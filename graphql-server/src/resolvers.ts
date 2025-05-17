import axios from 'axios';
import { Company } from '../../smithy/typescript-client/src/models';

export const resolvers = {
  Query: {
    companies: async (
      _: unknown,
      __: unknown,
      { token }: { token: string }
    ): Promise<Company[]> => {
      const res = await axios.get<Company[]>(
        'http://localhost:3001/companies',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  },
};
