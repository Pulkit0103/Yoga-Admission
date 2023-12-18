import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ParticipantList from './ParticipantList';
import Home from './Home';


function App() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    selectedBatch: '',
  });

  const handleSubmit = async () => {
    try {
      // Basic validations
      if (!formData.name || !formData.age || !formData.selectedBatch) {
        alert('Please fill in all the fields');
        return;
      }

      // Make API request to backend
      const response = await axios.post('http://localhost:5000/api/enroll', formData);

      // Handle response from backend
      console.log(response.data); // Log the response or update UI accordingly
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Router>
      <div className="container">
        <h1>Yoga Admission Form</h1>


        <label>Name: </label>
        <input type="text" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <br />


        <label>Age: </label>
        <input type="number" onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
        <br />


        <label>Choose Batch: </label>
        <select onChange={(e) => setFormData({ ...formData, selectedBatch: e.target.value })}>
          <option value="">Select Batch</option>
          <option value="6-7AM">6-7AM</option>
          <option value="7-8AM">7-8AM</option>
          <option value="8-9AM">8-9AM</option>
          <option value="5-6PM">5-6PM</option>
        </select>


        <br />
        <button onClick={handleSubmit}> Submit </button>

        <Link to="/participantsList">View Participants</Link>
        <Routes>
          <Route path="/participantsList" element={<ParticipantList />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="*" element={<div>
          </div>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
