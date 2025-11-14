# HR System - Shared Schemas

## Overview

This repository contains the **shared database schemas** that are used across **ALL subsystems** of the HR Management System. Every team must use these exact schemas to ensure data consistency and integration.

**⚠️ CRITICAL:** Any changes to these schemas MUST be approved by ALL subsystem teams before implementation.

---

## 📋 What's Inside

This repository contains the foundational schemas that serve as the **Single Source of Truth** for:

1. **User Authentication** - `User` schema
2. **Employee Master Data** - `Employee` schema  
3. **Departments** - `Department` schema
4. **Positions** - `Position` schema
5. **Audit Logging** - `AuditLog` schema
6. **Document Management** - `Document` schema

---

## 🗄️ Shared Collections (6 Total)

### 1. Users Collection
- **Purpose:** Authentication and authorization
- **Used By:** All modules
- **Key Fields:** email, passwordHash, role, employeeId
- **File:** `schemas/user.schema.ts`

### 2. Employees Collection
- **Purpose:** Central employee master data
- **Used By:** All modules (READ), Employee Profile module (WRITE)
- **Key Fields:** personalInfo, contactInfo, employmentInfo, organizationalInfo, compensationInfo
- **File:** `schemas/employee.schema.ts`
- **⚠️ CRITICAL:** Only Employee Profile module can modify this collection

### 3. Departments Collection
- **Purpose:** Department hierarchy
- **Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance, Time, Leaves
- **Key Fields:** departmentCode, departmentName, parentDepartmentId, departmentHeadId
- **File:** `schemas/department.schema.ts`

### 4. Positions Collection
- **Purpose:** Job position definitions
- **Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance
- **Key Fields:** positionCode, positionTitle, departmentId, level, payGradeId, headcountBudget
- **File:** `schemas/position.schema.ts`

### 5. Audit Logs Collection
- **Purpose:** System-wide audit trail
- **Used By:** All modules
- **Key Fields:** userId, action, entity, entityId, changes, timestamp
- **File:** `schemas/audit-log.schema.ts`

### 6. Documents Collection
- **Purpose:** File/document storage references
- **Used By:** Employee Profile, Leaves, Payroll, Onboarding, Performance
- **Key Fields:** fileName, fileUrl, documentType, ownerId, ownerType
- **File:** `schemas/document.schema.ts`

---

## 🏗️ Repository Structure

```
hr-shared-schemas/
├── README.md                      # This file
├── SCHEMA_DOCUMENTATION.md        # Detailed schema documentation
├── CHANGE_POLICY.md              # How to request schema changes
├── schemas/
│   ├── user.schema.ts            # User/Auth schema
│   ├── employee.schema.ts        # Employee master data
│   ├── department.schema.ts      # Department schema
│   ├── position.schema.ts        # Position schema
│   ├── audit-log.schema.ts       # Audit log schema
│   ├── document.schema.ts        # Document schema
│   └── index.ts                  # Export all schemas
├── types/
│   └── shared.types.ts           # Shared TypeScript types
├── package.json
└── tsconfig.json
```

---

## 📦 Installation

### For Backend Teams (NestJS)

```bash
# Install from GitHub
npm install git+https://github.com/YOUR-ORG/hr-shared-schemas.git

# Or if published to npm
npm install @your-org/hr-shared-schemas
```

### Usage in Your Module

```typescript
import { Employee, EmployeeSchema } from '@your-org/hr-shared-schemas';
import { User, UserSchema } from '@your-org/hr-shared-schemas';

// In your NestJS module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class YourModule {}
```

---

## 🔒 Change Management Policy

### Making Changes to Shared Schemas

**⚠️ IMPORTANT:** Changes to shared schemas affect ALL teams!

#### Step 1: Propose Change
1. Create an issue in this repository describing:
   - What needs to change
   - Why it's needed
   - Which teams are affected
   - Backward compatibility plan

#### Step 2: Team Review
2. ALL affected teams must review and approve:
   - Employee Profile, Org Structure, Performance team
   - Time Management team
   - Leaves team
   - Payroll team
   - Recruitment, Onboarding, Offboarding team

#### Step 3: Implementation
3. Once approved:
   - Create a branch: `feature/schema-change-description`
   - Make changes
   - Update version number (semantic versioning)
   - Create pull request
   - Merge after final approval

#### Step 4: Migration
4. All teams update to new version:
   - Run migration scripts if needed
   - Update their code to handle new schema
   - Test integration

---

## 📝 Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes (e.g., removing fields, changing types)
- **MINOR** version: Adding new fields (backward compatible)
- **PATCH** version: Bug fixes, documentation updates

**Current Version:** 1.0.0

---

## 🚀 Technology Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **ODM:** Mongoose
- **Database:** MongoDB 7.0+

---

## 👥 Maintainers

This repository is maintained by representatives from ALL subsystem teams:

- **Employee Profile, Org Structure, Performance Team:** [Your Names]
- **Time Management Team:** [Team Members]
- **Leaves Team:** [Team Members]
- **Payroll Team:** [Team Members]
- **Recruitment/Onboarding/Offboarding Team:** [Team Members]

---

## 📞 Contact

For questions or change requests:
1. Open an issue in this repository
2. Tag all team representatives
3. Wait for consensus before implementing

---

## 📚 Documentation

- **Detailed Schema Docs:** See `SCHEMA_DOCUMENTATION.md`
- **Integration Guide:** See individual team repositories
- **Change Policy:** See `CHANGE_POLICY.md`

---

## ⚠️ Critical Rules

1. ✅ **DO** read from shared collections in your modules
2. ✅ **DO** propose changes through the proper process
3. ✅ **DO** respect ownership (e.g., only Employee Profile modifies `employees`)
4. ❌ **DON'T** modify shared schemas without team approval
5. ❌ **DON'T** create duplicate collections
6. ❌ **DON'T** break backward compatibility without migration plan

---

**Course:** Software Project I, Winter 2025  
**Institution:** German International University  
**Last Updated:** November 14, 2025  
**Version:** 1.0.0

