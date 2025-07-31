// ✅ authStorage.js
export function getAccess() {
  return localStorage.getItem("accessToken");
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
}
