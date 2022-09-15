import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const addAuthor: Pick<MutationResolvers, "addAuthor"> = {
	addAuthor: (parent, args, context) => {
		console.log("Mutation - addAuthor - parent", parent);
		const { id, bookIds, firstName, lastName } = args.input;

		// id must not be provided when creating an author
		if (id) throw new Error("id must not be provided");

		// firstName and lastName required
		if (!firstName || !lastName)
			throw new Error("first name and last name are required");

		// increment id for storing author in "data"
		const authorId = `a:${context.dbAuthors.length + 1}`;

		const newAuthor: Author = {
			id: `${authorId}`,
			firstName,
			lastName,
		};

		if (bookIds && bookIds.length > 0) {
			const books: Book[] = cloneDeep(context.dbBooks);

			// get books based on provided bookIds
			const matchedBooks: Book[] = books.filter((book) => {
				const result = bookIds.filter((id) => book.id === id);
				// returns books that match
				return result && result.length > 0;
			});

			// do not create author if an invalid book provided
			if (matchedBooks.length !== bookIds.length)
				throw new Error("book not found");

			// do not create author if trying to include a book that already has an author
			matchedBooks.forEach((b) => {
				if (b.author) {
					throw new Error("provided book already has an author");
				}
			});

			// assign author as books' author
			matchedBooks.forEach((book) => (book.author = newAuthor));

			// modify books to include matched books
			const matchedBooksIds = matchedBooks.map((b) => b.id);
			const modifiedBooks = books.map((b) => {
				if (matchedBooksIds.includes(b.id)) {
					const replaceBook = matchedBooks.find((mb) => mb.id === b.id);
					if (replaceBook) {
						b = replaceBook;
					}
				}
				return b;
			});

			// update books "data"
			context.dbBooks.splice(0, books.length, ...modifiedBooks);

			// set author's books - no need to handle existing books since new author
			newAuthor.books = matchedBooks;
		}

		// add author to "data"
		context.dbAuthors.push(newAuthor);

		// provide author to response
		return newAuthor;
	},
};
