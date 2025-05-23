import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
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

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await API.post(`/messages`, { chatId, text });
      setMessages([...messages, res.data]);
      setText('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.sender?.username || 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
