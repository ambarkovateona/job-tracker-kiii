import { useDraggable } from '@dnd-kit/core';
import { MapPin, Clock } from 'lucide-react';
import type { Application } from '../../types/application';

interface Props {
    application: Application;
    isOverlay?: boolean;
    onClick?: () => void;
}

export function KanbanCard({ application, isOverlay, onClick }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });

    const style = transform && !isOverlay
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            onClick={onClick}
            className={`bg-paper border border-hairline rounded-md p-3 shadow-sm cursor-grab active:cursor-grabbing transition ${
                isDragging && !isOverlay ? 'opacity-30' : ''
            } ${isOverlay ? 'shadow-lg rotate-1' : 'hover:shadow-md'}`}
        >
            <p className="font-medium text-sm text-ink truncate">{application.companyName}</p>
            <p className="text-xs text-slate truncate">{application.position}</p>
            <div className="mt-2 flex flex-col gap-1">
                {application.location && (
                    <span className="flex items-center gap-1 text-[11px] text-slate">
                        <MapPin size={12} />{application.location}
                    </span>
                )}
                {application.interviewDateTime && (
                    <span className="flex items-center gap-1 text-[11px] text-status-interview font-medium">
                        <Clock size={12} />
                        {new Date(application.interviewDateTime).toLocaleString('mk-MK', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}