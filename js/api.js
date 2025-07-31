// ✅ api.js
const BASE_URL = "https://unijournal.onrender.com/api/v1";

export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  token = null
) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(BASE_URL + endpoint, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Something went wrong");
  }

  return response.json();
}
