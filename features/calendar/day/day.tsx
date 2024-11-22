"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import useCalendarApi from '../calendar/hooks/useCalendarApi';
import { useCalendarStore } from "../../stores/useCalendarStore";
import { Interview } from '../calendar/models/interview';

const DayCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentTime, setCurrentTime] = useState<number>(0);

    const { events: interviews, loading, error } = useCalendarApi();
    const { onDateChange, selectedDate } = useCalendarStore();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.getHours() * 60 + now.getMinutes());
        };
        updateTime();
        const intervalId = setInterval(updateTime, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const getGMTOffset = (): string => {
        const offset = -new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const groupEventsByStartTime = (events: Interview[]) => {
        const groupedEvents: { [key: string]: Interview[] } = {};
      
        events.forEach((event) => {
          const startTime = format(new Date(event.date_time), 'HH:mm');
          if (!groupedEvents[startTime]) {
            groupedEvents[startTime] = [];
          }
          groupedEvents[startTime].push(event);
        });
      
        return groupedEvents;
    };
    
    const convertTimeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };
    
    const groupedInterviews = groupEventsByStartTime(interviews);
    const colors = ['bg-green-500', 'bg-blue-300', 'bg-red-400', 'bg-yellow-500', 'bg-purple-500'];
    const lastAssignedColors: { [time: string]: string } = {};

    return (
        <div className="flex flex-col p-5 gap-5">
            <div className="flex flex-col items-start mb-5">
                <div className="text-2xl font-bold">{format(currentDate, 'EEEE')}</div>
                <div className="text-xl mt-1">{format(currentDate, 'MMMM d, yyyy')}</div>
                <div className="text-sm text-gray-600 mt-1">{getGMTOffset()}</div>
            </div>

            <div className="relative flex h-[80rem] overflow-hidden">
                <div className="flex flex-col w-[5%]">
                    {Array.from({ length: 24 }).map((_, index) => (
                        <div key={index} className="h-60 flex items-center justify-center border-b border-gray-300">
                            {format(new Date().setHours(index, 0, 0, 0), 'h a')}
                        </div>
                    ))}
                </div>

                <div className="relative flex-1 overflow-y-auto h-full">
                    {Object.keys(groupedInterviews).map((startTime, groupIndex) => {
                        const eventsAtSameTime = groupedInterviews[startTime];
                        const totalOverlap = eventsAtSameTime.length;

                        const currentTimeInMinutes = convertTimeToMinutes(startTime);

                        return eventsAtSameTime.map((interview: Interview, index) => {
                            const start = new Date(interview.date_time);
                            const end = new Date(start.getTime() + (interview.duration || 60) * 60000);

                            let assignedColor = '';

                            for (let i = 0; i < colors.length; i++) {
                                const color = colors[(index + i) % colors.length];
                                const prevColor = lastAssignedColors[startTime];
                                const aboveTimeInMinutes = currentTimeInMinutes - 60;
                                const aboveTimeSlot = Object.keys(groupedInterviews).find(timeSlot => convertTimeToMinutes(timeSlot) === aboveTimeInMinutes);
                                const aboveColor = aboveTimeSlot ? lastAssignedColors[aboveTimeSlot] : null;

                                if (color !== prevColor && color !== aboveColor) {
                                    assignedColor = color;
                                    break;
                                }
                            }

                            lastAssignedColors[startTime] = assignedColor;

                            return (
                                <Card
                                    key={`${groupIndex}-${index}`}
                                    className={`absolute text-white rounded cursor-pointer overflow-hidden flex flex-col justify-center items-center p-1 text-center text-xs ${assignedColor}`}
                                    style={{
                                        top: `${(start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100}%`,
                                        height: `${((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) * 100}%`,
                                        width: `calc(${100 / totalOverlap}% - 5px)`,
                                        left: `calc(${(100 / totalOverlap) * index}%)`,
                                    }}
                                    onClick={() => {
                                        const interviewTime = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
                                        const interviewers = interview.interviewer.map(i => i.name).join(', ') || 'N/A';
                                        const jobTitle = interview.job ? interview.job.title : 'N/A';
                                        const location = interview.location || 'N/A';
                                        const status = interview.status || 'N/A';
                                    
                                        alert(`Time: ${interviewTime}\nInterviewer(s): ${interviewers}\nJob: ${jobTitle}\nLocation: ${location}\nStatus: ${status}`);
                                    }}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-sm">{'Interview with ' + (interview.interviewee?.name || 'Interview')}</CardTitle>
                                    </CardHeader>
                                </Card>
                            );
                        });
                    })}
                    <div
                        className="absolute h-0.5 w-full bg-red-500"
                        style={{ top: `${(currentTime / (24 * 60)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DayCalendar;
