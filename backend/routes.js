const express = require('express');
const { queryPinecone, queryOpenAI } = require('./utils/queryUtils');

const router = express.Router();

router.post('/adminSentiment', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Generate a response to categorize admin sentiment 
        const systemPrompt1 = `
        Given the following admin message, please identify and provide in a 
        single word a relevant category that this message falls into, which 
        could be useful for organizing or analyzing admin communications.
        `;
        const admin_sentiment = await queryOpenAI(message, "", systemPrompt1);

        // 2.  Generate a response for admin sentiment score
        const systemPrompt2 = `
        Given the following admin message, please evaluate the professionalism
        of the message and provide a score between 0 (unprofessional) and 1 
        (highly professional).
        `; //logic/role need to be adjusted TODO
        const admin_sentiment_score = await queryOpenAI(message, "", systemPrompt2);

        // 2. Return 
        res.status(200).json({
            admin_sentiment: admin_sentiment,
            admin_sentiment_score: admin_sentiment_score,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

router.post('/customerSentiment', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Generate a response to categorize customer sentiment 
        const systemPrompt1 = `
        Given the following customer message, please provide a single word 
        that best describes how the customer is feeling.
        `;
        const customer_sentiment = await queryOpenAI(message, "", systemPrompt1);

        // 2.  Generate a response for customer sentiment score
        const systemPrompt2 = `
        Given the following customer message, please provide the sentiment 
        score between 0 (negative) and 1 (positive).
        `;
        const customer_sentiment_score = await queryOpenAI(message, "", systemPrompt2);

        console.log("customer sentiment: " + customer_sentiment)

        // 2. Return 
        res.status(200).json({
            customer_sentiment: customer_sentiment,
            customer_sentiment_score: customer_sentiment_score,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

router.post('/checkTopics', async (req, res) => {
    try {
        const { message, topics } = req.body;

        // 1. Generate a response to categorize mentioned topics
        const systemPrompt = `
        You have a list of topics, each represented by a number.

        When a user inputs a message, analyze the message and 
        return a comma-separated list of numbers corresponding 
        to the topics mentioned or matched. 
        
        If a topic is not mentioned, do not include its number 
        in the output. Ensure the numbers are returned in order, 
        without spaces.
        
        Topics:
        ${topics}
        `;
        const aiMessage = await queryOpenAI(message, "", systemPrompt);

        // 2. Return 
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