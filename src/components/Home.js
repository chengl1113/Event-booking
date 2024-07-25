import React, { useState, useEffect } from 'react';
import NavigationBar from './navbar';
import EventCard from './EventCard';
import db from '../api/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore';


const Home = () => {
    const [events, setEvents] = useState([]);

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
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
        };

        fetchEvents();
    }, []);

    events.map((event) => (
        console.log(event.date)
    ))



    return (
        <div>
            <NavigationBar />
            <h1 className='m-5'>Events</h1>
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    name={event.name}
                    date={event.date.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    description={event.description}
                    max_capacity={event.max_capacity} />
            ))}
        </div>
    )
}

export default Home