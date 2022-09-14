# copy files then build dist and copy schema
FROM node:16.10.0 as build
WORKDIR /home/node/app
COPY package.json package-lock.json codegen.yml ./
RUN npm install
COPY ./tsconfig.json ./tsconfig-build.json ./
COPY ./src ./src
RUN npm run graphql-codegen
RUN npm run build:docker
COPY ./src/schema ./dist/schema

# install prod dependencies
FROM node:16.10.0 as proddeps
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm install --only=production

# build the final runtime image
FROM node:16.10.0 as runtime
WORKDIR /home/node/app
COPY package.json package-lock.json ./
COPY --from=build /home/node/app/dist ./src
COPY --from=proddeps /home/node/app/node_modules ./node_modules
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
