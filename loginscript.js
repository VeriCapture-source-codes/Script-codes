document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailOrUsername = document.getElementById("emailOrUsername"); // FIXED
  const password = document.getElementById("password");
  const passwordToggle = document.getElementById("bx-hide");
  const keepSignedIn = document.getElementById("checkbox");
  const apiUrl = "https://localhost:5000/api/v1/users/login"; 

  function showError(input, message) {
    input.style.border = "2px solid red";
    const errorMsg = document.createElement("small");
    errorMsg.textContent = message;
    errorMsg.style.color = "red";
    errorMsg.classList.add("error-message");
    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error-message")) {
      input.insertAdjacentElement("afterend", errorMsg);
    }
  }

  function clearError(input) {
    input.style.border = "1px solid #ccc";
    if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")) {
      input.nextElementSibling.remove();
    }
  }

  function validateEmailOrUsername(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || value.trim().length >= 3; // Accepts either valid email or min 3-char username
  }

  function validatePassword(value) {
    return value.length >= 6;
  }

  // Toggle password visibility
  passwordToggle.addEventListener("click", function () {
    password.type = password.type === "password" ? "text" : "password";
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let valid = true;

    if (!validateEmailOrUsername(emailOrUsername.value)) {
      showError(emailOrUsername, "Enter a valid email or username (min 3 characters)");
      valid = false;
    } else clearError(emailOrUsername);

    if (!validatePassword(password.value)) {
      showError(password, "Password must be at least 6 characters long");
      valid = false;
    } else clearError(password);

    if (valid) {
      const formData = {
        emailOrUsername: emailOrUsername.value.trim(),
        password: password.value.trim(),
        keepSignedIn: keepSignedIn.checked
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data));
          alert("Login successful!");
          window.location.href = "dashboard.html"; 
        } else {
          const errorData = await response.json();
          showError(emailOrUsername, errorData.message || "Invalid credentials");
        }
      } catch (error) {
        alert("Network error, please try again later");
      }
    }
  });
});
