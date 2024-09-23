const handleDelete = async (postId) => {
    await axios.delete(`http://localhost:8000/posts/delete/${postId}`);
    setPosts(posts.filter(post => post._id !== postId));
};