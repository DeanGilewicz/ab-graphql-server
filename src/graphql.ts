import * as path from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "@graphql-tools/merge";
import { resolvers } from "src/resolvers";

const schema = loadSchemaSync(path.join(__dirname, "./schema/**/*.graphql"), {
	loaders: [new GraphQLFileLoader()],
});

const allResolvers = mergeResolvers(resolvers);

export const schemaWithResolvers = addResolversToSchema({
	schema,
	resolvers: allResolvers,
});
