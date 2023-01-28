import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("updateAuthorResolver", () => {
	it("throws error when id is not provided", async () => {
		// Given a mutation without an id
		const query = `mutation updateAuthor {
			updateAuthor(input: {}) {
				id
			}
		}`;

		// When we attempt to update an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: id must be provided],
  ],
}
`);
	});

	it("throws error when author is not found", async () => {
		// Given a mutation with an id that does not exist
		const query = `mutation updateAuthor {
				updateAuthor(input: { id: "a:1" }) {
					id
				}
			}`;

		// When we attempt to update an author
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

	it("throws error when provided bookId already has an author", async () => {
		// Given a book that has an author assigned
		const authors = [factory.newAuthor({})];
		const books = [factory.newBook({ author: authors[0] })];
		// and a mutation with a bookId that is already assigned an author
		const query = `mutation updateAuthor {
			updateAuthor(input: { id: "a:1", bookIds: ["b:1"] }) {
				id
			}
		}`;

		// When we attempt to update an author
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: provided book already has an author],
  ],
}
`);
	});

	it("updates an author", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation with author input
		const query = `mutation updateAuthor {
			updateAuthor(input: { id: "a:1", firstName: "demo", lastName: "user" }) {
				id
				firstName
				lastName
			}
		}`;

		// When we attempt to update an author
		const { gql } = await graphqlTestCall({ query, authors });

		// Then the author is updated
		expect(gql).toEqual({
			data: {
				updateAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
				},
			},
		});
	});

	it("updates an author and assigns new book", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a book with no defined author
		const books = [factory.newBook({ title: "New Book" })];
		// and a mutation with author input
		const query = `mutation updateAuthor {
			updateAuthor(input: { id: "a:1", firstName: "demo", lastName: "user", bookIds: ["b:1"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we attempt to update the author
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the author is updated with the book assigned
		expect(gql).toEqual({
			data: {
				updateAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
					books: [{ id: "b:1", title: "New Book" }],
				},
			},
		});
		// and the book is also updated
		expect(db.books[0].author).toEqual(db.authors[0]);
	});

	it("updates an author and assigns new books to author's current books", async () => {
		// Given a book with a defined author
		const author = { id: "a:1" };
		const book = { id: "b:1", title: "Existing Book", author };
		const authors = [factory.newAuthor({ ...author, books: [book] })];
		// and two books without an author
		const books = [
			factory.newBook(book),
			factory.newBook({ id: "b:3", title: "Last Book" }),
			factory.newBook({ id: "b:2", title: "New Book" }),
		];
		// and a mutation with author input
		const query = `mutation updateAuthor {
			updateAuthor(input: { id: "a:1", firstName: "demo", lastName: "user", bookIds: ["b:3", "b:2"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we attempt to update an author
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the author is updated and assigned the new books
		expect(gql).toEqual({
			data: {
				updateAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
					books: [
						{ id: "b:1", title: "Existing Book" },
						{ id: "b:2", title: "New Book" },
						{ id: "b:3", title: "Last Book" },
					],
				},
			},
		});
		// and the books are also updated
		expect(db.books[0].author?.id).toEqual(db.authors[0].id);
		expect(db.books[1].author?.id).toEqual(db.authors[0].id);
		expect(db.books[2].author?.id).toEqual(db.authors[0].id);
	});

	it("updates an author's name when associated to books", async () => {
		// Given a book with a defined author
		const author = { id: "a:1", firstName: "demo 1", lastName: "user 1" };
		const book = { id: "b:1", title: "Existing Book", author };
		const authors = [factory.newAuthor({ ...author, books: [book] })];
		const books = [factory.newBook(book)];
		// and a mutation with author input
		const query = `mutation updateAuthor {
			updateAuthor(input: { id: "a:1", firstName: "demo 2", lastName: "user 2" } ) {
        id
        firstName
        lastName
        books {
          id
          title
					author {
						id
						firstName
						lastName
					}
        }
      }
		}`;

		// When we attempt to update an author
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the author is updated
		expect(gql).toEqual({
			data: {
				updateAuthor: {
					id: "a:1",
					firstName: "demo 2",
					lastName: "user 2",
					books: [
						{
							id: "b:1",
							title: "Existing Book",
							author: { id: "a:1", firstName: "demo 2", lastName: "user 2" },
						},
					],
				},
			},
		});
		// and book reflects the updated name
		expect(db.books[0].author?.id).toEqual(db.authors[0].id);
		expect(db.books[0].author?.firstName).toEqual("demo 2");
		expect(db.books[0].author?.lastName).toEqual("user 2");
	});
});
