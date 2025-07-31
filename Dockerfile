FROM node:18

WORKDIR /app

# Copy everything (including mongo.js)
COPY . .

# Install dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]
