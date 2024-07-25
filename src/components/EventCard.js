import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function EventCard({ name, date, description, max_capacity }) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                {/* <Card.Text>{date}</Card.Text> */}
                <Card.Text>
                    {description}
                </Card.Text>
                <Card.Text>
                    Max Capacity: {max_capacity}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default EventCard;