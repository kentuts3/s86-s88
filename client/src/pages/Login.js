import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'notyf/notyf.min.css';
import AppNavbar from '../components/AppNavbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const notyf = new Notyf();
    const { setUser } = useContext(UserContext);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const authenticate = (e) => {
        e.preventDefault();

        fetch(`http://localhost:8000/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                notyf.success('Successful Login');
                navigate('/');
            } else if (data.message === 'Incorrect email or password') {
                notyf.error('Incorrect Credentials. Try Again');
            } else {
                notyf.error('User not Found. Try Again');
            }
        });
    };

    const retrieveUserDetails = (token) => {
        fetch('http://localhost:8000/users/details', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({ id: data._id, isAdmin: data.isAdmin });
        });
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        <>
        <AppNavbar/>
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={authenticate}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3" disabled={!isActive}>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Login;
