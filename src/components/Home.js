import React, { useState, useEffect } from 'react';
import NavigationBar from './navbar';
import EventCard from './EventCard';
import db from '../api/firebase'
import { collection, getDocs, query, doc, getDoc, } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';


const Home = () => {
    const { auth } = useAuth();

    const [events, setEvents] = useState([]);
    const [userEvents, setUserEvents] = useState([])

    // get all events
    useEffect(() => {
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
    }, []);

    // get all events of the user
    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                const userRef = doc(db, "Users", auth.id);
                const userDoc = await getDoc(userRef);

                const userData = userDoc.data();

                const bookedEvents = userData.booked_events || []
                const eventIds = bookedEvents.map(ref => ref.id);
                setUserEvents(eventIds);
                console.log('booked events: ', eventIds);

            } catch (error) {
                console.log("Error getting user events", error);
            }
        }
        fetchUserEvents()

    }, [])


    events.map((event) => (
        console.log(event.date)
    ))



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
                        userEvents={userEvents} />
                ))}
            </div>
        </div>
    )
}

export default Home