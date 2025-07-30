import { AlertCircle, Clock, DollarSign } from 'lucide-react';
import { EventData } from '@clubhive/shared';

interface TAPIntegrationProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function TAPIntegration({ event, onEventChange }: TAPIntegrationProps) {
    return (
        <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant min-h-[600px]">
            <div className="flex items-center gap-3 mb-6">
                <h4 className="text-xl font-semibold text-on-surface">TAP Integration</h4>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">WIP</span>
            </div>

            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5 className="font-medium text-blue-900 mb-1">Triton Activities Planner (TAP) Integration</h5>
                            <p className="text-sm text-blue-700">
                                This feature will integrate with UCSD's TAP system to streamline event planning and approval processes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-outline-variant rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-5 w-5 text-on-surface-variant" />
                            <h6 className="font-medium text-on-surface">Event Approval Status</h6>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Status:</span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Pending</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Submitted:</span>
                                <span className="text-sm text-on-surface">Not yet submitted</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-outline-variant rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="h-5 w-5 text-on-surface-variant" />
                            <h6 className="font-medium text-on-surface">Resource Requests</h6>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Tables/Chairs:</span>
                                <span className="text-sm text-on-surface">Not requested</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">A/V Equipment:</span>
                                <span className="text-sm text-on-surface">Not requested</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className="font-medium text-on-surface mb-3">Planned Features</h6>
                    <ul className="space-y-2 text-sm text-on-surface-variant">
                        <li>• Automatic TAP form submission</li>
                        <li>• Real-time approval status tracking</li>
                        <li>• Resource request management</li>
                        <li>• Conflict detection with other events</li>
                        <li>• Venue availability checking</li>
                        <li>• Integration with campus calendars</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
