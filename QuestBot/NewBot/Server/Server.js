const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Qi8NhH6k0HUZ115WJm7aoEeJrQEXKCKc6uPZ MUpkynCgXmUXZUxyvc0I8a5tbQfbvIf77dNb9rinTefcp9OzweYO0ZR20nZYf"); // Replace with your Stripe secret key
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const { turfId, name, pricePerHour } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: name,
                        },
                        unit_amount: pricePerHour * 100, // Convert to paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/success?turfId=${turfId}`,
            cancel_url: `http://localhost:5173/turf/${turfId}`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create session" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
