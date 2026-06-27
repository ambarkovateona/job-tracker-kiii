import type { Application, ApplicationStatus } from '../types/application';

const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
    APPLIED: ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
    INTERVIEW: ['OFFER', 'REJECTED', 'WITHDRAWN'],
    OFFER: ['WITHDRAWN'],
    REJECTED: [],
    WITHDRAWN: [],
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    APPLIED: 'Аплицирано', INTERVIEW: 'Интервју', OFFER: 'Понуда',
    REJECTED: 'Одбиено', WITHDRAWN: 'Повлечено',
};

interface Props {
    applications: Application[];
    onStatusChange: (id: number, newStatus: ApplicationStatus) => void;
    onDelete: (id: number) => void;
}

export function ApplicationList({ applications, onStatusChange, onDelete }: Props) {
    if (applications.length === 0) {
        return (
            <div className="bg-paper border border-hairline rounded-lg shadow-sm p-8 text-center text-slate text-sm">
                Сè уште нема додадени апликации.
            </div>
        );
    }

    return (
        <div className="bg-paper border border-hairline rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-mist text-slate text-xs uppercase tracking-wide">
                <tr>
                    <th className="text-left px-4 py-3">Компанија</th>
                    <th className="text-left px-4 py-3">Позиција</th>
                    <th className="text-left px-4 py-3">Статус</th>
                    <th className="text-left px-4 py-3">Аплицирано</th>
                    <th className="text-left px-4 py-3">Последна промена</th>
                    <th className="px-4 py-3"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                {applications.map(app => {
                    const nextOptions = ALLOWED_TRANSITIONS[app.status];
                    return (
                        <tr key={app.id} className="hover:bg-mist transition">
                            <td className="px-4 py-3 text-ink font-medium">{app.companyName}</td>
                            <td className="px-4 py-3 text-slate">{app.position}</td>
                            <td className="px-4 py-3">
                                <select
                                    value={app.status}
                                    onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                                    disabled={nextOptions.length === 0}
                                    className="text-xs rounded-sm border border-hairline bg-paper px-2 py-1 disabled:opacity-60"
                                >
                                    <option value={app.status}>{STATUS_LABELS[app.status]}</option>
                                    {nextOptions.map(status => (
                                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate">{app.appliedDate}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate">{app.lastUpdated ?? '-'}</td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => onDelete(app.id)} className="text-xs text-status-rejected hover:underline">Избриши</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}