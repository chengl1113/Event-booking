import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function EventCard({ name, date, description, max_capacity, tickets_sold }) {
    const tickets_remaining = max_capacity - tickets_sold;

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
                <Card.Text>Max Capacity: {max_capacity}</Card.Text>
                <Card.Text>Tickets Remaining: {tickets_remaining}</Card.Text>
                {/* todo link to detail page */}
                <Button
                    disabled={tickets_remaining <= 0}
                    variant={tickets_remaining > 0 ? "primary" : "danger"}
                >
                    {tickets_remaining > 0 ? 'Get Tickets' : 'Sold Out'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EventCard;