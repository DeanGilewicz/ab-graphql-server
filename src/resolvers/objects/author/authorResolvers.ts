import { AuthorResolvers } from "src/types";

// for custom logic for any field on the type, in this case Author
// by default query will attempt to provide the typed field responses but can use this if we need some custom logic

// parent = the author object
export const authorResolvers: AuthorResolvers = {
	// id: (parent, args, context, info) => {
	// 	// parent = the author object
	// 	console.log("Object - authorResolvers - id - parent", parent);
	// 	return parent.id;
	// },
};
