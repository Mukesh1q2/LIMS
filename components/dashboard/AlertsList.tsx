'use client';

import { Alert } from '@/types';
import { getSeverityColor, formatDateTime } from '@/lib/utils';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface AlertsListProps {
  alerts: Alert[];
}

const alertIcons = {
  overdue_books: ExclamationTriangleIcon,
  pending_fees: ClockIcon,
  low_attendance: UserGroupIcon,
  general: InformationCircleIcon,
};

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Alerts</h3>
        <span className="text-sm text-neutral-500">
          {alerts.filter(alert => !alert.isRead).length} unread
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const IconComponent = alertIcons[alert.type] || InformationCircleIcon;
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-neutral-50 ${
                getSeverityColor(alert.severity)
              } ${!alert.isRead ? 'ring-2 ring-primary-500 ring-opacity-20' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900">
                      {alert.title}
                    </p>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    {alert.message}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    {formatDateTime(alert.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <InformationCircleIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No alerts at this time</p>
        </div>
      )}
    </div>
  );
}