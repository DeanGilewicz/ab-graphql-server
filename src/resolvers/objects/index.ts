import { authorResolvers } from "src/resolvers/objects/author/authorResolvers";
import { bookResolvers } from "src/resolvers/objects/book/bookResolvers";

export const objectResolvers = {
	Author: authorResolvers,
	Book: bookResolvers,
};
