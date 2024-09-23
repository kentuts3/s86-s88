import React from 'react';
import axios from 'axios';
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const DeleteComment = ({ postId, commentId, onDelete }) => {

    const notyf = new Notyf();
    const [show, setShow] = useState(false);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:8000/posts/${postId}/deleteComment/${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Call the onDelete callback to update the UI after deletion
            onDelete(commentId);
            notyf.success('Deleted success')
        } catch (error) {
            console.error('Error deleting comment:', error.response?.data || error.message);
            notyf.error('Failed to delete comment. Please try again.');
        }
    };

    return (
        <>
            <Button variant="danger" onClick={() => setShow(true)}>
                Delete
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

export default DeleteComment;