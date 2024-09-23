const fetchPosts = async () => {
    const response = await axios.get('http://localhost:8000/posts/getPosts');
    setPosts(response.data.posts);
};