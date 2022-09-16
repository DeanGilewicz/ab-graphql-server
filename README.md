<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">✍📚 Authors Books - GraphQL Server</h2>
  <p align="center">
    A Fastify and Mercurius GraphQL server!
  </p>
</div>

<br />
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<br />

## About The Project

This example project provides a GraphQL server allowing for CRUD operations of `Author` and `Book`. There is no persistent layer (e.g. no Database) meaning restarting the server will cause all data to be lost.

There were several reasons for working on this project, including the chance to:

- implement a GraphQL server
- set up and use TypeScript
- explore the use of test factories
- implement test coverage
- package an application with Docker

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Built With**

Below is a list of major frameworks/libraries that were used to bootstrap this project.

- [![Fastify][fastify]][fastify-url]
- [![Mercurius][mercurius]][mercurius-url]
- [![GraphQL][graphql]][graphql-url]
- [![TypeScript][typescript]][typescript-url]
- [![Jest][jest]][jest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

## Getting Started

The following information will provide you with the details necessary to get the application up and running locally.

### **Prerequisites**

On your operating system of choice, ensure that [NodeJS](https://nodejs.org/en/) version `16.6.1` is installed. It is recommended that a Node Version Manager be used, such as [NVM](https://github.com/nvm-sh/nvm). When installing `NodeJS` this way, the correctly associated `npm` version should automatically be installed.

```sh
nvm install node@16.6.1
```

### **Installation**

Once `NodeJS` and `npm` is installed you can follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/DeanGilewicz/ab-graphql-server.git
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Run the application
   ```sh
   npm run start:dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The application provides a variety of commands in `package.json`:

- build
  - builds application
- build:docker
  - TBD?
- copy:graphql
  - copies graphql schema from `src` to `dist`
- graphql-codegen
  - runs graphql codegen based on `codegen.yml `
- lint
  - runs `eslint` and attempts to fix any issues
- start:dev
  - starts the application using `nodemon`, compiles TypeScript and uses `/db/dev.ts` data
- start:prod
  - starts the application using `node` and uses `/db/prod.ts` data
- start:staging
  - starts the application using `nodemon`, compiles TypeScript and uses `/db/prod.ts` data
- test
  - runs all tests via `jest`
- test:coverage
  - runs all tests via `jest` and generates code coverage report
- test:watch
  - runs test in watch mode via `jest`

Once the server is up and running you can visit the [GraphiQL endpoint](http://0.0.0.0:8080/graphiql) to interact with the GraphQL server. You can click `Docs` to see the available `queries` and `mutations`. See [GraphiQL](https://github.com/graphql/graphiql) for more information.

Note: restarting the server will cause all data to be lost.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
