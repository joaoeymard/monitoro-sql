# Use a Node.js base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if needed, adjust as necessary)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]