FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port (if needed for health checks)
EXPOSE 3003

# Start the application
CMD ["npm", "start"]