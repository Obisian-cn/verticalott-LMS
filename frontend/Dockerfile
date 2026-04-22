# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies strictly utilizing cache logic
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the project for production
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts to the nginx HTML directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Replace default configuration with custom SPA-friendly routing setup
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Automatically expose port 80 based on standard HTTP protocols
EXPOSE 80

# Keep nginx running globally in daemon off mode for Docker scaling
CMD ["nginx", "-g", "daemon off;"]
