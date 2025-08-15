# Database Migration Guide for Splitwise Clone v2.0

This directory contains the database migration scripts to upgrade your Splitwise Clone from v1.0 to v2.0.

## 🚀 **What's New in v2.0**

- **Enhanced User Profiles** - Avatars, preferences, notifications, settings
- **Contacts/Friends System** - Complete friends management with invitations
- **Advanced Groups** - Icons, permissions, member management, archiving
- **Better Performance** - Optimized indexes and database structure

## 📁 **Migration Files**

1. **`V2__enhance_user_model.sql`** - Adds profile fields to User table
2. **`V3__create_contacts_table.sql`** - Creates new Contacts table
3. **`V4__enhance_group_model.sql`** - Enhances Group table with new features
4. **`run_migrations.sql`** - Master script to run all migrations
5. **`rollback_migrations.sql`** - Rollback script (use with caution!)

## 🛠️ **How to Run the Migration**

### **Option 1: Using the Master Script (Recommended)**

```bash
# Connect to your PostgreSQL database
psql -h localhost -U your_username -d your_database_name -f run_migrations.sql
```

### **Option 2: Running Individual Migrations**

```bash
# 1. Enhance User table
psql -h localhost -U your_username -d your_database_name -f V2__enhance_user_model.sql

# 2. Create Contacts table
psql -h localhost -U your_username -d your_database_name -f V3__create_contacts_table.sql

# 3. Enhance Group table
psql -h localhost -U your_username -d your_database_name -f V4__enhance_group_model.sql
```

### **Option 3: Using pgAdmin or DBeaver**

1. Open your database management tool
2. Open each `.sql` file
3. Execute them in order (V2 → V3 → V4)

## ⚠️ **Important Notes**

- **Backup First!** Always backup your database before running migrations
- **Test Environment** - Test migrations on a copy of your database first
- **Downtime** - These migrations are safe and won't cause downtime
- **Rollback** - Use `rollback_migrations.sql` if you need to revert

## 🔍 **Verification**

After running migrations, verify success by checking:

```sql
-- Check User table enhancements
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'user' AND column_name IN ('avatar_url', 'phone', 'default_currency');

-- Check Contact table
SELECT table_name FROM information_schema.tables
WHERE table_name = 'contact';

-- Check Group table enhancements
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'group' AND column_name IN ('icon_url', 'group_type', 'privacy_level');
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Permission Denied** - Ensure your user has ALTER TABLE permissions
2. **Column Already Exists** - Safe to ignore, migrations use IF NOT EXISTS
3. **Type Already Exists** - Safe to ignore, enums use IF NOT EXISTS

### **If Something Goes Wrong:**

```bash
# Run the rollback script
psql -h localhost -U your_username -d your_database_name -f rollback_migrations.sql
```

## 📊 **Migration Summary**

| Migration | Purpose                  | Tables Affected | New Features                        |
| --------- | ------------------------ | --------------- | ----------------------------------- |
| V2        | User Profile Enhancement | `user`          | Avatars, preferences, notifications |
| V3        | Contacts System          | `contact`       | Friends, invitations, relationships |
| V4        | Group Enhancement        | `group`         | Icons, permissions, settings        |

## 🎯 **Next Steps**

After successful migration:

1. **Test Your APIs** - Visit `/api/docs` to see all endpoints
2. **Build Frontend** - Create UI components for new features
3. **Add Real-time** - Implement WebSockets for live updates

## 📞 **Need Help?**

If you encounter issues:

1. Check the PostgreSQL logs
2. Verify your database user permissions
3. Ensure you're running migrations in the correct order

---

**Good luck with your upgrade! 🚀**
