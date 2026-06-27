export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
export interface StatusHistoryEntry {
    status: ApplicationStatus;
    changedAt: string;
}


export interface Application {
    id: number;
    companyName: string;
    position: string;
    status: ApplicationStatus;
    appliedDate: string;
    lastUpdated: string | null;
    notes: string | null;
    recruiterName: string | null;
    salary: string | null;
    location: string | null;
    interviewDateTime: string | null;
}

export interface ApplicationRequest {
    companyName: string;
    industry?: string;
    position: string;
    appliedDate: string;
    notes?: string;
    recruiterName?: string;
    salary?: string;
    location?: string;
    interviewDateTime?: string;
}


export interface ApplicationDetailsUpdate {
    recruiterName?: string;
    salary?: string;
    location?: string;
    interviewDateTime?: string;
    notes?: string;
}
