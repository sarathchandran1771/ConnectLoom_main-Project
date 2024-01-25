#!/bin/bash

# Navigate to the server directory
cd /root/server

# Install Python
apk update && apk add python3 --no-cache

# Install npm dependencies
npm install --legacy-peer-deps

# Install the AWS SDK for S3
npm install @aws-sdk/client-s3

# Start the server
npm run start
