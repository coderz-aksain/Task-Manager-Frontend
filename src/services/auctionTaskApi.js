import api from "../services/api";

export async function createAuctionTask(taskData) {
  // Only send required fields for Auction
  const data = {
    taskType: taskData.taskType,
    auctionType: taskData.auctionType,
    eventName: taskData.eventName, // Use eventName instead of taskName
    requesterName: taskData.requesterName, // Use plain string (name only)
    client: taskData.client,
    division: taskData.division,
    assignEmployees: Array.isArray(taskData.assignEmployees)
      ? taskData.assignEmployees
      : [],
  };
  // Log payload for debugging
  console.log("[AuctionTaskApi] Payload sent to /api/auction-tasks:", data);
  // Use the auction-tasks endpoint, send JSON
  return api.request("/auction-tasks", {
    method: "POST",
    headers: api.getAuthHeaders(),
    body: JSON.stringify(data),
  });
}
