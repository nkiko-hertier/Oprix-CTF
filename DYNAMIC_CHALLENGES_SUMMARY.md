# Dynamic Challenges Instance System - Implementation Summary

## What Was Built

A complete dynamic challenge instance system for CTF platforms that allows users to create time-limited instances of challenges.

## Files Created

### 1. Database Schema
- **Modified**: `/backend/prisma/schema.prisma`
  - Added `Instance` model with userId, challengeId, duration, githubUrl fields
  - Added `instances` relation to User and Challenge models
  - Unique constraint on (userId, challengeId)

### 2. Instances Module Files
All files created in `/backend/src/modules/instances/`:

- **instances.module.ts**: Module definition with InstancesService and InstancesGateway
- **instances.service.ts**: Core business logic with 6 main methods:
  - `create()`: Create new instance or return existing active one
  - `findAll()`: Get instances with filtering and pagination
  - `findById()`: Get single instance
  - `deleteExpired()`: Batch delete expired instances
  - `getActiveInstance()`: Helper for challenge integration
  - `isExpired()`, `getExpiresAt()`, `toResponseDto()`: Utility methods

- **instances.controller.ts**: REST endpoints
  - `POST /instances`: Create new instance
  - `GET /instances`: List with filters and pagination
  - `DELETE /instances/delete-expired`: Admin-only deletion

- **instances.gateway.ts**: WebSocket real-time updates
  - Authentication via JWT
  - `filter` event: Send filters, receive instances
  - `instanceCreated` broadcast: New instance event
  - `instanceExpired` broadcast: Expiration event
  - 30-second expiration check interval

### 3. DTOs
- **create-instance.dto.ts**: POST request validation
- **instance-response.dto.ts**: Response structure with calculated fields
- **instance-query.dto.ts**: Query parameter validation with pagination

### 4. Module Integration
- **Modified**: `/backend/src/app.module.ts`
  - Added `InstancesModule` import

### 5. Challenges Service Integration
- **Modified**: `/backend/src/modules/challenges/challenges.service.ts`
  - Updated `findOne()` method
  - Added instance fetching for dynamic challenges
  - Returns `instance` property in response (null if not dynamic or no active instance)

### 6. Documentation
- **DYNAMIC_CHALLENGES_IMPLEMENTATION.md**: Comprehensive 555-line guide with:
  - Architecture overview
  - Complete API documentation
  - WebSocket usage guide
  - Service layer details
  - Security considerations
  - Testing guide
  - Troubleshooting section

- **DYNAMIC_CHALLENGES_SUMMARY.md**: This file

## Key Features

### 1. REST API Endpoints
- `POST /api/v1/instances` - Create instance
- `GET /api/v1/instances` - List with filters and pagination
- `DELETE /api/v1/instances/delete-expired` - Admin cleanup

### 2. WebSocket Real-Time Updates
- Real-time instance creation notifications
- Real-time expiration notifications
- Dynamic filtering with `filter` event
- 30-second expiration check interval

### 3. Automatic Behavior
- Automatically extracts `duration` from challenge.timeLimit
- Automatically extracts `githubUrl` from challenge.url
- Returns existing active instance if user tries to create duplicate
- Calculates `expiresAt` timestamp on-the-fly
- Tracks `isExpired` status in responses

### 4. Security Features
- JWT authentication required for all endpoints
- Users can only view their own instances
- Admins can view all instances
- Database-level unique constraint on (userId, challengeId)
- Input validation on all DTOs
- Permission enforcement in service layer

### 5. Challenge Integration
- Dynamic challenges automatically include instance data in response
- Instance only included if active and not expired
- Non-dynamic challenges return `instance: null`

## Data Flow

### Creating an Instance
1. User sends `POST /instances` with challengeId
2. Service validates challenge is dynamic and active
3. Checks if user already has active instance
4. If active exists, returns it; if expired, creates new one
5. Extracts duration from challenge.timeLimit
6. Extracts githubUrl from challenge.url
7. Stores in database
8. WebSocket broadcasts `instanceCreated` event

### Fetching Challenge with Instance
1. User requests `GET /challenges/:id`
2. Service fetches challenge
3. If isDynamic, queries for user's instance
4. Checks if instance is expired (createdAt + duration > now)
5. Includes instance in response if active and not expired
6. Otherwise returns `instance: null`

### Deleting Expired Instances
1. Admin sends `DELETE /instances/delete-expired`
2. Service fetches all instances
3. Filters where createdAt + duration < now
4. Batch deletes expired instances
5. Returns count of deleted records
6. WebSocket broadcasts `instanceExpired` events

## Technical Implementation Details

### Expiration Logic
```
isExpired = new Date() > new Date(createdAt.getTime() + duration * 1000)
expiresAt = new Date(createdAt.getTime() + duration * 1000)
```

### Database Unique Constraint
```prisma
@@unique([userId, challengeId])
```
Ensures one active instance per user per challenge.

### Pagination Logic
```
skip = (page - 1) * limit
results = instances.slice(skip, skip + limit)
pages = ceil(total / limit)
```

### WebSocket Authentication
- Token passed in handshake auth or Authorization header
- Verified using Clerk JWT service
- User joined to `user:{userId}` room for targeted broadcasts

## Integration Points

1. **Auth Module**: Uses JwtAuthGuard and AdminGuard
2. **Challenges Module**: Integrated in findOne() method
3. **Prisma Service**: Database access
4. **Clerk JWT Service**: WebSocket authentication
5. **User Model**: Instance relation

## Performance Characteristics

- **Indexes**: userId, challengeId, createdAt
- **Unique Constraint**: Prevents duplicate instances
- **Pagination**: Limits result size
- **Batch Operations**: Delete uses batch deletion
- **WebSocket**: Per-user rooms for targeted broadcasts

## Next Steps to Use

1. **Run Migration**:
   ```bash
   npx prisma migrate dev --name add_instances
   ```

2. **Create Dynamic Challenge**:
   - Set `isDynamic: true`
   - Set `timeLimit` (in seconds)
   - Set `url` (GitHub URL)

3. **Test Endpoints**:
   - POST to create instance
   - GET to list instances
   - DELETE to remove expired

4. **Connect WebSocket**:
   - Connect to `/instances` namespace
   - Send filters on `filter` event
   - Listen for `instanceCreated` and `instanceExpired`

5. **Schedule Cleanup** (Optional):
   - Use Jobs module to call `DELETE /instances/delete-expired`
   - Recommended: Every 5-10 minutes

## Files Modified Summary

| File | Changes |
|------|---------|
| prisma/schema.prisma | Added Instance model, added relations |
| app.module.ts | Added InstancesModule import |
| challenges/challenges.service.ts | Added instance data to findOne() response |

## Files Created Summary

| File | Type | Lines |
|------|------|-------|
| instances/instances.module.ts | Module | 14 |
| instances/instances.service.ts | Service | 289 |
| instances/instances.controller.ts | Controller | 90 |
| instances/instances.gateway.ts | Gateway | 238 |
| instances/dto/create-instance.dto.ts | DTO | 13 |
| instances/dto/instance-response.dto.ts | DTO | 52 |
| instances/dto/instance-query.dto.ts | DTO | 59 |
| DYNAMIC_CHALLENGES_IMPLEMENTATION.md | Docs | 555 |
| DYNAMIC_CHALLENGES_SUMMARY.md | Docs | This file |

## API Examples

### Create Instance
```bash
curl -X POST http://localhost:3001/api/v1/instances \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"challengeId": "challenge-123"}'
```

### Get Instances
```bash
curl "http://localhost:3001/api/v1/instances?page=1&limit=10&isExpired=false" \
  -H "Authorization: Bearer <token>"
```

### Delete Expired
```bash
curl -X DELETE http://localhost:3001/api/v1/instances/delete-expired \
  -H "Authorization: Bearer <token>"
```

### WebSocket Connect
```javascript
const socket = io('ws://localhost:3001/instances', {
  auth: { token: 'jwt-token' }
});

socket.on('instanceCreated', (data) => {
  console.log('New instance:', data);
});
```

## Validation Rules

### Create Instance
- challengeId: Required, must be UUID
- Challenge must exist and be dynamic
- Challenge must be active
- Challenge must have timeLimit > 0

### Get Instances
- page: Min 1, optional
- limit: Min 1, Max 100, optional
- isExpired: Boolean, optional
- userId: Optional, non-admins can only view own

### Delete Expired
- Admin role required
- No request body

## Error Handling

All endpoints follow standard NestJS error responses:
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid JWT)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

**Implementation Date**: February 20, 2024
**Status**: Complete and Ready for Testing
