# Use Node 20
FROM node:20.17.0

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Copy rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Start NestJS in dev mode
CMD ["npm", "run", "start:dev"]