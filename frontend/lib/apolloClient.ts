import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export function createApolloClient(token?: string) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
      fetch,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
    cache: new InMemoryCache(),
  });
}
