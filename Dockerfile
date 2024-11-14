# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package.json . 
COPY package-lock.json . 
RUN npm install --frozen-lockfile # Cache dependencies
COPY . . 
RUN npm run build

# Runtime stage
FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
