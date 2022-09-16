import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const deleteAuthor: Pick<MutationResolvers, "deleteAuthor"> = {
	deleteAuthor: (parent, args, context) => {
		console.log("Mutation - deleteAuthor - parent", parent);
		const { id } = args.input;

		// find existing author
		const authors: Author[] = cloneDeep(context.dbAuthors);
		const existingAuthor = authors.find((a) => a.id === id);
		if (!existingAuthor) throw new Error("author not found");

		if (existingAuthor.books && existingAuthor.books.length > 0) {
			// remove author from any associated book
			const books: Book[] = cloneDeep(context.dbBooks);
			const modifiedBooks = books.map((b) => {
				if (b.author && b.author.id === existingAuthor.id) {
					b.author = undefined;
				}
				return b;
			});

			// update book "data"
			context.dbBooks.splice(0, books.length, ...modifiedBooks);
		}

		// remove author from "data"
		const modifiedAuthors = authors.filter((a) => a.id !== existingAuthor.id);
		context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

		// provide author id to response
		return { id };
	},
};
