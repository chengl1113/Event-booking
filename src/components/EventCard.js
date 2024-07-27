import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import useAuth from '../hooks/useAuth';
import db from '../api/firebase'
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { useState } from 'react';

function EventCard({ id, name, date, description, maxCapacity, ticketsSold, userEvents }) {
    const [ticketsRemaining, setTicketsRemaining] = useState(maxCapacity - ticketsSold);
    const soldOut = ticketsRemaining <= 0;
    const [userHasTickets, setUserHasTickets] = useState(userEvents.includes(id));
    const { auth } = useAuth();

    const [showToast, setShowToast] = useState(false)

    console.log(name);
    console.log(userHasTickets);

    const handleGetTickets = async (event) => {
        // add 1 to tickets_sold on event
        try {
            const eventRef = doc(db, 'Events', id);

            await updateDoc(eventRef, {
                tickets_sold: increment(1)
            });

            const userRef = doc(db, 'Users', auth.id);

            await updateDoc(userRef, {
                booked_events: arrayUnion(eventRef)
            })

            setTicketsRemaining(ticketsRemaining - 1);
            setUserHasTickets(true);
            setShowToast(true);
        } catch (error) {
            console.error("Error incrementing 'tickets_sold' field:", error);
        }
    };

    return (
        <>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                bg='success'
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    zIndex: 1050, // Bootstrap's default z-index for toasts
                }}>
                <Toast.Header>
                    <strong className="me-auto">Event-Booking</strong>
                </Toast.Header>
                <Toast.Body style={{ color: 'white' }}>Congrats! You got tickets to {name}!</Toast.Body>
            </Toast>
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
                    <Button
                        onClick={handleGetTickets}
                        disabled={userHasTickets || soldOut}
                        variant={userHasTickets ? 'success' : soldOut ? 'danger' : 'primary'}
                    >
                        {userHasTickets ? 'You Got\'Em!' : soldOut ? 'Sold Out' : 'Get Tickets'}
                    </Button>
                </Card.Body>
            </Card>
        </>

    );
}

export default EventCard;