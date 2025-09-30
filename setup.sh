#!/bin/bash

# Dropshipping Platform Setup Script
# This script automates the initial setup of the dropshipping platform

set -e

echo "🚀 Starting Dropshipping Platform Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "All requirements met!"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please edit .env file with your configuration before continuing"
        print_warning "Especially important: JWT_SECRET and Firebase credentials"
        
        read -p "Press Enter to continue after editing .env file..."
    else
        print_success ".env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install all workspace dependencies
    npm run install:all
    
    print_success "Dependencies installed successfully!"
}

# Start Docker containers
start_containers() {
    print_status "Starting Docker containers..."
    
    docker-compose up -d
    
    print_success "Docker containers started!"
    print_status "Waiting for database to be ready..."
    
    # Wait for database to be ready
    sleep 30
    
    print_success "Database is ready!"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd services/api
    npm run migration:run
    cd ../..
    
    print_success "Database migrations completed!"
}

# Seed initial data
seed_data() {
    print_status "Creating initial data..."
    
    cd services/api
    npm run seed
    cd ../..
    
    print_success "Initial data created!"
}

# Test CSV import
test_csv_import() {
    print_status "Testing CSV import functionality..."
    
    cd services/workers
    if [ -f sample-products.csv ]; then
        node src/import-csv.js sample-products.csv 2
        print_success "CSV import test completed!"
    else
        print_warning "Sample CSV file not found, skipping import test"
    fi
    cd ../..
}

# Display final information
display_final_info() {
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "📋 Next steps:"
    echo "1. Start development servers: npm run dev"
    echo "2. Access applications:"
    echo "   - Store Frontend: http://localhost:3000"
    echo "   - Admin Panel: http://localhost:3001"
    echo "   - API Docs: http://localhost:3002/api/docs"
    echo ""
    echo "🔐 Test accounts:"
    echo "   - Admin: admin@dropshipping.com / admin123"
    echo "   - Supplier: supplier@dropshipping.com / supplier123"
    echo ""
    echo "📚 Documentation: See README.md for detailed information"
    echo ""
    print_warning "Don't forget to configure Firebase credentials in .env for push notifications!"
}

# Main execution
main() {
    echo "🏪 Dropshipping Platform Setup"
    echo "=============================="
    echo ""
    
    check_requirements
    setup_environment
    install_dependencies
    start_containers
    run_migrations
    seed_data
    test_csv_import
    display_final_info
}

# Run main function
main "$@"