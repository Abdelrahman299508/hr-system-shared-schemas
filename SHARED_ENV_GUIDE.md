# 🔐 Shared Environment Variables Guide

## Overview

This file (`.env.shared`) contains environment variables that **MUST be identical** across all subsystem teams to ensure proper integration and authentication.

---

## 🎯 Purpose

### Why Shared Environment Variables?

When different subsystems communicate with each other, they need to:
- ✅ **Validate JWT tokens** from other subsystems
- ✅ **Share sessions** across different APIs
- ✅ **Use consistent security settings**
- ✅ **Have compatible CORS configurations**

If each team uses different JWT secrets, authentication will fail across subsystems!

---

## 📋 What's Shared vs. What's Private

### ✅ **Shared (in `.env.shared`):**
- JWT secrets and configuration
- Session secrets
- CORS settings
- Rate limiting settings
- File upload standards
- Frontend URL
- API documentation settings
- Logging levels

### 🔒 **Private (in each team's `.env`):**
- MongoDB connection strings
- Database names
- Server ports (each subsystem has different port)
- Team-specific upload paths
- Email/SMTP credentials (if different per team)
- Any team-specific secrets

---

## 🚀 How to Use

### For All Teams:

#### Step 1: Clone Shared Schemas Repository
```bash
git clone https://github.com/Abdelrahman299508/hr-system-shared-schemas.git
```

#### Step 2: Copy Shared Variables
```bash
cd hr-system-shared-schemas
cat .env.shared
```

#### Step 3: Merge into Your `.env`
Copy the values from `.env.shared` into your team's `.env` file.

**Example for Employee Profile team:**
```env
# Your team-specific variables
MONGODB_URI=mongodb+srv://your-credentials@cluster.mongodb.net/hr_system
PORT=3001

# Shared variables (copied from .env.shared)
JWT_SECRET=hr_system_shared_jwt_secret_2025_do_not_change
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005
# ... etc
```

---

## 🔄 Keeping in Sync

### When Shared Variables Change:

1. **Notification:** A team creates an issue in `hr-shared-schemas` repository
2. **Discussion:** All teams review and approve the change
3. **Update:** The change is merged to `.env.shared`
4. **Sync:** All teams pull the latest version
5. **Update Local:** Each team updates their local `.env` file

### Check for Updates Regularly:
```bash
cd hr-system-shared-schemas
git pull origin main
cat .env.shared
```

---

## 📊 Shared Variables Reference

### Authentication Variables

| Variable | Shared Value | Why Shared? |
|----------|--------------|-------------|
| `JWT_SECRET` | `hr_system_shared_jwt_secret_2025_do_not_change` | All systems must validate tokens with same secret |
| `JWT_EXPIRATION` | `7d` | Consistent token lifetime across systems |
| `JWT_REFRESH_SECRET` | `hr_system_shared_refresh_secret_2025_do_not_change` | Refresh tokens must work across systems |
| `JWT_REFRESH_EXPIRATION` | `30d` | Consistent refresh token lifetime |
| `BCRYPT_SALT_ROUNDS` | `10` | Password hashes must be compatible |
| `SESSION_SECRET` | `hr_system_shared_session_secret_2025_do_not_change` | Sessions shared across subsystems |

### CORS Variables

| Variable | Shared Value | Why Shared? |
|----------|--------------|-------------|
| `CORS_ORIGIN` | All localhost ports | Each API must allow requests from all others |
| `CORS_CREDENTIALS` | `true` | Enable credential sharing |

### File Upload Variables

| Variable | Shared Value | Why Shared? |
|----------|--------------|-------------|
| `MAX_FILE_SIZE` | `5242880` (5MB) | Consistent file size limits |
| `ALLOWED_FILE_TYPES` | Standard types | Documents uploaded in one system viewable in another |

### Rate Limiting Variables

| Variable | Shared Value | Why Shared? |
|----------|--------------|-------------|
| `RATE_LIMIT_TTL` | `60` | Consistent rate limiting |
| `RATE_LIMIT_MAX` | `100` | Same request limits |

---

## 🔐 Security Considerations

### Development vs. Production

**Current Shared Values (Development):**
```env
JWT_SECRET=hr_system_shared_jwt_secret_2025_do_not_change
```

**Production Values (To be decided by all teams):**
```env
# Generate strong random strings for production
JWT_SECRET=<48+ character random string>
JWT_REFRESH_SECRET=<48+ character random string>
SESSION_SECRET=<48+ character random string>
```

### Generating Secure Secrets for Production:

```bash
# On Mac/Linux
openssl rand -base64 48

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

All teams must coordinate and use the **same** generated secrets in production!

---

## 👥 Team-Specific Ports

Each subsystem uses a different port to avoid conflicts during local development:

| Subsystem | Port | API Base URL |
|-----------|------|--------------|
| Employee Profile, Org Structure, Performance | 3001 | http://localhost:3001/api |
| Time Management | 3002 | http://localhost:3002/api |
| Leaves | 3003 | http://localhost:3003/api |
| Payroll | 3004 | http://localhost:3004/api |
| Recruitment/Onboarding/Offboarding | 3005 | http://localhost:3005/api |
| Frontend (All teams) | 3000 | http://localhost:3000 |

---

## 🧪 Testing Integration

### Test Authentication Across Subsystems:

1. **Employee Profile (3001)** generates a JWT token for a user
2. **Time Management (3002)** should be able to validate that token
3. **Leaves (3003)** should also validate the same token
4. All because they share the same `JWT_SECRET`!

### Example Test Flow:

```javascript
// In Employee Profile API (port 3001)
const token = jwt.sign(payload, process.env.JWT_SECRET);
// Returns: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// In Time Management API (port 3002)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// ✅ Works! Because both use same JWT_SECRET
```

---

## ⚠️ Common Issues

### Issue: "JWT token validation failed"

**Cause:** Teams are using different `JWT_SECRET` values

**Solution:**
1. Check your `.env` file has the exact value from `.env.shared`
2. Restart your server after updating
3. Clear any cached tokens

### Issue: "CORS error when calling other subsystem"

**Cause:** CORS_ORIGIN doesn't include the calling service's URL

**Solution:**
1. Update `CORS_ORIGIN` to include all subsystem ports
2. Make sure to include `http://` prefix
3. Restart your server

### Issue: "Session not shared between subsystems"

**Cause:** Different `SESSION_SECRET` values

**Solution:**
1. Use the shared `SESSION_SECRET` from `.env.shared`
2. Ensure all teams are using compatible session middleware

---

## 📝 Change Request Template

When you need to change a shared variable:

```markdown
## Shared Environment Variable Change Request

**Requested by:** [Your Team Name]
**Date:** [Date]
**Variable:** [Variable name]

### Proposed Change
Current value: `...`
New value: `...`

### Reason
[Why this change is needed]

### Impact Assessment
- [ ] Employee Profile, Org Structure, Performance
- [ ] Time Management
- [ ] Leaves
- [ ] Payroll
- [ ] Recruitment, Onboarding, Offboarding

### Migration Plan
[How teams will update their environments]

### Testing Plan
[How to verify the change works across all systems]
```

---

## ✅ Best Practices

1. **Never modify shared secrets without team consensus**
2. **Always pull latest `.env.shared` before starting work**
3. **Test integration after any shared variable changes**
4. **Document any team-specific overrides** (with reason)
5. **Keep production secrets secure** (use secret management tools)
6. **Rotate secrets regularly in production** (coordinate with all teams)

---

## 🔄 Update Checklist

When `.env.shared` is updated:

- [ ] Pull latest from shared schemas repo
- [ ] Review changes
- [ ] Update your local `.env` file
- [ ] Restart your development server
- [ ] Test authentication/integration
- [ ] Notify your team members
- [ ] Update your team's documentation if needed

---

## 📞 Coordination

### Shared Environment Maintainers:

All subsystem teams share responsibility:
- Employee Profile, Org Structure, Performance team
- Time Management team
- Leaves team
- Payroll team
- Recruitment, Onboarding, Offboarding team

### Communication Channels:

- **GitHub Issues:** For change requests
- **Team Group Chat:** For quick coordination
- **Weekly Meetings:** Review any pending changes

---

## 🎯 Quick Reference

### To Get Latest Shared Variables:
```bash
cd hr-system-shared-schemas
git pull origin main
cat .env.shared
```

### To Update Your Environment:
```bash
# Copy shared values into your .env
# Restart your server
npm run start:dev
```

### To Propose Changes:
```bash
# Create issue in hr-shared-schemas repo
# Tag all team representatives
# Wait for consensus
```

---

**Maintained by all subsystem teams**  
**Last Updated:** November 14, 2025  
**Version:** 1.0.0

