const express = require('express');
const { queryPinecone, queryOpenAI } = require('./utils/queryUtils');

const router = express.Router();

router.post('/adminSentiment', async (req, res) => {
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

router.post('/customerSentiment', async (req, res) => {
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

router.post('/checkTopics', async (req, res) => {
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

router.post('/queryGPT', async (req, res) => {
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

module.exports = router;