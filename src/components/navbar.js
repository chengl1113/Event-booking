import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NavigationBar = () => {
    const { auth } = useAuth();

    return (
        <Navbar expand="lg" className="bg-body-tertiary" sticky='top'>
            <Container>
                <Navbar.Brand>Event Booking</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/myevents">My Events</Nav.Link>
                        {auth.isAdmin && (<Nav.Link as={Link} to="/createevent">Create Event</Nav.Link>)}
                        <Nav.Link as={Link} to="/account">Account</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
