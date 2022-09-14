import { QueryResolvers } from "src/types";
import { author } from "src/resolvers/queries/author/authorResolver";
import { authors } from "src/resolvers/queries/author/authorsResolver";
import { book } from "src/resolvers/queries/book/bookResolver";
import { books } from "src/resolvers/queries/book/booksResolver";

export const queryResolvers: Omit<QueryResolvers, "test"> = {
	...author,
	...authors,
	...book,
	...books,
};
