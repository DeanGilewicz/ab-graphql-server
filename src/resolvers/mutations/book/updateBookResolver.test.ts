import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("updateBookResolver", () => {
	it("throws error when id is not provided", async () => {
		// Given a mutation without an id
		const query = `mutation updateBook {
			updateBook(input: {}) {
				id
			}
		}`;

		// When we attempt to update the book
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

	it("throws error when book is not found", async () => {
		// Given a mutation with an id that does not exist
		const query = `mutation updateBook {
			updateBook(input: { id: "b:1" }) {
				id
			}
		}`;

		// When we attempt to update the book
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

	it("throws error when author is not found", async () => {
		// Given a book
		const books = [factory.newBook({})];
		// and a mutation with an authorId that does not exist
		const query = `mutation updateBook {
			updateBook(input: { id: "b:1", authorId: "a:1" }) {
				id
			}
		}`;

		// When we attempt to update the book
		const { gql } = await graphqlTestCall({ query, books });

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

	it("updates a book", async () => {
		// Given a book
		const books = [factory.newBook({})];
		// and a mutation with book input
		const query = `mutation updateBook {
			updateBook(input: { id: "b:1", title: "New Book" }) {
        id
        title
      }
		}`;

		// When we attempt to update a book
		const { gql } = await graphqlTestCall({ query, books });

		// Then the book is updated
		expect(gql).toEqual({
			data: {
				updateBook: {
					id: "b:1",
					title: "New Book",
				},
			},
		});
	});

	it("updates book and assigns author", async () => {
		// Given two authors - 1 with and 1 without association to this book
		const book = { id: "b:1", title: "Book" };
		const authors = [
			factory.newAuthor({ books: [book] }),
			factory.newAuthor({}),
		];
		const books = [factory.newBook(book)];
		// and a mutation with book input
		const query = `mutation updateBook {
			updateBook(input: { id: "b:1", title: "Book", authorId: "a:2" }) {
        id
        title
        author {
          id
          firstName
          lastName
        }
      }
		}`;

		// When we attempt to update the book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the book is updated with correct author assigned
		expect(gql).toEqual({
			data: {
				updateBook: {
					id: "b:1",
					title: "Book",
					author: { id: "a:2", firstName: "first name", lastName: "last name" },
				},
			},
		});
		// and the authors are also updated to correctly associate only one author to this book
		expect(db.authors[0].books).toEqual([]);
		expect(db.authors[1].books).toEqual([db.books[0]]);
	});

	it("updates book and assigns author when author has existing books", async () => {
		// Given two authors - 1 with and 1 without association to this book
		const book1 = { id: "b:1" };
		const book2 = { id: "b:2" };
		const book3 = { id: "b:3" };
		const authors = [
			factory.newAuthor({ books: [book1, book2] }),
			factory.newAuthor({ books: [book3] }),
		];
		const books = [
			factory.newBook(book1),
			factory.newBook(book2),
			factory.newBook(book3),
		];
		// and a mutation with book input
		const query = `mutation updateBook {
			updateBook(input: { id: "b:1", title: "Book", authorId: "a:2" }) {
        id
        title
        author {
          id
          firstName
          lastName
        }
      }
		}`;

		// When we attempt to update the book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the book is updated with correct author assigned
		expect(gql).toEqual({
			data: {
				updateBook: {
					id: "b:1",
					title: "Book",
					author: { id: "a:2", firstName: "first name", lastName: "last name" },
				},
			},
		});
		// and the authors are also updated to correctly associate only one author to this book
		expect(db.authors[0].books).toEqual([book2]);
		expect(db.authors[1].books).toEqual([book3, db.books[0]]);
	});
});
