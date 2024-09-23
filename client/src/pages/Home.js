import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch blog posts from the API
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">My Blog</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5">
                <Row>
                    <Col md={8}>
                        <h2>Latest Posts</h2>
                        <Row>
                            {posts.map(post => (
                                <Col key={post._id} md={6} className="mb-4">
                                    <Card>
                                        <Card.Img variant="top" src={post.image || 'placeholder.jpg'} />
                                        <Card.Body>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text>{post.excerpt}</Card.Text>
                                            <Button as={Link} to={`/posts/${post._id}`} variant="primary">Read More</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    <Col md={4}>
                        <h3>Categories</h3>
                        {/* Example categories list */}
                        <ul>
                            <li><Link to="/category/technology">Technology</Link></li>
                            <li><Link to="/category/lifestyle">Lifestyle</Link></li>
                            <li><Link to="/category/travel">Travel</Link></li>
                        </ul>

                        <h3>Recent Posts</h3>
                        <ul>
                            {posts.slice(0, 5).map(post => (
                                <li key={post._id}>
                                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>

            <footer className="text-center py-4">
                <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Home;