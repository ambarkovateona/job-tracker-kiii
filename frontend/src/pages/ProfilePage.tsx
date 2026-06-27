import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import { Mail, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { applications } = useApplications();

    if (!user) return null;

    const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`;

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>

            <div className="bg-paper border border-hairline rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-pine text-paper flex items-center justify-center text-xl font-display font-semibold">
                        {initials}
                    </div>
                    <div>
                        <p className="font-display text-lg font-semibold text-ink">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-slate">{applications.length} апликации следени</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate mb-1">Име</label>
                        <p className="flex items-center gap-2 text-sm text-ink border border-hairline rounded-sm px-3 py-2 bg-mist">
                            <UserIcon size={14} className="text-slate" />{user.firstName}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate mb-1">Презиме</label>
                        <p className="flex items-center gap-2 text-sm text-ink border border-hairline rounded-sm px-3 py-2 bg-mist">
                            <UserIcon size={14} className="text-slate" />{user.lastName}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate mb-1">Email</label>
                        <p className="flex items-center gap-2 text-sm text-ink border border-hairline rounded-sm px-3 py-2 bg-mist">
                            <Mail size={14} className="text-slate" />{user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}