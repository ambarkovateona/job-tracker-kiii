import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApplications } from '../context/ApplicationsContext';
import { createApplication } from '../api/applications';
import { ApplicationForm } from '../components/ApplicationForm';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Modal } from '../components/Modal';
import { ApplicationDetailModal } from '../components/ApplicationDetailModal';
import type { ApplicationRequest } from '../types/application';

export default function ApplicationsPage() {
    const { applications, setApplications } = useApplications();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedApplication = applications.find(a => a.id === selectedId) ?? null;

    async function handleCreate(data: ApplicationRequest) {
        const created = await createApplication(data);
        setApplications(prev => [...prev, created]);
        setIsAddModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-semibold text-ink">Applications</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-sm bg-pine text-paper font-medium px-4 py-2 text-sm transition hover:bg-pine/90 active:scale-[0.98]"
                >
                    <Plus size={16} /> Додај апликација
                </button>
            </div>

            <KanbanBoard onCardClick={setSelectedId} />

            <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} title="Нова апликација">
                <ApplicationForm onSubmit={handleCreate} />
            </Modal>

            <ApplicationDetailModal application={selectedApplication} onClose={() => setSelectedId(null)} />
        </div>
    );
}