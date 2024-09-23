import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';
import DeleteComment from './DeleteComment';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:8000/posts/getPostWithComments/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setPost(response.data.post);
            } catch (error) {
                setError('Post not found or error fetching post.');
                console.error('Error fetching post:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleDeleteComment = (commentId) => {
        setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.filter((comment) => comment._id !== commentId),
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container className='text-center'>
            <h1 className='mb-4'>{post.title}</h1>
            <h6 className='mb-2 text-muted'>Username: {post.author.username}</h6>
            <Card className='mb-4'>
                <Card.Body>
                    <Card.Text>{post.content}</Card.Text>
                </Card.Body>
            </Card>

            <h5 className='mt-4'>Comments:</h5>
            {post.comments.length > 0 ? (
                post.comments.map(comment => (
                    <Card key={comment._id} className='mb-2'>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{comment.author.username}</strong>: {comment.content}
                            </div>
                            <DeleteComment 
                                postId={post._id} 
                                commentId={comment._id} 
                                onDelete={handleDeleteComment} 
                            />
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No comments yet.</p>
            )}

            <Link to='/' className='btn btn-secondary mt-3'>Posts</Link>
        </Container>
    );
};

export default PostDetail;
