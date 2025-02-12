import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";

function TurfDetails() {
    const { id } = useParams();
    console.log("Received Turf ID:", id); // ✅ Debugging

    const [turf, setTurf] = useState(null);

    useEffect(() => {
        if (!id) {
            console.error("Error: Turf ID is undefined!");
            return;
        }

        const fetchTurf = async () => {
            console.log(`Fetching turf with ID: ${id}`); // ✅ Debugging
            const docRef = doc(db, "turfs", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTurf(docSnap.data());
            } else {
                console.error("No such turf found in Firestore!");
            }
        };

        fetchTurf();
    }, [id]);

    if (!turf) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h1>{turf.name}</h1>
            <img src={turf.imageUrl} alt={turf.name} className="img-fluid" />
            <p><strong>Location:</strong> {turf.location}</p>
            <p><strong>Price Per Hour:</strong> ₹{turf.pricePerHour}</p>
            <p><strong>Time Slots:</strong> {turf.timeSlots?.join(", ")}</p>
            <a href={`/checkout?turfId=${id}`} className="btn btn-primary">Book Now</a>
        </div>
    );
}

export default TurfDetails;
