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
                // console.log("home events: ", events);
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
        };

        fetchEvents();

    }, []);

    // get all event ids of the user
    useEffect(() => {
        console.log("Home mounted");

        const fetchUserEventIds = async () => {
            try {
                const userRef = doc(db, "Users", auth.id);
                const userDoc = await getDoc(userRef);

                const userData = userDoc.data();

                const bookedEvents = userData.booked_events || []
                const eventIds = bookedEvents.map(ref => ref.id);
                setUserEventIds(eventIds);
                console.log("home userEventIds", userEventIds);

            } catch (error) {
                console.error("Error getting user events", error);
            }
        }
        fetchUserEventIds()


        return () => {
            console.log("Home Unmount");
        };

    }, [])

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