import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("deleteAuthorResolver", () => {
	it("throws error when id is not provided", async () => {
		// Given a mutation without an id
		const query = `mutation deleteAuthor {
			deleteAuthor(input: {}) {
				id
			}
		}`;

		// When we attempt to delete an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "AuthorDeleteInput.id" of required type "ID!" was not provided.],
  ],
}
`);
	});

	it("throws error when author is not found", async () => {
		// Given a mutation with an id that does not exist
		const query = `mutation deleteAuthor {
      deleteAuthor(input: { id: "a:1" }) {
        id
      }
    }`;

		// When we attempt to delete an author
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

	it("deletes an author", async () => {
		// Given an author
		const authors = [factory.newAuthor({})];
		// and a mutation with an id for this author
		const query = `mutation deleteAuthor {
      deleteAuthor(input: { id: "a:1" }) {
        id
      }
    }`;

		// When we attempt to delete the author
		const { gql, db } = await graphqlTestCall({ query, authors });

		// Then the author is deleted
		expect(gql).toEqual({ data: { deleteAuthor: { id: "a:1" } } });
		expect(db.authors).toEqual([]);
	});

	it("deletes an author and removes author from any associated book", async () => {
		// Given a author with a book
		const book1 = factory.newBook({ author: { id: "a:1" } });
		const book2 = factory.newBook({ author: { id: "a:1" } });
		const authors = [factory.newAuthor({ books: [book1, book2] })];
		const books = [book1, book2];
		// and a mutation with an id for an author
		const query = `mutation deleteAuthor {
      deleteAuthor(input: { id: "a:1" }) {
        id
      }
		}`;

		// When we attempt to delete an author
		const { gql, db } = await graphqlTestCall({ query, authors, books });

		// Then the author is deleted
		expect(gql).toEqual({ data: { deleteAuthor: { id: "a:1" } } });
		expect(db.authors).toEqual([]);
		// and associated books' author is unset
		expect(db.books[0].author).toBeUndefined();
		expect(db.books[1].author).toBeUndefined();
	});
});
