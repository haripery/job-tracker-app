import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import cors from 'cors';

async function start() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ token: req.headers.authorization?.split(' ')[1] }),
  });
  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;
  app.listen({ port }, () => {
    console.log(`GraphQL ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

start();
