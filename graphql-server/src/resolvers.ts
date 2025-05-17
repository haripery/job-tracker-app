import axios from 'axios';

export const resolvers = {
  Query: {
    companies: async (_: any, __: any, { token }: { token: string }) => {
      const res = await axios.get('http://localhost:3001/companies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  },
};
