import "./index.css";
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';  // Adjust import paths as needed
import { fetchUserPosts, fetchUserAnswers, deleteUser } from '../../../services/userService';  // Adjust import paths as needed

const UserProfile = ({ username, handleAnswer, handleQuestions }) => {
    const { user } = useUser();  // Access the user context to get the currently logged-in user
    const [posts, setPosts] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsRes = await fetchUserPosts(username);
                const answersRes = await fetchUserAnswers(username);

                if (!postsRes.success) {
                    throw new Error(postsRes.message || "Failed to fetch posts");
                }
                setPosts(postsRes.posts);

                if (!answersRes.success) {
                    throw new Error(answersRes.message || "Failed to fetch answers");
                }
                setAnswers(answersRes.answers);
            } catch (err) {
                setError(err.message);
            }
        };

        if (username) {
            fetchData();
        } else {
            setError("No username provided");
        }
    }, [username]);

    const handleDeleteUser = async () => {
        const result = await deleteUser(username);
        if (result.success) {
            handleQuestions();
            //alert('User deleted successfully');
            // Additional cleanup or redirection logic here
        } else {
            //alert(`Error deleting user: ${result.message}`);
        }
    };

    const sortPostsByDate = (posts) => {
        return posts.slice().sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
    }

    if (error) {
        return <div className="user-profile"><p className="error">{error}</p></div>;
    }

    return (
        <div className="user-profile">
            <h1>User Profile for {username}</h1>
            {user && user.username === "moderator" && (
                <button onClick={handleDeleteUser}>Delete User</button>
            )}
            <div>
                <h2>Posts</h2>
                <ul>
                    {sortPostsByDate(posts).map(post => (
                        <li key={post.id} onClick={() => handleAnswer(post.id)}>
                            <h3>{post.title}</h3>
                            <p>{post.text}</p>
                            <p>Asked: {new Date(post.ask_date_time).toLocaleString()}</p>
                            <p>Views: {post.views}</p>
                            <p>Tags: {post.tags.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Answers</h2>
                <ul>
                    {answers.map(answer => (
                        <li key={answer.answerId} onClick={() => handleAnswer(answer.questionId)}>
                            <h3>Question Title: {answer.questionTitle}</h3>
                            <p>Answer Text: {answer.text}</p>
                            <p>Answered: {new Date(answer.ans_date_time).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserProfile;
