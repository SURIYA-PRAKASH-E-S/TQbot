import React from "react";
import { useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QiBNhH6k0HUZ1150nqzwrHrYJ399NhC3jcQI Z1aRPLx9ZnTQdAi94TfN@pyeQ9Q7svKOuRKasDZ56uQWhcoZoX1009qbyIZoo");

function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const turfId = searchParams.get("turfId");

    const handleCheckout = async () => {
        const stripe = await stripePromise;

        const response = await fetch("http://localhost:5000/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ turfId }),
        });

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
    };

    return (
        <div className="container mt-5">
            <h1>Booking Turf</h1>
            <p>Proceed to payment for Turf ID: {turfId}</p>
            <button onClick={handleCheckout} className="btn btn-success">Pay Now</button>
        </div>
    );
}

export default CheckoutPage;
