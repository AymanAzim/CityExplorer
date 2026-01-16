import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com";

// Simuliamo "places" usando i post come esempio
export const getNearbyPlaces = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};
