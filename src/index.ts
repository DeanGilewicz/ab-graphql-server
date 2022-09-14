import fastify from "fastify";
import fastifyCors from "fastify-cors";
import mercurius from "mercurius";
import { schemaWithResolvers } from "src/graphql";
import { authors, books } from "src/db/prod";
import { authors as devAuthors, books as devBooks } from "src/db/dev";
import { isAllowedOrigin } from "src/cors";

const app = fastify();

const env = process.env.NODE_ENV || "development";
const port = 8080;
const host = "0.0.0.0";

app.register(fastifyCors, {
	origin(requestOrigin, callback) {
		callback(null, isAllowedOrigin(requestOrigin));
	},
	// 24hrs
	maxAge: 86400,
});

app.register(mercurius, {
	schema: schemaWithResolvers,
	graphiql: true,
	context: (request, reply) => {
		return {
			// TODO: look into setting up tests for https://github.com/mercurius-js/mercurius-integration-testing
			dbAuthors: env === "production" ? authors : devAuthors,
			dbBooks: env === "production" ? books : devBooks,
		};
	},
});

app.listen(
	port,
	host,
	() => {
		console.log(`Running GraphQL API server at http://${host}:${port}/graphql`);
	}
	// (e) => console.log("ERROR", e)
);
