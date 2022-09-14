import { Author, Book } from "src/types";

interface FactoryI {
	authors: Author[];
	books: Book[];
}

export class Factory {
	authors: Author[];
	authorsCount: number;
	books: Book[];
	booksCount: number;
	ids: string[];

	constructor(props?: FactoryI) {
		this.authors = props?.authors || [];
		this.authorsCount = 0;
		this.books = props?.books || [];
		this.booksCount = 0;
		this.ids = [];
	}

	newAuthor(props: Partial<Author>): Author {
		this.authorsCount = this.authorsCount + 1;
		return {
			id: this.handleId(props.id || `a:${this.authorsCount}`),
			firstName: props.firstName || "first name",
			lastName: props.lastName || "last name",
			books: props.books || undefined,
		};
	}

	newBook(props: Partial<Book>): Book {
		this.booksCount = this.booksCount + 1;
		return {
			id: this.handleId(props.id || `b:${this.booksCount}`),
			title: props.title || "title",
			author: props.author || undefined,
		};
	}

	handleId(id: string): string {
		if (this.ids.includes(id)) {
			throw new Error("factory cannot contain duplicate ids");
		}
		this.ids.push(id);
		return id;
	}
}
