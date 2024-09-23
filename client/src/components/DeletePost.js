import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const DeletePost = ({ postId, postOwnerId, onDelete }) => {

    const notyf = new Notyf();
    const [show, setShow] = useState(false);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`http://localhost:8000/posts/deletePost/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            
            notyf.success('Successfully deleted post')
            onDelete(postId);
        
            console.log(response.data.message);
             // Call the onDelete function passed as a prop
        } catch (error) {
            console.error('Error deleting post:', error.response?.data || error.message);
            if(error.response) {
                if(error.response.status === 403) {
                    notyf.error('Unauthorized')
                } else {
                    notyf.error('An error occured while deleting post.')
                }
            } else {
                notyf.error('Network error. Please try again.')
            }
        } finally {
            setShow(false); // Close the modal after attempting to delete
        }
    };

    return (
        <>
            <Button variant="danger" onClick={() => setShow(true)}>
                Delete Post
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeletePost;