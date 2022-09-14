import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("bookResolver", () => {
	it("throws error when book is not found", async () => {
		// Given a query with an id that does not exist
		const query = `query book {
			book(id: "b:1") {
				id
			}
		}`;

		// When we query for a book
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: No book found],
  ],
}
`);
	});

	it("returns a single book", async () => {
		const authors = [
			factory.newAuthor({ firstName: "Stephen", lastName: "King" }),
		];
		const books = [
			factory.newBook({ title: "The Shining", author: authors[0] }),
		];

		// Given a query with an existing id
		const query = `query book {
			book(id: "b:1") {
				id
				title
				author {
					id
					firstName
					lastName
				}
			}
		}`;

		// When we query for a book
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the book is returned
		expect(gql).toEqual({
			data: {
				book: {
					id: "b:1",
					title: "The Shining",
					author: {
						id: "a:1",
						firstName: "Stephen",
						lastName: "King",
					},
				},
			},
		});
	});
});
