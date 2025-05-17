import { Router } from 'express';
import { listCompanies, createCompany } from '../controllers/companiesController';

const router = Router();
router.get('/', listCompanies);
router.post('/', createCompany);

export default router;
