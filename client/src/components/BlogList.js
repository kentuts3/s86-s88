import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import DeletePost from './DeletePost';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import AppNavbar from './AppNavbar';
import App from '../App';

const BlogList = () => {

    const notyf = new Notyf();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            setLoading(true);

            try {
                const response = await axios.get('http://localhost:8000/posts/getPosts', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs({
            ...commentInputs,
            [postId]: value,
        });
    };

    const handleCommentSubmit = async (postId) => {
        const comment = commentInputs[postId]?.trim(); // Trim to remove whitespace
        if (!comment) {
            return; // Don't submit if the comment is empty
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/posts/addComment/${postId}`, { content: comment }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Clear the input after submission
            setCommentInputs({
                ...commentInputs,
                [postId]: '',
            });

            console.log('Comment submitted:', response.data);
            // Optionally, fetch posts again if needed
            const postsResponse = await axios.get('http://localhost:8000/posts/getPosts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setPosts(postsResponse.data.posts);
            notyf.success('Success')
        } catch (error) {
            console.error('Error submitting comment:', error.response?.data || error.message);
        }
    };

    return (
        <>
        <AppNavbar/>
        <Container className='text-center'>
            <h1 className='mb-4'>Blog Posts</h1>
            <div className="d-flex justify-content-end mb-3">
                <Link to="/addPost">
                    <Button variant="primary">Add Post</Button>
                </Link>
            </div>
            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length > 0 ? (
                <Row className='justify-content-center'>
                    {posts.map(post => (
                        <Col xs={12} md={12} lg={12} key={post._id} className='mb-4'>
                            <Card className='h-100'>
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Subtitle className='mb-2 text-muted'>Author: {post.author.username}</Card.Subtitle>
                                    <Card.Text>{post.content}</Card.Text>
                                    <Link to={`/posts/${post._id}`} className='text-muted'>Read Comments</Link>
                                    <Form className='mt-3'>
                                        <Form.Group controlId={`comment-${post._id}`}>
                                            <Form.Control
                                                type='text'
                                                placeholder='Add a comment...'
                                                value={commentInputs[post._id] || ''}
                                                onChange={event => handleCommentChange(post._id, event.target.value)} // Update with event target value
                                            />
                                        </Form.Group>
                                        <Form.Group className='text-end my-1'>
                                            <DeletePost 
                                                postId={post._id} 
                                                onDelete={handleDeletePost} 
                                                postAuthorId={post.author._id} // Pass post author ID
                                            />
                                        </Form.Group>
                                        <Button
                                            className='my-2'
                                            variant='success'
                                            onClick={() => handleCommentSubmit(post._id)}
                                            disabled={!commentInputs[post._id]?.trim()} // Disable if the input is empty
                                        >
                                            Comment
                                        </Button>
                            
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No posts available.</p>
            )}
        </Container>
        </>
    );
};

export default BlogList;