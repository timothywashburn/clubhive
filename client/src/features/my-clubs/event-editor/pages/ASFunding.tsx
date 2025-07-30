import { AlertCircle, DollarSign, FileText, Calculator } from 'lucide-react';
import { EventData } from '@clubhive/shared';

interface ASFundingProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function ASFunding({ event, onEventChange }: ASFundingProps) {
    const fundingCategories = [
        { name: 'Food & Beverages', amount: 0, limit: 500 },
        { name: 'Venue Rental', amount: 0, limit: 300 },
        { name: 'Equipment Rental', amount: 0, limit: 200 },
        { name: 'Marketing Materials', amount: 0, limit: 150 },
        { name: 'Speaker/Entertainment', amount: 0, limit: 1000 },
    ];

    return (
        <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant min-h-[600px]">
            <div className="flex items-center gap-3 mb-6">
                <h4 className="text-xl font-semibold text-on-surface">AS Funding</h4>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">WIP</span>
            </div>

            <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5 className="font-medium text-green-900 mb-1">Associated Students Funding Request</h5>
                            <p className="text-sm text-green-700">
                                Request funding from UCSD Associated Students for your event. Track your budget and ensure compliance with
                                funding guidelines.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h6 className="font-medium text-on-surface mb-4">Budget Breakdown</h6>
                        <div className="space-y-3">
                            {fundingCategories.map((category, index) => (
                                <div key={index} className="border border-outline-variant rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-on-surface">{category.name}</span>
                                        <span className="text-xs text-on-surface-variant">Limit: ${category.limit}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-on-surface-variant">$</span>
                                        <input
                                            type="number"
                                            value={category.amount}
                                            className="flex-1 px-2 py-1 border border-outline-variant rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface text-on-surface"
                                            placeholder="0"
                                            min="0"
                                            max={category.limit}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className="font-medium text-on-surface mb-4">Funding Summary</h6>
                        <div className="bg-surface-variant/50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Total Requested:</span>
                                <span className="font-medium text-on-surface">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Available Budget:</span>
                                <span className="font-medium text-green-600">$2,150.00</span>
                            </div>
                            <div className="border-t border-outline-variant pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-on-surface">Remaining:</span>
                                    <span className="font-medium text-on-surface">$2,150.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="font-medium text-on-surface mb-2">Required Documents</h6>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-on-surface-variant" />
                                    <span className="text-on-surface-variant">Event Proposal</span>
                                    <span className="text-red-500">Required</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calculator className="h-4 w-4 text-on-surface-variant" />
                                    <span className="text-on-surface-variant">Detailed Budget</span>
                                    <span className="text-red-500">Required</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-on-surface-variant" />
                                    <span className="text-on-surface-variant">Receipts (Post-Event)</span>
                                    <span className="text-yellow-600">After Event</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h6 className="font-medium text-blue-900 mb-1">Funding Guidelines</h6>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Submit requests at least 2 weeks before your event</li>
                                <li>• All purchases must be pre-approved</li>
                                <li>• Keep all receipts for reimbursement</li>
                                <li>• Events must be open to all UCSD students</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
