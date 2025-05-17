import { Request, Response } from 'express';
import { Company } from '../models/company';

export async function listCompanies(_req: Request, res: Response) {
  const companies = await Company.findAll();
  res.json(companies);
}

export async function createCompany(req: Request, res: Response) {
  const { name, role, status } = req.body;
  const company = await Company.create({ name, role, status });
  res.status(201).json(company);
}
