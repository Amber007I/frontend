// ✅ boot.js
import { apiRequest } from "./api.js";
import { getAccess, clearTokens } from "./authStorage.js";

async function init() {
  try {
    await apiRequest("/auth/users/me/", "GET", null, getAccess());
  } catch (err) {
    clearTokens();
    window.location.href = "./auth/index.html";
  }
}

init();
// ✅ Logout Logic
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    Swal.fire({
      icon: "success",
      title: "Logged out!",
      text: "You've been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../auth/index.html";
    });
  });
}
