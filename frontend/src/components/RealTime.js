import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ChatBot from './ChatBot';
import EmotionAnalysis from './EmotionAnalysis';
import { checkTopics, generateCustomerResponse } from '../api';
import { useRealTimeUpdates, formatTime } from '../utils/hooks';

const RealTime = () => {

  // Conversations variable
  const [messages, setMessages] = useState([]);
  // User Input variable
  const [input, setInput] = useState('');
  // Call Duration variable
  const [callDuration, setCallDuration] = useState(0);
  // Topic Checklist variable
  const [checklist, setChecklist] = useState([
    { text: 'Wish the customer well', checked: false },
    { text: 'Identify Customer Needs', checked: false },
    { text: 'Empathize with Customer Concerns', checked: false },
    { text: 'Solve customer problem', checked: false },
    { text: 'Express Gratitude', checked: false },
    { text: 'Summarize the conversation', checked: false },
  ]);
  // List of Checklist items
  const checklistTopics = checklist
    .map((item, index) => `${index + 1}. ${item.text}`)
    .join('\n');
  // Sentiment Score Data variable
  const initialEmotionData = [
    { time: '0:00', score: 0.5 },
    { time: '0:05', score: 0.6 },
    { time: '0:10', score: 0.4 },
    { time: '0:15', score: 0.7 },
    { time: '0:20', score: 0.5 },
  ];

  const emotionData = useRealTimeUpdates(initialEmotionData);

  // Function to handle checklist toggle
  const handleChecklistToggle = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };

  // UseEffect to render current time interval 
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prevDuration => prevDuration + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to handle send messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // 1) Check for admin sentiment

    const newMessage = {
      text: input,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString(),
      sentiment: 'Neutral',
      sentimentScore: 0.5,
    };

    setMessages([...messages, newMessage]);

    setInput('');

    // 2) Tick checklist if topic was discussed by admin
    try {
      const data = await checkTopics(input, checklistTopics);

      let responseString = data.aiResponse; // e.g., "1,2,4"

      // Convert the string into an array of numbers
      // Also, adjust for 0-based index
      let mentionedTopics = responseString.split(',').map(num => Number(num) - 1); // [0, 1, 3]

      // Update the checklist state 
      setChecklist(prevChecklist =>
        prevChecklist.map((topic, index) => ({
          ...topic,
          checked: topic.checked || mentionedTopics.includes(index) // Keep it true if already true
        }))
      );

    } catch (error) {
      console.error('Error checking topics:', error);
    }

    // 3) Check for customer sentiment

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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, borderRight: '1px solid #ccc' }}>
        {/* Correct prop passing */}
        <ChatBot
          messages={messages}
          handleSendMessage={handleSendMessage}
          input={input}
          setInput={setInput}
          callDuration={callDuration}
          formatTime={formatTime}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <EmotionAnalysis
          checklist={checklist}
          emotionData={emotionData}
        />
      </Box>
    </Box>
  );
};

export default RealTime;
