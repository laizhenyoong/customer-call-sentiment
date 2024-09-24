import React from 'react';
import { Box } from '@mui/material';
import ChatBot from './ChatBot';
import EmotionAnalysis from './EmotionAnalysis';

const RealTime = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <ChatBot />
      </Box>
      <Box sx={{ flex: 1 }}>
        <EmotionAnalysis />
      </Box>
    </Box>
  );
};

export default RealTime;