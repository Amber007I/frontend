// ✅ auth.js
import { apiRequest } from "./api.js";

// DOM Elements
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotSubmit = document.getElementById("forgotSubmit");
const resetSubmit = document.getElementById("resetSubmit");
const usernameSubmit = document.getElementById("usernameSubmit");

// ✅ SWITCH TABS (Login/Signup)
if (loginTab && signupTab && loginForm && signupForm) {
  loginTab.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  });

  signupTab.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
  });
}

// ✅ SIGNUP
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirm_password.value;

    if (password !== confirmPassword) {
      return Swal.fire("Mismatch", "Passwords do not match", "warning");
    }

    try {
      await apiRequest("/auth/users/", "POST", {
        email,
        password,
        confirm_password: confirmPassword,
      });

      Swal.fire(
        "Account Created",
        "Check your email to activate your account.",
        "success"
      );
      signupForm.reset();
    } catch (err) {
      Swal.fire("Signup Failed", err.message, "error");
    }
  });
}

// ✅ LOGIN
if (loginForm) {
  loginForm.querySelector(".submit-btn").addEventListener("click", async () => {
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      const res = await apiRequest("/auth/signin/", "POST", {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.access);
      Swal.fire("Success", "Logged in!", "success").then(() => {
        window.location.href = "../dashboard.html";
      });
    } catch (err) {
      Swal.fire("Login Failed", err.message, "error");
    }
  });
}

// ✅ FORGOT PASSWORD
if (forgotSubmit) {
  forgotSubmit.addEventListener("click", async () => {
    const email = document.getElementById("forgotEmail").value.trim();

    try {
      await apiRequest("/auth/password/forgot/", "POST", { email });
      Swal.fire("Sent", "Check your email for reset instructions", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  });
}

// ✅ RESET PASSWORD
if (resetSubmit) {
  resetSubmit.addEventListener("click", async () => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uid");
    const token = urlParams.get("token");

    if (!uid || !token) {
      return Swal.fire("Invalid", "Reset link is incomplete", "error");
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire("Mismatch", "Passwords do not match", "warning");
    }

    try {
      await apiRequest("/auth/password/reset/confirm/", "POST", {
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      Swal.fire("Done", "Password reset successful", "success").then(() => {
        window.location.href = "done.html";
      });
    } catch (err) {
      Swal.fire("Failed", err.message, "error");
    }
  });
}

// ✅ SET USERNAME
if (usernameSubmit) {
  usernameSubmit.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const token = localStorage.getItem("accessToken");

    if (!username) {
      return Swal.fire("Empty", "Please enter a username", "warning");
    }

    try {
      await apiRequest("/auth/username/", "POST", { username }, token);
      Swal.fire("Saved", "Username set successfully!", "success").then(() => {
        window.location.href = "../dashboard.html";
      });
    } catch (err) {
      Swal.fire("Failed", err.message, "error");
    }
  });
}
// ✅ RESEND ACTIVATION EMAIL
const showResendForm = document.getElementById("showResendForm");
const resendForm = document.getElementById("resendForm");
const resendEmailInput = document.getElementById("resendEmail");
const resendActivationBtn = document.getElementById("resendActivationBtn");

if (showResendForm && resendForm && resendEmailInput && resendActivationBtn) {
  showResendForm.addEventListener("click", (e) => {
    e.preventDefault();
    resendForm.classList.toggle("hidden");
  });

  resendActivationBtn.addEventListener("click", async () => {
    const email = resendEmailInput.value.trim();
    if (!email) {
      return Swal.fire("Empty", "Please enter your school email", "warning");
    }

    try {
      await apiRequest("/auth/users/resend_activation/", "POST", { email });
      Swal.fire("Sent", "Activation email has been resent!", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  });
}
document.getElementById("resendBtn").addEventListener("click", () => {
  // Call the resend activation endpoint
});
