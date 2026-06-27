import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, User, Banknote, Clock, Trash2, Pencil } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getApplicationHistory, updateApplicationDetails, deleteApplication } from '../api/applications';
import { useApplications } from '../context/ApplicationsContext';
import { STATUS_LABELS, STATUS_BG_CLASS } from '../lib/applicationStatus';
import type { Application, ApplicationDetailsUpdate, StatusHistoryEntry } from '../types/application';

const inputClass = "w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20 transition";
const labelClass = "block text-xs font-medium text-slate mb-1";

interface Props {
    application: Application | null;
    onClose: () => void;
}

function formatDateTime(value: string) {
    return new Date(value).toLocaleString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function DetailField({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | null | undefined }) {
    return (
        <div>
            <p className={labelClass}>{label}</p>
            <p className="flex items-center gap-1.5 text-sm text-ink">
                <Icon size={14} className="text-slate" />
                {value || '-'}
            </p>
        </div>
    );
}

export function ApplicationDetailModal({ application, onClose }: Props) {
    const { setApplications } = useApplications();
    const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ApplicationDetailsUpdate>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!application) return;
        setIsEditing(false);
        setError(null);
        setForm({
            recruiterName: application.recruiterName ?? '',
            salary: application.salary ?? '',
            location: application.location ?? '',
            interviewDateTime: application.interviewDateTime ?? '',
            notes: application.notes ?? '',
        });
        getApplicationHistory(application.id).then(setHistory).catch(() => setHistory([]));
    }, [application]);

    if (!application) return null;

    function handleChange(field: keyof ApplicationDetailsUpdate, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        if (!application) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await updateApplicationDetails(application.id, form);
            setApplications(prev => prev.map(a => a.id === application.id ? updated : a));
            setIsEditing(false);
        } catch {
            setError('Не успеа да се зачуваат промените.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!application) return;
        if (!confirm(`Избриши апликација за ${application.companyName}?`)) return;
        await deleteApplication(application.id);
        setApplications(prev => prev.filter(a => a.id !== application.id));
        onClose();
    }

    return (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-ink/40 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto bg-paper rounded-lg shadow-lg p-6">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <Dialog.Title className="font-display text-xl font-semibold text-ink">{application.companyName}</Dialog.Title>
                            <p className="text-sm text-slate">{application.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full text-paper ${STATUS_BG_CLASS[application.status]}`}>
                                {STATUS_LABELS[application.status]}
                            </span>
                            <Dialog.Close className="text-slate hover:text-ink transition"><X size={20} /></Dialog.Close>
                        </div>
                    </div>

                    {error && <p className="text-sm text-status-rejected bg-status-rejected/10 rounded-sm px-3 py-2 mt-3">{error}</p>}

                    <div className="mt-5 grid grid-cols-2 gap-4">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className={labelClass}>Локација</label>
                                    <input value={form.location ?? ''} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Recruiter контакт</label>
                                    <input value={form.recruiterName ?? ''} onChange={(e) => handleChange('recruiterName', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Плата</label>
                                    <input value={form.salary ?? ''} onChange={(e) => handleChange('salary', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Интервју термин</label>
                                    <input type="datetime-local" value={form.interviewDateTime ?? ''} onChange={(e) => handleChange('interviewDateTime', e.target.value)} className={inputClass} />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass}>Белешки</label>
                                    <textarea rows={3} value={form.notes ?? ''} onChange={(e) => handleChange('notes', e.target.value)} className={inputClass} />
                                </div>
                            </>
                        ) : (
                            <>
                                <DetailField icon={MapPin} label="Локација" value={application.location} />
                                <DetailField icon={User} label="Recruiter контакт" value={application.recruiterName} />
                                <DetailField icon={Banknote} label="Плата" value={application.salary} />
                                <DetailField icon={Clock} label="Интервју термин" value={application.interviewDateTime ? formatDateTime(application.interviewDateTime) : null} />
                                <div className="col-span-2">
                                    <p className={labelClass}>Белешки</p>
                                    <p className="text-sm text-ink whitespace-pre-wrap">{application.notes || '-'}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} disabled={isSaving} className="rounded-sm bg-pine text-paper text-sm font-medium px-4 py-2 hover:bg-pine/90 transition disabled:opacity-60">
                                    {isSaving ? 'Се зачувува...' : 'Зачувај'}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="rounded-sm border border-hairline text-sm font-medium px-4 py-2 text-slate hover:bg-mist transition">
                                    Откажи
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 rounded-sm border border-hairline text-sm font-medium px-4 py-2 text-ink hover:bg-mist transition">
                                <Pencil size={14} /> Уреди
                            </button>
                        )}
                        <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-sm border border-hairline text-sm font-medium px-4 py-2 text-status-rejected hover:bg-status-rejected/10 transition ml-auto">
                            <Trash2 size={14} /> Избриши
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-hairline">
                        <p className="text-xs font-medium text-slate uppercase tracking-wide mb-3">Timeline</p>
                        <div className="space-y-3">
                            {history.map((entry, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className={`w-2.5 h-2.5 rounded-full mt-1 ${STATUS_BG_CLASS[entry.status]}`} />
                                    <div>
                                        <p className="text-sm text-ink font-medium">{STATUS_LABELS[entry.status]}</p>
                                        <p className="text-xs font-mono text-slate">{formatDateTime(entry.changedAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}