// ParticipantList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ParticipantList.css';

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/enrolled-participants');
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div>
      <h1>Registered Participants</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Selected Batch</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>{participant.age}</td>
              <td>{participant.selectedBatch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantList;

