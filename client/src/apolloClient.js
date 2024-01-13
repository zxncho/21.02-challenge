// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'your GraphQL server endpoint',
  cache: new InMemoryCache(),
});

export default client;
