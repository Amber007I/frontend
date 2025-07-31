import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

// DOM references
const dateElement = document.getElementById("dateTime");
const editBtn = document.getElementById("editProfileToggle");
const editCard = document.getElementById("editProfileCard");
const saveBtn = document.getElementById("saveProfileBtn");

// Form fields
const editFirst = document.getElementById("editFirstName");
const editLast = document.getElementById("editLastName");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");
const editBio = document.getElementById("editBio");

function updateTime() {
  const now = new Date();
  dateElement.textContent = `Date: ${now.toLocaleDateString()} | ${now.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}
updateTime();
setInterval(updateTime, 60000);

// ✅ Load user profile
async function loadProfile() {
  try {
    const token = getAccess();
    const user = await apiRequest("/auth/users/me/", "GET", null, token);

    // Display static info
    document.querySelector(".user-name").textContent = user.username || "User";
    document.querySelector(".user-email").textContent =
      user.email || "No email";
    document.querySelector(".profile-summary h2").textContent =
      user.username || "User";
    document.querySelector(".profile-header h3").textContent =
      user.username || "User";
    document.querySelector(".profile-header p:nth-of-type(1)").textContent = `${
      user.first_name || ""
    } ${user.last_name || ""}`;
    document.querySelector(".profile-header p:nth-of-type(2)").textContent =
      user.email || "";

    // Set personal info
    const infoGrid = document.querySelector(".profile-info-grid");
    if (infoGrid) {
      infoGrid.innerHTML = `
        <div>
          <p><strong>First Name</strong></p><p>${user.first_name || ""}</p>
          <p><strong>School Email</strong></p><p>${user.email || ""}</p>
          <p><strong>Bio</strong></p><p>${user.bio || "No bio"}</p>
        </div>
        <div>
          <p><strong>Last Name</strong></p><p>${user.last_name || ""}</p>
          <p><strong>Phone Number</strong></p><p>${user.phone || "N/A"}</p>
        </div>
      `;
    }

    // Pre-fill form
    editFirst.value = user.first_name || "";
    editLast.value = user.last_name || "";
    editEmail.value = user.email || "";
    editPhone.value = user.phone || "";
    editBio.value = user.bio || "";
  } catch (err) {
    console.error("Failed to load profile:", err.message);
  }
}
loadProfile();

// ✅ Toggle Edit Form
editBtn?.addEventListener("click", () => {
  editCard.classList.toggle("hidden");
});

// ✅ Save Profile Changes
saveBtn?.addEventListener("click", async () => {
  const first_name = editFirst.value.trim();
  const last_name = editLast.value.trim();
  const bio = editBio.value.trim();
  const phone = editPhone.value.trim();

  try {
    await apiRequest(
      "/auth/users/me/",
      "PUT",
      {
        first_name,
        last_name,
        bio,
        phone,
      },
      getAccess()
    );

    Swal.fire("Saved", "Profile updated!", "success").then(() => {
      location.reload();
    });
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
});
