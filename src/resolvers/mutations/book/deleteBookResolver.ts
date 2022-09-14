import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const deleteBook: Pick<MutationResolvers, "deleteBook"> = {
	deleteBook: (parent, args, context, info) => {
		console.log("Mutation - deleteBook - parent", parent);
		const { id } = args.input;

		// find existing book
		const books: Book[] = cloneDeep(context.dbBooks);
		const existingBook = books.find((b) => b.id === id);
		if (!existingBook) throw new Error("book not found");

		// remove book from all authors
		const authors: Author[] = cloneDeep(context.dbAuthors);
		const modifiedAuthors = authors.map((a) => {
			if (a.books) {
				a.books = a.books.filter((b) => b.id !== id);
			}
			return a;
		});

		// update author "data"
		context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

		// remove book from "data"
		const modifiedBooks = books.filter((b) => b.id !== existingBook.id);
		context.dbBooks.splice(0, books.length, ...modifiedBooks);

		// provide book id to response
		return { id };
	},
};
