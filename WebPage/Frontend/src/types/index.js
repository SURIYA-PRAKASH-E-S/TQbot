// User structure
const User = {
    id: '', // String: Unique identifier for the user
    email: '', // String: User's email address
    name: '', // String: User's name
    role: 'user' // Role: 'admin' or 'user'
  };
  
  // Booking structure
  const Booking = {
    id: '', // String: Unique identifier for the booking
    userId: '', // String: ID of the user who made the booking
    turfId: '', // String: ID of the turf being booked
    date: '', // String: Date of booking in ISO format
    startTime: '', // String: Start time of booking
    endTime: '', // String: End time of booking
    status: 'pending' // Status: 'pending', 'confirmed', or 'cancelled'
  };
  
  // Turf structure
  const Turf = {
    id: '', // String: Unique identifier for the turf
    name: '', // String: Name of the turf
    description: '', // String: Description of the turf
    pricePerHour: 0, // Number: Cost per hour for using the turf
    image: '', // String: URL or path to the turf's image
    available: true // Boolean: Availability status of the turf
  };
  