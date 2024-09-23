import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateEditPost = () => {
    const { id } = useParams(); // for editing
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            // Fetch existing post details for editing
            const fetchPost = async () => {
                const response = await axios.get(`http://localhost:8000/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            };
            fetchPost();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            // Update existing post
            await axios.put(`http://localhost:8000/posts/update/${id}`, { title, content });
        } else {
            // Create new post
            await axios.post('http://localhost:8000/posts/create', { title, content });
        }
        navigate('/admin/posts');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" value={content} onChange={e => setContent(e.target.value)} required />
            </Form.Group>
            <Button type="submit">{id ? 'Update' : 'Create'} Post</Button>
        </Form>
    );
};

export default CreateEditPost;