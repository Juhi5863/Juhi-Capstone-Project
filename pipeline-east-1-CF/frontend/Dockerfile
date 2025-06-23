# Use official Node image for build
FROM node:18 AS build

# Accept backend URL at build time
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the React app with the backend URL
RUN echo "BUILD-TIME REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL"
RUN npm run build

# --- Serve the static files using a lightweight server ---
FROM public.ecr.aws/docker/library/nginx:alpine

# Copy the build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Optionally: custom Nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
