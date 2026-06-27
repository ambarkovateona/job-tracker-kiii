import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

const inputClass = "w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20 transition";
const labelClass = "block text-sm font-medium text-ink mb-1";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(field: keyof typeof form, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await register(form);
            navigate('/dashboard');
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.status === 409) setError('Веќе постои корисник со овој email.');
                else if (err.response?.status === 400) setError(err.response.data?.message ?? 'Невалидни податоци.');
                else setError('Настана грешка. Пробај повторно.');
            } else {
                setError('Настана грешка. Пробај повторно.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout>
            <h1 className="font-display text-2xl font-semibold text-ink mb-1">Регистрација</h1>
            <p className="text-slate text-sm mb-6">Започни да го следиш твоjot job search денес.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <p className="text-sm text-status-rejected bg-status-rejected/10 rounded-sm px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="firstName" className={labelClass}>Име</label>
                        <input id="firstName" value={form.firstName} required onChange={(e) => handleChange('firstName', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="lastName" className={labelClass}>Презиме</label>
                        <input id="lastName" value={form.lastName} required onChange={(e) => handleChange('lastName', e.target.value)} className={inputClass} />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input id="email" type="email" value={form.email} required autoComplete="email" onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Лозинка</label>
                    <input id="password" type="password" value={form.password} required minLength={6} autoComplete="new-password" onChange={(e) => handleChange('password', e.target.value)} className={inputClass} />
                </div>

                <button
                    type="submit" disabled={isSubmitting}
                    className="w-full rounded-sm bg-pine text-paper font-medium py-2.5 text-sm transition hover:bg-pine/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Се регистрирам...' : 'Регистрирај се'}
                </button>

                <p className="text-sm text-slate text-center">
                    Веќе имаш профил?{' '}
                    <Link to="/login" className="text-sky font-medium hover:underline">Најави се</Link>
                </p>
            </form>
        </AuthLayout>
    );
}