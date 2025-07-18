import React from 'react';

interface InboxCardProps {
    sender: string;
    title: string;
    body: string;
}

export function InboxCardHomepage({ sender, title, body }: InboxCardProps) {
    return (
        <div className="border border-outline-variant rounded-md p-4">
            <div className="space-y-2">
                <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">
                            CS
                        </div>
                        <span className="text-lg  text-on-surface">
                            {sender}
                        </span>
                    </div>
                </div>

                <div className="h-px bg-outline-variant -mx-4 my-4" />

                <div className="flex justify-between w-full items-start">
                    <h3 className="text-base text-on-surface">{title}</h3>
                    <div className="text-sm text-on-surface-variant">
                        4 hrs ago
                    </div>
                </div>

                <h3 className="text-sm font-light text-on-surface-variant text-left">
                    {body}
                </h3>
            </div>
        </div>
    );
}
