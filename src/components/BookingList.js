import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  return (
    <div>
      <h3>Mina bokningar</h3>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}<br />
            Rum: {booking.roomId?.name || 'okänt'}
            <br />
            <button onClick={() => handleDelete(booking._id)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
