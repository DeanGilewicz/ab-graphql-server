import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("authorResolver", () => {
	it("throws error when author is not found", async () => {
		// Given a query with an id that does not exist
		const query = `query author {
			author(id: "a:1") {
				id
			}
		}`;

		// When we query for an author
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "data": null,
  "errors": Array [
    [GraphQLError: No author found],
  ],
}
`);
	});

	it("returns a single author", async () => {
		const books = [factory.newBook({ title: "The Shining" })];
		const authors = [
			factory.newAuthor({
				firstName: "Stephen",
				lastName: "King",
				books: [books[0]],
			}),
		];

		// Given a query with an existing id
		const query = `query author {
			author(id: "a:1") {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for an author
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the author is returned
		expect(gql).toEqual({
			data: {
				author: {
					id: "a:1",
					firstName: "Stephen",
					lastName: "King",
					books: [
						{
							id: "b:1",
							title: "The Shining",
						},
					],
				},
			},
		});
	});
});
