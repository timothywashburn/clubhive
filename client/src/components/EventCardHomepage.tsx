import React from 'react';

interface EventCardProps {
    name: string;
    location: string;
    date: string;
    startTime: string;
    description: string;
    attendees: number;
}

export function EventCardHomepage({ name, location, date, startTime, description, attendees }: EventCardProps) {
    return (
        <div className="border border-outline-variant rounded-md p-4">
            <div className="space-y-2">
                <div className="flex items-center ">
                    <div className="flex justify-between w-full items-start">
                        <h3 className="text-base font-light text-on-surface">{name}</h3>
                        <div className="text-sm text-on-surface-variant">{date}</div>
                    </div>
                </div>

                <div className="flex items-center ">
                    <div className="flex justify-between w-full items-start">
                        <div className="text-sm text-on-surface-variant">{location}</div>
                        <div className="text-sm text-on-surface-variant">{startTime}</div>
                    </div>
                </div>

                <h4 className="text-sm text-on-surface text-left">{description} </h4>
                <div className="flex items-start ">
                    <div className="text-sm text-on-surface-variant">{attendees} attendees</div>
                </div>
            </div>
        </div>
    );
}
