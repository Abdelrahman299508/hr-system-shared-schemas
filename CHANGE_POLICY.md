# Shared Schema Change Policy

## Overview

Since these schemas are used by **ALL subsystem teams**, any changes must follow a strict approval process to avoid breaking integrations.

---

## 📋 Change Request Process

### Step 1: Identify the Need
Before requesting a change, ask yourself:
- Is this change necessary for your subsystem?
- Could it be handled in your module-specific schemas instead?
- Will it affect other teams?
- Is it backward compatible?

### Step 2: Create an Issue
Create a GitHub issue with this template:

```markdown
## Schema Change Request

**Requested by:** [Your Team Name]
**Schema:** [e.g., Employee, Department, Position]
**Type:** [Breaking / Non-Breaking]

### Proposed Change
[Describe what you want to change]

### Reason
[Explain why this change is needed]

### Affected Teams
- [ ] Employee Profile, Org Structure, Performance
- [ ] Time Management
- [ ] Leaves
- [ ] Payroll
- [ ] Recruitment, Onboarding, Offboarding

### Backward Compatibility
[Explain if/how this breaks existing code]

### Migration Plan
[If breaking, how will teams migrate?]
```

### Step 3: Team Review (3-5 days)
All affected teams review the proposal:
- Each team comments with approval/concerns
- Discuss alternatives if concerns raised
- Aim for consensus

### Step 4: Implementation
Once ALL teams approve:
1. Create a feature branch
2. Make the changes
3. Update version number (see versioning below)
4. Update documentation
5. Create pull request
6. Final review by all teams
7. Merge to main

### Step 5: Release & Migration
1. Create a new release/tag
2. All teams update their package version
3. Run migration scripts if needed
4. Test integrations

---

## 📊 Versioning Strategy

We use [Semantic Versioning](https://semver.org/):

### MAJOR version (X.0.0)
**Breaking changes** - requires code changes in consuming modules

Examples:
- Removing a field
- Changing a field type
- Renaming a field
- Changing required/optional status

**Process:**
- Requires approval from ALL teams
- Requires migration plan
- Minimum 1 week notice before release
- Deprecated features should be marked in previous minor version

### MINOR version (1.X.0)
**New features** - backward compatible

Examples:
- Adding a new optional field
- Adding a new schema
- Adding indexes
- Adding virtuals

**Process:**
- Requires approval from affected teams
- No migration needed
- Can be released after team consensus

### PATCH version (1.0.X)
**Bug fixes** - backward compatible

Examples:
- Fixing typos in documentation
- Fixing incorrect index definitions
- Fixing validation rules that were too strict

**Process:**
- Can be done by any team
- Notify other teams via Slack/email
- Fast-track approval

---

## 🚫 What NOT to Change

### Never Change These Without MAJOR Version:
- Field names in existing schemas
- Field types (e.g., String to Number)
- Making optional fields required
- Removing fields

### Discouraged (but possible with team consensus):
- Changing enum values that are already in use
- Changing index strategies significantly
- Major restructuring of nested objects

---

## ✅ Safe Changes (Encouraged)

### Always Safe:
- Adding new optional fields
- Adding documentation/comments
- Adding new schemas
- Adding new indexes (performance improvement)
- Adding virtuals (computed properties)
- Making required fields optional (relaxing constraint)

---

## 🔄 Migration Scripts

For breaking changes, provide migration scripts:

### Example: Renaming a field

```typescript
// migrations/1.0.0-to-2.0.0.ts
import { MongoClient } from 'mongodb';

export async function migrate() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('hr_system');
  
  // Rename field: employeeNum -> employeeNumber
  await db.collection('employees').updateMany(
    {},
    { $rename: { 'employeeNum': 'employmentInfo.employeeNumber' } }
  );
  
  console.log('Migration completed');
  await client.close();
}
```

---

## 📞 Emergency Changes

If a critical bug is found that affects production:

1. Create hotfix branch immediately
2. Fix the issue
3. Create PATCH version
4. Notify all teams immediately (Slack + email)
5. Merge and release
6. Document in CHANGELOG.md

---

## 📝 Communication Channels

- **Planning:** GitHub Issues
- **Urgent:** Team WhatsApp/Slack group
- **Weekly Sync:** Friday standup meeting
- **Documentation:** This repo's Wiki

---

## 🏆 Best Practices

1. **Think twice before changing shared schemas** - Can you solve it in your module?
2. **Communicate early** - Mention potential changes in weekly meetings
3. **Test thoroughly** - Breaking integrations affects everyone
4. **Document everything** - Update SCHEMA_DOCUMENTATION.md
5. **Be respectful** - Other teams depend on stability
6. **Plan migrations** - Make breaking changes easy to adopt

---

## 📅 Regular Reviews

Every **2 months**, all teams meet to:
- Review current schema design
- Discuss pain points
- Plan major version upgrades
- Share learnings

---

**Last Updated:** November 14, 2025  
**Version:** 1.0.0

