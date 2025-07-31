// changePassword.js
import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

// DOM elements
const currentInput = document.getElementById("currentPassword");
const newInput = document.getElementById("newPassword");
const confirmInput = document.getElementById("confirmPassword");
const changeBtn = document.getElementById("changePasswordBtn");

// Event listener for change password button
changeBtn.addEventListener("click", async () => {
  const current_password = currentInput.value.trim();
  const new_password = newInput.value.trim();
  const confirm_password = confirmInput.value.trim();

  if (!current_password || !new_password || !confirm_password) {
    return Swal.fire("Missing Fields", "All fields are required.", "warning");
  }

  if (new_password !== confirm_password) {
    return Swal.fire("Mismatch", "New passwords do not match.", "error");
  }

  try {
    await apiRequest(
      "/auth/change-password/",
      "PUT",
      {
        current_password,
        new_password,
        confirm_password,
      },
      getAccess()
    );

    Swal.fire("Success", "Password changed successfully!", "success").then(
      () => {
        window.location.href = "../dashboard.html";
      }
    );
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
});
