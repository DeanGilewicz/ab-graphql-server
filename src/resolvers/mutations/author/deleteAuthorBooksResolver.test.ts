import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("deleteAuthorBookResolver", () => {
	it("throws error when both id and bookIds are not provided", async () => {
		// Given a mutation without an author id
		const query = `mutation deleteAuthorBooks {
			deleteAuthorBooks (input: {}) {
				id
			}
		}`;

		// When we attempt to remove an author's book
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "AuthorBookInput.id" of required type "ID!" was not provided.],
    [GraphQLError: Field "AuthorBookInput.bookIds" of required type "[ID!]!" was not provided.],
  ],
}
`);
	});

	it("throws error when id is not provided", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation without an id
		const query = `mutation deleteAuthorBooks {
			deleteAuthorBooks (input: { bookIds: ["b:1"] }) {
				id
			}
		}`;

		// When we attempt to remove an author's book
		const { gql } = await graphqlTestCall({ query, authors });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "AuthorBookInput.id" of required type "ID!" was not provided.],
  ],
}
`);
	});

	it("throws error when bookIds are not provided", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation without any bookIds
		const query = `mutation deleteAuthorBooks {
			deleteAuthorBooks (input: { id: "a:1" }) {
				id
			}
		}`;

		// When we attempt to remove an author's book
		const { gql } = await graphqlTestCall({ query, authors });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "AuthorBookInput.bookIds" of required type "[ID!]!" was not provided.],
  ],
}
`);
	});

	it("throws error when provided bookIds are empty", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation without any bookIds
		const query = `mutation deleteAuthorBooks {
			deleteAuthorBooks (input: { id: "a:1", bookIds: [] }) {
				id
			}
		}`;

		// When we attempt to remove an author's book
		const { gql } = await graphqlTestCall({ query, authors });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: at least one bookId must be provided],
  ],
}
`);
	});

	it("throws error when author is not found", async () => {
		// Given a mutation with an author id that does not exist
		const query = `mutation deleteAuthorBooks {
      deleteAuthorBooks(input: { id: "a:1", bookIds: ["b:1"] }) {
        id
      }
    }`;

		// When we attempt to remove an author's book
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: author not found],
  ],
}
`);
	});

	it("returns author when author does not have books", async () => {
		// Given an author with no books
		const book = factory.newBook({ author: { id: "a:1" } });
		const authors = [factory.newAuthor({})];
		const books = [book];
		// and a mutation with an id for an author and bookId
		const query = `mutation deleteAuthorBooks {
      deleteAuthorBooks(input: { id: "a:1", bookIds: ["b:1"] }) {
        id
				books {
					id
				}
      }
		}`;

		// When we attempt to remove an author's book
		const { gql, db } = await graphqlTestCall({ query, authors, books });
		// Then the author is returned
		expect(gql).toEqual({
			data: {
				deleteAuthorBooks: { id: "a:1", books: null },
			},
		});
	});

	it("deletes an author's books and removes author from any associated book", async () => {
		// Given an author with books
		const book1 = factory.newBook({ author: { id: "a:1" } });
		const book2 = factory.newBook({ author: { id: "a:1" } });
		const book3 = factory.newBook({ author: { id: "a:1" } });
		const authors = [factory.newAuthor({ books: [book1, book2, book3] })];
		const books = [book1, book2, book3];
		// and a mutation with an id for an author and bookId
		const query = `mutation deleteAuthorBooks {
      deleteAuthorBooks(input: { id: "a:1", bookIds: ["b:2"] }) {
        id
				books {
					id
				}
      }
		}`;

		// When we attempt to remove an author's book
		const { gql, db } = await graphqlTestCall({ query, authors, books });
		// Then the author's book is removed
		expect(gql).toEqual({
			data: {
				deleteAuthorBooks: { id: "a:1", books: [{ id: "b:1" }, { id: "b:3" }] },
			},
		});
		const authorIndex = db.authors.findIndex((a) => a.id === "a:1");
		const bookIds = db.authors[authorIndex].books?.map((b) => b.id);
		expect(bookIds).toEqual(["b:1", "b:3"]);
		// and associated books' author (b:2) is unset
		expect(db.books[0].author).toBeDefined();
		expect(db.books[1].author).toBeUndefined();
		expect(db.books[2].author).toBeDefined();
	});
});
