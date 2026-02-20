# Dynamic Challenges Instance System - Implementation Guide

## Overview
This document details the complete implementation of the Dynamic Challenges Instance System, which enables CTF platforms to support dynamic, time-limited challenge instances for users.

## Architecture Overview

The system follows a modular NestJS architecture with the following components:
- **Prisma Schema**: Database layer with Instance model
- **InstancesModule**: Core module containing service, controller, and gateway
- **REST API**: HTTP endpoints for instance management
- **WebSocket Gateway**: Real-time updates for instance events

## Database Schema Changes

### Added Instance Model

```prisma
model Instance {
  id          String    @id @default(uuid())
  userId      String
  challengeId String
  duration    Int       @default(0)
  githubUrl   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([challengeId])
  @@index([createdAt])
  @@unique([userId, challengeId])
}
```

### Updated Models

**User Model**: Added `instances Instance[]` relation
**Challenge Model**: Added `instances Instance[]` relation

### Field Descriptions

- **id**: Unique identifier for the instance (UUID)
- **userId**: Reference to the user who created the instance
- **challengeId**: Reference to the challenge this instance belongs to
- **duration**: Time in seconds for the instance validity (copied from challenge.timeLimit)
- **githubUrl**: GitHub URL for the challenge code/resources (copied from challenge.url)
- **createdAt**: Timestamp when the instance was created
- **updatedAt**: Timestamp of last update
- **Unique Constraint**: One active instance per user per challenge

## REST API Endpoints

### 1. POST /api/v1/instances
Creates a new dynamic challenge instance for the authenticated user.

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "challengeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201 Created)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-id-123",
  "duration": 3600,
  "githubUrl": "https://github.com/example/challenge",
  "createdAt": "2024-02-20T10:30:00Z",
  "expiresAt": "2024-02-20T14:30:00Z",
  "isExpired": false
}
```

**Error Responses**:
- `404 Not Found`: Challenge not found
- `400 Bad Request`: 
  - Challenge is not dynamic (`isDynamic !== true`)
  - Challenge is not active
  - Challenge has no time limit set
- `401 Unauthorized`: User not authenticated

**Logic**:
1. Validates user is authenticated
2. Fetches challenge and verifies it's dynamic
3. Checks if user already has an active instance for this challenge
4. If active instance exists, returns it
5. If expired, creates a new instance
6. Extracts `duration` from challenge.timeLimit
7. Extracts `githubUrl` from challenge.url
8. Stores instance in database

---

### 2. GET /api/v1/instances
Retrieves instances with optional filtering and pagination.

**Authentication**: Required (JWT)

**Query Parameters**:
- `userId` (optional): Filter by user ID (users can only view their own unless admin)
- `challengeId` (optional): Filter by challenge ID
- `isExpired` (optional): Boolean filter for expired status
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)

**Example Request**:
```
GET /api/v1/instances?userId=user-123&challengeId=challenge-456&page=1&limit=20
```

**Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "challengeId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-id-123",
      "duration": 3600,
      "githubUrl": "https://github.com/example/challenge",
      "createdAt": "2024-02-20T10:30:00Z",
      "expiresAt": "2024-02-20T14:30:00Z",
      "isExpired": false
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "pages": 3
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: Cannot view other users' instances (non-admin)

**Logic**:
1. Validates user is authenticated
2. Applies filters (respects permission restrictions)
3. Calculates pagination offset
4. Retrieves instances from database
5. Filters by expiration status if requested
6. Returns paginated results with metadata

---

### 3. DELETE /api/v1/instances/delete-expired
Deletes all expired instances (Admin only).

**Authentication**: Required (JWT), Admin role required

**Response (200 OK)**:
```json
{
  "deletedCount": 15
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: Only admins can delete expired instances

**Logic**:
1. Validates user is authenticated and has admin role
2. Retrieves all instances
3. Filters instances where: `createdAt + (duration in seconds) < now()`
4. Deletes expired instances in batch
5. Returns count of deleted instances

**Recommended Usage**:
- Run as a scheduled cron job every 5-10 minutes
- Can be integrated with the Jobs module for scheduling

---

## WebSocket Gateway

### Connection Details

**Namespace**: `/instances`

**Authentication**: JWT token required in handshake
- Token can be sent via `auth.token` or `Authorization` header
- Format: `Bearer <token>`

**Example Connection** (JavaScript):
```javascript
const socket = io('ws://localhost:3001/instances', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
  // {
  //   message: 'Connected to dynamic challenge instances',
  //   userId: 'user-id-123',
  //   username: 'john_doe'
  // }
});
```

### WebSocket Events

#### Client -> Server Events

**Event**: `filter`
Sends filter parameters and receives matching instances.

**Payload**:
```json
{
  "userId": "user-123",
  "challengeId": "challenge-456",
  "isExpired": false,
  "page": 1,
  "limit": 10
}
```

**Server Response** (`instances` event):
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

#### Server -> Client Events

**Event**: `connected`
Emitted when client connects successfully.

**Event**: `instanceCreated`
Emitted when a new instance is created for the user.

**Payload**:
```json
{
  "instanceId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-id-123",
  "challengeId": "challenge-id-456",
  "createdAt": "2024-02-20T10:30:00Z"
}
```

**Event**: `instanceExpired`
Emitted when an instance expires.

**Payload**:
```json
{
  "instanceId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-id-123",
  "challengeId": "challenge-id-456",
  "expiredAt": "2024-02-20T14:30:00Z"
}
```

**Event**: `error`
Emitted when an error occurs.

**Payload**:
```json
{
  "message": "Error description"
}
```

### Real-Time Features

1. **Expiration Checking**: Gateway runs a check every 30 seconds to identify and broadcast expired instances
2. **User-Specific Rooms**: Each user is automatically joined to their own room (`user:{userId}`)
3. **Automatic Cleanup**: Expired instances are tracked and broadcasted to relevant users

---

## Challenge API Enhancement

### GET /challenges/:challengeId

**New Response Field**: `instance`

When a challenge is marked as `isDynamic: true`, the response includes instance data:

**Response (200 OK)**:
```json
{
  "id": "challenge-123",
  "title": "SQL Injection Challenge",
  "description": "...",
  "isDynamic": true,
  "points": 100,
  "difficulty": "MEDIUM",
  "instance": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "challengeId": "challenge-123",
    "userId": "user-123",
    "duration": 3600,
    "githubUrl": "https://github.com/example/challenge",
    "createdAt": "2024-02-20T10:30:00Z",
    "expiresAt": "2024-02-20T14:30:00Z",
    "isExpired": false
  },
  "..."
}
```

**Instance Field Availability**:
- Only included if `isDynamic === true`
- Only included if user is authenticated
- Only included if user has an active (non-expired) instance
- If no active instance or instance expired: `instance: null`

---

## Service Layer Details

### InstancesService

**Constructor Dependencies**:
- `PrismaService`: Database access

**Key Methods**:

#### `create(createInstanceDto, userId)`
- Creates new instance or returns existing active instance
- Validates challenge is dynamic and active
- Handles duplicate check with unique constraint

#### `findAll(query, userId?, role?)`
- Returns paginated instances with filtering
- Enforces permission checks
- Filters by expiration status dynamically

#### `findById(instanceId, userId?)`
- Retrieves single instance by ID
- Validates user permissions

#### `deleteExpired()`
- Batch deletes all expired instances
- Returns count of deleted records

#### `getActiveInstance(userId, challengeId)`
- Gets active instance for user on specific challenge
- Returns null if no active instance
- Helper method for challenge integration

**Helper Methods**:

#### `isExpired(instance)`
- Checks if instance has exceeded expiration time
- Logic: `createdAt + (duration in seconds) > now`

#### `getExpiresAt(instance)`
- Calculates expiration timestamp
- Returns: `new Date(createdAt + duration*1000)`

#### `toResponseDto(instance)`
- Converts database instance to response DTO
- Includes calculated `expiresAt` and `isExpired`

---

## Module Structure

```
backend/src/modules/instances/
├── instances.module.ts          # Module definition
├── instances.service.ts         # Business logic
├── instances.controller.ts      # HTTP endpoints
├── instances.gateway.ts         # WebSocket gateway
└── dto/
    ├── create-instance.dto.ts   # POST request DTO
    ├── instance-response.dto.ts # Response DTO
    └── instance-query.dto.ts    # Query parameters DTO
```

---

## Integration with Other Modules

### App Module
- InstancesModule is imported in AppModule
- Provides services to other modules via exports

### Challenges Module
- Calls `instancesService.getActiveInstance()` in `findOne()` method
- Adds instance data to challenge response for dynamic challenges

### Submissions Module (Future)
- Can validate instances before flag submission
- Can prevent submissions after instance expiration

### Jobs Module (Future)
- Can schedule periodic `deleteExpired()` calls
- Recommended: Every 5-10 minutes

---

## Security Considerations

1. **Authentication**: All endpoints and WebSocket require JWT authentication
2. **Authorization**: Users cannot view other users' instances (enforced in service)
3. **Unique Constraint**: Database ensures only one instance per user per challenge
4. **Admin Operations**: Only admins can delete expired instances
5. **Input Validation**: All DTOs use class-validator for validation
6. **Rate Limiting**: Can be added via middleware if needed

---

## Testing Guide

### Manual Testing with cURL

**1. Create an instance**:
```bash
curl -X POST http://localhost:3001/api/v1/instances \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"challengeId": "challenge-id"}'
```

**2. Get instances with filters**:
```bash
curl "http://localhost:3001/api/v1/instances?page=1&limit=10&isExpired=false" \
  -H "Authorization: Bearer <token>"
```

**3. Delete expired instances** (admin):
```bash
curl -X DELETE http://localhost:3001/api/v1/instances/delete-expired \
  -H "Authorization: Bearer <token>"
```

### Testing with WebSocket

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3001/instances', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
  
  // Send filter request
  socket.emit('filter', {
    userId: 'user-123',
    page: 1,
    limit: 10
  });
});

socket.on('instances', (data) => {
  console.log('Instances:', data);
});

socket.on('instanceCreated', (data) => {
  console.log('New instance:', data);
});

socket.on('instanceExpired', (data) => {
  console.log('Instance expired:', data);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

---

## Environment Variables

No new environment variables required. Uses existing:
- `DATABASE_URL`: Prisma database connection
- `FRONTEND_URL`: CORS origin for WebSocket
- JWT configuration from Auth module

---

## Migration Steps

1. **Update Prisma Schema**: Added Instance model and relations
2. **Run Migration**: `npx prisma migrate dev --name add_instances`
3. **Create Instances Module**: All files in `/instances/` directory
4. **Update App Module**: Import InstancesModule
5. **Update Challenges Service**: Modified `findOne()` to include instance data
6. **Verify Integration**: Test endpoints and WebSocket

---

## Performance Considerations

1. **Index Strategy**: Indexes on userId, challengeId, createdAt for fast queries
2. **Unique Constraint**: Database-level enforcement prevents duplicates
3. **Pagination**: Prevents large result sets from impacting performance
4. **Expiration Check**: Runs every 30 seconds (configurable in gateway)
5. **Bulk Delete**: Uses batch deletion for efficiency

---

## Future Enhancements

1. **Scheduled Cleanup**: Integrate with Jobs module for automatic cleanup
2. **Instance Metrics**: Track instance usage and expiration rates
3. **Custom Duration**: Allow challenges to override default duration
4. **Instance History**: Archive expired instances instead of deleting
5. **Concurrent Limit**: Limit instances per user across all challenges
6. **Instance Hooks**: Webhook notifications for instance events

---

## Troubleshooting

### Instance creation fails with "Challenge is not dynamic"
- Verify challenge has `isDynamic: true` in database
- Check challenge is active with `isActive: true`

### Instance doesn't expire
- Check challenge `timeLimit` is set (in seconds)
- Verify system time is correct
- Check gateway is running (30-second expiration check)

### WebSocket connection fails
- Verify JWT token is valid
- Check CORS configuration
- Ensure `/instances` namespace is correct
- Verify user exists and is active

### Can't view other users' instances
- This is by design - non-admins can only see their own
- Admins can filter by any userId

---

## References

- [NestJS WebSockets Documentation](https://docs.nestjs.com/websockets/gateways)
- [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/relations)
- [Socket.io Documentation](https://socket.io/docs/)
