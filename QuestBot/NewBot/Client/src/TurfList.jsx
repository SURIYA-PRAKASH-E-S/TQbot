import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";

function TurfList() {
    const [turfs, setTurfs] = useState([]);

    useEffect(() => {
        const fetchTurfs = async () => {
            const querySnapshot = await getDocs(collection(db, "turfs"));
            const turfsArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTurfs(turfsArray);
        };

        fetchTurfs();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Available Turfs</h1>
            <div className="row">
                {turfs.length > 0 ? (
                    turfs.map((turf) => (
                        <div key={turf.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={turf.imageUrl} className="card-img-top" alt={turf.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{turf.name}</h5>
                                    <p className="card-text"><strong>Location:</strong> {turf.location}</p>
                                    <p className="card-text"><strong>Price:</strong> ₹{turf.pricePerHour}/hour</p>
                                    <div className="d-flex gap-2">
                                        <Link to={`/turf-details/${turf.id}`} className="btn btn-success">View Details</Link>
                                        <Link to={`/checkout?turfId=${turf.id}`} className="btn btn-primary">Book Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No turfs available.</p>
                )}
            </div>
        </div>
    );
}

export default TurfList;
