import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex md:w-1/2 bg-pine flex-col justify-between p-12 text-paper">
                <span className="font-display text-2xl font-semibold">JobFlow</span>
                <div>
                    <h2 className="font-display text-4xl font-semibold leading-tight mb-4">
                        Следи ја секоjа апликација за работно место како професионалец.
                    </h2>
                    <p className="text-paper/80 max-w-md">
                        Едно место за сите твои апликации - статус, интервjуа, понуди.
                    </p>
                </div>
                <span className="text-paper/60 text-sm">© 2026 JobFlow</span>
            </div>

            <div className="flex-1 flex items-center justify-center bg-mist p-6">
                <div className="w-full max-w-sm">{children}</div>
            </div>
        </div>
    );
}