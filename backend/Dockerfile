# Stage 1: Build the Nx monorepo
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies using package-lock.json to ensure reproducible builds.
# Doing this before copying all source code maximizes layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy Nx configuration files first (optional, as we copy everything anyway, but good for context)
COPY nx.json tsconfig.base.json ./

# Copy all source files
COPY . .

# Build all microservices using Nx within the monorepo
RUN npx nx run-many --target=build --all

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency files
COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm ci --omit=dev

# Copy only the compiled output (dist folder contains dist/apps/*)
COPY --from=builder /usr/src/app/dist ./dist

# The default command will run the api-gateway. 
# Other default commands can be overridden in docker-compose.yml.
CMD ["node", "dist/api-gateway/main.js"]
