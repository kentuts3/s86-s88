const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User')


const auth = require('../auth');
const { errorHandler } = auth;

module.exports.addPost = async (req, res) => {
    try {
        const authorId = req.user.id; // Get the author's user ID from the request
        const author = await User.findById(authorId).select('username'); // Fetch the author's username

        if (!author) {
            return res.status(400).send({ message: 'Author not found' });
        }

        let newPost = {
            title: req.body.title,
            content: req.body.content,
            author: authorId // Store the author ID
        };

        newPost._id = new mongoose.Types.ObjectId();

        const post = new Post(newPost);
        const savedPost = await post.save(); // Save the post

        res.status(201).send({
            post: {
                ...savedPost.toObject(),
                username: author.username // Include the author's username
            }
        });
    } catch (error) {
        errorHandler(res, error, 'Failed to add post');
    }
};

module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username'); // Populate author with username

        if (posts.length === 0) {
            return res.status(404).json({
                message: 'No posts found.'
            });
        }

        res.status(200).json({
            posts: posts
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch posts',
            error: error.message // Return a more user-friendly error message
        });
    }
};

module.exports.getPost = (req, res) => {
    const { id } = req.params;  // Get the post ID from the URL parameters

    Post.findById(id)
        .populate('author', 'username')  // Optionally populate author details
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: 'No post found.'
                });
            }

            res.status(200).json({
                post: post
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Error retrieving the post',
                error: err.message
            });
        });
};

module.exports.updatePost = (req, res) => {
    const { id } = req.params;  // Post ID from the URL
    const updateData = req.body; // Data to update from the request body
    const userId = req.user.id;  // Authenticated user's ID (assumed from verify middleware)

    // Check if there is any data to update
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            message: 'No update data provided'
        });
    }

    // Find the post and check if the authenticated user is the author
    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found.'
                });
            }

            // Check if the post's author matches the authenticated user's ID
            if (post.author.toString() !== userId) {
                return res.status(403).json({
                    message: 'Unauthorized: You can only update your own posts.'
                });
            }

            // Proceed to update the post
            Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                .then(updatedPost => {
                    res.status(200).json({
                        message: 'Post updated successfully',
                        updatedPost: updatedPost
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Failed to update post',
                        error: error.message
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving post',
                error: error.message
            });
        });
};

module.exports.deletePost = (req, res) => {
    const { id } = req.params;  // Post ID from the URL
    const userId = req.user.id; // Authenticated user's ID from verify middleware
    const isAdmin = req.user.isAdmin; // Assuming isAdmin is set in the token/user object

    // Finding the post by ID
    Post.findById(id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found.' });
            }

            // If the user is not an admin, check if they are the author
            if (!isAdmin && post.author.toString() !== userId) {
                return res.status(403).json({
                    message: `Unauthorized`
                });
            }

            // Proceed to delete the post
            Post.findByIdAndDelete(id)
                .then(deletedPost => {
                    res.status(200).json({
                        message: 'Successfully deleted post.',
                        post: deletedPost
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Failed to delete post.',
                        error: error.message
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving post.',
                error: error.message
            });
        });
};

module.exports.addComment = (req, res) => {
    const { postId } = req.params; // Extract the post ID from the request parameters
    const { content } = req.body;   // Get the comment content from the request body
    const userId = req.user.id;     // Assume user is authenticated, extract their ID from req.user

    // Validate that content is provided
    if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    // Find the post to ensure it exists
    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found.' });
            }

            // Create the new comment
            const newComment = new Comment({
                postId,
                author: userId,
                content
            });

            // Save the comment and associate it with the post
            return newComment.save()
                .then(comment => {
                    // Push the comment ID to the post's comments array
                    post.comments.push(comment._id);
                    return post.save(); // Save the updated post
                })
                .then(() => {
                    // Populate the post's comments array with author details
                    return Post.findById(postId).populate({
                        path: 'comments',
                        populate: {
                            path: 'author',  // Populate author details
                            select: 'username' // Optional: only return username
                        }
                    });
                })
                .then(updatedPost => {
                    res.status(201).json({
                        message: 'Comment added successfully',
                        post: updatedPost
                    });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to add comment.', error: error.message });
        });
};

module.exports.getPostWithComments = (req, res) => {
    const { postId } = req.params;

    Post.findById(postId)
        .populate({
            path: 'comments',
            populate: {
                path: 'author', // Populate the author of each comment
                select: 'username' // Only return the username
            }
        })
        .populate('author', 'username') // Also populate the post's author
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json({ post });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Failed to retrieve post with comments',
                error: error.message
            });
        });
};

module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.user.id; // Use 'id' instead of '_id'

    // Log the user for debugging
    console.log('User from request:', req.user);

    try {
        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Log the comment for debugging
        console.log('Comment found:', comment);
        console.log('User ID:', userId);
        console.log('Comment Author ID:', comment.author.toString());

        // Check if userId and comment.author are defined
        if (!userId || !comment.author) {
            return res.status(400).json({ message: 'User ID or comment author is not defined' });
        }

        // Check if the user is the owner or an admin
        if (comment.author.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Action Forbidden' });
        }

        // Proceed to delete the comment
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};