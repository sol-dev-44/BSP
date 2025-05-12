// ReservationCalendar.tsx - Basic component
import React, { useState, useEffect } from 'react';

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface ReservationForm {
  time_slot_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
}

const ReservationCalendar: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [formData, setFormData] = useState<ReservationForm>({
    time_slot_id: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_people: 1
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Fetch available time slots
    fetch('/api/time-slots')
      .then(res => res.json())
      .then(data => setTimeSlots(data));
  }, []);
  

  const handleSelectSlot = (id: number) => {
    setSelectedSlot(id);
    setFormData({...formData, time_slot_id: id});
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (res.ok) {
        setIsSuccess(true);
        // Remove the booked slot from available slots
        setTimeSlots(timeSlots.filter(slot => slot.id !== selectedSlot));
        setSelectedSlot(null);
      }
      return res.json();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="reservation-calendar">
      <h2>Book Your Parasailing Adventure</h2>
      
      {isSuccess ? (
        <div className="success-message">
          <p>Your reservation has been confirmed!</p>
          <button onClick={() => setIsSuccess(false)}>Book Another</button>
        </div>
      ) : (
        <>
          <div className="time-slots">
            <h3>Available Time Slots</h3>
            {timeSlots.length === 0 ? (
              <p>No available time slots.</p>
            ) : (
              <ul>
                {timeSlots.map(slot => (
                  <li 
                    key={slot.id} 
                    className={selectedSlot === slot.id ? 'selected' : ''}
                    onClick={() => handleSelectSlot(slot.id)}
                  >
                    {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {selectedSlot && (
            <form onSubmit={handleSubmit}>
              <h3>Customer Information</h3>
              <div>
                <label>
                  Name:
                  <input 
                    type="text" 
                    name="customer_name" 
                    value={formData.customer_name} 
                    onChange={handleInputChange}
                    required 
                  />
                </label>
              </div>
              <div>
                <label>
                  Email:
                  <input 
                    type="email" 
                    name="customer_email" 
                    value={formData.customer_email} 
                    onChange={handleInputChange}
                    required 
                  />
                </label>
              </div>
              <div>
                <label>
                  Phone:
                  <input 
                    type="tel" 
                    name="customer_phone" 
                    value={formData.customer_phone} 
                    onChange={handleInputChange} 
                  />
                </label>
              </div>
              <div>
                <label>
                  Number of People:
                  <input 
                    type="number" 
                    name="number_of_people" 
                    min="1"
                    max="10"
                    value={formData.number_of_people} 
                    onChange={handleInputChange}
                    required 
                  />
                </label>
              </div>
              <button type="submit">Confirm Reservation</button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default ReservationCalendar;