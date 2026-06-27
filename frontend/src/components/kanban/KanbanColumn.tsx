import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import { STATUS_BG_CLASS } from '../../lib/applicationStatus';
import type { Application, ApplicationStatus } from '../../types/application';

interface Props {
    status: ApplicationStatus;
    label: string;
    applications: Application[];
    isDimmed: boolean;
    disabled: boolean;
    onCardClick: (id: number) => void;
}

export function KanbanColumn({ status, label, applications, isDimmed, disabled, onCardClick }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id: status, disabled });

    return (
        <div className={`w-72 flex-shrink-0 transition-opacity ${isDimmed ? 'opacity-40' : ''}`}>
            <div className="flex items-center gap-2 px-2 py-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_BG_CLASS[status]}`} />
                <span className="font-medium text-sm text-ink">{label}</span>
                <span className="text-xs font-mono text-slate ml-auto">{applications.length}</span>
            </div>
            <div ref={setNodeRef} className={`space-y-2 min-h-[140px] rounded-lg p-2 transition ${isOver ? 'bg-pine/5 ring-2 ring-pine/30' : 'bg-mist'}`}>
                {applications.map(app => (
                    <KanbanCard key={app.id} application={app} onClick={() => onCardClick(app.id)} />
                ))}
                {applications.length === 0 && <p className="text-xs text-slate text-center py-6">Нема апликации</p>}
            </div>
        </div>
    );
}