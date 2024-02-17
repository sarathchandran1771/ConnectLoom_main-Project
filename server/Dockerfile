# Start your image with a node base image
FROM node:18-alpine

# Install Python
RUN apk update && apk add python3 --no-cache

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install --legacy-peer-deps

# Add this line to install the AWS SDK
RUN npm install @aws-sdk/client-s3

# Copy the rest of the application code
COPY . .  

      ENV MONGO_URL=mongodb+srv://connectLoom:connectLoom@loomdata.lwjdsu4.mongodb.net/
      ENV JWT_SECRET=ERDFTYGHUI124357HFGXR
      ENV CLOUDINARY_CLOUD_NAME=dnudvzoj9
      ENV CLOUDINARY_API_KEY=766737744245659
      ENV CLOUDINARY_API_SECRET=hDMleqjCm9sv4oVU6qcZyPPeyb8
      ENV HOST=smtp.gmail.com
      ENV FRONTEND_BASEURL=https://connectloom.shop
      ENV SERVICE=gmail
      ENV EMAIL_PORT=587
      ENV SECURE=true
      ENV USER=ksarathchandran2101@gmail.com
      ENV PASS=edwl\ gnvy\ fbjc\ teie

      ENV GOOGLE_CLIENT_ID=538914185784-lvkjflgma50ikctonctvmb4fb9v4rgaq.apps.googleusercontent.com
      ENV GOOGLE_CLIENT_SECRET=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

      ENV S3_ACCESS_KEY=AKIA2NYRYFNPZWBN7QWK
      ENV S3_SECRET_KEY=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
      ENV S3_BUCKETNAME=adminconnectloom
      ENV S3_BUCKET_REGION=ap-south-1

      ENV STRIPE_PUBLISHABLE_KEY=pk_test_51OP9g7SJWK76MyVzKQZCMnWse35YbzNshtsWfHKBepI8DCa7HRPXmRziaL9KyRbreTG0AJJtX4uficb7TL1GgPGD00XVntXdk6
      ENV STRIPE_SECRET_KEY=sk_test_51OP9g7SJWK76MyVzAvzQQbEtc4F6CCw73NSXZFsKLDaL5e7HY1mtbfZ7jF14On1DyIYk4g5neoqddeIR07l28jf000hvaDiv1Z
      ENV STRIPE_ENDPOINT_KEY=whsec_363893ed4afc35f33f01050c5d2ba84c32d97eadad5b95470fd2d51eefbccfac
      ENV PAYPAL_CLIENT_ID=AWS8Xh43QRvYsL-SbnSu-7PL108pOreRtR1pUDqW2j-UA5auzmoGQY_re3lGAHc19qyPzvHXBSkrSveZ
      ENV PAYPAL_SECRET_KEY=EJ88XX7gzIWwkaGyFQ4ecEBB4qHmrQFs89cZt_4ALzNINz5yUx8F4F_r7h7ZpOh-E1RJu4rGx6EQgCP6


# Expose port
EXPOSE 5000

# Start the app using serve command
CMD ["npm", "run", "start"]
