import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Convert currency endpoint
app.get('/api/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    // Validate required parameters
    if (!from || !to || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters: from, to, amount'
      });
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({
        error: 'Amount must be a valid number'
      });
    }

    const apiKey = process.env.EXCHANGE_RATES_API_KEY;
    const apiUrl = process.env.EXCHANGE_RATES_API_URL;

    if (!apiKey || !apiUrl) {
      return res.status(500).json({
        error: 'Server configuration error: Missing API credentials'
      });
    }

    // Make request to exchange rates API
    const response = await fetch(
      `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=${amount}`
    );
    
    const data = await response.json();

    if (data.success) {
      res.json({
        success: true,
        from,
        to,
        amount: parseFloat(amount),
        result: data.result,
        rate: data.info.rate,
        timestamp: data.info.timestamp
      });
    } else {
      res.status(400).json({
        error: data.error?.info || 'Failed to convert currency'
      });
    }
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});