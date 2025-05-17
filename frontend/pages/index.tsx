import { GetServerSideProps } from 'next';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import { ApolloProvider, gql } from '@apollo/client';
import { createApolloClient } from '../lib/apolloClient';

const COMPANIES_QUERY = gql`
  query Companies {
    companies {
      id
      name
      role
      status
    }
  }
`;

export default function CompaniesPage({ companies, token }: { companies: any[]; token: string }) {
  const { data: session } = useSession();
  const client = createApolloClient(token);

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Applied Companies</h1>
        <button onClick={() => signOut()}>Logout</button>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Job Role</th>
              <th>Application Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.role}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ApolloProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const token = session?.accessToken as string;
  const client = createApolloClient(token);

  const { data } = await client.query({ query: COMPANIES_QUERY });

  return {
    props: {
      companies: data.companies,
      token: token || null,
    },
  };
};
