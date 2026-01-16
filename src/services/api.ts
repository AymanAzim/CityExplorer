import axios from "axios";

// 🔎 GET – Nearby real places from OpenStreetMap (stable version)
export const getNearbyPlaces = async (lat: number, lon: number) => {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"](around:1200, ${lat}, ${lon});
      node["amenity"="restaurant"](around:1200, ${lat}, ${lon});
      node["amenity"="cafe"](around:1200, ${lat}, ${lon});
      node["amenity"="bar"](around:1200, ${lat}, ${lon});
    );
    out body 30;
  `;

  const response = await axios.post(
    "https://overpass.kumi.systems/api/interpreter", // ✅ mirror più stabile
    query,
    {
      headers: { "Content-Type": "text/plain" },
      timeout: 20000, // 20 secondi max
    }
  );

  return response.data.elements;
};

// ✏️ PUT – update favourite with photo (memory)
export const updateFavourite = async (id: number, data: any) => {
  const response = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    data
  );
  return response.data;
};
