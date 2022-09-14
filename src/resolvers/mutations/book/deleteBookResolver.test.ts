import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("deleteBookResolver", () => {
	it("throws error when id is not provided", async () => {
		// Given a mutation without an id
		const query = `mutation deleteBook {
			deleteBook(input: {}) {
				id
			}
		}`;

		// When we attempt to delete a book
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "BookDeleteInput.id" of required type "ID!" was not provided.],
  ],
}
`);
	});

	it("throws error when book is not found", async () => {
		// Given a mutation with an id that does not exist
		const query = `mutation deleteBook {
      deleteBook(input: { id: "b:1" }) {
        id
      }
    }`;

		// When we attempt to delete a book
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

	it("deletes a book", async () => {
		// Given a book
		const books = [factory.newBook({})];
		// and a mutation with an id for this book
		const query = `mutation deleteBook {
      deleteBook(input: { id: "b:1" }) {
        id
      }
    }`;

		// When we attempt to delete the book
		const { gql, db } = await graphqlTestCall({ query, books });

		// Then the book is deleted
		expect(gql).toEqual({ data: { deleteBook: { id: "b:1" } } });
		expect(db.books).toEqual([]);
	});

	it("deletes book and removes it from any associated author", async () => {
		// Given books
		const author = { id: "a:1" };
		const book1 = { id: "b:1", title: "Existing Book", author };
		const book2 = { id: "b:2", title: "Existing Book", author };
		const book3 = { id: "b:3", title: "Existing Book", author };
		const authors = [factory.newAuthor({ books: [book1, book2, book3] })];
		const books = [
			factory.newBook(book1),
			factory.newBook(book2),
			factory.newBook(book3),
		];
		// and a mutation with id to delete
		const query = `mutation deleteBook {
      deleteBook(input: { id: "b:2" }) {
        id
      }
		}`;

		// When we attempt to delete a book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the book is deleted
		expect(gql).toEqual({ data: { deleteBook: { id: "b:2" } } });
		expect(db.books).toEqual([book1, book3]);
		// and the book is removed from associated authors
		expect(db.authors[0].books).toEqual([book1, book3]);
	});
});
