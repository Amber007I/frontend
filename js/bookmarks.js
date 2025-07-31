// ✅ bookmarks.js
import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

const token = getAccess();
const container = document.getElementById("bookmarkContainer");

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function createBookmarkCard(post) {
  return `
    <div class="post-card">
      <div class="img-wrapper">
        <img src="../frontend/img/courses.png" class="post-img" alt="Post Image" />
      </div>
      <div class="post-details">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p><strong>By ${post.author || "Anonymous"}</strong> • ${formatDate(
    post.created_at
  )}</p>
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
    </div>
  `;
}

async function loadBookmarks() {
  try {
    const bookmarks = await apiRequest(
      "/blogs/bookmarked/",
      "GET",
      null,
      token
    );
    container.innerHTML = "";

    if (bookmarks.length === 0) {
      container.innerHTML = "<p>No bookmarks yet.</p>";
      return;
    }

    bookmarks.forEach((post) => {
      container.innerHTML += createBookmarkCard(post);
    });
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load bookmarks: ${err.message}</p>`;
  }
}

loadBookmarks();
