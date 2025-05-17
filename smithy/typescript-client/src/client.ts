import axios, { AxiosInstance } from 'axios';
import { Company } from './models';

export class JobTrackerClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({ baseURL: baseUrl });
  }

  async listCompanies(token: string): Promise<Company[]> {
    const res = await this.axios.get('/companies', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}
