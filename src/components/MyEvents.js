import React, { useState, useEffect } from 'react';
import NavigationBar from './navbar';
import EventCard from './EventCard';
import db from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

const MyEvents = () => {
    const { auth } = useAuth();
    const [userEventsIds, setUserEventsIds] = useState([]);
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        const fetchUserEventIds = async () => {
            try {
                const userRef = doc(db, "Users", auth.id);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                const bookedEvents = userData.booked_events || [];
                const eventIds = bookedEvents.map(ref => ref.id);
                setUserEventsIds(eventIds);
            } catch (error) {
                console.error("Error getting user events", error);
            }
        }
        fetchUserEventIds();
    }, [auth.id]);

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                // Using Promise.all to fetch all events in parallel
                const eventDocs = await Promise.all(userEventsIds.map(eventId => getDoc(doc(db, "Events", eventId))));
                const eventsData = eventDocs.map(eventDoc => ({
                    id: eventDoc.id,
                    name: eventDoc.data().name,
                    date: eventDoc.data().date.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    description: eventDoc.data().description,
                    maxCapacity: eventDoc.data().max_capacity,
                    ticketsSold: eventDoc.data().tickets_sold
                }));
                setUserEvents(eventsData);
            } catch (error) {
                console.error("Error fetching event details", error);
            }
        };

        if (userEventsIds.length > 0) {
            fetchUserEvents();
        }
    }, [userEventsIds]);

    return (
        <div>
            <NavigationBar />
            <div className='container d-flex flex-column justify-content-center align-items-center'>
                <h1 className='m-5'>My Events</h1>
                {userEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        name={event.name}
                        date={event.date}
                        description={event.description}
                        maxCapacity={event.maxCapacity}
                        ticketsSold={event.ticketsSold}
                        userEvents={userEventsIds}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyEvents;
