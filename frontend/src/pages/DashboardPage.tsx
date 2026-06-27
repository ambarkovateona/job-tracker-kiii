import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import { STATUS_LABELS, STATUS_BG_CLASS } from '../lib/applicationStatus';

function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Добро утро';
    if (hour < 18) return 'Добар ден';
    return 'Добра вечер';
}

function daysSince(dateStr: string) {
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function formatRelativeInterview(value: string) {
    const date = new Date(value);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const time = date.toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' });

    if (date.toDateString() === now.toDateString()) return `Денес • ${time}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Утре • ${time}`;
    return `${date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit' })} • ${time}`;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { applications, isLoading } = useApplications();

    const stats = useMemo(() => ({
        total: applications.length,
        interviews: applications.filter(a => a.status === 'INTERVIEW').length,
        offers: applications.filter(a => a.status === 'OFFER').length,
    }), [applications]);

    const nextInterview = useMemo(() => {
        const now = Date.now();
        return applications
            .filter(a =>
                a.status !== 'WITHDRAWN' &&
                a.status !== 'REJECTED' &&
                a.interviewDateTime &&
                new Date(a.interviewDateTime).getTime() >= now
            )
            .sort((a, b) => new Date(a.interviewDateTime!).getTime() - new Date(b.interviewDateTime!).getTime())[0] ?? null;
    }, [applications]);

    const recentApplications = useMemo(() => {
        return [...applications]
            .sort((a, b) => new Date(b.lastUpdated ?? b.appliedDate).getTime() - new Date(a.lastUpdated ?? a.appliedDate).getTime())
            .slice(0, 5);
    }, [applications]);

    const todaysFocus = useMemo(() => {
        const items: { key: string; text: string }[] = [];
        const now = Date.now();
        applications.forEach(a => {
            if (a.status !== 'WITHDRAWN' && a.status !== 'REJECTED' && a.interviewDateTime) {
                const diffHours = (new Date(a.interviewDateTime).getTime() - now) / (1000 * 60 * 60);
                if (diffHours > 0 && diffHours <= 48) {
                    items.push({ key: `interview-${a.id}`, text: `Подготви се за интервју со ${a.companyName}` });
                }
            }
            if (a.status === 'APPLIED' && daysSince(a.appliedDate) >= 7) {
                items.push({ key: `followup-${a.id}`, text: `Follow-up со ${a.companyName} (${daysSince(a.appliedDate)} дена без одговор)` });
            }
        });
        return items.slice(0, 5);
    }, [applications]);

    if (isLoading) return <p className="text-slate text-sm">Се вчитува...</p>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-semibold text-ink">
                    {greeting()}, {user?.firstName}
                </h1>
                <p className="text-slate text-sm mt-1">
                    {new Date().toLocaleDateString('mk-MK', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-paper border border-hairline rounded-lg shadow-sm p-5">
                    <p className="text-xs text-slate uppercase tracking-wide mb-1">Апликации</p>
                    <p className="font-mono text-3xl font-semibold text-ink">{stats.total}</p>
                </div>
                <div className="bg-paper border border-hairline rounded-lg shadow-sm p-5">
                    <p className="text-xs text-slate uppercase tracking-wide mb-1">Интервјуа</p>
                    <p className="font-mono text-3xl font-semibold text-status-interview">{stats.interviews}</p>
                </div>
                <div className="bg-paper border border-hairline rounded-lg shadow-sm p-5">
                    <p className="text-xs text-slate uppercase tracking-wide mb-1">Понуди</p>
                    <p className="font-mono text-3xl font-semibold text-status-offer">{stats.offers}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-paper border border-hairline rounded-lg shadow-sm p-5">
                    <p className="text-sm font-medium text-ink mb-3">Следно интервју</p>
                    {nextInterview ? (
                        <div>
                            <p className="font-display text-lg font-semibold text-ink">{nextInterview.companyName}</p>
                            <p className="text-sm text-slate mb-2">{nextInterview.position}</p>
                            <div className="flex items-center gap-1.5 text-sm text-status-interview font-medium">
                                <Clock size={14} />
                                {formatRelativeInterview(nextInterview.interviewDateTime!)}
                            </div>
                            {nextInterview.location && (
                                <div className="flex items-center gap-1.5 text-xs text-slate mt-1">
                                    <MapPin size={12} />{nextInterview.location}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate">Нема закажани интервјуа моментално.</p>
                    )}
                </div>

                <div className="bg-paper border border-hairline rounded-lg shadow-sm p-5">
                    <p className="text-sm font-medium text-ink mb-3">Today's Focus</p>
                    {todaysFocus.length > 0 ? (
                        <ul className="space-y-2">
                            {todaysFocus.map(item => (
                                <li key={item.key} className="flex items-start gap-2 text-sm text-ink">
                                    <AlertCircle size={14} className="text-status-offer mt-0.5 flex-shrink-0" />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate">Нема итни задачи - сè е во ред.</p>
                    )}
                </div>
            </div>

            <div className="bg-paper border border-hairline rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
                    <p className="text-sm font-medium text-ink">Скорашни апликации</p>
                    <Link to="/applications" className="flex items-center gap-1 text-xs text-sky font-medium hover:underline">
                        Сите апликации <ArrowUpRight size={14} />
                    </Link>
                </div>
                {recentApplications.length > 0 ? (
                    <ul className="divide-y divide-hairline">
                        {recentApplications.map(app => (
                            <li key={app.id} className="flex items-center justify-between px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${STATUS_BG_CLASS[app.status]}`} />
                                    <div>
                                        <p className="text-sm text-ink font-medium">{app.companyName}</p>
                                        <p className="text-xs text-slate">{app.position}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate">{STATUS_LABELS[app.status]}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-5 py-8 text-center">
                        <Briefcase size={24} className="text-slate mx-auto mb-2" />
                        <p className="text-sm text-slate mb-3">Сè уште нема апликации.</p>
                        <Link to="/applications" className="text-sky font-medium text-sm hover:underline">
                            Додај прва апликација →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}