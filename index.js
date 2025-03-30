document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form2");
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.querySelector("input[type='email']");
  const username = document.querySelector("input[type='text']"); // Fixed selector
  const password = document.getElementById("password2");
  const country = document.querySelector(".select-box2 select");
  const termsCheckbox = document.getElementById("checkbox2");
  const passwordToggle = document.getElementById("bx-hide2");
  const apiUrl = "https://localhost:5000/api/v1/users/signup"; 

  function showError(input, message) {
    input.style.border = "2px solid red";
    alert(message);
  }

  function clearError(input) {
    input.style.border = "1px solid #ccc";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  }

  // Toggle password visibility
  passwordToggle.addEventListener("click", function () {
    password.type = password.type === "password" ? "text" : "password";
  });

  // Form submission with validation
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, "First name is required");
      valid = false;
    } else clearError(firstName);

    if (!lastName.value.trim()) {
      showError(lastName, "Last name is required");
      valid = false;
    } else clearError(lastName);

    if (!validateEmail(email.value)) {
      showError(email, "Enter a valid email address");
      valid = false;
    } else clearError(email);

    if (!username.value.trim()) {
      showError(username, "Username is required");
      valid = false;
    } else clearError(username);

    if (!validatePassword(password.value)) {
      showError(password, "Password must be at least 6 characters and contain letters & numbers");
      valid = false;
    } else clearError(password);

    if (country.value === "country") {
      showError(country, "Please select your country");
      valid = false;
    } else clearError(country);

    if (!termsCheckbox.checked) {
      showError(termsCheckbox, "You must accept the terms and conditions");
      valid = false;
    } else clearError(termsCheckbox);

    if (!valid) return;

    // Prepare form data
    const formData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value.trim(),
      country: country.value,
    };

    // Submit data to API
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        form.reset();
      } else {
        alert("Error: " + (result.message || "Signup failed"));
      }
    } catch (error) {
      alert("Network error: Could not reach the server");
    }
  });
});
