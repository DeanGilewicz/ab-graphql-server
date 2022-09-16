import { cloneDeep } from "lodash";
import { Author, Book, MutationResolvers } from "src/types";

export const addBook: Pick<MutationResolvers, "addBook"> = {
	addBook: (parent, args, context) => {
		console.log("Mutation - addBook - parent", parent);
		const { id, authorId } = args.input;

		// id must not be provided when creating a book
		if (id) throw new Error("id must not be provided");

		// increment id for storing author in "data"
		const bookId = `b:${context.dbBooks.length + 1}`;

		const newBook: Book = {
			id: `${bookId}`,
			title: args.input.title || "",
		};

		if (authorId) {
			const authors: Author[] = cloneDeep(context.dbAuthors);
			const author = authors.find((a) => a.id === authorId);
			if (!author) throw new Error("author not found");

			// associate this new book to author
			if (!author.books) {
				// set array if no books exist already
				author.books = [newBook];
			} else {
				// add book when books array already exists
				author.books.push(newBook);
			}

			const modifiedAuthors = authors.map((a) => {
				if (a.id === author.id) {
					a = author;
				}
				return a;
			});

			// update authors "data"
			context.dbAuthors.splice(0, authors.length, ...modifiedAuthors);

			// assign author as book's author
			newBook.author = author;
		}

		// add book to "data"
		context.dbBooks.push(newBook);

		// provide book to response
		return newBook;
	},
};
