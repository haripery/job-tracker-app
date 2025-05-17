import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Company {
    id: ID!
    name: String!
    role: String!
    status: String!
  }

  type Query {
    companies: [Company!]!
  }
`;
