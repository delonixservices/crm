# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose the development server port (default is 5173 for Vite or 3000 for Create React App)
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev"]
