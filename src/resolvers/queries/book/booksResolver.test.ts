import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("booksResolver", () => {
	it("returns all books", async () => {
		const authors = [
			factory.newAuthor({ firstName: "Stephen", lastName: "King" }),
			factory.newAuthor({ firstName: "J.K.", lastName: "Rowling" }),
			factory.newAuthor({ firstName: "James", lastName: "Patterson" }),
		];
		const books = [
			factory.newBook({ title: "The Shining", author: authors[0] }),
			factory.newBook({
				title: "Harry Potter and the Sorcerer's Stone",
				author: authors[1],
			}),
			factory.newBook({ title: "Alex Cross", author: authors[2] }),
		];

		// Given a book query
		const query = `query books {
			books {
				id
				title
				author {
					id
					firstName
					lastName
				}
			}
		}`;

		// When we query for books
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then books are returned
		expect(gql).toEqual({
			data: {
				books: [
					{
						id: "b:1",
						title: "The Shining",
						author: {
							id: "a:1",
							firstName: "Stephen",
							lastName: "King",
						},
					},
					{
						id: "b:2",
						title: "Harry Potter and the Sorcerer's Stone",
						author: {
							id: "a:2",
							firstName: "J.K.",
							lastName: "Rowling",
						},
					},
					{
						id: "b:3",
						title: "Alex Cross",
						author: {
							id: "a:3",
							firstName: "James",
							lastName: "Patterson",
						},
					},
				],
			},
		});
	});
});
