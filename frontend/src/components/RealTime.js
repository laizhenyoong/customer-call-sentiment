import React, { useState, useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBot from './ChatBot';
import EmotionAnalysis from './EmotionAnalysis';
import FloatingCustomerChat from './FloatingCustomerChat';
import { checkTopics, getAdminSentiment, getCustomerSentiment } from '../utils/api';
import { useRealTimeUpdates, formatTime } from '../utils/hooks';

const RealTime = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [checklist, setChecklist] = useState([
    { text: 'Wish the customer well', checked: false },
    { text: 'Identify Customer Needs', checked: false },
    { text: 'Empathize with Customer Concerns', checked: false },
    { text: 'Solve customer problem', checked: false },
    { text: 'Express Gratitude', checked: false },
    { text: 'Summarize the conversation', checked: false },
  ]);

  const checklistTopics = checklist
    .map((item, index) => `${index + 1}. ${item.text}`)
    .join('\n');

  const[emotionData, setEmotionData] = useState([
    // { time: new Date().toLocaleTimeString(), score: 0.3  },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prevDuration => prevDuration + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (text, sender) => {
    if (text.trim() === '') return;

    // 1 Check if customer message or admin message using sender - done

    if (sender === 'customer') {
      const data = await getCustomerSentiment(text); // 2 If the sender is customer then use getCustomerSentiment - done
      let customer_sentiment = data.customer_sentiment;
      let customer_sentiment_score = data.customer_sentiment_score
      
      const newMessage = {
        text,
        sender,
        timestamp: new Date().toLocaleTimeString(),
        sentiment: customer_sentiment, 
        sentimentScore: customer_sentiment_score,
      };
  
      setMessages([...messages, newMessage]);

      // 3 Insert the time and sentiment score into initialEmotionData - done

      setEmotionData(prevData => [
        ...prevData,
        { time: new Date().toLocaleTimeString(), score: customer_sentiment_score }
      ]);
    
    } 

    // 4 use callDuration and get mins and score from api call like { time: '0:00', score: 0.5 } - ??

    if (sender === 'admin') {
      setInput('');
      try {
        const data = await checkTopics(text, checklistTopics);
        let responseString = data.aiResponse;
        let mentionedTopics = responseString.split(',').map(num => Number(num) - 1);

        setChecklist(prevChecklist =>
          prevChecklist.map((topic, index) => ({
            ...topic,
            checked: topic.checked || mentionedTopics.includes(index)
          }))
        );
      } catch (error) {
        console.error('Error checking topics:', error);
      }
      
      const data = await getAdminSentiment(text); // 5 If the sender is admin then use getAdminSentiment - done
      let admin_sentiment_score = data.admin_sentiment_score
        
      const newMessage = {
        text,
        sender,
        timestamp: new Date().toLocaleTimeString(),
        sentiment: "", 
        sentimentScore: admin_sentiment_score,
      };
  
      setMessages([...messages, newMessage]);

    } 
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <ChatBot
          messages={messages}
          handleSendMessage={(e) => {
            e.preventDefault();
            handleSendMessage(input, 'admin');
          }}
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
      {isChatOpen ? (
        <FloatingCustomerChat 
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={() => setIsChatOpen(false)}
        />
      ) : (
        <Fab
          color="secondary"
          aria-label="chat"
          style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2rem',
          }}
          onClick={() => setIsChatOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
};

export default RealTime;
