import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useAuth from '../hooks/useAuth';
import db from '../api/firebase'
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useState } from 'react';

function EventCard({ id, name, date, description, maxCapacity, ticketsSold }) {
    const [ticketsRemaining, setTicketsRemaining] = useState(maxCapacity - ticketsSold)

    const { auth } = useAuth;

    const handleGetTickets = async (event) => {
        try {
            const eventRef = doc(db, 'Events', id);
            // add 1 to tickets_sold on event

            await updateDoc(eventRef, {
                tickets_sold: increment(1)
            });

            setTicketsRemaining(ticketsRemaining - 1);
            console.log("Successfully incremented 'tickets_sold' field.");
        } catch (error) {
            console.error("Error incrementing 'tickets_sold' field:", error);
        }
    };

    return (
        <Card
            bg={'secondary'}
            style={{ width: '18rem' }}
            className="mb-4"
            text={'light'}
        >
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{date}</Card.Text>
                <Card.Text>{description}</Card.Text>
                <hr />
                <Card.Text>Max Capacity: {maxCapacity}</Card.Text>
                <Card.Text>Tickets Remaining: {ticketsRemaining}</Card.Text>
                {/* todo link to detail page */}
                <Button
                    onClick={handleGetTickets}
                    disabled={ticketsRemaining <= 0}
                    variant={ticketsRemaining > 0 ? "primary" : "danger"}
                >
                    {ticketsRemaining > 0 ? 'Get Tickets' : 'Sold Out'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EventCard;