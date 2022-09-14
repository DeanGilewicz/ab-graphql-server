import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("addAuthorResolver", () => {
	it("throws error when id is provided", async () => {
		// Given a mutation with an id
		const query = `mutation addAuthor {
			addAuthor(input: { id: "a:1" }) {
				id
			}
		}`;

		// When we attempt to create an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: id must not be provided],
  ],
}
`);
	});

	it("throws error when firstName is not provided", async () => {
		// Given a mutation without a firstName
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "", lastName: "name" }) {
				id
			}
		}`;

		// When we attempt to create an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: first name and last name are required],
  ],
}
`);
	});

	it("throws error when lastName is not provided", async () => {
		// Given a mutation without a firstName
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "name", lastName: "" }) {
				id
			}
		}`;

		// When we attempt to create an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: first name and last name are required],
  ],
}
`);
	});

	it("throws error when provided bookId is not found", async () => {
		// Given a mutation with a bookId that does not exist
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "demo", lastName: "user", bookIds: ["b:1"] }) {
				id
			}
		}`;

		// When we attempt to create an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: book not found],
  ],
}
`);
	});

	it("throws error when provided bookId already has an author", async () => {
		// Given a book that has an author assigned
		const authors = [factory.newAuthor({})];
		const books = [factory.newBook({ author: authors[0] })];
		// and a mutation with a bookId that is already assigned an author
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "demo", lastName: "user", bookIds: ["b:1"] }) {
				id
			}
		}`;

		// When we attempt to create an author
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

	it("creates an author", async () => {
		// Given a mutation with author input
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "demo", lastName: "user" }) {
        id
        firstName
        lastName
      }
		}`;

		// When we attempt to create an author
		const { gql } = await graphqlTestCall({ query });

		// Then the author is created
		expect(gql).toEqual({
			data: {
				addAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
				},
			},
		});
	});

	it("creates an author and assigns new book", async () => {
		// Given a book with no defined author
		const books = [factory.newBook({ title: "New Book" })];
		// and a mutation with author input
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "demo", lastName: "user", bookIds: ["b:1"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we attempt to create an author
		const { gql, db } = await graphqlTestCall({ query, books });

		// Then an author is created and assigned to book
		expect(gql).toEqual({
			data: {
				addAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
					books: [{ id: "b:1", title: "New Book" }],
				},
			},
		});
		// and the book's author is updated
		expect(db.books[0].author).toEqual(db.authors[0]);
	});

	it("creates an author and assigns new books", async () => {
		// Given three books with no defined author
		const book1 = factory.newBook({ title: "New Book 1" });
		const book2 = factory.newBook({ title: "New Book 2" });
		const book3 = factory.newBook({ title: "New Book 3" });
		// and a mutation with author input
		const query = `mutation addAuthor {
			addAuthor(input: { firstName: "demo", lastName: "user", bookIds: ["b:1", "b:3"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we attempt to create an author
		const { gql, db } = await graphqlTestCall({
			query,
			books: [book1, book2, book3],
		});

		// Then the author is created and assigned both books
		expect(gql).toEqual({
			data: {
				addAuthor: {
					id: "a:1",
					firstName: "demo",
					lastName: "user",
					books: [
						{ id: "b:1", title: "New Book 1" },
						{ id: "b:3", title: "New Book 3" },
					],
				},
			},
		});
		// and the book's author is updated
		expect(db.books[0].author).toEqual(db.authors[0]);
		expect(db.books[2].author).toEqual(db.authors[0]);
		// but not for this one
		expect(db.books[1].author).toEqual(undefined);
	});
});
