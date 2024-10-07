// api.js

const API_BASE_URL = 'http://localhost:5000';

export const checkTopics = async (message, topics) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkTopics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, topics }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking topics:', error);
    throw error;
  }
};

export const generateCustomerResponse = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating customer response:', error);
    throw error;
  }
};

export const queryGPT = async (queryText) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queryGPT`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryText }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying GPT:', error);
    throw error;
  }
};