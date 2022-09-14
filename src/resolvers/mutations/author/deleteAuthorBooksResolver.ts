import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const deleteAuthorBooks: Pick<MutationResolvers, "deleteAuthorBooks"> = {
	deleteAuthorBooks: (parent, args, context, info) => {
		console.log("Mutation - deleteAuthorBooks - parent", parent);
		const { id, bookIds } = args.input;

		// id must be provided when updating an author
		if (!id) throw new Error("id must be provided");
		// ids of books to delete
		if (!bookIds || bookIds.length === 0)
			throw new Error("at least one bookId must be provided");

		// find existing author
		const authors: Author[] = cloneDeep(context.dbAuthors);
		const existingAuthor = authors.find((a) => a.id === id);
		if (!existingAuthor) throw new Error("author not found");

		if (!existingAuthor.books || existingAuthor.books.length === 0) {
			return existingAuthor;
		}

		// remove books from author
		const updatedAuthorBooks: Book[] = existingAuthor.books.filter((book) => {
			const result = bookIds.filter((id) => book.id !== id);
			// returns books that do not match provided book ids
			return result && result.length > 0;
		});

		// remove author from any associated book
		const books: Book[] = cloneDeep(context.dbBooks);
		const modifiedBooks = books.map((b) => {
			if (
				b.author &&
				b.author.id === existingAuthor.id &&
				bookIds.includes(b.id)
			) {
				b.author = undefined;
			}
			return b;
		});

		// update book "data"
		context.dbBooks.splice(0, books.length, ...modifiedBooks);

		const updatedAuthor: Author = {
			id,
			firstName: existingAuthor.firstName,
			lastName: existingAuthor.lastName,
			books: updatedAuthorBooks,
		};

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
