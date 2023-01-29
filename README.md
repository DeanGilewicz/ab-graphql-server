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
      <ul>
        <li><a href="#api">API</a></li>
      </ul>
      <ul>
        <li><a href="#rules">Rules</a></li>
      </ul>
       <ul>
        <li><a href="#no-data-persistance">No Data Persistance</a></li>
      </ul>
       <ul>
        <li><a href="#testing">Testing</a></li>
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
    <li><a href="#cicd">CI/CD</a></li>
  </ol>
</details>

<br />

## About The Project

This example project provides a GraphQL server allowing for CRUD operations of `Author` and `Book`. There is no persistent layer (no Database) meaning restarting the server will cause all data to be lost.

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

### **API**

The API is provided via a Mercurius GraphQL adapter that has been used with Fastify - the web framework on top of Node JS.

[GraphQL codegen](https://the-guild.dev/graphql/codegen) has also been used to generate types for the application based on `.graphql` files in the `schema` directory.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Rules**

An `author` can have many `book`s but a `book` can only have one author. An `author` can be created with out `book` and a `book` can be created without an `author`. A `book` can be removed from an `author` and an `author` can be removed from a `book`.

Logic exists in `updateAuthorResolver` to throw when an attempt is made to associate an `author` to a `book` when the `book` already has an `author`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **No Data Persistance**

Each time a mutation is invoked, the app creates a copy of the data using [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice). This method modifies the existing data (in our case we remove current data and replace with a "copied" state), allowing tests to keep its reference to the original data to be able to assert against. This is due to storing data in memory and not persisting to a database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### **Testing**

A `GraphQl` mock helper function `graphqlTestCall` has been created to enable testing expected behavior. Assertions can be made against the GraphQL request and response, and the outcome of mutations.

Test factories have been created for both `author` and `book` to more easily set up data for the different test scenarios.

Jest has been used as the test framework and coverage reporting is also set up

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
  - builds non-dockerized production application
- build:docker
  - handles type for docker build
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

## CI/CD

The application has been dockerized in order to provide an easier way to manage deployment.

Currently, [GitHub Actions](https://docs.github.com/en/actions) has been set up as the CI/CD solution. There is an action for PR review that runs `linting`, `type checking` and `tests` and there is an action to facilitate production deployment.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[fastify]: https://img.shields.io/badge/Fastify-20232A?style=for-the-badge&logo=fastify&logoColor=ffffff
[fastify-url]: https://www.fastify.io/
[mercurius]: https://img.shields.io/badge/Mercurius-ff9b00?style=for-the-badge&logo=Mercurius-&logoColor=ffffff
[mercurius-url]: https://mercurius.dev/
[graphql]: https://img.shields.io/badge/GraphQL-1E252D?style=for-the-badge&logo=graphql&logoColor=E10098&
[graphql-url]: https://graphql.org/
[typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff
[typescript-url]: https://www.typescriptlang.org/
[jest]: https://img.shields.io/badge/Jest-15c213?style=for-the-badge&logo=jest&logoColor=C21325
[jest-url]: https://jestjs.io/
