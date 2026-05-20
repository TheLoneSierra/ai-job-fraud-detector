import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const analyzeScamText = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/api/analyze`, {
      text,
    });

    return response.data;
  } catch (error) {
    console.log("API Error:", error);
    throw error;
  }
};
