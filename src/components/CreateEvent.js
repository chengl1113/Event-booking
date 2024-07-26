import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Alert } from 'react-bootstrap';

import NavigationBar from './navbar'

import db from "../api/firebase";
import { collection, addDoc } from 'firebase/firestore';

const CreateEvent = () => {

    const [validated, setValidated] = useState(false);

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(dayjs());
    const [eventDescription, setEventDescription] = useState('');
    const [eventCapacity, setEventCapacity] = useState(0);

    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        event.preventDefault();

        // add event to the database
        const newEvent = {
            name: eventName,
            date: eventDate.toDate(),
            description: eventDescription,
            max_capacity: eventCapacity,
            tickets_sold: 0
        };

        try {
            await addDoc(collection(db, "Events"), newEvent);
            console.log("Event added:", newEvent);
            setShowAlert(true);
        } catch (error) {
            console.error("Error adding event:", error)
        }

        console.log("eventName:", eventName);
        console.log("eventDate:", eventDate);
        console.log("eventDescription:", eventDescription);
        console.log("eventCapacity:", eventCapacity);

    };
    return (
        <div>

            <NavigationBar />
            <div className='container d-flex flex-column justify-content-center align-items-center'>
                <h1 className='m-5'>Create Event</h1>
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Event Added!</Alert.Heading>
                        <p>
                            You have successfully added your event.
                        </p>
                    </Alert>)
                }
                <Form noValidate validated={validated} onSubmit={handleSubmit} className='container d-flex flex-column justify-content-center align-items-left'>

                    {/* Event Name field  */}
                    <Form.Group as={Col} md="4" controlId="eventName">
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Event Name"
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    {/* Event Date Field */}
                    <Form.Group as={Col} md="4" controlId="eventDate">
                        <Form.Label>Event Date</Form.Label>
                        <br></br>
                        <DateTimePicker
                            value={eventDate}
                            onChange={(newValue) => setEventDate(newValue)}
                        />
                    </Form.Group>

                    {/* Event description field */}
                    <Form.Group as={Col} md="4" controlId="eventDescription">
                        <Form.Label>Description</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                as="textarea"
                                placeholder='Enter Description'
                                rows={3}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please add a description.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>


                    <Form.Group as={Col} md="4" controlId="maxCapacity">
                        <Form.Label>Max Capacity</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Capacity"
                            required
                            onChange={(e) => setEventCapacity(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a max capacity.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className='mt-4'>Submit form</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateEvent