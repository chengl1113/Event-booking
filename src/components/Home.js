import React, { useState, useEffect } from 'react';
import NavigationBar from './navbar';
import EventCard from './EventCard';
import db from '../api/firebase'
import { collection, getDocs, query, doc, getDoc, } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';


const Home = () => {
    const { auth } = useAuth();

    const [events, setEvents] = useState([]);
    const [userEventIds, setUserEventIds] = useState([])

    // get all events
    useEffect(() => {
        console.log("home events: ", events);
        const fetchEvents = async () => {
            try {
                const eventsRef = collection(db, "Events");
                const q = query(eventsRef);
                const querySnapshot = await getDocs(q);

                const eventsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                // sort from earliest to latest
                eventsData.sort((a, b) => a.date.toDate() - b.date.toDate())

                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
        };

        fetchEvents();
    }, [auth.id]);

    // get all event ids of the user
    useEffect(() => {
        const fetchUserEventIds = async () => {
            try {
                const userRef = doc(db, "Users", auth.id);
                const userDoc = await getDoc(userRef);

                const userData = userDoc.data();

                const bookedEvents = userData.booked_events || []
                const eventIds = bookedEvents.map(ref => ref.id);
                setUserEventIds(eventIds);

            } catch (error) {
                console.error("Error getting user events", error);
            }
        }
        fetchUserEventIds()

    }, [auth.id])

    return (
        <div>
            <NavigationBar />
            <div className='container d-flex flex-column justify-content-center align-items-center'>
                <h1 className='m-5'>Events</h1>
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        name={event.name}
                        date={event.date.toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        description={event.description}
                        maxCapacity={event.max_capacity}
                        ticketsSold={event.tickets_sold}
                        userEvents={userEventIds} />
                ))}
            </div>
        </div>
    )
}

export default Home