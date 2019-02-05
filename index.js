const { ApolloServer } = require('apollo-server');
const { GraphQLDateTime } = require('@targos/graphql-iso-date');
const { importSchema } = require('graphql-import');
const path = require('path');
const TodosModel = require('./todo');
const Todos = new TodosModel();

const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));

const resolvers = {
	DateTime: GraphQLDateTime,
	Query: {
		todo: async (root, args, context) => await Todos.getOne(args.id),
		allTodos: async (root, args, context) => await Todos.findAll()
	},
	Mutation: {
		createTodo: async (root, args, context) => {
			const { name, isComplete } = args.input;
			return await Todos.create({
				name,
				isComplete
			});
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	resolverValidationOptions: {
		requireResolversForResolveType: false
	}
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
