import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Grid, List, ListItem, ListItemText, CircularProgress, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AIInsightItem = ({ name, score }) => {
  const getColor = (score) => {
    if (score > 80) return 'success';
    if (score > 40) return 'warning';
    return 'error';
  };

  return (
    <ListItem>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">{name}</Typography>
          <Typography variant="body2" color="text.secondary">{score}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={score}
          color={getColor(score)}
          sx={{ height: 8, borderRadius: 5 }}
        />
      </Box>
    </ListItem>
  );
};

const PostCall = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual data in a real implementation
  const csatScore = 85;
  const conversationResult = "Upgraded package";
  const overallSentiment = "Positive";
  const timeTaken = "15:30";
  const overallPerformance = 88;

  const aiInsights = [
    { name: "Introduction", score: 90 },
    { name: "Recommendations from agents", score: 80 },
    { name: "Thank you message", score: 70 },
    { name: "Topics discussed", score: 20 },
    { name: "Attitude", score: 85 },
    { name: "Communication skills", score: 85 },
  ];

  const topicsDiscussed = [
    { name: "Billing", value: 40 },
    { name: "Technical Support", value: 30 },
    { name: "Upgrades", value: 20 },
    { name: "General Inquiries", value: 10 },
  ];

  const timeDistribution = [
    { name: "Agent", time: 500 },
    { name: "Customer", time: 300 },
    { name: "Not Talking", time: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getHeartColor = (score) => {
    if (score > 80) return 'green';
    if (score > 40) return 'yellow';
    return 'red';
  };

  const getPerformanceColor = (score) => {
    if (score > 80) return 'green';
    if (score > 40) return 'yellow';
    return 'red';
  };

  return (
    <Box sx={{ padding: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>Post-Call Analysis</Typography>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2, height: 'calc(33% - 8px)' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overall Summary" />
              <Tab label="Agent Summary" />
              <Tab label="Customer Summary" />
            </Tabs>
            <Box sx={{ mt: 2, overflow: 'auto', maxHeight: 'calc(100% - 48px)' }}>
              {tabValue === 0 && <Typography>The agent addressed the customer's service outage, provided troubleshooting, and escalated the issue for further investigation. The customer was informed of the next steps and offered a temporary solution.</Typography>}
              {tabValue === 1 && <Typography>The agent confirmed the outage, performed troubleshooting, and escalated the issue. They provided the customer with a temporary data package and outlined the resolution process.</Typography>}
              {tabValue === 2 && <Typography>The customer reported a service outage, expressed frustration with past disruptions, and requested a quick resolution, considering alternatives if the problem continues.</Typography>}
            </Box>
          </Paper>
          <Paper sx={{ p: 2, mb: 2, height: 'calc(33% - 8px)' }}>
            <Typography variant="h6" gutterBottom>Conversation Insights</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <FavoriteIcon sx={{ color: getHeartColor(csatScore), fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">CSAT: {csatScore}</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <CheckCircleIcon sx={{ color: 'green', fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">{conversationResult}</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <EmojiEmotionsIcon sx={{ color: 'orange', fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">{overallSentiment}</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <TimerIcon sx={{ color: 'blue', fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">{timeTaken}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          <Paper sx={{ p: 2, height: 'calc(33% - 8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress 
                variant="determinate" 
                value={overallPerformance} 
                size={60} 
                thickness={4}
                sx={{ color: getPerformanceColor(overallPerformance) }} 
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${Math.round(overallPerformance)}%`}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ ml: 2 }}>Overall Performance</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>AI Insights</Typography>
                <List dense>
                  {aiInsights.map((insight, index) => (
                    <AIInsightItem key={index} name={insight.name} score={insight.score} />
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper sx={{ p: 2, mb: 2, flex: 1 }}>
                <Typography variant="h6" gutterBottom>Topics Discussed</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={topicsDiscussed}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="70%"
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topicsDiscussed.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
              <Paper sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" gutterBottom>Time Distribution</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={timeDistribution} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostCall;