import axios from "axios";

const API_KEY = "YOUR_API_KEY";


// 🌍 Client Axios configurato
const client = axios.create({
  baseURL: "https://api.foursquare.com/v3",
  headers: {
    Accept: "application/json",
    Authorization: API_KEY,
  },
  timeout: 30000, // 30 secondi per evitare timeout prematuri
});

// 🔎 Cerca un luogo per nome + coordinate
export const searchPlace = async (
  name: string,
  lat: number,
  lon: number
) => {
  try {
    const response = await client.get("/places/search", {
      params: {
        query: name,
        ll: `${lat},${lon}`,
        limit: 1,
      },
    });

    if (response.data?.results?.length > 0) {
      return response.data.results[0]; // primo risultato
    }

    return null;
  } catch (error) {
    console.log("Foursquare search error:", name);
    return null; // ❗ non crasha l'app
  }
};

// 📸 Ottieni le foto di un luogo tramite fsq_id
export const getPlacePhotos = async (fsq_id: string) => {
  try {
    const response = await client.get(`/places/${fsq_id}/photos`);

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.log("Foursquare photo error for:", fsq_id);
    return []; // ❗ non crasha l'app
  }
};

