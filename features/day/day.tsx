"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import styles from '../../app/styles/DayCalendar.module.css';
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
        return hours * 60 + minutes; // Total minutes since midnight
    };
    const groupedInterviews = groupEventsByStartTime(interviews);
    const colors = ['bg-green-500', 'bg-blue-300', 'bg-red-400', 'bg-yellow-500', 'bg-purple-500'];
    const lastAssignedColors: { [time: string]: string } = {};

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {/* Header content */}
            </div>
  
            <div className={styles.dayCalendar}>
                <div className={styles.hours}>
                    {Array.from({ length: 24 }).map((_, index) => (
                        <div key={index} className={styles.hour}>
                            {format(new Date().setHours(index, 0, 0, 0), 'h a')}
                        </div>
                    ))}
                </div>
                <div className={styles.events}>
                {Object.keys(groupedInterviews).map((startTime, groupIndex) => {
                    const eventsAtSameTime = groupedInterviews[startTime];
                    const totalOverlap = eventsAtSameTime.length;

                    // Convert current startTime to minutes
                    const currentTimeInMinutes = convertTimeToMinutes(startTime);

                    return eventsAtSameTime.map((interview: Interview, index) => {
                        const start = new Date(interview.date_time);
                        const end = new Date(start.getTime() + (interview.duration || 60) * 60000);

                        // Determine the color for this card
                        let assignedColor = '';

                        // Shuffle colors and assign a color ensuring no adjacent cards have the same color
                        for (let i = 0; i < colors.length; i++) {
                            const color = colors[(index + i) % colors.length]; // Rotate through colors
                            const prevColor = lastAssignedColors[startTime]; // Last color for the time slot

                            // Check for the above time slot to determine its color
                            const aboveTimeInMinutes = currentTimeInMinutes - 60; // Check the previous hour
                            const aboveTimeSlot = Object.keys(groupedInterviews).find(timeSlot => convertTimeToMinutes(timeSlot) === aboveTimeInMinutes);

                            // Get the color of the event above
                            const aboveColor = aboveTimeSlot ? lastAssignedColors[aboveTimeSlot] : null;

                            if (color !== prevColor && color !== aboveColor) {
                                assignedColor = color;
                                break;
                            }
                        }

                        // Store the assigned color for this time slot
                        lastAssignedColors[startTime] = assignedColor;

                            return (
                                <Card
                                    key={`${groupIndex}-${index}`}
                                    className={`${styles.event} ${assignedColor}`}
                                    style={{
                                        top: `${(start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100}%`,
                                        height: `${((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) * 100}%`,
                                        width: `calc(${100 / totalOverlap}% - 5px)`, // Adjust width
                                        left: `calc(${(100 / totalOverlap) * index}%)`, // Offset horizontally based on index
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
                                        <CardTitle>{('Interview with ' + interview.interviewee?.name || 'Interview')}</CardTitle>
                                    </CardHeader>
                                    {/* <CardContent>
                                        <CardDescription className={styles.cardDescription}>
                                            {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                                        </CardDescription>
                                        <div>
                                            <strong>Interviewer(s):</strong> {interview.interviewer.map(i => i.name).join(', ')}
                                        </div>
                                        {interview.job && (
                                            <div>
                                                <strong>Job:</strong> {interview.job.title}
                                            </div>
                                        )}
                                        {interview.business_area && (
                                            <div>
                                                <strong>Business Area:</strong> {interview.business_area.name}
                                            </div>
                                        )}
                                        {interview.location && (
                                            <div>
                                                <strong>Location:</strong> {interview.location}
                                            </div>
                                        )}
                                        {interview.status && (
                                            <div>
                                                <strong>Status:</strong> {interview.status}
                                            </div>
                                        )}
                                    </CardContent> */}
                                </Card>
                            );
                        });
                    })}
                    <div
                        className={styles.currentTimeIndicator}
                        style={{ top: `${(currentTime / (24 * 60)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DayCalendar;
