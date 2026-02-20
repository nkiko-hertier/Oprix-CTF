# Dynamic Challenges Instance System - Detailed Changelog

## Database Schema Changes

### File: `backend/prisma/schema.prisma`

#### 1. User Model - Added Relations
**Line**: Added after `learningMaterials` field
```prisma
instances            Instance[]
```
**Purpose**: Enable relation to instances created by user

#### 2. Challenge Model - Added Relations
**Line**: Added after `hints` field
```prisma
instances     Instance[]
```
**Purpose**: Enable relation to instances of this challenge

#### 3. New Instance Model - Complete Addition
**Lines**: Added at end of schema (before enums)
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

**Fields Explanation**:
- `id`: UUID primary key, auto-generated
- `userId`: Foreign key to User (cascade delete)
- `challengeId`: Foreign key to Challenge (cascade delete)
- `duration`: Time in seconds (from challenge.timeLimit)
- `githubUrl`: GitHub URL (from challenge.url)
- `createdAt`: Auto-set timestamp on creation
- `updatedAt`: Auto-update on any change
- `@@unique`: Ensures one instance per user per challenge
- `@@index`: Performance optimization for queries

---

## Backend Module Files

### File: `backend/src/modules/instances/instances.module.ts`
**Status**: Created (14 lines)

**Content**:
- Module definition with @Module decorator
- Imports AuthModule
- Declares InstancesService and InstancesGateway as providers
- InstancesController as controller
- Exports InstancesService and InstancesGateway for other modules

**Purpose**: NestJS module configuration for instances feature

---

### File: `backend/src/modules/instances/instances.service.ts`
**Status**: Created (289 lines)

**Core Methods**:

1. **create(createInstanceDto, userId)** (Lines 77-134)
   - Validates challenge is dynamic
   - Checks for existing active instance
   - Returns existing if found, creates new if expired
   - Extracts duration and githubUrl from challenge

2. **findAll(query, userId?, role?)** (Lines 140-185)
   - Applies userId, challengeId filters
   - Enforces permission checks
   - Implements pagination (skip/take)
   - Optional isExpired filtering post-fetch
   - Returns paginated results with metadata

3. **findById(instanceId, userId?)** (Lines 191-210)
   - Retrieves single instance
   - Enforces permission checks
   - Throws 404 if not found

4. **deleteExpired()** (Lines 216-240)
   - Gets all instances
   - Filters expired ones (createdAt + duration < now)
   - Batch deletes
   - Returns count

5. **getActiveInstance(userId, challengeId)** (Lines 246-266)
   - Helper method for challenge integration
   - Returns null if no active instance
   - Used by challenges.service.ts

**Helper Methods**:
- `isExpired()`: Checks if instance exceeded expiration
- `getExpiresAt()`: Calculates expiration timestamp
- `validateChallenge()`: Validates challenge is dynamic and active
- `toResponseDto()`: Converts to response format with calculated fields

---

### File: `backend/src/modules/instances/instances.controller.ts`
**Status**: Created (90 lines)

**Endpoints**:

1. **POST /instances** (Lines 27-47)
   - @UseGuards(JwtAuthGuard)
   - @HttpCode(201)
   - Calls service.create()
   - Returns InstanceResponseDto

2. **GET /instances** (Lines 52-70)
   - @UseGuards(JwtAuthGuard)
   - Query: InstanceQueryDto
   - Calls service.findAll() with user context
   - Returns paginated results

3. **DELETE /instances/delete-expired** (Lines 75-90)
   - @UseGuards(JwtAuthGuard, AdminGuard)
   - Admin-only operation
   - Calls service.deleteExpired()
   - Returns { deletedCount: number }

---

### File: `backend/src/modules/instances/instances.gateway.ts`
**Status**: Created (238 lines)

**WebSocket Configuration** (Lines 28-37):
- Namespace: `/instances`
- CORS enabled for FRONTEND_URL
- Socket.io server

**Connection Lifecycle**:

1. **handleConnection** (Lines 53-97)
   - Validates JWT token
   - Finds user by Clerk ID
   - Joins user-specific room
   - Sends connection confirmation

2. **handleDisconnect** (Lines 99-109)
   - Removes user from tracking
   - Logs disconnection

3. **afterInit** (Lines 44-51)
   - Initializes gateway
   - Starts 30-second expiration check interval

**Event Handlers**:

1. **@SubscribeMessage('filter')** (Lines 121-168)
   - Receives filter parameters from client
   - Validates permissions
   - Calls service.findAll()
   - Emits 'instances' event back to client

**Broadcasting Methods**:

1. **broadcastInstanceCreated()** (Lines 172-178)
   - Emits 'instanceCreated' to user-specific room
   - Called after create operation

2. **broadcastInstanceExpired()** (Lines 183-189)
   - Emits 'instanceExpired' to user-specific room
   - Called when instance expires

**Background Operations**:

1. **checkExpiredInstances()** (Lines 195-213)
   - Runs every 30 seconds
   - Fetches all instances
   - Broadcasts expiration events for expired ones

2. **onApplicationShutdown()** (Lines 218-222)
   - Cleanup on application shutdown
   - Clears expiration check interval

---

### File: `backend/src/modules/instances/dto/create-instance.dto.ts`
**Status**: Created (13 lines)

**Fields**:
- `challengeId`: String, UUID, required
  - Description: The challenge ID for which to create an instance
  - Validation: @IsString(), @IsUUID()

**Purpose**: Validate POST request body

---

### File: `backend/src/modules/instances/dto/instance-response.dto.ts`
**Status**: Created (52 lines)

**Fields**:
- `id`: Unique instance identifier (UUID)
- `githubUrl`: GitHub URL for challenge (from challenge.url)
- `duration`: Duration in seconds (from challenge.timeLimit)
- `createdAt`: When instance was created
- `expiresAt`: Calculated expiration time (createdAt + duration)
- `isExpired`: Boolean flag for expiration status
- `challengeId`: Reference to challenge
- `userId`: Reference to user who created instance

**Purpose**: Standardize instance response format across API

---

### File: `backend/src/modules/instances/dto/instance-query.dto.ts`
**Status**: Created (59 lines)

**Query Parameters**:
- `userId`: Optional string filter
- `challengeId`: Optional string filter
- `isExpired`: Optional boolean filter
- `page`: Optional number (min 1, default 1)
- `limit`: Optional number (min 1, max 100, default 10)

**Validation**: Uses @Type() transformer for number conversion

**Purpose**: Validate GET query parameters with pagination

---

## Challenges Module Integration

### File: `backend/src/modules/challenges/challenges.service.ts`

#### Change 1: Updated findOne() method (Lines 276-390)

**Location**: In `async findOne()` method after permission checks

**Added Code Block** (Lines 339-372):
```typescript
// Fetch instance data for dynamic challenges
let instance = null;
if (challengeAny.isDynamic && userId) {
  const userInstance = await this.prisma.instance.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  // Check if instance exists and is not expired
  if (userInstance) {
    const expirationTime = new Date(
      userInstance.createdAt.getTime() + userInstance.duration * 1000,
    );
    const isExpired = new Date() > expirationTime;

    if (!isExpired) {
      instance = {
        id: userInstance.id,
        challengeId: userInstance.challengeId,
        userId: userInstance.userId,
        duration: userInstance.duration,
        githubUrl: userInstance.githubUrl,
        createdAt: userInstance.createdAt,
        expiresAt: expirationTime,
        isExpired: false,
      };
    }
  }
}
```

**Added to Return Object** (Line 390):
```typescript
instance,
```

**Logic**:
1. Initialize instance as null
2. Check if challenge is dynamic and user is authenticated
3. Query for user's instance using unique constraint
4. If found, calculate expiration time
5. Check if expired
6. If not expired, include in response with calculated fields
7. Return instance (or null if expired/not found)

---

## App Module Integration

### File: `backend/src/app.module.ts`

#### Change 1: Import Addition (Line 22)
**Before**:
```typescript
import { LearningMaterialsModule } from './modules/learning-materials/learning-materials.module';
```

**After**:
```typescript
import { LearningMaterialsModule } from './modules/learning-materials/learning-materials.module';
import { InstancesModule } from './modules/instances/instances.module';
```

#### Change 2: Module Imports (Line 44)
**Before**:
```typescript
@Module({
  imports: [
    // ... other modules
    LearningMaterialsModule,
  ],
```

**After**:
```typescript
@Module({
  imports: [
    // ... other modules
    LearningMaterialsModule,
    InstancesModule,
  ],
```

**Purpose**: Register instances module with NestJS application

---

## Documentation Files

### File: `DYNAMIC_CHALLENGES_IMPLEMENTATION.md`
**Status**: Created (555 lines)

**Sections**:
1. Overview and Architecture
2. Database Schema Changes
3. REST API Endpoints (Complete documentation)
4. WebSocket Gateway
5. Challenge API Enhancement
6. Service Layer Details
7. Module Structure
8. Integration Points
9. Security Considerations
10. Testing Guide
11. Environment Variables
12. Migration Steps
13. Performance Considerations
14. Future Enhancements
15. Troubleshooting
16. References

---

### File: `DYNAMIC_CHALLENGES_SUMMARY.md`
**Status**: Created (281 lines)

**Contents**:
- Feature overview
- Files created/modified with line counts
- Key features list
- Data flow diagrams
- Technical implementation details
- Integration points
- Performance characteristics
- Usage instructions
- API examples
- Validation rules
- Error handling

---

### File: `IMPLEMENTATION_CHANGELOG.md`
**Status**: This file (Detailed changelog)

---

## Summary Statistics

### Files Created: 9
1. instances.module.ts
2. instances.service.ts
3. instances.controller.ts
4. instances.gateway.ts
5. create-instance.dto.ts
6. instance-response.dto.ts
7. instance-query.dto.ts
8. DYNAMIC_CHALLENGES_IMPLEMENTATION.md
9. DYNAMIC_CHALLENGES_SUMMARY.md
10. IMPLEMENTATION_CHANGELOG.md (This file)

### Files Modified: 3
1. backend/prisma/schema.prisma
2. backend/src/app.module.ts
3. backend/src/modules/challenges/challenges.service.ts

### Total Lines Added: ~1,500+
- Code: ~700 lines
- Documentation: ~850 lines

---

## Migration Checklist

- [ ] Review schema changes in `prisma/schema.prisma`
- [ ] Run: `npx prisma migrate dev --name add_instances`
- [ ] Verify instances module files created
- [ ] Verify app.module.ts updated
- [ ] Verify challenges.service.ts updated
- [ ] Test POST /instances endpoint
- [ ] Test GET /instances endpoint with filters
- [ ] Test DELETE /instances/delete-expired endpoint
- [ ] Test WebSocket connection to /instances
- [ ] Test filter event on WebSocket
- [ ] Verify instance appears in challenge response
- [ ] Create dynamic challenge and test end-to-end
- [ ] Test expiration logic with manual time adjustment
- [ ] Load test WebSocket with multiple connections

---

## Backward Compatibility

**Non-Breaking Changes**:
- Challenge response includes new optional `instance` field
- Existing code ignoring `instance` field will continue to work
- No changes to existing endpoints or database structure (only additions)
- No changes to authentication or authorization

**Migration Required**:
- Prisma migration needed to create Instance table
- No data migration needed (new feature)

---

## Testing Scenarios

### Scenario 1: Create Instance
1. User has dynamic challenge with timeLimit=3600
2. POST /instances with challengeId
3. Verify instance created with duration=3600
4. Verify githubUrl matches challenge.url
5. Verify response includes expiresAt and isExpired=false

### Scenario 2: Duplicate Instance Prevention
1. User creates instance
2. User creates same instance again
3. Verify existing instance returned (not new one)
4. Verify same ID returned

### Scenario 3: Instance Expiration
1. User creates instance with 10-second duration
2. Wait 11 seconds
3. POST new instance
4. Verify new instance created (old one expired)
5. Verify isExpired=true for old instance

### Scenario 4: Challenge Integration
1. User creates instance
2. GET /challenges/{id}
3. Verify instance field in response
4. Verify includes expiresAt and isExpired

### Scenario 5: Non-Dynamic Challenge
1. Challenge has isDynamic=false
2. GET /challenges/{id}
3. Verify instance=null in response

### Scenario 6: WebSocket Filter
1. User connects to /instances WebSocket
2. Emit filter event with isExpired=false
3. Verify instances event received
4. Verify pagination metadata included

### Scenario 7: Admin Cleanup
1. Create multiple instances
2. Wait for some to expire
3. DELETE /instances/delete-expired
4. Verify deletedCount > 0
5. Verify expired instances removed from database

---

## Performance Metrics (Expected)

- Create instance: ~50ms (database write)
- Get instances (10 items): ~30ms (indexed query)
- Get instance in challenge: ~20ms (additional query, indexed)
- Delete expired (100 instances): ~100ms (batch operation)
- WebSocket filter: ~30ms (same as GET)

---

## Notes

- All times and durations in API are in seconds
- All timestamps follow ISO 8601 format
- WebSocket expiration check runs every 30 seconds (configurable)
- Instance has unique constraint on (userId, challengeId) pair
- Cascade delete ensures instance cleanup when user/challenge deleted
- Admin can view all instances; users can only view their own

---

**Implementation Completed**: February 20, 2024
**Status**: Ready for Database Migration and Testing
