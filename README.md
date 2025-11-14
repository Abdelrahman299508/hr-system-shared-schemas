# HR System - Shared Schemas

## Overview

This repository contains the **shared database schemas** and **shared environment variables** that are used across **ALL subsystems** of the HR Management System. Every team must use these exact schemas and settings to ensure data consistency and integration.

**⚠️ CRITICAL:** Any changes to these shared resources MUST be approved by ALL subsystem teams before implementation.

---

## 📋 What's Inside

### 1. Shared Database Schemas
The foundational schemas that serve as the **Single Source of Truth** for:
- User authentication (`User` schema)
- Employee master data (`Employee` schema)
- Departments (`Department` schema)
- Positions (`Position` schema)
- Audit logging (`AuditLog` schema)
- Document management (`Document` schema)

### 2. Shared Environment Variables (NEW! 🎉)
Common configuration that **MUST be identical** across all teams:
- JWT secrets for authentication
- Session secrets
- CORS settings
- Rate limiting
- File upload standards
- And more...

---

## 🗂️ Repository Structure

```
hr-system-shared-schemas/
├── README.md                        # This file
├── SCHEMA_DOCUMENTATION.md          # Detailed schema docs
├── CHANGE_POLICY.md                 # How to request changes
├── .env.shared                      # 🆕 SHARED environment variables
├── SHARED_ENV_GUIDE.md              # 🆕 How to use shared env vars
├── schemas/
│   ├── user.schema.ts               # User/Auth schema
│   ├── employee.schema.ts           # Employee master data
│   ├── department.schema.ts         # Department schema
│   ├── position.schema.ts           # Position schema
│   ├── audit-log.schema.ts          # Audit log schema
│   ├── document.schema.ts           # Document schema
│   └── index.ts                     # Export all schemas
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Use

### For All Subsystem Teams:

#### 1. Clone this Repository
```bash
git clone https://github.com/Abdelrahman299508/hr-system-shared-schemas.git
cd hr-system-shared-schemas
```

#### 2. Use Shared Schemas
Install or copy the schemas to your project:

```bash
# Option A: Install as npm package (if published)
npm install git+https://github.com/Abdelrahman299508/hr-system-shared-schemas.git

# Option B: Copy schemas directly
cp -r schemas/ ../your-project/src/shared/schemas/
```

#### 3. Copy Shared Environment Variables ⭐ NEW!
```bash
# View shared environment variables
cat .env.shared

# Copy the values into your team's .env file
# Keep your MongoDB URL private, use shared JWT secrets
```

#### 4. Keep Updated
```bash
# Regularly check for updates
git pull origin main

# Review .env.shared for any changes
cat .env.shared
```

---

## 🔐 Shared Environment Variables

### What's Shared?

The `.env.shared` file contains variables that **MUST be identical** across all teams:

✅ **JWT Secrets** - So tokens work across subsystems  
✅ **Session Secrets** - For session sharing  
✅ **CORS Settings** - So APIs can communicate  
✅ **Rate Limiting** - Consistent limits  
✅ **File Upload Standards** - Compatible file handling  

### What's NOT Shared?

Each team keeps these private in their own `.env`:

🔒 **MongoDB Connection Strings** - Your database credentials  
🔒 **Server Ports** - Each team uses different port  
🔒 **Upload Paths** - Team-specific storage  
🔒 **Email/SMTP** - Team-specific email settings  

### Example Usage:

**Your team's `.env` file:**
```env
# YOUR PRIVATE SETTINGS
MONGODB_URI=mongodb+srv://your-credentials@cluster.mongodb.net/hr_system
PORT=3001
UPLOAD_PATH=./uploads

# SHARED SETTINGS (copy from .env.shared)
JWT_SECRET=hr_system_shared_jwt_secret_2025_do_not_change
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005
# ... other shared variables
```

**📖 Read the complete guide:** [`SHARED_ENV_GUIDE.md`](./SHARED_ENV_GUIDE.md)

---

## 📚 Documentation

### For Schemas:
- **[SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md)** - Detailed schema documentation
- **[CHANGE_POLICY.md](./CHANGE_POLICY.md)** - How to request schema changes

### For Environment Variables:
- **[SHARED_ENV_GUIDE.md](./SHARED_ENV_GUIDE.md)** - Complete guide to shared environment variables
- **[.env.shared](./.env.shared)** - The actual shared environment variables file

---

## 🗄️ Shared Schemas Reference

### 1. User Schema
**Purpose:** Authentication & authorization  
**Used By:** All modules  
**Key Fields:** email, passwordHash, role, employeeId

### 2. Employee Schema
**Purpose:** Central employee master data  
**Used By:** All modules (READ), Employee Profile module (WRITE)  
**Key Fields:** personalInfo, contactInfo, employmentInfo, organizationalInfo, compensationInfo  
**⚠️ CRITICAL:** Only Employee Profile module can modify this collection

### 3. Department Schema
**Purpose:** Department hierarchy  
**Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance, Time, Leaves  
**Key Fields:** departmentCode, departmentName, parentDepartmentId, departmentHeadId

### 4. Position Schema
**Purpose:** Job position definitions  
**Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance  
**Key Fields:** positionCode, positionTitle, departmentId, level, payGradeId, headcountBudget

### 5. Audit Log Schema
**Purpose:** System-wide audit trail  
**Used By:** All modules  
**Key Fields:** userId, action, entity, entityId, changes, timestamp

### 6. Document Schema
**Purpose:** File/document storage references  
**Used By:** Employee Profile, Leaves, Payroll, Onboarding, Performance  
**Key Fields:** fileName, fileUrl, documentType, ownerId, ownerType

---

## 🔄 Change Management

### For Schema Changes:

See **[CHANGE_POLICY.md](./CHANGE_POLICY.md)** for the complete process.

**Quick summary:**
1. Create an issue in this repository
2. Get approval from ALL teams
3. Update schemas
4. Update version number
5. Notify all teams
6. All teams update their code

### For Environment Variable Changes:

See **[SHARED_ENV_GUIDE.md](./SHARED_ENV_GUIDE.md)** for the complete process.

**Quick summary:**
1. Create an issue describing the change
2. Get consensus from all teams
3. Update `.env.shared`
4. Notify all teams
5. All teams update their local `.env` files
6. All teams restart their servers

---

## 👥 Subsystem Teams

This repository is used by:

- **Employee Profile, Org Structure, Performance Team** (Port: 3001)
- **Time Management Team** (Port: 3002)
- **Leaves Team** (Port: 3003)
- **Payroll Team** (Port: 3004)
- **Recruitment, Onboarding, Offboarding Team** (Port: 3005)

---

## ⚠️ Critical Rules

### For Schemas:
1. ✅ **DO** read from shared collections in your modules
2. ✅ **DO** propose changes through the proper process
3. ✅ **DO** respect ownership (e.g., only Employee Profile modifies `employees`)
4. ❌ **DON'T** modify shared schemas without team approval
5. ❌ **DON'T** create duplicate collections
6. ❌ **DON'T** break backward compatibility without migration plan

### For Environment Variables:
1. ✅ **DO** use the exact values from `.env.shared` for authentication
2. ✅ **DO** keep your database credentials private
3. ✅ **DO** check for updates regularly
4. ❌ **DON'T** change JWT secrets without coordinating with all teams
5. ❌ **DON'T** commit your private `.env` file
6. ❌ **DON'T** share database credentials

---

## 🧪 Testing Integration

### Test Authentication Across Teams:

1. Employee Profile generates a JWT token
2. Time Management validates that token
3. Leaves validates the same token
4. All work because they share `JWT_SECRET`!

### Test CORS:

1. Frontend (port 3000) calls Employee Profile API (port 3001) ✅
2. Employee Profile calls Time Management API (port 3002) ✅
3. Time Management calls Leaves API (port 3003) ✅
4. All work because CORS includes all ports!

---

## 📦 Installation

### As NPM Package:
```bash
npm install git+https://github.com/Abdelrahman299508/hr-system-shared-schemas.git
```

### Usage in Code:
```typescript
import { Employee, EmployeeSchema } from '@hr-system/shared-schemas';
import { User, UserSchema } from '@hr-system/shared-schemas';
```

---

## 📞 Contact & Support

- **Repository:** https://github.com/Abdelrahman299508/hr-system-shared-schemas
- **Issues:** Create an issue for questions or change requests
- **Course:** Software Project I, Winter 2025
- **Institution:** German International University

---

## 🎯 Quick Links

- **[Schema Documentation](./SCHEMA_DOCUMENTATION.md)** - Detailed schema specs
- **[Environment Variables Guide](./SHARED_ENV_GUIDE.md)** - How to use shared env vars
- **[Change Policy](./CHANGE_POLICY.md)** - How to request changes
- **[Shared Environment File](./.env.shared)** - The actual shared variables

---

**Version:** 1.0.0  
**Last Updated:** November 14, 2025  
**Maintained By:** All HR System subsystem teams
