# ==========================================
# Stage 1: Build the static assets
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency configuration manifests
COPY package*.json ./

# Install packages clean and fast
RUN npm ci

# Copy the remaining project application code layers
COPY . .

# Compile Vite source maps into optimized production HTML/CSS/JS dist assets
RUN npm run build

# ==========================================
# Stage 2: Serve the assets using Nginx
# ==========================================
FROM nginx:alpine

# Copy the static web build directly from the compilation stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port web traffic gateway inside the container
EXPOSE 80

# Launch Nginx in the foreground to keep the container runtime alive
CMD ["nginx", "-g", "daemon off;"]
