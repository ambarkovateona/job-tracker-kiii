import type { ApplicationStatus } from '../types/application';

export const STATUS_ORDER: ApplicationStatus[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    APPLIED: 'Applied',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
};

export const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
    APPLIED: ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
    INTERVIEW: ['OFFER', 'REJECTED', 'WITHDRAWN'],
    OFFER: ['WITHDRAWN'],
    REJECTED: [],
    WITHDRAWN: [],
};

export const STATUS_BG_CLASS: Record<ApplicationStatus, string> = {
    APPLIED: 'bg-status-applied',
    INTERVIEW: 'bg-status-interview',
    OFFER: 'bg-status-offer',
    REJECTED: 'bg-status-rejected',
    WITHDRAWN: 'bg-status-withdrawn',
};