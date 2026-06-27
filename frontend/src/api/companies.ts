import apiClient from './client';
import type { Company } from '../types/company';

export async function getCompanies(): Promise<Company[]> {
    const res = await apiClient.get<Company[]>('/api/companies');
    return res.data;
}