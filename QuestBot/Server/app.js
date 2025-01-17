const express = require('express');
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const Papa = require('papaparse');
const fs = require('fs');

/* Gen Ai */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = `AIzaSyBeCn02TRCtxkEBkMJVek7YiMuRqeJQL04`; // Replace with your API key

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 100,
  temperature: 0.9,
  topP: 0.1,
  topk: 16,
};

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, generationConfig);

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'] });

// Load CSV and Train Chatbot using PapaParse
const trainChatbot = async () => {
  try {
    console.log('Loading FAQ dataset...');

    // Read the CSV file
    const csvData = fs.readFileSync('./turf_booking_faq.csv', 'utf8');

    // Parse the CSV file using PapaParse
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
      throw new Error('Error parsing CSV file: ' + JSON.stringify(parsedData.errors));
    }

    console.log('Training the chatbot...');
    parsedData.data.forEach((row) => {
      const question = row['Question'];
      const answer = row['Answer'];

      if (question && answer) {
        manager.addDocument('en', question, question); // Add question as intent
        manager.addAnswer('en', question, answer); // Add answer as response
      }
    });

    await manager.train();
    manager.save();
    console.log('Training completed.');
  } catch (error) {
    console.error('Error loading or training the chatbot:', error);
  }
};

// Train the chatbot
trainChatbot();

// API Endpoints
app.get('/', (req, res) => {
  res.send('Chatbot is running...');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid input. Provide a valid query.' });
    }


    if (query.includes('List')) {
      return res.json({
          botReply: `<h1 class="text-4xl text-red-400">Here are all the Turfs</h1>`
      });
  }

  const initialPrompt = `
You are Questbot, a helpful chatbot specializing in turf bookings in Madurai, Tamil Nadu. Below is a list of turfs with their details. Use this data to answer questions about booking, facilities, timings, payments, or contact details. If the user asks for unavailable information, politely inform them and suggest alternatives if possible.

List of Turfs:
1. **MGR Race Course Stadium** - Madurai, Tamil Nadu
   - Facilities: 400m track, badminton, basketball, cricket, football, tennis, table tennis, volleyball, swimming
   - Additional Info: Seating for 10,000

2. **Madurai Turf** - S.E.V. Mahal, KK Nagar, Madurai-20
   - Facilities: Multi-sport turf
   - Contact: 9787 644 921, 9092 920 772

3. **Game On Madurai** - Madurai, Tamil Nadu
   - Facilities: Multi-sport outdoor turf
   - Additional Info: Largest outdoor turf in Madurai

4. **GreenField Arena** - Anna Nagar, Madurai
   - Facilities: Football, cricket, badminton
   - Contact: 9955 123 456
   - Additional Info: Floodlights for night games

5. **ProPlay Turf** - Avaniyapuram, Madurai
   - Facilities: Football, basketball, volleyball
   - Contact: 9876 543 210
   - Additional Info: Nearby parking available

6. **Victory Sports Hub** - Alagappan Nagar, Madurai
   - Facilities: Football, badminton, tennis
   - Additional Info: Membership discounts

7. **Elite Turf Arena** - KK Nagar, Madurai
   - Facilities: Cricket, football
   - Contact: 9999 888 777
   - Additional Info: High-quality turf

8. **Sky Sports Ground** - Mattuthavani, Madurai
   - Facilities: Cricket, volleyball, basketball
   - Contact: 9012 345 678
   - Additional Info: Open for bookings

9. **Champion's Arena** - Simmakkal, Madurai
   - Facilities: Football, cricket
   - Additional Info: Weekend tournaments

10. **Ultimate Play Zone** - Thirunagar, Madurai
    - Facilities: Multi-sport
    - Contact: 9123 456 789
    - Additional Info: Kid-friendly environment

Provide accurate, engaging, and user-friendly responses based on the above data.
`;
  
    // Process the query using the NLP manager
    const response = await manager.process('en', initialPrompt + '\n think as' + query);


    // Check if the NLP model has an answer
    if (response.answer) {
      return res.json({ botReply: response.answer });
    }

    // If no answer found in the dataset, fall back to Gemini model
    const geminiResponse = await model.generateContent(query);
    const botRes = geminiResponse.response.text();

    return res.json({ botReply: botRes || "I'm sorry, I didn't understand that." });
    
  } catch (error) {
    console.error('Error processing the query:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
