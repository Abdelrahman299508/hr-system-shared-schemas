# Shared Schemas - HR System (Standardized Across All Subsystems)

## Overview
These schemas are the **SINGLE SOURCE OF TRUTH** for all HR subsystems. All teams must use these exact structures when referencing employees, departments, positions, and users.

---

## 1. User Schema (Authentication & Authorization)
**Collection:** `users`

```typescript
interface User {
  _id: ObjectId;
  email: string; // unique, indexed
  passwordHash: string;
  role: 'EMPLOYEE' | 'HR_MANAGER' | 'HR_ADMIN' | 'DEPARTMENT_MANAGER' | 
        'PAYROLL_SPECIALIST' | 'PAYROLL_MANAGER' | 'FINANCE_STAFF' | 
        'SYSTEM_ADMIN' | 'LEGAL_ADMIN';
  employeeId: ObjectId; // Reference to Employee collection
  isActive: boolean;
  lastLogin: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `email` (unique)
- `employeeId`
- `isActive`

**Used By:** All subsystems for authentication and role-based access control

---

## 2. Employee Schema (Core Master Data)
**Collection:** `employees`

This is the **central employee record** that all subsystems reference.

```typescript
interface Employee {
  _id: ObjectId;
  
  // Personal Information
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    fullNameArabic?: string;
    dateOfBirth: Date;
    gender: 'MALE' | 'FEMALE';
    nationality: string;
    nationalId: string; // unique, indexed
    passportNumber?: string;
    maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
    profilePicture?: string; // URL/path
  };
  
  // Contact Information
  contactInfo: {
    personalEmail: string;
    workEmail: string; // unique, indexed
    phoneNumber: string;
    alternatePhone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  
  // Employment Information
  employmentInfo: {
    employeeNumber: string; // unique, indexed
    hireDate: Date;
    workReceivingDate: Date; // Used for leave accrual calculations
    contractType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
    employmentStatus: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED' | 'RESIGNED';
    probationEndDate?: Date;
    confirmationDate?: Date;
    terminationDate?: Date;
    terminationReason?: string;
  };
  
  // Organizational Assignment
  organizationalInfo: {
    departmentId: ObjectId; // Reference to Department
    positionId: ObjectId; // Reference to Position
    reportingManagerId?: ObjectId; // Reference to Employee (manager)
    dottedLineManagerId?: ObjectId; // Secondary reporting line
    location: string; // Office location
  };
  
  // Compensation (Basic - detailed in Payroll)
  compensationInfo: {
    payGradeId: ObjectId; // Reference to PayGrade (Payroll subsystem)
    currency: string; // e.g., "EGP", "USD"
    bankAccountNumber?: string;
    bankName?: string;
    bankBranch?: string;
  };
  
  // System Metadata
  metadata: {
    createdBy: ObjectId; // Reference to User
    createdAt: Date;
    updatedBy: ObjectId; // Reference to User
    updatedAt: Date;
    version: number; // For optimistic locking
  };
  
  isActive: boolean; // Quick filter for active employees
}
```

**Indexes:**
- `personalInfo.nationalId` (unique)
- `contactInfo.workEmail` (unique)
- `employmentInfo.employeeNumber` (unique)
- `organizationalInfo.departmentId`
- `organizationalInfo.positionId`
- `organizationalInfo.reportingManagerId`
- `employmentInfo.employmentStatus`
- `isActive`

**Used By:** ALL subsystems - this is the master employee record

---

## 3. Department Schema
**Collection:** `departments`

```typescript
interface Department {
  _id: ObjectId;
  departmentCode: string; // unique, e.g., "HR", "IT", "FIN"
  departmentName: string;
  departmentNameArabic?: string;
  description?: string;
  
  // Hierarchy
  parentDepartmentId?: ObjectId; // For nested departments
  departmentHeadId?: ObjectId; // Reference to Employee (Department Manager)
  
  // Cost Center (for Payroll integration)
  costCenter?: string;
  
  // Status
  isActive: boolean;
  effectiveDate: Date; // When this department became active
  endDate?: Date; // When deactivated (soft delete)
  
  // Metadata
  createdBy: ObjectId; // Reference to User
  createdAt: Date;
  updatedBy: ObjectId;
  updatedAt: Date;
}
```

**Indexes:**
- `departmentCode` (unique)
- `parentDepartmentId`
- `departmentHeadId`
- `isActive`

**Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance, Time Management

---

## 4. Position Schema
**Collection:** `positions`

```typescript
interface Position {
  _id: ObjectId;
  positionCode: string; // unique, e.g., "SE-001"
  positionTitle: string;
  positionTitleArabic?: string;
  description?: string;
  
  // Organizational Placement
  departmentId: ObjectId; // Reference to Department
  reportsToPositionId?: ObjectId; // Reference to Position (hierarchical structure)
  
  // Position Details
  level: string; // e.g., "Junior", "Mid", "Senior", "Lead", "Manager"
  jobFamily?: string; // e.g., "Engineering", "Sales", "HR"
  
  // Compensation
  payGradeId: ObjectId; // Reference to PayGrade (Payroll subsystem)
  
  // Headcount
  headcountBudget: number; // Number of people allowed in this position
  currentHeadcount: number; // Number of people currently in this position
  
  // Status
  isActive: boolean;
  effectiveDate: Date;
  endDate?: Date; // When position was delimited/deactivated
  
  // Metadata
  createdBy: ObjectId;
  createdAt: Date;
  updatedBy: ObjectId;
  updatedAt: Date;
}
```

**Indexes:**
- `positionCode` (unique)
- `departmentId`
- `reportsToPositionId`
- `isActive`

**Used By:** Organization Structure, Employee Profile, Recruitment, Payroll, Performance

---

## 5. Audit Log Schema (System-wide)
**Collection:** `audit_logs`

```typescript
interface AuditLog {
  _id: ObjectId;
  
  // Who
  userId: ObjectId; // Reference to User who made the change
  userEmail: string;
  userRole: string;
  
  // What
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'VIEW';
  entity: string; // e.g., "Employee", "Department", "LeaveRequest"
  entityId: ObjectId; // ID of the affected record
  
  // Changes
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  
  // Context
  reason?: string; // Justification for the change
  metadata?: Record<string, any>; // Additional context
  
  // When
  timestamp: Date;
  
  // Where (optional)
  ipAddress?: string;
  userAgent?: string;
}
```

**Indexes:**
- `userId`
- `entity` + `entityId` (compound)
- `timestamp`
- `action`

**Used By:** ALL subsystems for compliance and traceability

---

## 6. File/Document Schema (Shared)
**Collection:** `documents`

```typescript
interface Document {
  _id: ObjectId;
  
  // Document Details
  fileName: string;
  originalFileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  fileUrl: string; // S3/Cloud storage URL or local path
  
  // Classification
  documentType: 'PROFILE_PICTURE' | 'NATIONAL_ID' | 'CONTRACT' | 'CERTIFICATE' | 
                'MEDICAL_DOCUMENT' | 'PAYSLIP' | 'TAX_DOCUMENT' | 'OTHER';
  category: string; // e.g., "Personal", "Employment", "Leave", "Payroll"
  
  // Ownership
  ownerId: ObjectId; // Employee or other entity
  ownerType: 'EMPLOYEE' | 'DEPARTMENT' | 'POSITION' | 'LEAVE_REQUEST' | 'APPRAISAL';
  
  // Access Control
  uploadedBy: ObjectId; // Reference to User
  isPublic: boolean; // Can all employees see this?
  allowedRoles: string[]; // Which roles can access
  
  // Metadata
  uploadedAt: Date;
  expiryDate?: Date; // For documents that expire (e.g., work permits)
  tags?: string[];
  description?: string;
}
```

**Indexes:**
- `ownerId` + `ownerType` (compound)
- `documentType`
- `uploadedBy`
- `uploadedAt`

**Used By:** Employee Profile, Leaves, Payroll, Onboarding, Performance

---

## Integration Guidelines

### 1. **Reference Integrity**
- Always use `ObjectId` references for relationships between collections
- When deleting/deactivating records, use soft deletes (`isActive: false`) to maintain historical data
- Never delete Employee, Department, or Position records that have historical references

### 2. **Data Consistency**
- All subsystems MUST read employee data from the `employees` collection
- Any updates to employee master data MUST go through the Employee Profile subsystem
- Use the `metadata.version` field for optimistic locking when updating shared records

### 3. **Change Management**
- All changes to shared schemas must be approved by all subsystem teams
- Use migration scripts for schema updates
- Maintain backward compatibility for at least one release cycle

### 4. **Naming Conventions**
- Collections: lowercase, plural (e.g., `employees`, `departments`)
- Fields: camelCase (e.g., `firstName`, `departmentId`)
- Enums: UPPER_CASE (e.g., `ACTIVE`, `FULL_TIME`)
- Reference fields: Always suffix with `Id` (e.g., `employeeId`, `departmentId`)

### 5. **Timestamps**
- Always include `createdAt` and `updatedAt` in metadata
- Use ISO 8601 format for dates
- Store all dates in UTC

### 6. **Scalability Considerations**
- Use compound indexes for frequently queried combinations
- Avoid deep nesting (max 3 levels)
- For large arrays, consider separate collections
- Use MongoDB references instead of embedded documents for shared entities

---

## Subsystem Dependencies

| Shared Schema | Used By Subsystems |
|---------------|-------------------|
| User | ALL |
| Employee | ALL |
| Department | Organization, Employee Profile, Recruitment, Payroll, Performance, Time, Leaves |
| Position | Organization, Employee Profile, Recruitment, Payroll, Performance |
| AuditLog | ALL |
| Document | Employee Profile, Leaves, Payroll, Onboarding, Performance |

---

## Version Control
- **Version:** 1.0
- **Last Updated:** 2025-11-14
- **Next Review:** Before Milestone 2

