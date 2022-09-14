import { AuthorSortType } from './enums/index';
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Author = {
  __typename?: 'Author';
  books?: Maybe<Array<Book>>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type AuthorBookInput = {
  bookIds: Array<Scalars['ID']>;
  id: Scalars['ID'];
};

export type AuthorDeleteInput = {
  id: Scalars['ID'];
};

export type AuthorDeleteResult = {
  __typename?: 'AuthorDeleteResult';
  id: Scalars['ID'];
};

export type AuthorFilter = {
  bookIds?: InputMaybe<Array<Scalars['ID']>>;
  firstName?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Array<Scalars['ID']>>;
  lastName?: InputMaybe<Array<Scalars['String']>>;
};

export type AuthorInput = {
  bookIds?: InputMaybe<Array<Scalars['ID']>>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  lastName?: InputMaybe<Scalars['String']>;
};

export { AuthorSortType };

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Author>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type BookAuthorInput = {
  id: Scalars['ID'];
};

export type BookDeleteInput = {
  id: Scalars['ID'];
};

export type BookDeleteResult = {
  __typename?: 'BookDeleteResult';
  id: Scalars['ID'];
};

export type BookInput = {
  authorId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAuthor: Author;
  addBook: Book;
  deleteAuthor: AuthorDeleteResult;
  deleteAuthorBooks: Author;
  deleteBook: BookDeleteResult;
  removeBookAuthor: Book;
  updateAuthor: Author;
  updateBook: Book;
};


export type MutationAddAuthorArgs = {
  input: AuthorInput;
};


export type MutationAddBookArgs = {
  input: BookInput;
};


export type MutationDeleteAuthorArgs = {
  input: AuthorDeleteInput;
};


export type MutationDeleteAuthorBooksArgs = {
  input: AuthorBookInput;
};


export type MutationDeleteBookArgs = {
  input: BookDeleteInput;
};


export type MutationRemoveBookAuthorArgs = {
  input: BookAuthorInput;
};


export type MutationUpdateAuthorArgs = {
  input: AuthorInput;
};


export type MutationUpdateBookArgs = {
  input: BookInput;
};

export type Query = {
  __typename?: 'Query';
  author: Author;
  authors: Array<Author>;
  book: Book;
  books: Array<Book>;
  test?: Maybe<Scalars['String']>;
};


export type QueryAuthorArgs = {
  id: Scalars['ID'];
};


export type QueryAuthorsArgs = {
  filter: AuthorFilter;
  sortBy?: InputMaybe<AuthorSortType>;
};


export type QueryBookArgs = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Author: ResolverTypeWrapper<Author>;
  AuthorBookInput: AuthorBookInput;
  AuthorDeleteInput: AuthorDeleteInput;
  AuthorDeleteResult: ResolverTypeWrapper<AuthorDeleteResult>;
  AuthorFilter: AuthorFilter;
  AuthorInput: AuthorInput;
  AuthorSortType: AuthorSortType;
  Book: ResolverTypeWrapper<Book>;
  BookAuthorInput: BookAuthorInput;
  BookDeleteInput: BookDeleteInput;
  BookDeleteResult: ResolverTypeWrapper<BookDeleteResult>;
  BookInput: BookInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Author: Author;
  AuthorBookInput: AuthorBookInput;
  AuthorDeleteInput: AuthorDeleteInput;
  AuthorDeleteResult: AuthorDeleteResult;
  AuthorFilter: AuthorFilter;
  AuthorInput: AuthorInput;
  Book: Book;
  BookAuthorInput: BookAuthorInput;
  BookDeleteInput: BookDeleteInput;
  BookDeleteResult: BookDeleteResult;
  BookInput: BookInput;
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  books?: Resolver<Maybe<Array<ResolversTypes['Book']>>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorDeleteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthorDeleteResult'] = ResolversParentTypes['AuthorDeleteResult']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorSortTypeResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, ResolversTypes['AuthorSortType']>;

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  author?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookDeleteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookDeleteResult'] = ResolversParentTypes['BookDeleteResult']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addAuthor?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<MutationAddAuthorArgs, 'input'>>;
  addBook?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationAddBookArgs, 'input'>>;
  deleteAuthor?: Resolver<ResolversTypes['AuthorDeleteResult'], ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'input'>>;
  deleteAuthorBooks?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<MutationDeleteAuthorBooksArgs, 'input'>>;
  deleteBook?: Resolver<ResolversTypes['BookDeleteResult'], ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'input'>>;
  removeBookAuthor?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationRemoveBookAuthorArgs, 'input'>>;
  updateAuthor?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<MutationUpdateAuthorArgs, 'input'>>;
  updateBook?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationUpdateBookArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<QueryAuthorArgs, 'id'>>;
  authors?: Resolver<Array<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryAuthorsArgs, 'filter'>>;
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<QueryBookArgs, 'id'>>;
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  test?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>;
  AuthorDeleteResult?: AuthorDeleteResultResolvers<ContextType>;
  AuthorSortType?: AuthorSortTypeResolvers;
  Book?: BookResolvers<ContextType>;
  BookDeleteResult?: BookDeleteResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

