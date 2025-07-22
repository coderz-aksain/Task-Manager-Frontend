export const verifyToken = async (token) => {
  const response = await fetch("https://task-manager-backend-vqen.onrender.com/api/verify-token", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

// Add other API functions as needed (e.g., fetchTasks, createTask)