import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function Checkout() {
    const [searchParams] = useSearchParams();
    const turfId = searchParams.get("turfId");

    useEffect(() => {
        const startPayment = async () => {
            const response = await axios.post("http://localhost:5000/create-checkout-session", {
                turfId,
                name: "Turf Booking",
                pricePerHour: 500, // Fetch actual price from backend
            });

            window.location.href = response.data.url;
        };

        startPayment();
    }, [turfId]);

    return <p>Redirecting to payment...</p>;
}

export default Checkout;
