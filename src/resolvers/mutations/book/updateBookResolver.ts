import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const updateBook: Pick<MutationResolvers, "updateBook"> = {
	updateBook: (parent, args, context, info) => {
		console.log("Mutation - updateBook - parent", parent);
		const { id, title, authorId } = args.input;

		// id must be provided when updating a book
		if (!id) throw new Error("id must be provided");

		// find existing book
		const books: Book[] = cloneDeep(context.dbBooks);
		const existingBook = books.find((b) => b.id === id);
		if (!existingBook) throw new Error("book not found");

		const updatedBook: Book = {
			id,
			title: title ? title : existingBook.title,
		};

		if (authorId) {
			const authors: Author[] = cloneDeep(context.dbAuthors);

			// get author based on provided authorId
			const author = authors.find((a) => a.id === authorId);
			if (!author) throw new Error("author not found");

			const modifiedAuthors = authors.map((a) => {
				// add book to matched author if it does not exist
				if (a.id === author.id) {
					if (a.books) {
						const existingBookIds = a.books.map((b) => b.id);
						if (!existingBookIds.includes(id)) {
							a.books.push(updatedBook);
						}
					} else {
						a.books = [updatedBook];
					}
				} else {
					// remove any association to this book for all other authors
					if (a.books) {
						a.books = a.books?.filter((b) => b.id !== id);
					}
				}
				return a;
			});

			// update authors "data"
			context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

			// set author for updated book
			updatedBook.author = author;
		}

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
