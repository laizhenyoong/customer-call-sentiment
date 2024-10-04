import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import ChatBot from './ChatBot';
import EmotionAnalysis from './EmotionAnalysis';

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

  // Function to handle checklist toggel
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

  // Function to format time correctly
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

    // 2) Tick checklist if topic was discussed by admin
    try {
      const response = await fetch('http://localhost:5000/checkTopics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, topics: checklistTopics }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

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
      console.error('Error fetching data:', error);
    }

    setInput('');

    // 3) Generate customer AI response
    try {

      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      let responseString = data.aiResponse;

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // 4) Check for customer sentiment

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
