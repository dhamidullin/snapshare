FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

ENV DATA_PATH=data
ENV NODE_ENV=production

# Create temporary data directory for build
RUN mkdir -p data

COPY . .
RUN yarn build

# Remove temporary data directory
RUN rm -rf data

EXPOSE 5286

CMD ["yarn", "start"] 
