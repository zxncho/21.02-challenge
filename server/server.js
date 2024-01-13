const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const {bookSchema,userSchema} = require('./models')
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const typeDefs = gql`
  type Book {
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type User {
    username: String
    email: String
    password: String
  }

  type Query {
    getBook: Book
    getUser: User
  } 

  type Mutation {
    addBook(authors: String, description: String, bookId: String, image: String, link: String, title: String): Book
    addUser(username: String, email: String, password: String): User
  }

`;

const resolvers = {
  Query: {
    getBook: () => bookSchema,
    getUser: () => userSchema,
  },
};

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the Apollo Server before applying middleware
  await server.start();

  // Apply middleware after the server has started
  server.applyMiddleware({ app, path: '/graphql' });
};

startApolloServer();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
