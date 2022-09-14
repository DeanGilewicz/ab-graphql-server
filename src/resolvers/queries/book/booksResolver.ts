import { QueryResolvers } from "src/types";

export const books: Pick<QueryResolvers, "books"> = {
	books: (parent, args, context, info) => {
		console.log("Query - books - parent", parent);
		return context.dbBooks;
	},
};
