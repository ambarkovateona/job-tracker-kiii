import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) {
                setError('Грешен email или лозинка.');
            } else {
                setError('Настана грешка. Пробај повторно.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout>
            <h1 className="font-display text-2xl font-semibold text-ink mb-1">Најава</h1>
            <p className="text-slate text-sm mb-6">Добредојде назад - внеси ги твоите податоци.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <p className="text-sm text-status-rejected bg-status-rejected/10 rounded-sm px-3 py-2">
                        {error}
                    </p>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">Email</label>
                    <input
                        id="email" type="email" value={email} required autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20 transition"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">Лозинка</label>
                    <input
                        id="password" type="password" value={password} required autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-sm border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20 transition"
                    />
                </div>

                <button
                    type="submit" disabled={isSubmitting}
                    className="w-full rounded-sm bg-pine text-paper font-medium py-2.5 text-sm transition hover:bg-pine/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Се најавувам...' : 'Најави се'}
                </button>

                <p className="text-sm text-slate text-center">
                    Немаш профил?{' '}
                    <Link to="/register" className="text-sky font-medium hover:underline">Регистрирај се</Link>
                </p>
            </form>
        </AuthLayout>
    );
}