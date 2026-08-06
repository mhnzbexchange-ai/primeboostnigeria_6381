import React from 'react';

type StatusType = 'active' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string; dot: string }> = {
  active: { label: 'Active', className: 'status-active', dot: 'bg-green-400' },
  pending: { label: 'Pending', className: 'status-pending', dot: 'bg-yellow-400' },
  processing: { label: 'Processing', className: 'status-processing', dot: 'bg-blue-400' },
  completed: { label: 'Completed', className: 'status-completed', dot: 'bg-primary' },
  failed: { label: 'Failed', className: 'status-failed', dot: 'bg-red-400' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`badge-base ${config.className} ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      {config.label}
    </span>
  );
}