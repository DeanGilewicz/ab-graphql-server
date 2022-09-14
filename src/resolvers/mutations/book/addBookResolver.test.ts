import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("addBookResolver", () => {
	it("throws error when id is provided", async () => {
		// Given a mutation with an id
		const query = `mutation addBook {
			addBook(input: { id: "a:1" }) {
				id
			}
		}`;

		// When we attempt to create a book
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

	it("throws error when provided author is not found", async () => {
		// Given a mutation with an authorId that does not exist
		const query = `mutation addBook {
			addBook(input: { authorId: "a:1" }) {
				id
			}
		}`;

		// When we attempt to create a book
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

	it("creates a book", async () => {
		// Given a mutation with book input
		const query = `mutation addBook {
			addBook(input: { title: "New Book" }) {
        id
        title
      }
		}`;

		// When we attempt to create a book
		const { gql } = await graphqlTestCall({ query });

		// Then the book is created
		expect(gql).toEqual({
			data: {
				addBook: {
					id: "b:1",
					title: "New Book",
				},
			},
		});
	});

	it("creates a book and assigns an author", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation with book input
		const query = `mutation addBook {
			addBook(input: { title: "New Book", authorId: "a:1" }) {
        id
        title
        author {
          id
          firstName
          lastName
        }
      }
		}`;

		// When we attempt to create a book
		const { gql, db } = await graphqlTestCall({ query, authors });

		// Then the book is created with author assigned
		expect(gql).toEqual({
			data: {
				addBook: {
					id: "b:1",
					title: "New Book",
					author: { id: "a:1", firstName: "first name", lastName: "last name" },
				},
			},
		});
		// and author is also updated
		expect(db.authors[0].books).toEqual([db.books[0]]);
	});

	it("creates a book and assigns an author that has existing books", async () => {
		// Given an author with an existing book
		const book = factory.newBook({});
		const books = [book];
		const authors = [factory.newAuthor({ books: [book] })];
		// and a mutation with book input
		const query = `mutation addBook {
			addBook(input: { title: "New Book", authorId: "a:1" }) {
        id
        title
        author {
          id
          firstName
          lastName
        }
      }
		}`;

		// When we attempt to create a book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the book is created and author assigned
		expect(gql).toEqual({
			data: {
				addBook: {
					id: "b:2",
					title: "New Book",
					author: {
						id: "a:1",
						firstName: "first name",
						lastName: "last name",
					},
				},
			},
		});
		// and the author is also updated
		expect(db.authors[0].books).toEqual([db.books[0], db.books[1]]);
	});
});
