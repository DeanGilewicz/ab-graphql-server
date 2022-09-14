import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("removeBookAuthor", () => {
	it("throws error when id is not provided", async () => {
		// Given a mutation without an id
		const query = `mutation removeBookAuthor {
			removeBookAuthor(input: {}) {
				id
			}
		}`;

		// When we attempt to update the book
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "BookAuthorInput.id" of required type "ID!" was not provided.],
  ],
}
`);
	});

	it("throws error when book is not found", async () => {
		// Given a mutation with an id that does not exist
		const query = `mutation removeBookAuthor {
			removeBookAuthor(input: { id: "b:1" }) {
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

	it("returns book when it does not have an author", async () => {
		// Given a book without an author
		const book = { id: "b:1" };
		const authors = [factory.newAuthor({})];
		const books = [factory.newBook(book)];
		// and a mutation with id
		const query = `mutation removeBookAuthor {
			removeBookAuthor(input: { id: "b:1" }) {
        id
        author {
					id
				}
      }
		}`;

		// When we attempt to remove author from book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the book is returned
		expect(gql).toEqual({
			data: {
				removeBookAuthor: {
					id: "b:1",
					author: null,
				},
			},
		});
		expect(db.books[0].author).toBeUndefined();
		// and the associated author's books are updated to remove book
		expect(db.authors[0].books).toBeUndefined();
	});

	it("removes author from book", async () => {
		// Given books with an author and author with existing books
		const book1 = { id: "b:1", author: { id: "a:1" } };
		const book2 = { id: "b:2", author: { id: "a:2" } };
		const authors = [factory.newAuthor({ books: [book1, book2] })];
		const books = [factory.newBook(book1), factory.newBook(book2)];
		// and a mutation with id
		const query = `mutation removeBookAuthor {
			removeBookAuthor(input: { id: "b:1" }) {
        id
        author {
					id
				}
      }
		}`;

		// When we attempt to remove author from book
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the author is removed from the book
		expect(gql).toEqual({
			data: {
				removeBookAuthor: {
					id: "b:1",
					author: null,
				},
			},
		});
		expect(db.books[0].author).toBeUndefined();
		expect(db.books[1].author).toEqual({ id: "a:2" });
		// and the associated author's books are updated to remove book
		expect(db.authors[0].books).toEqual([book2]);
	});
});
