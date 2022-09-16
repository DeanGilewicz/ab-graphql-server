import { Book, QueryResolvers } from "src/types";

export const book: Pick<QueryResolvers, "book"> = {
	book: (parent, args, context) => {
		console.log("Query - book - parent", parent);
		const book = context.dbBooks.find((b: Book) => b.id === args.id);
		if (!book) throw new Error("No book found");
		return book;
	},
};
