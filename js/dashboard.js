// ✅ dashboard.js
import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

const token = getAccess();

// ✅ Load Blogs
async function loadBlogs() {
  try {
    const blogs = await apiRequest("/blogs/", "GET", null, token);
    const container = document.getElementById("postContainer");
    container.innerHTML = "";

    blogs.forEach((post) => {
      const div = document.createElement("div");
      div.classList.add("post-card");
      div.innerHTML = `
        <div class="img-wrapper">
          <img src="../frontend/img/courses.png" class="post-img" alt="Post Image" />
        </div>
        <div class="post-details">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><strong>By ${post.author || "Anonymous"}</strong> • ${new Date(
        post.created_at
      ).toLocaleString()}</p>
          <span class="tag">${post.tag || "General"}</span>
          <div class="stats">
            <div class="post-icon">
              <span>♡ ${post.likes || 0}</span>
              <span>💬 ${post.comments || 0}</span>
              <span>🔖 ${post.bookmarks || 0}</span>
            </div>
            <button class="post-button" onclick="window.location.href='post.html?id=${
              post.id
            }'">View post</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load blogs:", err.message);
  }
}

loadBlogs();

// ✅ Post Modal Logic
document.querySelector(".post-btn").addEventListener("click", () => {
  document.getElementById("postModal").classList.remove("hidden");
});

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("postModal").classList.add("hidden");
});

// ✅ Create New Blog Post
document
  .querySelector(".modal-post-btn")
  .addEventListener("click", async () => {
    const title = document.querySelector(".modal-title").value;
    const content = document.querySelector(".modal-textarea").value;
    const tag = document.querySelector(".modal-select").value;

    if (!title || !content || tag === "Select Tag") {
      return Swal.fire("Fill all fields!", "", "warning");
    }

    try {
      await apiRequest("/blogs/", "POST", { title, content, tag }, token);
      Swal.fire("Success", "Blog created!", "success");

      // Reset form and close modal
      document.querySelector(".modal-title").value = "";
      document.querySelector(".modal-textarea").value = "";
      document.querySelector(".modal-select").value = "Select Tag";
      document.getElementById("postModal").classList.add("hidden");

      loadBlogs(); // Refresh blogs
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  });
