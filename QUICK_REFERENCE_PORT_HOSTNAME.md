# Quick Reference: Port & Hostname Fields

## What Changed?
Added `port` (Int) and `hostname` (String) fields to Instance model for tracking dynamic challenge instance locations.

## Files Modified (6 total)

### 1. Prisma Schema
```prisma
model Instance {
  port      Int?     // NEW: Port number (1-65535)
  hostname  String?  // NEW: Hostname/IP address
}
```

### 2. DTOs
- **create-instance.dto.ts**: Added port/hostname to request validation
- **instance-response.dto.ts**: Added port/hostname to response
- **instance-query.dto.ts**: Added port/hostname filter options

### 3. Services
- **instances.service.ts**: 
  - `create()`: Store port & hostname from DTO
  - `findAll()`: Filter by port (exact) and hostname (contains)
  - `toResponseDto()`: Map port & hostname to response
  
- **challenges.service.ts**:
  - `findOne()`: Include port & hostname in instance response

## API Usage

### Create Instance
```bash
POST /api/v1/instances
{
  "challengeId": "uuid",
  "port": 8080,           // Optional
  "hostname": "localhost" // Optional
}
```

### List Instances with Filters
```bash
GET /api/v1/instances?port=8080&hostname=localhost&page=1&limit=10
```

### Get Challenge with Instance Info
```bash
GET /api/v1/challenges/:id
# Response includes:
{
  "instance": {
    "port": 8080,
    "hostname": "localhost",
    ...
  }
}
```

### WebSocket Filter
```typescript
socket.emit('filter', {
  port: 8080,
  hostname: 'localhost'
});
```

## Validation Rules

| Field | Type | Range | Required | Default |
|-------|------|-------|----------|---------|
| port | Integer | 1-65535 | No | null |
| hostname | String | Any | No | null |

## Database Migration

```bash
npx prisma migrate dev --name add_instance_port_hostname
```

## Backward Compatibility
✅ Fully backward compatible - both fields are optional and null-safe

## Use Cases
- Track which server instance user is connected to
- Load balancing and instance discovery
- Store network configuration for IDE/terminal access
- Query instances by specific hostname or port
