import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { useApplications } from '../../context/ApplicationsContext';
import { updateApplicationStatus } from '../../api/applications';
import { STATUS_ORDER, STATUS_LABELS, ALLOWED_TRANSITIONS } from '../../lib/applicationStatus';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Application, ApplicationStatus } from '../../types/application';

interface Props {
    onCardClick: (id: number) => void;
}

export function KanbanBoard({ onCardClick }: Props) {
    const { applications, setApplications } = useApplications();
    const [activeApp, setActiveApp] = useState<Application | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    function handleDragStart(event: DragStartEvent) {
        setActiveApp(applications.find(a => a.id === event.active.id) ?? null);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveApp(null);
        if (!over) return;

        const app = applications.find(a => a.id === active.id);
        const newStatus = over.id as ApplicationStatus;
        if (!app || app.status === newStatus || !ALLOWED_TRANSITIONS[app.status].includes(newStatus)) return;

        setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
        try {
            const updated = await updateApplicationStatus(app.id, newStatus);
            setApplications(prev => prev.map(a => a.id === app.id ? updated : a));
        } catch {
            setApplications(prev => prev.map(a => a.id === app.id ? app : a));
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {STATUS_ORDER.map(status => {
                    const isValidTarget = !activeApp || status === activeApp.status || ALLOWED_TRANSITIONS[activeApp.status].includes(status);
                    return (
                        <KanbanColumn
                            key={status}
                            status={status}
                            label={STATUS_LABELS[status]}
                            applications={applications.filter(a => a.status === status)}
                            isDimmed={!!activeApp && !isValidTarget}
                            disabled={!!activeApp && !isValidTarget}
                            onCardClick={onCardClick}
                        />
                    );
                })}
            </div>

            <DragOverlay>
                {activeApp ? <KanbanCard application={activeApp} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}