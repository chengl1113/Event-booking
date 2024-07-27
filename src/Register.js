import React, { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import db from "./api/firebase";
import { Link } from 'react-router-dom';


const Register = () => {
    const userRef = useRef();

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [isAdmin, setIsAdmin] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [validated, setValidated] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    // Handle submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false || pwd !== matchPwd) {
            event.stopPropagation();

            // Check if passwords match
            if (pwd !== matchPwd) {
                setPasswordMatch(false);
            } else {
                setPasswordMatch(true);
            }
        } else {

            // Check if email is being used already
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setShowAlert(true);
                setInvalidEmail(true);
                setValidated(false);
            } else {
                try {
                    await addDoc(collection(db, "Users"), {
                        name: user,
                        email: email,
                        password: pwd,
                        admin: isAdmin,
                        booked_events: []
                    });
                    setSuccess(true);
                    setShowAlert(false);
                    setValidated(true);

                } catch (error) {
                    console.error("Error adding document: ", error);
                }
            }
        }
    };

    return (
        <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Email already in use!</Alert.Heading>
                    <p>
                        The email you entered is already associated with an account. Please use a different email or log in.
                    </p>
                </Alert>
            )}
            {success ? (
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 className='mb-3'>Registration Success!</h1>
                    <Link to="/login" className='btn btn-secondary'>Sign In</Link>
                </div>
            ) : (
                <div className="container d-flex justify-content-center align-items-center">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-50">
                        <h1>Register</h1>

                        {/* full name input */}
                        <Form.Group className="mb-3" controlId="validationFullName">
                            <Form.Label>Full name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter full name"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                aria-describedby="uidnote"
                            />
                            <Form.Control.Feedback type="invalid">Please fill in your full name.</Form.Control.Feedback>
                        </Form.Group>

                        {/* email input */}
                        <Form.Group className="mb-3" controlId="validationEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                isInvalid={invalidEmail}
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
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                aria-describedby="uidnote"
                            />
                            <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
                        </Form.Group>

                        {/* second password input */}
                        <Form.Group className="mb-3" controlId="validationMatchPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Confirm Password"
                                autoComplete="off"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                isInvalid={!passwordMatch}
                            />
                            <Form.Control.Feedback type="invalid">The passwords need to match.</Form.Control.Feedback>
                        </Form.Group>

                        {/* create admin account button  */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                label="Create Admin Account"
                                onChange={() => {
                                    setIsAdmin(!isAdmin)
                                }}
                            />
                        </Form.Group>

                        <Button type="submit" className='w-100 mb-3'>Sign Up</Button>
                        <p className='primary mb-3'>Already registered?</p>
                        <Link to="/login" className='btn btn-secondary'>Sign In</Link>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default Register;
