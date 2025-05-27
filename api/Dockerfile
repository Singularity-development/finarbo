# --------- Stage 1: Build ----------
FROM node:23-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install the application dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# --------- Stage 2: Production ----------
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Only copy production files from the builder stage
COPY package*.json ./
RUN npm install --only=production

# Copy built dist folder from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 3000

# Set NODE_ENV to 'production' by default
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "run", "start:prod"]
