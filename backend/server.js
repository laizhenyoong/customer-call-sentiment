// server.js
const express = require('express');
const cors = require('cors');
const { queryPinecone, queryOpenAI } = require('./utils/queryUtils');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.post('/createCustomer', async (req, res) => {
    try {
        const { messages, formattedMessages } = req.body;

        // 1. Generate a response using OpenAI with the system context
        const systemPrompt = messages.length == 1 
        ? 
        `You are a customer of a telecom company. Please start a conversation 
        with me in full without any introductory phrases like "Sure! Here’s a 
        reply as a customer."
        
        ${formattedMessages}
        `
        :
        `You are a customer of a telecom company. Please respond to the conversation 
        in full without any introductory phrases like "Sure! Here’s a reply as a 
        .customer.
        
        ${formattedMessages}
        "
        `;
        const aiMessage = await queryOpenAI(messages, "", systemPrompt);
 
        // 2. Return the AI response back to the frontend
        res.status(200).json({
            aiResponse: aiMessage,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.post('/adminSentiment', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. 

        // 2. Return something
        res.status(200).json({
            message: returnsomething
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.post('/customerSentiment', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. 

        // 2. Return something
        res.status(200).json({
            message: returnsomething
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});



app.post('/checkTopics', async (req, res) => {
    try {
        const { message, topics } = req.body;

        // 1. Generate a response using OpenAI with the system context
        const systemPrompt = `
        You have a list of topics, each represented by a number. 
        When a user inputs a message, analyze the message and return a comma-separated 
        list of numbers corresponding to the topics mentioned or matched. 
        If a topic is not mentioned, do not include its number in the output. 
        Ensure the numbers are returned in order, without spaces.
        
        Topics:
        ${topics}
        `;
        const aiMessage = await queryOpenAI(message, "", systemPrompt);

        // 2. Return the AI response back to the frontend
        res.status(200).json({
            aiResponse: aiMessage,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});


app.post('/queryGPT', async (req, res) => {
    try {
        const { queryText } = req.body;

        // 1. Query Pinecone for relevant data
        const pineconeResponse = await queryPinecone(queryText);

        // 2. Build context from Pinecone matches
        const context = pineconeResponse.matches
            .map((match) => match.metadata.text)
            .join("\n");

        // 3. Generate a response using OpenAI with the system context
        const systemPrompt = `You are a helpful assistant who provides accurate and concise answers. 
        Use the provided context to respond intelligently to user queries.`;
        const aiMessage = await queryOpenAI(queryText, context, systemPrompt);

        // 4. Send the AI response back to the frontend
        res.status(200).json({
            aiResponse: aiMessage,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
