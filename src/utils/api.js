import axios from 'axios';

export const verifyToken = async (token) => {
  try {
    const response = await axios.get("https://task-manager-backend-xs5s.onrender.com/api/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ok: true,
      status: response.status,
      json: () => Promise.resolve(response.data),
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status || 500,
      json: () => Promise.resolve({ error: error.message }),
    };
  }
};
