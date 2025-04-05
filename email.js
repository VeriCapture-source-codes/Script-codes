document.addEventListener("DOMContentLoaded", async () => {
    const emailText = document.querySelector(".email"); 
    const otpInputs = document.querySelectorAll(".otp-input input");
    const verifyButton = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".resend-link");
    const resendText = document.querySelector(".resend-text");
  
    let userEmail = "";
    let countdownTimer; 
  
    // Function to fetch user email from backend
    async function fetchUserEmail() {
        try {
            const response = await fetch("https://localhost:5000/api/v1/users/password-reset-otp"); 
            const data = await response.json();
  
            if (data && data.email) {
                userEmail = data.email;
                emailText.textContent = maskEmail(userEmail);
                startCountdown(); 
            }
        } catch (error) {
            console.error("Error fetching email:", error);
        }
    }
  
    // Function to mask email for display
    function maskEmail(email) {
        const [name, domain] = email.split("@");
        return `${"*".repeat(name.length - 3)}${name.slice(-3)}@${domain}`;
    }
  
    // Function to start the 60-second countdown timer
    function startCountdown() {
        let timeLeft = 60;
        resendText.innerHTML = `Didn't get a code? Resend in <strong>${timeLeft}s</strong>`;
        resendLink.style.pointerEvents = "none"; 
        resendLink.style.opacity = "0.5"; 
  
        countdownTimer = setInterval(() => {
            if (timeLeft > 0) {
                resendText.innerHTML = `Didn't get a code? Resend in <strong>${timeLeft}s</strong>`;
                timeLeft--;
            } else {
                clearInterval(countdownTimer);
                resendText.innerHTML = `Didn't get a code? <a href="#" class="resend-link">Resend code</a>`;
                const newLink = resendText.querySelector(".resend-link");
                 newLink.addEventListener;"click", (e) => {
                 e.preventDefault();
                 resendOTP();
                   }
                resendLink.style.pointerEvents = "auto"; 
                resendLink.style.opacity = "1";
                resendLink.addEventListener("click", resendOTP);
            }
        }, 1000);
    }
  
    // OTP auto-focus functionality
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          const value = e.target.value;
            if (e.inputType === "deleteContentBackward" && index > 0) {
                otpInputs[index - 1].focus();
            } else if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
  
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && index > 0 && input.value === "") {
                otpInputs[index - 1].focus();
            }
        });
    });
  
    // Function to verify OTP
    async function verifyOTP() {
        const otpCode = Array.from(otpInputs).map(input => input.value).join("");
  
        if (otpCode.length !== 6) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }
  
        try {
            const response = await fetch("https://localhost:5000/api/v1/users/password-reset-otp", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userEmail, otp: otpCode })
            });
  
            const result = await response.json();
  
            if (result.success) {
                alert("OTP Verified Successfully!");
                window.location.href = "dashboard.html"; // Redirect after verification
            } else {
                alert(result.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
        }
    }
  
    // Function to resend OTP
    async function resendOTP(event) {
        event.preventDefault(); // Prevent default link behavior
  
        try {
            const response = await fetch("https://localhost:5000/api/v1/users/password-reset-otp", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userEmail })
            });
  
            const result = await response.json();
  
            if (result.success) {
                alert("A new OTP has been sent to your email.");
                startCountdown(); 
            } else {
                alert(result.message || "Failed to resend OTP. Try again later.");
            }
        } catch (error) {
            console.error("Resend OTP failed:", error);
        }
    }
  
    // Event Listeners
    verifyButton.addEventListener("click", verifyOTP);
    resendLink.addEventListener("click", resendOTP);
  
    // Fetch email on page load
    fetchUserEmail();
  });
  