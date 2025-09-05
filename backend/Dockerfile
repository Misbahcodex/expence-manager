# Use Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Install ts-node globally to run TypeScript directly
RUN npm install -g ts-node

# Expose port
EXPOSE 5000

# Start the application using ts-node
CMD ["npx", "ts-node", "src/index.ts"]
