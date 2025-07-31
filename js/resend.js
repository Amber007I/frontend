// ✅ resend.js
import { apiRequest } from "./api.js";

// Get the email from localStorage (must have been saved during signup)
const verifyEmailEl = document.getElementById("verifyEmail");
const resendLink = document.getElementById("resendLink");

// Display email
const email = localStorage.getItem("pendingEmail");
if (email && verifyEmailEl) {
  verifyEmailEl.textContent = email;
}

// Resend Activation
resendLink?.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!email) {
    return Swal.fire("Error", "No email found to resend link", "error");
  }

  try {
    await apiRequest("/auth/activate/resend/", "POST", { email });
    Swal.fire("Sent!", "Verification link has been resent.", "success");
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
});
