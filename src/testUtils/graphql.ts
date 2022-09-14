import { graphql } from "graphql";
import { schemaWithResolvers } from "src/graphql";
import { Author, Book } from "src/types";

// currently testing resolvers in isolation
// (not integrating with the fastify / mercurius set up)
export const graphqlTestCall = async ({
	query,
	authors = [],
	books = [],
}: {
	query: any;
	authors?: Author[];
	books?: Book[];
}) => {
	// make data available to test - useful for mutations
	const [gql, db] = await Promise.all([
		graphql({
			schema: schemaWithResolvers,
			source: query,
			contextValue: {
				dbAuthors: authors,
				dbBooks: books,
			},
		}),
		new Promise((resolve) =>
			resolve({ authors, books })
		) as Promise<TestDbData>,
	]);
	return { gql, db };
};

type TestDbData = { authors: Author[]; books: Book[] };
