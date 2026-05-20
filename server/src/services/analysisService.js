import axios from "axios";

const API_URL = "http://localhost:5000/api/analyze";

export const analyzeScamText = async (text) => {
  try {
    const response = await axios.post(API_URL, {
      text,
    });

    return response.data;
  } catch (error) {
    console.log("API Error:", error);

    throw error;
  }
};
