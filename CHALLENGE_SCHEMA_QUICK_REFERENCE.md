# Challenge Schema Changes - Quick Reference

## Summary of Changes

| Field | Before | After | Impact |
|-------|--------|-------|--------|
| `flagHash` | Required String | Optional String? | Flag validation now optional |
| `flagSalt` | Required String (default: "h3xsalt") | Optional String? (default: "h3xsalt") | Maintains backwards compatibility |
| `File_URL` | N/A (didn't exist) | Optional String? | NEW: Link to challenge files/resources |

## API Request Examples

### Example 1: Traditional Flag-Based Challenge ✅
```json
{
  "title": "SQL Injection Basics",
  "description": "Exploit SQL injection to find the flag",
  "category": "WEB",
  "difficulty": "MEDIUM",
  "points": 100,
  "flag": "flag{sql_1nj3ct10n_m4st3r}"
}
```

**Result**: 
- ✅ Creates challenge with flagHash and flagSalt populated
- ✅ File_URL is null
- ✅ Users can submit flags via /submissions

---

### Example 2: File-Based Challenge ✅
```json
{
  "title": "Reverse Engineering Challenge",
  "description": "Reverse engineer the binary and find the flag",
  "category": "REVERSE",
  "difficulty": "HARD",
  "points": 250,
  "File_URL": "https://storage.example.com/challenges/binary.zip"
}
```

**Result**:
- ✅ Creates challenge with File_URL populated
- ✅ flagHash and flagSalt are null
- ❌ Flag submissions will be rejected with clear error

---

### Example 3: Hybrid Challenge (Both) ✅
```json
{
  "title": "Web Challenge with Resources",
  "description": "Solve the web challenge and download resources",
  "category": "WEB",
  "difficulty": "MEDIUM",
  "points": 150,
  "flag": "flag{web_m4ster}",
  "File_URL": "https://storage.example.com/challenges/webfiles.zip"
}
```

**Result**:
- ✅ Creates challenge with both fields populated
- ✅ Users can either submit flag OR download file
- ✅ Maximum flexibility

---

### Example 4: Invalid Request ❌
```json
{
  "title": "Invalid Challenge",
  "description": "This challenge has neither flag nor file",
  "category": "MISC",
  "difficulty": "EASY",
  "points": 50
}
```

**Result**:
- ❌ Request fails with error
- Error: `"Either a flag or File_URL must be provided for the challenge"`

---

## Challenge Type Behavior

### Flag-Only Challenge
```
Challenge Properties:
  - flagHash: "hashed_value"
  - flagSalt: "h3xsalt" (or custom)
  - File_URL: null
  
User Submission:
  - POST /submissions with flag ✅ Allowed
  - File upload ❌ Not implemented yet
```

### File-Only Challenge
```
Challenge Properties:
  - flagHash: null
  - flagSalt: null
  - File_URL: "https://storage.example.com/..."
  
User Submission:
  - POST /submissions with flag ❌ Rejected (with clear error)
  - File download ✅ Via File_URL
```

### Hybrid Challenge
```
Challenge Properties:
  - flagHash: "hashed_value"
  - flagSalt: "h3xsalt"
  - File_URL: "https://storage.example.com/..."
  
User Submission:
  - POST /submissions with flag ✅ Allowed
  - File download ✅ Via File_URL
```

---

## Error Handling

### When Creating Challenge

**Error**: Missing both flag and File_URL
```
Status: 400 Bad Request
Message: "Either a flag or File_URL must be provided for the challenge"
```

### When Submitting Flag

**Error**: Submitting flag to file-only challenge
```
Status: 400 Bad Request
Message: "This challenge does not accept flag submissions. It may use a file-based verification system."
```

---

## Database Changes

### What Changed
- `flagHash` column: NULL allowed (was NOT NULL)
- `flagSalt` column: NULL allowed (was NOT NULL) 
- `File_URL` column: NEW column added (always NULL until populated)

### Migration
```bash
# Option 1: Interactive migration
npx prisma migrate dev --name make_flag_fields_optional

# Option 2: Push to database directly
npx prisma db push
```

### Data Impact
✅ **No existing data lost**
- Existing challenges keep their flagHash and flagSalt
- File_URL will be null for all existing challenges
- No data transformation needed

---

## Code Files Modified

| File | Change Type | Impact |
|------|-------------|--------|
| `prisma/schema.prisma` | Schema Update | Made flagHash/flagSalt optional, added File_URL |
| `challenges/dto/create-challenge.dto.ts` | DTO Update | Made flag optional, added File_URL field |
| `challenges/challenges.service.ts` | Service Logic | Added validation and conditional hashing |
| `submissions/submissions.service.ts` | Service Logic | Added null-checks before flag verification |

---

## Testing Checklist

- [ ] Create flag-only challenge and verify submission works
- [ ] Create file-only challenge and verify flag submission rejected
- [ ] Create hybrid challenge and verify both options work
- [ ] Attempt to create challenge with neither flag nor File_URL (should fail)
- [ ] Verify existing challenges still work unchanged
- [ ] Verify flag hashing produces same results as before
- [ ] Check error messages are clear and helpful

---

## Migration Guide

### For Challenge Creators

**Before** (Still works):
```json
POST /competitions/{id}/challenges
{
  "title": "Challenge",
  "description": "...",
  "flag": "flag{test}"
}
```

**After** (All options work):
```json
// Option 1: Traditional flag
POST /competitions/{id}/challenges
{
  "title": "Challenge",
  "flag": "flag{test}"
}

// Option 2: File-based
POST /competitions/{id}/challenges
{
  "title": "Challenge",
  "File_URL": "https://..."
}

// Option 3: Hybrid
POST /competitions/{id}/challenges
{
  "title": "Challenge",
  "flag": "flag{test}",
  "File_URL": "https://..."
}
```

### For Players

**No changes needed** - Existing challenges work exactly the same way. New challenge types may have different submission methods clearly indicated.

---

## Production Deployment

1. ✅ Deploy updated code
2. ✅ Run database migration
3. ✅ No data cleanup needed
4. ✅ No downtime required
5. ✅ Fully backwards compatible

**Risk Level**: 🟢 LOW - No breaking changes, only additive functionality

---

## Support

For issues or questions:
1. Check the full changelog: `CHANGELOG_CHALLENGE_SCHEMA.md`
2. Review test cases in documentation
3. Check error messages for guidance
