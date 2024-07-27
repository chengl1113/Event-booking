import { useRef, useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';
import db from "./api/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link, useNavigate, useLocation } from 'react-router-dom';



const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const emailRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [credentialsInvalid, setCredentialsInvalid] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Put focus on email input
    useEffect(() => {
        emailRef.current.focus();
    }, [])

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            // Check database if email and password exists
            const usersRef = collection(db, "Users");
            const q = query(
                usersRef,
                where("email", "==", email),
                where("password", "==", password));

            const querySnapshot = await getDocs(q);

            // Credentials match
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data()
                    setAuth({
                        id: doc.id,
                        email: userData.email,
                        name: userData.name,
                        isAdmin: userData.admin
                    })

                });
                setValidated(true);
                setShowAlert(false);

                navigate(from, { replace: true });
            } else {
                // Credentails fail 
                setCredentialsInvalid(true);
                setValidated(false);
                setShowAlert(true);
            }
        }
    };




    return (

        <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Incorrect login details!</Alert.Heading>
                    <p>
                        The email or password you entered is incorrect.
                    </p>
                </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-50">
                <h1>Sign In</h1>
                {/* email input */}
                <Form.Group className="mb-3" controlId="validationEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        ref={emailRef}
                        required
                        type="email"
                        placeholder="Enter email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        isInvalid={credentialsInvalid}
                        aria-describedby="uidnote"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
                </Form.Group>

                {/* password input */}
                <Form.Group className="mb-3" controlId="validationPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        isInvalid={credentialsInvalid}
                        aria-describedby="uidnote"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className='w-100 mb-3'>Sign In</Button>
                <p className='primary mb-3'>Need an Account?</p>
                <Link to="/register" className='btn btn-secondary'>Sign Up</Link>
            </Form>


        </div>
    )
}

export default Login