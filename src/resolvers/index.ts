import { Resolvers } from "src/types";
import { mutationResolvers } from "src/resolvers/mutations";
import { objectResolvers } from "src/resolvers/objects";
import { queryResolvers } from "src/resolvers/queries";

export const resolvers: Resolvers = {
	Query: queryResolvers,
	Mutation: mutationResolvers,
	...objectResolvers,
};
