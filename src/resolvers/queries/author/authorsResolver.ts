import {
	Author,
	AuthorFilter,
	AuthorSortType,
	QueryResolvers,
} from "src/types";

export const authors: Pick<QueryResolvers, "authors"> = {
	authors: (parent, args, context, info) => {
		console.log("Query - authors - parent", parent);

		const filters: AuthorFilter = { ...args.filter };

		// id: [ID!];
		const byId = context.dbAuthors.filter((author: Author) => {
			const result = filters.id?.filter((id) => author.id === id);
			// returns non-empty array that has the id
			return result && result.length > 0;
		});

		// firstName: [String!];
		const byFirstName = context.dbAuthors.filter((author: Author) => {
			const result = filters.firstName?.filter(
				(fn) => author.firstName.toLowerCase() === fn.toLowerCase()
			);
			// returns non-empty array that has the firstName
			return result && result.length > 0;
		});

		// lastName: [String!];
		const byLastName = context.dbAuthors.filter((author: Author) => {
			const result = filters.lastName?.filter(
				(ln) => author.lastName.toLowerCase() === ln.toLowerCase()
			);
			// returns non-empty array that has the lastName
			return result && result.length > 0;
		});

		// bookIds: [ID!];
		const byBookIds = context.dbAuthors.filter((author: Author) => {
			const result = filters.bookIds?.filter((bId) => {
				const result = author.books?.filter((book) => bId === book.id);
				// returns non-empty array that has the bookId
				return result && result.length > 0;
			});
			// returns non-empty array that has the bookId
			return result && result.length > 0;
		});

		// use Array.from to convert Set to an Array
		// use new Set to ensure uniqueness of filtered results
		const filteredAuthors = Array.from(
			new Set([...byId, ...byFirstName, ...byLastName, ...byBookIds])
		);

		let authors: Author[];

		if (Object.keys(filters).length > 0) {
			authors = filteredAuthors;
		} else {
			authors = context.dbAuthors;
		}

		authors.sort((a, b) => {
			// compare author ids
			const authorIdA = parseInt(a.id.split("a:")[1]);
			const authorIdB = parseInt(b.id.split("a:")[1]);

			// ascending by default
			if (args.sortBy === AuthorSortType.Descending) {
				return authorIdA < authorIdB ? 1 : authorIdA > authorIdB ? -1 : 0;
			}
			return authorIdA > authorIdB ? 1 : authorIdA < authorIdB ? -1 : 0;
		});

		return authors;
	},
};
