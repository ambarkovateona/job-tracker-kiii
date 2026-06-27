import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Briefcase, User, Settings, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import { STATUS_ORDER, STATUS_LABELS, STATUS_BG_CLASS } from '../lib/applicationStatus';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
];

function PipelineWidget() {
    const { applications } = useApplications();
    const total = applications.length;

    if (total === 0) {
        return <p className="text-xs text-slate px-4 py-3 border-t border-hairline">Нема апликации сè уште.</p>;
    }

    return (
        <div className="px-4 py-3 space-y-2 border-t border-hairline">
            <p className="text-[11px] font-medium text-slate uppercase tracking-wide mb-1">Pipeline</p>
            {STATUS_ORDER.map(status => {
                const count = applications.filter(a => a.status === status).length;
                const pct = Math.round((count / total) * 100);
                return (
                    <div key={status} className="flex items-center gap-2">
                        <span className="w-14 text-[11px] text-slate truncate">{STATUS_LABELS[status]}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-hairline overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${STATUS_BG_CLASS[status]}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] font-mono text-ink w-5 text-right">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

export function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex bg-mist">
            <aside className="w-60 flex-shrink-0 bg-paper border-r border-hairline flex flex-col">
                <div className="px-5 py-5">
                    <span className="font-display text-xl font-semibold text-ink">JobFlow</span>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-pine/10 text-pine shadow-[inset_2px_0_0_0_var(--color-pine)]'
                                        : 'text-slate hover:bg-mist hover:text-ink'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <PipelineWidget />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 flex-shrink-0 border-b border-hairline bg-paper flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-slate text-sm bg-mist rounded-sm px-3 py-1.5 w-64">
                        <Search size={16} />
                        <span>Search...</span>
                        <span className="ml-auto text-[11px] font-mono border border-hairline rounded-sm px-1.5 py-0.5">⌘K</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-slate hover:text-ink transition">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-pine text-paper flex items-center justify-center text-sm font-medium">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <button onClick={handleLogout} className="text-slate hover:text-ink transition" title="Одjави се">
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}