import { Author, QueryResolvers } from "src/types";

export const author: Pick<QueryResolvers, "author"> = {
	author: (parent, args, context) => {
		console.log("Query - author - parent", parent);
		const author = context.dbAuthors.find((a: Author) => a.id === args.id);
		if (!author) throw new Error("No author found");
		return author;
	},
};
