import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

const token = getAccess();
const draftContainer = document.getElementById("draftContainer");

async function fetchDrafts() {
  try {
    const drafts = await apiRequest("/blogs/draft/", "GET", null, token);
    draftContainer.innerHTML = "";

    if (!drafts.length) {
      draftContainer.innerHTML = "<p>No drafts found.</p>";
      return;
    }

    drafts.forEach((draft) => {
      const div = document.createElement("div");
      div.className = "post-card";
      div.innerHTML = `
        <div class="post-details">
          <h3>${draft.title}</h3>
          <p>${draft.content}</p>
          <p><strong>${draft.tag || "Draft"}</strong></p>
          <button onclick="publishDraft(${draft.id})">Publish</button>
          <button onclick="deleteDraft(${draft.id})">Delete</button>
        </div>
      `;
      draftContainer.appendChild(div);
    });
  } catch (err) {
    draftContainer.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

window.publishDraft = async function (id) {
  try {
    await apiRequest(`/blogs/draft/publish/${id}/`, "POST", null, token);
    Swal.fire("Published!", "Draft has been published.", "success").then(() => {
      fetchDrafts();
    });
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};

window.deleteDraft = async function (id) {
  try {
    await apiRequest(`/blogs/draft/${id}/`, "DELETE", null, token);
    Swal.fire("Deleted", "Draft deleted successfully", "success").then(() => {
      fetchDrafts();
    });
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};

fetchDrafts();
