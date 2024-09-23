const fetchComments = async () => {
    const response = await axios.get('http://localhost:8000/posts/getPosts');
    setComments(response.data.comments);
};