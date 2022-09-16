import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const removeBookAuthor: Pick<MutationResolvers, "removeBookAuthor"> = {
	removeBookAuthor: (parent, args, context) => {
		console.log("Mutation - removeBookAuthor - parent", parent);
		const { id } = args.input;

		// id must be provided when removing an author from a book
		if (!id) throw new Error("id must be provided");

		// find existing book
		const books: Book[] = cloneDeep(context.dbBooks);
		const existingBook = books.find((b) => b.id === id);
		if (!existingBook) throw new Error("book not found");

		// fail silently should book not have an existing author
		if (!existingBook.author) return existingBook;

		const updatedBook: Book = {
			id,
			title: existingBook.title,
			author: undefined,
		};

		// copy authors data
		const authors: Author[] = cloneDeep(context.dbAuthors);

		// make modifications to authors copy
		const modifiedAuthors = authors.map((a) => {
			// remove book from author
			if (a.id === existingBook.author?.id) {
				if (a.books) {
					a.books = a.books.filter((b) => b.id !== id);
				}
			}
			return a;
		});

		// update authors "data"
		context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

		// make modifications to books
		const modifiedBooks = books.map((b) => {
			if (b.id === existingBook.id) {
				b = { ...existingBook, ...updatedBook };
			}
			return b;
		});

		// update books "data"
		context.dbBooks.splice(0, books.length, ...modifiedBooks);

		// provide updated book to response
		return updatedBook;
	},
};
