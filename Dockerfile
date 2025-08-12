# First Stage: Build Stage
FROM node:22 AS builder

LABEL authors="arezooq"

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json if using npm)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the NestJS project
RUN yarn build

# Second Stage: Runtime Stage
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on (default NestJS port is 3000)
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:prod"]