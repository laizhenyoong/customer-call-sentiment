import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { styled } from '@mui/system';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const ChatHeader = styled(Box)({
  padding: '1rem',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ccc',
});

const ChatMessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '1rem',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
});

const MessageItem = styled(ListItem)({
  marginBottom: '1rem',
});

const MessageContent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})(({ isAdmin }) => ({
  padding: '0.5rem 1rem',
  maxWidth: '70%',
  backgroundColor: isAdmin ? '#e3f2fd' : '#f5f5f5',
}));

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isAdmin',
})(({ isAdmin }) => ({
  backgroundColor: isAdmin ? '#1976d2' : '#ff9800',
}));

const ChatInput = styled(Box)({
  display: 'flex',
  padding: '1rem',
  borderTop: '1px solid #ccc',
});

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you today?",
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString(),
      sentiment: 'Neutral',
      sentimentScore: 0.5,
    },
    {
      text: "I'm having trouble with my account.",
      sender: 'customer',
      timestamp: new Date().toLocaleTimeString(),
      sentiment: 'Negative',
      sentimentScore: 0.3,
    },
    {
      text: "I'm sorry to hear that. Can you please provide more details about the issue you're experiencing?",
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString(),
      sentiment: 'Neutral',
      sentimentScore: 0.5,
    },
  ]);
  const [input, setInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prevDuration => prevDuration + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = {
      text: input,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString(),
      sentiment: 'Neutral',
      sentimentScore: 0.5,
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate customer response
    setTimeout(() => {
      const customerResponse = {
        text: "Thank you for your help. I'm still having issues accessing my account. It says my password is incorrect, but I'm sure I'm using the right one.",
        sender: 'customer',
        timestamp: new Date().toLocaleTimeString(),
        sentiment: 'Negative',
        sentimentScore: 0.3,
      };
      setMessages(prevMessages => [...prevMessages, customerResponse]);
    }, 1000);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Typography variant="h6">Customer Service Chat</Typography>
        <Typography variant="body2" key={callDuration}>Call Duration: {formatTime(callDuration)}</Typography>
      </ChatHeader>
      <ChatMessagesContainer>
        <List>
          {messages.map((message, index) => (
            <MessageItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <StyledAvatar isAdmin={message.sender === 'admin'}>{message.sender[0].toUpperCase()}</StyledAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <MessageContent elevation={1} isAdmin={message.sender === 'admin'}>
                    <Typography variant="body1">{message.text}</Typography>
                  </MessageContent>
                }
                secondary={
                  <Typography variant="caption" display="block">
                    {message.timestamp} - {message.sentiment} ({message.sentimentScore.toFixed(2)})
                  </Typography>
                }
              />
            </MessageItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </ChatMessagesContainer>
      <ChatInput component="form" onSubmit={handleSendMessage}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          size="small"
          sx={{ mr: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatBot;