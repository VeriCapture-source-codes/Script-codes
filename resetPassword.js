document.addEventListener("DOMContentLoaded", function () {
  const resetForm = document.querySelector("form");
  const newPasswordInput = document.getElementById("New-Password");
  const confirmPasswordInput = document.getElementById("Confirm-New-Password");
  const resetButton = document.querySelector(".reset-btn");

  // Toast Notification Function
  function showToast(message, type) {
      const toast = document.createElement("div");
      toast.classList.add("toast", type);
      toast.innerText = message;
      document.body.appendChild(toast);

      setTimeout(() => {
          toast.remove();
      }, 3000); 
  }

  // Password Validation Function
  function validatePasswords() {
      const password = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Password Strength Validation 
      const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPasswordRegex.test(password)) {
          showToast("Password must be 8+ characters, with an uppercase, number & special character!", "error");
          return false;
      }

      if (password !== confirmPassword) {
          showToast("Passwords do not match!", "error");
          return false;
      }

      return true;
  }

  // Handle Form Submission
  resetForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Validate passwords before sending API request
      if (!validatePasswords()) {
          return;
      }

      
      const apiUrl = "https://localhost:5000/api/v1/users/set-password";

      const requestData = {
          newPassword: newPasswordInput.value,
          confirmPassword: confirmPasswordInput.value,
      };

      try {
          const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestData),
          });

          const data = await response.json();

          if (response.ok) {
              showToast("Password reset successful! Redirecting to login...", "success");
              setTimeout(() => {
                  window.location.href = "./login.html"; // Redirect to login
              }, 2000);
          } else {
              showToast(data.message || "Password reset failed! Try again.", "error");
          }
      } catch (error) {
          showToast("Network error! Please try again.", "error");
      }
  });
});
