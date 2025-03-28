//Script for login.html
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailOrUsername = document.querySelector("input[type='email']");
  const password = document.getElementById("password");
  const passwordToggle = document.getElementById("bx-hide");
  const keepSignedIn = document.getElementById("checkbox");
  const apiUrl = "https://localhost:5000/api/v1/users/login"; 

  function showError(input, message) {
    input.style.border = "2px solid red";
    alert(message);
  }

  function clearError(input) {
    input.style.border = "1px solid #ccc";
  }

  function validateEmailOrUsername(value) {
    return value.trim().length > 0;
  }

  function validatePassword(value) {
    return value.length >= 6;
  }

  passwordToggle.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let valid = true;

    if (!validateEmailOrUsername(emailOrUsername.value)) {
      showError(emailOrUsername, "Email or Username is required");
      valid = false;
    } else clearError(emailOrUsername);

    if (!validatePassword(password.value)) {
      showError(password, "Password must be at least 6 characters");
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
          alert("Error: " + (errorData.message || "Invalid credentials"));
        }
      } catch (error) {
        alert("Network error, please try again later");
      }
    }
  });
});
