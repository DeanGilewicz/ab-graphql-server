import { AuthorSortType } from "src/enums";
import { factory } from "src/setupTests";
import { graphqlTestCall } from "src/testUtils/graphql";

describe("authorsResolver", () => {
	it("throws error when filter is not provided", async () => {
		// Given a query with no filter
		const query = `query authors {
			authors {
				id
			}
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query });

		// Then an error is thrown
		expect(gql).toMatchInlineSnapshot(`
Object {
  "errors": Array [
    [GraphQLError: Field "authors" argument "filter" of type "AuthorFilter!" is required, but it was not provided.],
  ],
}
`);
	});

	it("returns all authors", async () => {
		const books = [
			factory.newBook({ title: "The Shining" }),
			factory.newBook({ title: "Harry Potter and the Sorcerer's Stone" }),
			factory.newBook({ title: "Alex Cross" }),
		];
		const authors = [
			factory.newAuthor({
				firstName: "Stephen",
				lastName: "King",
				books: [books[0]],
			}),
			factory.newAuthor({
				firstName: "J.K.",
				lastName: "Rowling",
				books: [books[1]],
			}),
			factory.newAuthor({
				firstName: "James",
				lastName: "Patterson",
				books: [books[2]],
			}),
		];

		// Given a query with an empty filter
		const query = `query authors {
			authors(filter: {}) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
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
					{
						id: "a:2",
						firstName: "J.K.",
						lastName: "Rowling",
						books: [
							{
								id: "b:2",
								title: "Harry Potter and the Sorcerer's Stone",
							},
						],
					},
					{
						id: "a:3",
						firstName: "James",
						lastName: "Patterson",
						books: [
							{
								id: "b:3",
								title: "Alex Cross",
							},
						],
					},
				],
			},
		});
	});

	it("returns filtered authors by id", async () => {
		const books = [
			factory.newBook({ title: "Harry Potter and the Sorcerer's Stone" }),
		];
		const authors = [
			factory.newAuthor({
				firstName: "J.K.",
				lastName: "Rowling",
				books: [books[0]],
			}),
			factory.newAuthor({ firstName: "another", lastName: "cool" }),
		];

		// Given a query with an id filter
		const query = `query authors {
			authors(filter: { id: ["a:1"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the correct authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
						id: "a:1",
						firstName: "J.K.",
						lastName: "Rowling",
						books: [
							{
								id: "b:1",
								title: "Harry Potter and the Sorcerer's Stone",
							},
						],
					},
				],
			},
		});
	});

	it("returns filtered authors by firstName", async () => {
		const books = [factory.newBook({ title: "Alex Cross" })];
		const authors = [
			factory.newAuthor({
				firstName: "James",
				lastName: "Patterson",
				books: [books[0]],
			}),
		];

		// Given a query with a firstName filter
		const query = `query authors {
			authors(filter: { firstName: ["James"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the correct authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
						id: "a:1",
						firstName: "James",
						lastName: "Patterson",
						books: [
							{
								id: "b:1",
								title: "Alex Cross",
							},
						],
					},
				],
			},
		});
	});

	it("returns filtered authors by lastName", async () => {
		const books = [factory.newBook({ title: "The Shining" })];
		const authors = [
			factory.newAuthor({
				firstName: "Stephen",
				lastName: "King",
				books: [books[0]],
			}),
		];

		// Given a query with a lastName filter
		const query = `query authors {
			authors(filter: { lastName: ["King"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the correct authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
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
				],
			},
		});
	});

	it("returns filtered authors by bookIds", async () => {
		const book1 = { id: "b:1", title: "Harry Potter and the Sorcerer's Stone" };
		const book2 = { id: "b:2", title: "Alex Cross" };
		const authors = [
			factory.newAuthor({
				firstName: "J.K.",
				lastName: "Rowling",
				books: [book1],
			}),
			factory.newAuthor({
				firstName: "James",
				lastName: "Patterson",
				books: [book2],
			}),
		];
		const books = [
			factory.newBook({
				...book1,
				author: authors[0],
			}),
			factory.newBook({ ...book2, author: authors[1] }),
		];

		// Given a query with bookIds filter
		const query = `query authors {
			authors(filter: { bookIds: ["b:1", "b:2"] }) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the correct authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
						id: "a:1",
						firstName: "J.K.",
						lastName: "Rowling",
						books: [
							{
								id: "b:1",
								title: "Harry Potter and the Sorcerer's Stone",
							},
						],
					},
					{
						id: "a:2",
						firstName: "James",
						lastName: "Patterson",
						books: [
							{
								id: "b:2",
								title: "Alex Cross",
							},
						],
					},
				],
			},
		});
	});

	it("returns filtered authors by multiple filters", async () => {
		const book1 = { id: "b:1", title: "The Shining" };
		const book2 = { id: "b:2", title: "Harry Potter and the Sorcerer's Stone" };
		const book3 = { id: "b:3", title: "Alex Cross" };
		const authors = [
			factory.newAuthor({
				firstName: "Stephen",
				lastName: "King",
				books: [book1],
			}),
			factory.newAuthor({
				firstName: "J.K.",
				lastName: "Rowling",
				books: [book2],
			}),
			factory.newAuthor({
				firstName: "James",
				lastName: "Patterson",
				books: [book3],
			}),
		];
		const books = [
			factory.newBook({ ...book1, author: authors[0] }),
			factory.newBook({ ...book2, author: authors[1] }),
			factory.newBook({ ...book3, author: authors[2] }),
		];

		// Given a query with multiple filters
		const query = `query authors {
			authors(filter:{id:[], firstName:["James"], lastName:["King"], bookIds:["b:2"]}) {
        id
        firstName
        lastName
        books {
          id
          title
        }
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors, books });

		// Then the correct authors are returned
		expect(gql).toEqual({
			data: {
				authors: [
					{
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
					{
						id: "a:2",
						firstName: "J.K.",
						lastName: "Rowling",
						books: [
							{
								id: "b:2",
								title: "Harry Potter and the Sorcerer's Stone",
							},
						],
					},
					{
						id: "a:3",
						firstName: "James",
						lastName: "Patterson",
						books: [
							{
								id: "b:3",
								title: "Alex Cross",
							},
						],
					},
				],
			},
		});
	});

	it("returns all authors in ascending order by default", async () => {
		const authors = [
			factory.newAuthor({ id: "a:2" }),
			factory.newAuthor({ id: "a:3" }),
			factory.newAuthor({ id: "a:1" }),
		];

		// Given a query with an empty filter
		const query = `query authors {
			authors(filter: {}) {
        id
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors });

		// Then the authors are returned in the correct order
		expect(gql).toEqual({
			data: {
				authors: [{ id: "a:1" }, { id: "a:2" }, { id: "a:3" }],
			},
		});
	});

	it("returns all authors in descending order when sortBy provided", async () => {
		const authors = [
			factory.newAuthor({ id: "a:2" }),
			factory.newAuthor({ id: "a:1" }),
			factory.newAuthor({ id: "a:3" }),
		];

		// Given a query with an empty filter and defined sortBy
		const query = `query authors {
			authors(filter: {}, sortBy: ${AuthorSortType.Descending}) {
        id
      }
		}`;

		// When we query for authors
		const { gql } = await graphqlTestCall({ query, authors });

		// Then the authors are returned in the correct order
		// Then the authors are returned in the correct order
		expect(gql).toEqual({
			data: {
				authors: [{ id: "a:3" }, { id: "a:2" }, { id: "a:1" }],
			},
		});
	});
});
