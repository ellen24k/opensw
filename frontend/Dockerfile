# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]

######################

## Use the official Node.js image as the base image for building the app
#FROM node:14-alpine AS build
#
## Set the working directory
#WORKDIR /app
#
## Copy package.json and package-lock.json
#COPY package*.json ./
#
## Install dependencies
#RUN npm install
#
## Copy the rest of the application code
#COPY . .
#
## Build the application
#RUN npm run build
#
## Use the official Nginx image as the base image for serving the app
#FROM nginx:alpine
#
## Set the working directory to /usr/share/nginx/html
#WORKDIR /usr/share/nginx/html
#
## Remove the default Nginx static files
#RUN rm -rf ./*
#
## Copy the build folder contents from the build stage to the working directory
#COPY --from=build /app/build .
#
## Expose port 80
#EXPOSE 80
#
## Start Nginx when the container launches
#CMD ["nginx", "-g", "daemon off;"]
