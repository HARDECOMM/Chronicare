// src/use_api/getDoctors.js
import axios from 'axios';

export async function getDoctors() {
  try {
    const res = await axios.get('http://localhost:5000/api/doctors');
    return res.data;
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return [];
  }
}
