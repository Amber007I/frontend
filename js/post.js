// ✅ post.js
import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

const token = getAccess();
const postId = new URLSearchParams(window.location.search).get("id");
const postContainer = document.getElementById("postDetails");

async function fetchPost() {
  try {
    const post = await apiRequest(`/blogs/${postId}/`, "GET", null, token);

    const isAuthor = post.is_owner || false;
    const date = new Date(post.created_at).toLocaleString();

    postContainer.innerHTML = `
      <div class="img-wrapper">
        <img src="../frontend/img/courses.png" class="post-img" alt="Post Image" />
      </div>
      <div class="post-details">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p><strong>By ${post.author || "Anonymous"}</strong> • ${date}</p>
        <span class="tag">${post.tag || "General"}</span>

        <div class="stats">
          <div class="post-icons">
            <span>♡ ${post.likes || 0}</span>
            <span>💬 ${post.comments || 0}</span>
            <span>🔖 ${post.bookmarks || 0}</span>
          </div>

          ${
            isAuthor
              ? `
            <button class="post-button" id="editBtn">✏️ Edit</button>
            <button class="post-button" id="deleteBtn">🗑️ Delete</button>
          `
              : ""
          }
        </div>
      </div>
    `;

    if (isAuthor) {
      document.getElementById("editBtn").addEventListener("click", () => {
        const newTitle = prompt("Edit Title", post.title);
        const newContent = prompt("Edit Content", post.content);
        const newTag = prompt("Edit Tag", post.tag);
        if (newTitle && newContent && newTag) {
          updatePost(newTitle, newContent, newTag);
        }
      });

      document.getElementById("deleteBtn").addEventListener("click", () => {
        Swal.fire({
          title: "Are you sure?",
          text: "This post will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) deletePost();
        });
      });
    }
  } catch (err) {
    postContainer.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

async function updatePost(title, content, tag) {
  try {
    await apiRequest(
      `/blogs/${postId}/`,
      "PUT",
      { title, content, tag },
      token
    );
    Swal.fire("Updated!", "Your post was updated.", "success").then(() => {
      fetchPost();
    });
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}

async function deletePost() {
  try {
    await apiRequest(`/blogs/${postId}/`, "DELETE", null, token);
    Swal.fire("Deleted!", "Your post was deleted.", "success").then(() => {
      window.location.href = "dashboard.html";
    });
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}

fetchPost();
