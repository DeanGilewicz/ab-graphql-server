import { MutationResolvers } from "src/types";
import { addAuthor } from "src/resolvers/mutations/author/addAuthorResolver";
import { updateAuthor } from "src/resolvers/mutations/author/updateAuthorResolver";
import { deleteAuthor } from "src/resolvers/mutations/author/deleteAuthorResolver";
import { deleteAuthorBooks } from "src/resolvers/mutations/author/deleteAuthorBooksResolver";
import { addBook } from "src/resolvers/mutations/book/addBookResolver";
import { updateBook } from "src/resolvers/mutations/book/updateBookResolver";
import { deleteBook } from "src/resolvers/mutations/book/deleteBookResolver";
import { removeBookAuthor } from "./book/removeBookAuthor";

export const mutationResolvers: MutationResolvers = {
	...addAuthor,
	...updateAuthor,
	...deleteAuthor,
	...deleteAuthorBooks,
	...addBook,
	...updateBook,
	...deleteBook,
	...removeBookAuthor,
};
