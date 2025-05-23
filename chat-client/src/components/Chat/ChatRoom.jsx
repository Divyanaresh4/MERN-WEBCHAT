import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // change if different

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    // Join this chat room
    socketRef.current.emit('joinRoom', chatId);

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    // Fetch existing messages from backend
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chats/${chatId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      chatId,
      sender: user._id,
      username: user.username,
      text: input.trim(),
      createdAt: new Date(),
    };

    socketRef.current.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div
        style={{
          height: '400px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === user._id ? 'right' : 'left',
              margin: '5px 0',
            }}
          >
            <b>{msg.username}</b>: {msg.text || msg.message}
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
