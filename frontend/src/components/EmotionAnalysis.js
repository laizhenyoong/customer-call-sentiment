import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Tabs, Tab, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalysisContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
});

const ChartContainer = styled(Paper)({
  flex: '0 0 40%',
  margin: '0.5rem',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
});

const TabContainer = styled(Box)({
  flex: '1 1 60%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ChatContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ChatMessages = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '0.5rem',
  height: '300px', // Set a fixed height
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

const ChatMessage = styled(Box)({
  marginBottom: '0.5rem',
  padding: '0.5rem',
  borderRadius: '4px',
  backgroundColor: '#f0f0f0',
  '&.response': {
    backgroundColor: '#e6f3ff',
  },
});

// Custom hook for real-time updates
const useRealTimeUpdates = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const timer = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        score: Math.random().toFixed(2),
      };
      setData(prevData => [...prevData.slice(-9), newDataPoint]);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return data;
};

const EmotionAnalysis = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'question', text: 'How can I reset my password?' },
    { type: 'response', text: 'To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on "Forgot Password"\n3. Enter your email address\n4. Follow the instructions sent to your email' },
    { type: 'question', text: 'What are your business hours?' },
    { type: 'response', text: 'Our business hours are Monday to Friday, 9:00 AM to 5:00 PM EST. We are closed on weekends and major holidays.' },
  ]);
  const [tabValue, setTabValue] = useState(0);
  const [checklist, setChecklist] = useState([
    { text: 'Solve customer problem', checked: false },
    { text: 'Wish the customer well', checked: false },
    { text: 'Offer additional assistance', checked: false },
    { text: 'Summarize the conversation', checked: false },
  ]);

  const initialEmotionData = [
    { time: '0:00', score: 0.5 },
    { time: '0:05', score: 0.6 },
    { time: '0:10', score: 0.4 },
    { time: '0:15', score: 0.7 },
    { time: '0:20', score: 0.5 },
  ];

  const emotionData = useRealTimeUpdates(initialEmotionData);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newQuestion = { type: 'question', text: input };
    const newResponse = { type: 'response', text: 'This is a sample response. In a real application, this would be generated by the ChatGPT API.' };

    setChatHistory([...chatHistory, newQuestion, newResponse]);
    setInput('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChecklistToggle = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };

  return (
    <AnalysisContainer>
      <ChartContainer elevation={3}>
        <Typography variant="h6" gutterBottom>
          Sentiment Line Chart 
        </Typography>
        <Box style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <LineChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </ChartContainer>
      <TabContainer>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="ChatGPT Agent" />
          <Tab label="Topic Checklist" />
        </Tabs>
        {tabValue === 0 && (
          <ChatContainer>
            <ChatMessages>
              {chatHistory.map((message, index) => (
                <ChatMessage key={index} className={message.type}>
                  <Typography variant="body2">
                    <strong>{message.type === 'question' ? 'Question:' : 'Response:'}</strong> {message.text}
                  </Typography>
                </ChatMessage>
              ))}
              <div ref={chatEndRef} />
            </ChatMessages>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', padding: '0.5rem' }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your question..."
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Send
              </Button>
            </Box>
          </ChatContainer>
        )}
        {tabValue === 1 && (
          <List sx={{ overflowY: 'auto', flex: 1 }}>
            {checklist.map((item, index) => (
              <ListItem key={index} dense button onClick={() => handleChecklistToggle(index)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.checked}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        )}
      </TabContainer>
    </AnalysisContainer>
  );
};

export default EmotionAnalysis;