// ✅ search.js
import { apiRequest } from "./api.js";
import { getAccess } from "./authStorage.js";

const token = getAccess();
const postContainer = document.querySelector(".search-results");
const tabs = document.querySelectorAll(".search-tabs .tab");
const dateElement = document.querySelector(".date");

function formatDateTime(date) {
  return (
    "Date: " +
    date.toLocaleDateString("en-GB") +
    " | " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function updateTime() {
  const now = new Date();
  dateElement.textContent = formatDateTime(now);
}

updateTime();
setInterval(updateTime, 60000); // Update every 60 seconds

async function fetchPostsByTag(tag) {
  try {
    const posts = await apiRequest(`/blogs/?tag=${tag}`, "GET", null, token);
    renderPosts(posts);
  } catch (err) {
    postContainer.innerHTML = `<p class="error">Failed to fetch posts: ${err.message}</p>`;
  }
}

function renderPosts(posts) {
  postContainer.innerHTML = "";

  if (posts.length === 0) {
    postContainer.innerHTML = `<p>No posts found for this category.</p>`;
    return;
  }

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `
      <span class="tag">${post.tag}</span>
      <p>${post.content}</p>
      <p><strong>By ${post.author || "Anonymous"}</strong></p>
    `;
    postContainer.appendChild(div);
  });
}

// Tab switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    fetchPostsByTag(tab.textContent);
  });
});

// Default load "For You" which will fetch all
fetchPostsByTag("for-you");
