const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

// Initialize API key and configuration
const API_KEY = `AIzaSyBeCn02TRCtxkEBkMJVek7YiMuRqeJQL04`; // Replace with your API key
const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 100,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

// Set up readline for dynamic user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

(async () => {
  try {
    console.log("Questbot is ready to assist you. Ask your questions!");

    // Function to handle user queries
    const handleQuery = async (query) => {
      console.log("\nQuestbot is thinking...\n");
      const result = await model.generateContentStream(
        `${initialPrompt}\nUser: ${query}`,
        generationConfig
      );

      // Stream the response
      for await (const chunk of result.stream) {
        process.stdout.write(chunk.text());
      }
      console.log("\n"); // Add spacing after the bot's response
      askUser(); // Prompt for the next question
    };

    // Function to prompt user input
    const askUser = () => {
      rl.question("You: ", (query) => {
        if (query.toLowerCase() === "exit") {
          console.log("Goodbye!");
          rl.close();
        } else {
          handleQuery(query);
        }
      });
    };

    askUser(); // Start the interaction loop
  } catch (error) {
    console.error("Error generating content stream:", error);
    rl.close();
  }
})();
