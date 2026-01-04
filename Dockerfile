# Gunakan image Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies dengan legacy-peer-deps
RUN npm install --legacy-peer-deps

# Install react-is explicitly
RUN npm install react-is --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port 3070
EXPOSE 3070

# Set environment variables
ENV HOSTNAME=0.0.0.0
ENV PORT=3070
ENV NODE_ENV=production

# Jalankan perintah start
CMD ["npm", "start"]
