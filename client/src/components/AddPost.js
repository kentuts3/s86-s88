import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const AddPost = () => {

    const notyf = new Notyf();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:8000/posts/addPost', {
                title,
                content,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if(response.data){
                notyf.success('Successfully posting');
                // Redirect to home or posts page
                navigate('/');
            }
             
        } catch (error) {
            setError(error.response?.data.message || 'Error creating post');
            console.error('Error creating post:', error);
        }
    };

    return (
        <Container>
            <h1 className="mt-4">Add New Post</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter post title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formContent" className="mt-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={5} 
                        placeholder="Enter post content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default AddPost;