import { Author, Book } from "src/types";

// id | firstName | lastName | books

const authors: Author[] = [
	{
		id: "a:1",
		firstName: "Stephen",
		lastName: "King",
	},
	{
		id: "a:2",
		firstName: "J.K.",
		lastName: "Rowling",
	},
	{
		id: "a:3",
		firstName: "James",
		lastName: "Patterson",
	},
];

// id | title | author_id

const books: Book[] = [
	{
		id: "b:1",
		title: "The Shining",
		author: authors[0],
	},
	{
		id: "b:2",
		title: "Harry Potter and the Sorcerer's Stone",
		author: authors[1],
	},
	{
		id: "b:3",
		title: "Alex Cross",
		author: authors[2],
	},
];

// causes a circular reference
authors[0].books = [books[0]];
authors[1].books = [books[1]];
authors[2].books = [books[2]];

export { authors, books };
