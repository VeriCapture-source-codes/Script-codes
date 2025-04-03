document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.querySelector(".forgot-input");
  const submitButton = document.querySelector(".submit-btn");

  // Function to validate email format
  function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  // Function to show alert messages
  function showAlert(message, isSuccess = true) {
      alert(message);
  }

  // Function to handle form submission
  async function handlePasswordReset() {
      const email = emailInput.value.trim();

      // Validate email input
      if (email === "") {
          showAlert("Please enter your email.", false);
          return;
      }
      if (!isValidEmail(email)) {
          showAlert("Please enter a valid email address.", false);
          return;
      }

      try {
          
        // Send request to backend API
          const response = await fetch("https://localhost:5000/api/v1/users/change-password", {  
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ email })
          });

          const result = await response.json();

          if (result.success) {
              showAlert("A password reset email has been sent. Please check your inbox!", true);
              emailInput.value = ""; // Clear input after successful submission
          } else {
              showAlert(result.message || "Failed to send reset email. Try again later.", false);
          }
      } catch (error) {
          console.error("Error submitting request:", error);
          showAlert("An error occurred. Please try again later.", false);
      }
  }

  // Attach event listener to submit button
  submitButton.addEventListener("click", (event) => {
      event.preventDefault(); 
      handlePasswordReset();
  });
});
