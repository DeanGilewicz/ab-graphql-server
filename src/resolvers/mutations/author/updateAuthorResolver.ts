import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const updateAuthor: Pick<MutationResolvers, "updateAuthor"> = {
	updateAuthor: (parent, args, context) => {
		console.log("Mutation - updateAuthor - parent", parent);
		const { id, bookIds, firstName, lastName } = args.input;

		// id must be provided when updating an author
		if (!id) throw new Error("id must be provided");

		// find existing author
		const authors: Author[] = cloneDeep(context.dbAuthors);
		const existingAuthor = authors.find((a) => a.id === id);
		if (!existingAuthor) throw new Error("author not found");

		const updatedAuthor: Author = {
			id,
			firstName: firstName ? firstName : existingAuthor.firstName,
			lastName: lastName ? lastName : existingAuthor.lastName,
		};

		if (bookIds && bookIds.length > 0) {
			const books: Book[] = cloneDeep(context.dbBooks);

			// get books based on provided bookIds
			const matchedBooks: Book[] = books.filter((book) => {
				const result = bookIds.filter((id) => book.id === id);
				// returns books that match
				return result && result.length > 0;
			});

			// do not update author if trying to include a book that already has an author
			matchedBooks.forEach((b) => {
				if (b.author) {
					throw new Error("provided book already has an author");
				}
			});

			// assign author as books' author
			matchedBooks.forEach((book) => (book.author = updatedAuthor));

			// modify books to include matched books
			const matchedBooksIds = matchedBooks.map((b) => b.id);
			const modifiedBooks = books.map((b) => {
				if (matchedBooksIds.includes(b.id)) {
					b.author = updatedAuthor;
				}
				return b;
			});

			// update books "data"
			context.dbBooks.splice(0, books.length, ...modifiedBooks);

			if (existingAuthor.books) {
				// keep any existing books and add the new books
				updatedAuthor.books = [...existingAuthor.books, ...matchedBooks];
			} else {
				// set author's books
				updatedAuthor.books = [...matchedBooks];
			}

			// sort books in ascending order
			updatedAuthor.books.sort((a, b) => {
				// compare book ids
				const bookIdA = parseInt(a.id.split("b:")[1]);
				const bookIdB = parseInt(b.id.split("b:")[1]);
				// ascending
				return bookIdA > bookIdB ? 1 : bookIdA < bookIdB ? -1 : 0;
			});
		}

		const modifiedAuthors = authors.map((a) => {
			if (a.id === existingAuthor.id) {
				a = { ...existingAuthor, ...updatedAuthor };
			}
			return a;
		});

		// update authors "data"
		context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

		// provide updated author to response
		return updatedAuthor;
	},
};
