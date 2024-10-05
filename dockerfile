# Base image
FROM alpine

# Set Node.js environment
ENV NODE_VERSION=20.15.1
ENV YARN_VERSION=1.22.15

# Argument for installation directory
ARG INSTALL_DIR=/opt

# Install necessary packages including Node.js, npm, build tools, and Python
RUN apk add --no-cache nodejs npm python3 make g++ bash

# Update npm and node-gyp to the latest version
RUN npm install -g npm@latest node-gyp@latest

# Copy the entire repo into the installation directory
COPY . ${INSTALL_DIR}/

# Set the working directory to where your app is located
WORKDIR ${INSTALL_DIR}/mount-bookmark

# Ensure the entrypoint script is executable
#RUN chmod +x ${INSTALL_DIR}/docker-entrypoint.sh

# Install npm dependencies
RUN npm install --legacy-peer-deps  # Use this if you encounter dependency issues

# Expose port 3000
EXPOSE 3000


# Set entry point script
#ENTRYPOINT ["${INSTALL_DIR}/docker-entrypoint.sh"]

# Default command to run the application
CMD ["npm", "start"]
