import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // For demo, let's hardcode a userId to start a chat with
  // Ideally you’d fetch users list and select one dynamically
  const userToChatWith = "some-user-id-to-chat-with";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/chats');
        setChats(res.data);
      } catch (err) {
        console.error('Failed to fetch chats', err);
      }
    };

    fetchChats();
  }, []);

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const startNewChat = async () => {
    try {
      // Create a chat with current user and the other user
      const members = [user._id, userToChatWith];
      const res = await API.post('/chats', { members });
      // Add new chat to list
      setChats(prev => [...prev, res.data]);
      // Navigate to the new chat room immediately
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error('Failed to create chat', err);
    }
  };

  return (
    <div>
      <h2>Your Chats</h2>
      {chats.length === 0 && <p>No chats found. Start a new conversation!</p>}
      <button onClick={startNewChat}>Start New Chat</button>
      <ul>
        {chats.map(chat => (
          <li 
            key={chat._id} 
            style={{cursor: 'pointer', padding: '8px', borderBottom: '1px solid #ccc'}}
            onClick={() => openChat(chat._id)}
          >
            {chat.name || chat.members.filter(m => m._id !== user._id).map(m => m.username).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
