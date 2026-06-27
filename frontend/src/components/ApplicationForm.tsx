import { useState, useEffect, type FormEvent } from 'react';
import type { ApplicationRequest } from '../types/application';
import type { Company } from '../types/company';
import { getCompanies } from '../api/companies';

const EMPTY_FORM: ApplicationRequest = {
    companyName: '', industry: '', position: '',
    appliedDate: new Date().toISOString().slice(0, 10), notes: '',
    recruiterName: '', salary: '', location: '', interviewDateTime: '',
};

const inputClass = "w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20 transition";
const labelClass = "block text-sm font-medium text-ink mb-1";

interface Props {
    onSubmit: (data: ApplicationRequest) => Promise<void>;
}

export function ApplicationForm({ onSubmit }: Props) {
    const [form, setForm] = useState<ApplicationRequest>(EMPTY_FORM);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCompanies().then(setCompanies).catch(() => {});
    }, []);

    function handleChange(field: keyof ApplicationRequest, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleCompanyNameChange(value: string) {
        handleChange('companyName', value);
        const match = companies.find(c => c.name.toLowerCase() === value.toLowerCase());
        if (match?.industry) {
            handleChange('industry', match.industry);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(form);
            setForm(EMPTY_FORM);
        } catch {
            setError('Не успеа да се додаде апликацијата.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-ink">Нова апликација</h2>
            {error && (
                <p className="text-sm text-status-rejected bg-status-rejected/10 rounded-sm px-3 py-2">{error}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="companyName" className={labelClass}>Компанија</label>
                    <input
                        id="companyName" list="companies-list" value={form.companyName} required
                        onChange={(e) => handleCompanyNameChange(e.target.value)}
                        className={inputClass}
                    />
                    <datalist id="companies-list">
                        {companies.map(c => <option key={c.id} value={c.name} />)}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="industry" className={labelClass}>Индустрија</label>
                    <input id="industry" value={form.industry} onChange={(e) => handleChange('industry', e.target.value)} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="position" className={labelClass}>Позиција</label>
                    <input id="position" value={form.position} required onChange={(e) => handleChange('position', e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="appliedDate" className={labelClass}>Датум на аплицирање</label>
                    <input id="appliedDate" type="date" value={form.appliedDate} required onChange={(e) => handleChange('appliedDate', e.target.value)} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="location" className={labelClass}>Локација</label>
                    <input id="location" value={form.location} placeholder="Skopje / Remote" onChange={(e) => handleChange('location', e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="recruiterName" className={labelClass}>Recruiter контакт</label>
                    <input id="recruiterName" value={form.recruiterName} onChange={(e) => handleChange('recruiterName', e.target.value)} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="salary" className={labelClass}>Плата</label>
                    <input id="salary" value={form.salary} placeholder="45.000-50.000 MKD" onChange={(e) => handleChange('salary', e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="interviewDateTime" className={labelClass}>Интервју термин</label>
                    <input id="interviewDateTime" type="datetime-local" value={form.interviewDateTime} onChange={(e) => handleChange('interviewDateTime', e.target.value)} className={inputClass} />
                </div>
            </div>

            <div>
                <label htmlFor="notes" className={labelClass}>Белешки</label>
                <textarea id="notes" rows={3} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className={inputClass} />
            </div>

            <button
                type="submit" disabled={isSubmitting}
                className="rounded-sm bg-pine text-paper font-medium px-5 py-2.5 text-sm transition hover:bg-pine/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Се додава...' : 'Додај апликација'}
            </button>
        </form>
    );
}