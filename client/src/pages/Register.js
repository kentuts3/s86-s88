import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import AppNavbar from '../components/AppNavbar';

const Register = () => {
    const navigate = useNavigate();
    const notyf = new Notyf();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isActive, setIsActive] = useState(false);

    const registerUser = (e) => {
        e.preventDefault();

        fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered successfully") {
                setUsername('');
                setEmail('');
                setPassword('');
                notyf.success("Registration successful");
                navigate('/login');
            } else {
                notyf.error("Something went wrong.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            notyf.error("Server error. Please try again.");
        });
    };

    useEffect(() => {
        setIsActive(username !== "" && email !== "" && password !== "");
    }, [username, email, password]);

    return (
        <>
        <AppNavbar/>
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h1 className="text-center mb-4">Register</h1>
                    <Form onSubmit={registerUser}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Username" 
                                required 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter Email" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter Password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            id="submitBtn" 
                            className="mt-3" 
                            disabled={!isActive}
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Register;
