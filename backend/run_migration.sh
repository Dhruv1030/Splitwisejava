#!/bin/bash

# Splitwise Clone Database Migration Script
# This script will run the database migrations to upgrade to v2.0

echo "🚀 Starting Splitwise Clone Database Migration to v2.0"
echo "=================================================="

# Database connection details (from application.properties)
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="splitwise_db"
DB_USER="postgres"
DB_PASSWORD="000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if psql is available
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL client (psql) is not installed or not in PATH"
    echo "Please install PostgreSQL client tools first"
    exit 1
fi

# Test database connection first
print_status "Testing database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    print_error "Cannot connect to database!"
    echo "Please check:"
    echo "  - Database is running on $DB_HOST:$DB_PORT"
    echo "  - Database '$DB_NAME' exists"
    echo "  - User '$DB_USER' has access with password '$DB_PASSWORD'"
    exit 1
fi

print_status "Database connection successful!"

# Ask for confirmation
echo ""
echo "This will upgrade your Splitwise Clone database to version 2.0"
echo "New features will be added:"
echo "  ✅ Enhanced user profiles with avatars and preferences"
echo "  ✅ Complete contacts/friends system"
echo "  ✅ Advanced group management with icons and permissions"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Migration cancelled by user"
    exit 0
fi

# Create backup (optional but recommended)
echo ""
read -p "Do you want to create a database backup first? (Y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    BACKUP_FILE="splitwise_backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "Creating database backup: $BACKUP_FILE"
    
    if PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_FILE"; then
        print_status "Backup created successfully: $BACKUP_FILE"
    else
        print_warning "Backup failed, but continuing with migration..."
    fi
fi

# Run the test connection script first
print_status "Running connection tests..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "src/main/resources/db/migration/test_connection.sql"; then
    print_error "Connection tests failed!"
    exit 1
fi

print_status "Connection tests passed!"

# Run the main migration
echo ""
print_status "Starting database migration..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "src/main/resources/db/migration/run_migrations.sql"; then
    echo ""
    print_status "🎉 Migration completed successfully!"
    echo ""
    echo "Your Splitwise Clone database has been upgraded to version 2.0!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart your Spring Boot application"
    echo "  2. Test the new APIs at http://localhost:8080/api/docs"
    echo "  3. Start building the frontend components"
    echo ""
else
    print_error "Migration failed!"
    echo ""
    echo "If you need to rollback, run:"
    echo "  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f src/main/resources/db/migration/rollback_migrations.sql"
    echo ""
    exit 1
fi
