import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={3} className="bg-light sidebar">
                    <h2 className="text-center">Admin AdminDashboard</h2>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/">Manage Posts</Nav.Link>
                    </Nav>
                </Col>
                <Col md={9}>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;