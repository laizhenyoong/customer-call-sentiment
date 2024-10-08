import React, { useEffect, useRef } from 'react';
import { Stack, Box, Typography, TextField, Button, Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { saveAs } from 'file-saver'; // Import saveAs from 'file-saver'

const ChatBot = ({ messages, handleSendMessage, input, setInput, callDuration, formatTime }) => {

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Function to handle End Chat and save data as JSON
  const handleEndChat = () => {
    const chatData = {
      messages,
      callDuration: formatTime(callDuration),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    saveAs(blob, `chat-data-${new Date().toLocaleDateString()}.txt`);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="column">
            <Typography variant="h6">Customer Service Chat</Typography>
            <Typography variant="body2" key={callDuration}>Call Duration: {formatTime(callDuration)}</Typography>
          </Stack>

          <Button variant="contained" color="primary" sx={{ minWidth: '120px' }} onClick={handleEndChat}>
            Analyse
          </Button>

        </Stack>
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

export default ChatBot;