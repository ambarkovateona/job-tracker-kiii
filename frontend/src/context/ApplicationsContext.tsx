import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { getApplications } from '../api/applications';
import type { Application } from '../types/application';

interface ApplicationsContextValue {
    applications: Application[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    setApplications: Dispatch<SetStateAction<Application[]>>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | undefined>(undefined);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function refresh() {
        setIsLoading(true);
        setError(null);
        try {
            setApplications(await getApplications());
        } catch {
            setError('Не успеа да се вчитаат апликациите.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { refresh(); }, []);

    return (
        <ApplicationsContext.Provider value={{ applications, isLoading, error, refresh, setApplications }}>
            {children}
        </ApplicationsContext.Provider>
    );
}

export function useApplications() {
    const ctx = useContext(ApplicationsContext);
    if (!ctx) {
        throw new Error('useApplications must be used within an ApplicationsProvider');
    }
    return ctx;
}