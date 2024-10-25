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
  
    // Fetch interviews (events) from the API
    const { events: interviews, loading, error } = useCalendarApi();
    
    // Zustand store for managing selected date
    const { onDateChange, selectedDate } = useCalendarStore();
  
    useEffect(() => {
      // Update time every minute to highlight the current time
      const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.getHours() * 60 + now.getMinutes());
      };
      updateTime();
      const intervalId = setInterval(updateTime, 60000); // Update every minute
  
      return () => clearInterval(intervalId);
    }, []);
  
    // GMT timezone offset
    const getGMTOffset = (): string => {
      const offset = -new Date().getTimezoneOffset();
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';
      return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.day}>{format(currentDate, 'EEEE')}</div>
          <div className={styles.date}>{format(currentDate, 'MMMM d, yyyy')}</div>
          <div className={styles.timezone}>{getGMTOffset()}</div>
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
            {interviews.map((interview: Interview, index) => {
              // Calculate start and end times for interview
              const start = new Date(interview.date_time);
              const end = new Date(start.getTime() + (interview.duration || 60) * 60000); // Default duration: 60 mins
  
              return (
                <Card
                  key={index}
                  className={styles.event}
                  style={{
                    top: `${(start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100}%`,
                    height: `${((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) * 100}%`,
                  }}
                  onClick={() => alert(interview.notes || 'No additional notes')}
                >
                  <CardHeader>
                    <CardTitle>{interview.interviewee?.name || 'Interview'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className={styles.cardDescription}>
                      {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                    </CardDescription>
                    <div>
                      <strong>Interviewer(s):</strong> {interview.interviewer.map((i: { name: string; }) => i.name).join(', ')}
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
                  </CardContent>
                </Card>
              );
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