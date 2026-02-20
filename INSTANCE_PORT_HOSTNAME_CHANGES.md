# Dynamic Challenge Instances: Port & Hostname Fields Update

## Overview
Added `port` and `hostname` fields to the Instance model to support dynamic instance lifecycle management. These fields allow tracking and filtering of running challenge instances by their network location.

## Changes Made

### 1. Database Schema Update
**File:** `backend/prisma/schema.prisma`

Added two optional fields to the Instance model:
```prisma
model Instance {
  id          String    @id @default(uuid())
  userId      String
  challengeId String
  duration    Int       @default(0)
  githubUrl   String?
  port        Int?           // NEW: Port number (1-65535)
  hostname    String?        // NEW: Hostname/IP address
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  // ... relations
}
```

**Fields:**
- `port` (Int, optional): Network port where instance is running
- `hostname` (String, optional): Hostname, FQDN, or IP address

### 2. Data Transfer Objects (DTOs)

#### CreateInstanceDto
**File:** `backend/src/modules/instances/dto/create-instance.dto.ts`

Added optional fields to request body validation:
```typescript
@ApiProperty({
  example: 8080,
  description: 'The port number where the instance is running',
  required: false,
})
@IsInt()
@Min(1)
@Max(65535)
@IsOptional()
port?: number;

@ApiProperty({
  example: 'localhost',
  description: 'The hostname where the instance is running',
  required: false,
})
@IsString()
@IsOptional()
hostname?: string;
```

**Usage in POST /api/v1/instances:**
```json
{
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "port": 8080,
  "hostname": "challenge-server.example.com"
}
```

#### InstanceResponseDto
**File:** `backend/src/modules/instances/dto/instance-response.dto.ts`

Extended response structure:
```typescript
export class InstanceResponseDto {
  id: string;
  challengeId: string;
  userId: string;
  duration: number;
  githubUrl: string | null;
  port: number | null;           // NEW
  hostname: string | null;       // NEW
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}
```

**Sample Response:**
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "userId": "uuid",
  "duration": 3600,
  "githubUrl": "https://github.com/example/challenge",
  "port": 8080,
  "hostname": "localhost",
  "createdAt": "2024-02-20T10:30:00Z",
  "expiresAt": "2024-02-20T14:30:00Z",
  "isExpired": false
}
```

#### InstanceQueryDto
**File:** `backend/src/modules/instances/dto/instance-query.dto.ts`

Added optional filter fields:
```typescript
@ApiProperty({
  example: 8080,
  description: 'Filter by port number',
  required: false,
})
@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(1)
@Max(65535)
port?: number;

@ApiProperty({
  example: 'localhost',
  description: 'Filter by hostname',
  required: false,
})
@IsOptional()
@IsString()
hostname?: string;
```

**Usage in GET /api/v1/instances?port=8080&hostname=localhost:**

### 3. Service Layer Updates

#### InstancesService
**File:** `backend/src/modules/instances/instances.service.ts`

**Changes:**
1. **toResponseDto()** - Maps port and hostname to response
2. **create()** - Stores port and hostname from DTO
3. **findAll()** - Filters by port (exact match) and hostname (case-insensitive contains)

```typescript
// In create() method
const instance = await this.prisma.instance.create({
  data: {
    userId,
    challengeId: createInstanceDto.challengeId,
    duration: challenge.timeLimit,
    githubUrl: challenge.url,
    port: createInstanceDto.port || null,        // NEW
    hostname: createInstanceDto.hostname || null, // NEW
  },
});

// In findAll() method - Added filters
if (query.port) {
  where.port = query.port;
}

if (query.hostname) {
  where.hostname = {
    contains: query.hostname,
    mode: 'insensitive',
  };
}
```

### 4. Challenges Service Integration

**File:** `backend/src/modules/challenges/challenges.service.ts`

Updated **findOne()** method to include port and hostname in instance response:

```typescript
if (!isExpired) {
  instance = {
    id: userInstance.id,
    challengeId: userInstance.challengeId,
    userId: userInstance.userId,
    duration: userInstance.duration,
    githubUrl: userInstance.githubUrl,
    port: userInstance.port,           // NEW
    hostname: userInstance.hostname,   // NEW
    createdAt: userInstance.createdAt,
    expiresAt: expirationTime,
    isExpired: false,
  };
}
```

**GET /challenges/:id Response:**
```json
{
  "id": "uuid",
  "title": "SQL Injection Challenge",
  "isDynamic": true,
  "instance": {
    "id": "uuid",
    "port": 8080,
    "hostname": "challenge-server.local",
    "duration": 3600,
    "expiresAt": "2024-02-20T14:30:00Z",
    "isExpired": false
  }
}
```

## API Endpoints Updated

### 1. POST /api/v1/instances
**Create Instance with Port & Hostname**

```bash
curl -X POST http://localhost:3000/api/v1/instances \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "550e8400-e29b-41d4-a716-446655440000",
    "port": 8080,
    "hostname": "localhost"
  }'
```

Response: 201 Created
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "userId": "uuid",
  "duration": 3600,
  "githubUrl": "https://github.com/...",
  "port": 8080,
  "hostname": "localhost",
  "createdAt": "2024-02-20T10:30:00Z",
  "expiresAt": "2024-02-20T14:30:00Z",
  "isExpired": false
}
```

### 2. GET /api/v1/instances
**List Instances with Port/Hostname Filtering**

```bash
# Filter by port
curl http://localhost:3000/api/v1/instances?port=8080 \
  -H "Authorization: Bearer <token>"

# Filter by hostname
curl http://localhost:3000/api/v1/instances?hostname=localhost \
  -H "Authorization: Bearer <token>"

# Combined filters
curl 'http://localhost:3000/api/v1/instances?port=8080&hostname=localhost&page=1&limit=10' \
  -H "Authorization: Bearer <token>"
```

Response: 200 OK
```json
{
  "data": [
    {
      "id": "uuid",
      "port": 8080,
      "hostname": "localhost",
      ...
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### 3. GET /api/v1/challenges/:id
**Challenge Detail with Instance Info**

```bash
curl http://localhost:3000/api/v1/challenges/uuid \
  -H "Authorization: Bearer <token>"
```

Response includes instance data:
```json
{
  "id": "uuid",
  "instance": {
    "port": 8080,
    "hostname": "localhost",
    ...
  }
}
```

## WebSocket Integration

The WebSocket gateway automatically includes port and hostname in filtered instance results:

```typescript
// Client sends filter
socket.emit('filter', {
  port: 8080,
  hostname: 'localhost',
  page: 1,
  limit: 10
});

// Server responds with filtered instances
socket.on('instances', (data) => {
  data.data.forEach(instance => {
    console.log(`${instance.hostname}:${instance.port}`);
  });
});
```

## Validation Rules

### Port Validation
- Type: Integer
- Range: 1-65535 (valid port numbers)
- Required: No (optional)
- Null-safe: Yes (defaults to null)

### Hostname Validation
- Type: String
- Format: Any hostname, FQDN, or IP address
- Required: No (optional)
- Case-insensitive filtering: Yes
- Null-safe: Yes (defaults to null)

## Database Migration

Run Prisma migration:
```bash
npx prisma migrate dev --name add_instance_port_hostname
```

This will:
1. Add `port` column (nullable Int)
2. Add `hostname` column (nullable String)
3. Create migration file in `prisma/migrations/`

## Backwards Compatibility

✅ **Fully Backward Compatible**
- Existing instances without port/hostname: Both fields are null
- Requests without port/hostname: Both default to null
- Existing endpoints: No breaking changes
- Filtering: Port/hostname filters are optional

## Use Cases

1. **Multi-Instance Tracking**: Track which specific server instance a user is connected to
   ```json
   {
     "port": 8080,
     "hostname": "docker-container-1"
   }
   ```

2. **Load Balancing**: Identify instances by port for distribution
   ```json
   {
     "port": 8081,
     "hostname": "challenge-lb.example.com"
   }
   ```

3. **Instance Discovery**: Query instances by specific server
   ```
   GET /api/v1/instances?hostname=docker-container-1
   ```

4. **Network Configuration**: Store access details for IDE/terminal connections
   ```json
   {
     "port": 3306,
     "hostname": "challenge-db.local"
   }
   ```

## Summary of Files Modified

| File | Changes | Lines |
|------|---------|-------|
| `prisma/schema.prisma` | Added port and hostname to Instance | 2 |
| `dto/create-instance.dto.ts` | Added port/hostname validation | +20 |
| `dto/instance-response.dto.ts` | Added port/hostname to response | +14 |
| `dto/instance-query.dto.ts` | Added port/hostname filters | +21 |
| `instances/instances.service.ts` | Updated create/findAll/toResponseDto | +13 |
| `challenges/challenges.service.ts` | Added port/hostname to instance response | +2 |

**Total Changes:** 72 lines of code across 6 files

## Testing Checklist

- [ ] Create instance with port and hostname
- [ ] Create instance without port and hostname
- [ ] Retrieve instances filtered by port
- [ ] Retrieve instances filtered by hostname
- [ ] Retrieve instances with combined filters
- [ ] WebSocket filter with port/hostname
- [ ] Challenge detail includes instance port/hostname
- [ ] Null handling for missing fields
- [ ] Port validation (1-65535)
- [ ] Case-insensitive hostname filtering
