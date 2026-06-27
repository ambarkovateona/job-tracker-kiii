import apiClient from './client';
import type { Application, ApplicationRequest, ApplicationStatus, ApplicationDetailsUpdate, StatusHistoryEntry } from '../types/application';

export async function getApplicationHistory(id: number): Promise<StatusHistoryEntry[]> {
    const res = await apiClient.get<StatusHistoryEntry[]>(`/api/applications/${id}/history`);
    return res.data;
}
export async function updateApplicationDetails(id: number, data: ApplicationDetailsUpdate): Promise<Application> {
    const res = await apiClient.patch<Application>(`/api/applications/${id}/details`, data);
    return res.data;
}

export async function getApplications(): Promise<Application[]> {
    const res = await apiClient.get<Application[]>('/api/applications');
    return res.data;
}

export async function createApplication(data: ApplicationRequest): Promise<Application> {
    const res = await apiClient.post<Application>('/api/applications', data);
    return res.data;
}

export async function updateApplicationStatus(id: number, newStatus: ApplicationStatus): Promise<Application> {
    const res = await apiClient.patch<Application>(`/api/applications/${id}/status`, { newStatus });
    return res.data;
}

export async function deleteApplication(id: number): Promise<void> {
    await apiClient.delete(`/api/applications/${id}`);
}