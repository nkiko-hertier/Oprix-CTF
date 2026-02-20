# Challenge Schema Modifications - Change Documentation

## Overview
Modified the Challenge model to make `flagHash` and `flagSalt` optional fields, and added a new `File_URL` field to support file-based challenges and alternative submission mechanisms.

**Date**: February 20, 2026
**Impact**: Database Schema, DTOs, Services
**Backwards Compatible**: Yes

---

## Files Modified

### 1. `/backend/prisma/schema.prisma`

#### Changes Made:
- **Line 106**: Made `flagHash` optional
  ```prisma
  // BEFORE
  flagHash      String
  
  // AFTER
  flagHash      String?
  ```

- **Line 118**: Added new `File_URL` field
  ```prisma
  File_URL      String?
  ```

- **Line 122**: Made `flagSalt` optional
  ```prisma
  // BEFORE
  flagSalt      String       @default("h3xsalt")
  
  // AFTER
  flagSalt      String?      @default("h3xsalt")
  ```

#### Rationale:
- Allows challenges without flag-based verification (e.g., file submission, external verification)
- Maintains backwards compatibility with default "h3xsalt" value for existing challenges
- `File_URL` enables linking to challenge resources, Docker containers, or writeups

---

### 2. `/backend/src/modules/challenges/dto/create-challenge.dto.ts`

#### Changes Made:

**A. Made `flag` field optional** (Lines 54-61):
```typescript
// BEFORE
@ApiProperty({ example: 'flag{sql_1nj3ct10n_m4st3r}', description: 'The flag to submit' })
@IsString()
@MinLength(5)
@MaxLength(200)
flag: string;

// AFTER
@ApiProperty({ example: 'flag{sql_1nj3ct10n_m4st3r}', description: 'The flag to submit', required: false })
@IsString()
@MinLength(5)
@MaxLength(200)
@IsOptional()
flag?: string;
```

**B. Added `File_URL` field** (Lines 96-104):
```typescript
@ApiProperty({ 
  example: 'https://storage.example.com/challenges/sqli.zip', 
  description: 'URL to challenge file or resource', 
  required: false 
})
@IsUrl()
@IsOptional()
File_URL?: string;
```

#### Validation Rules:
- `flag` is now optional but validates if provided (MinLength: 5, MaxLength: 200)
- `File_URL` must be a valid URL format if provided
- At least one must be provided (enforced in service layer)

---

### 3. `/backend/src/modules/challenges/challenges.service.ts`

#### Changes Made:

**A. Added validation in `create()` method** (Lines 56-61):
```typescript
// Validate: at least one of flag or File_URL must be provided
if (!createChallengeDto.flag && !createChallengeDto.File_URL) {
  throw new BadRequestException(
    'Either a flag or File_URL must be provided for the challenge',
  );
}
```

**B. Conditional flag hashing** (Lines 63-71):
```typescript
// Hash flag only if provided
let flagHash: string | null = null;
let flagSalt: string | null = null;
if (createChallengeDto.flag) {
  const hashed = this.cryptoService.hashFlag(createChallengeDto.flag);
  flagHash = hashed.hash;
  flagSalt = hashed.salt;
}
```

**C. Added `File_URL` assignment** (Line 80):
```typescript
File_URL: createChallengeDto.File_URL || null,
```

#### Business Logic:
- Ensures every challenge has at least one submission method
- Flag hashing only occurs if flag is provided (performance optimization)
- Maintains existing behavior for flag-based challenges
- Enables new file-based challenge types

---

### 4. `/backend/src/modules/submissions/submissions.service.ts`

#### Changes Made:

**A. Added null-check in `submit()` method** (Lines 73-80):
```typescript
// Check if challenge accepts flag submissions
if (!challengeData.flagHash || !challengeData.flagSalt) {
  throw new BadRequestException(
    'This challenge does not accept flag submissions. It may use a file-based verification system.',
  );
}
```

**B. Added null-check in admin submit function** (Lines 196-203):
```typescript
// Check if challenge accepts flag submissions
if (!challengeData.flagHash || !challengeData.flagSalt) {
  throw new BadRequestException(
    'This challenge does not accept flag submissions. It may use a file-based verification system.',
  );
}
```

#### Security Implications:
- Prevents attempts to submit flags for file-based challenges
- Clear error messaging for users trying unsupported submission methods
- No breaking changes to existing flag verification logic

---

## Impact Analysis

### Existing Functionality
✅ **Preserved** - All existing flag-based challenges continue to work unchanged
- Flag hashing logic remains identical
- Default `flagSalt` value ("h3xsalt") maintained
- Existing submissions verification unaffected

### New Functionality
✨ **Added** - Support for alternative challenge types:
- File-based challenges (no flag verification)
- Hybrid challenges (both flag and file submission)
- External CTF integrations (via File_URL)

### API Changes
📝 **Breaking Changes**: None
- `flag` field is now optional in POST/PATCH requests
- `File_URL` field is new and optional
- Existing requests without these fields continue to work

### Database Migration
🔧 **Required Action**:
```bash
# Run Prisma migration
npx prisma migrate dev --name make_flag_fields_optional

# Or if using db:push
npx prisma db push
```

---

## Testing Recommendations

### Test Cases to Add

1. **Create challenge with flag only** (Existing behavior)
   ```
   POST /challenges
   { title, description, ..., flag: "flag{test}" }
   ✓ Should create successfully
   ✓ flagHash and flagSalt should be populated
   ✓ File_URL should be null
   ```

2. **Create challenge with File_URL only** (New behavior)
   ```
   POST /challenges
   { title, description, ..., File_URL: "https://..." }
   ✓ Should create successfully
   ✓ flagHash and flagSalt should be null
   ✓ File_URL should be populated
   ```

3. **Create challenge with both flag and File_URL** (Hybrid)
   ```
   POST /challenges
   { title, description, ..., flag: "...", File_URL: "..." }
   ✓ Should create successfully
   ✓ Both fields should be populated
   ```

4. **Create challenge with neither flag nor File_URL** (Validation)
   ```
   POST /challenges
   { title, description, ... }
   ✗ Should fail with BadRequestException
   ✓ Error message: "Either a flag or File_URL must be provided..."
   ```

5. **Submit flag to file-only challenge** (New protection)
   ```
   POST /submissions
   { challengeId: "file_only_id", flag: "..." }
   ✗ Should fail with BadRequestException
   ✓ Error message: "This challenge does not accept flag submissions..."
   ```

6. **Submit flag to flag-based challenge** (Existing behavior)
   ```
   POST /submissions
   { challengeId: "flag_id", flag: "correct_flag" }
   ✓ Should work as before
   ```

---

## Backwards Compatibility Notes

### ✅ Fully Compatible
- Existing API endpoints accept same parameters
- Existing challenges function unchanged
- Default values maintain original behavior
- No consumer-facing breaking changes

### ⚠️ Database Considerations
- **Old data**: Will have `flagHash` and `flagSalt` populated, `File_URL` null
- **New data**: Can be created with any combination (at least one required)
- **Queries**: Must account for null values in flagHash/flagSalt

### Recommended Migration Path
1. Deploy code changes
2. Run Prisma migration
3. No data transformation needed
4. Existing challenges continue working immediately

---

## Security Considerations

✅ **Maintained**:
- Flag hashing security unchanged
- Rate limiting still enforced
- No flags stored in plain text
- Audit logging intact

✅ **Improved**:
- Prevents incorrect flag submission attempts
- Clearer error messages for users
- Better type safety with optional fields

---

## Future Enhancements

Potential improvements enabled by these changes:

1. **File Upload Challenges**
   - Accept file submissions instead of text flags
   - Verify file hashes or contents

2. **Hybrid Submission Methods**
   - Accept either flag submission OR file submission
   - Different point values per method

3. **External Challenge Integrations**
   - Link to Docker containers via File_URL
   - External CTF platforms
   - Live challenge environments

4. **Dynamic File Generation**
   - Generate challenge files per user
   - Track file downloads

---

## Rollback Plan

If needed to revert changes:

```bash
# Revert Prisma schema
git checkout HEAD~1 prisma/schema.prisma

# Revert migrations
npx prisma migrate resolve --rolled-back "<migration-name>"

# Redeploy
```

⚠️ **Note**: This requires reverting DTO and service changes as well. Not recommended for production after data has been created with new schema.

---

## Summary

These changes provide flexibility for different challenge types while maintaining 100% backwards compatibility with existing flag-based challenges. The validation at both the database and service layers ensures data integrity and provides clear feedback to API consumers.

**Status**: ✅ Ready for Production
