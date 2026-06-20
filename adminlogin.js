const form = document.getElementById("adminLoginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// 🔐 Admin Credentials (Array of multiple admins)
const ADMIN_CREDENTIALS_LIST = [
    {
        email: "admin@surplus2serve.com",
        password: "Admin@2024",
        secret: "SURPLUS2SERVE",
        name: "System Admin"
    }
];

// Store admin emails for notifications
localStorage.setItem('adminEmails', JSON.stringify(ADMIN_CREDENTIALS_LIST.map(a => a.email)));

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById("adminPassword");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

// Clear error message on input
document.getElementById("adminEmail").addEventListener("input", clearErrors);
document.getElementById("adminPassword").addEventListener("input", clearErrors);
document.getElementById("secretCode").addEventListener("input", clearErrors);

function clearErrors() {
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
}

// Form submission handler
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const secret = document.getElementById("secretCode").value.trim().toUpperCase();

    // Validation
    if (!email || !password || !secret) {
        showError("Please fill in all fields");
        return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address");
        return;
    }

    // Password minimum length
    if (password.length < 4) {
        showError("Password must be at least 4 characters");
        return;
    }

    // Find matching admin
    const admin = ADMIN_CREDENTIALS_LIST.find(a => 
        a.email === email && a.password === password && a.secret === secret
    );

    if (admin) {
        // Show modal notification if available, otherwise use alert
        if (typeof notificationManager !== 'undefined') {
            notificationManager.showModal(
                "🎉 Login Successful",
                `Welcome back, ${admin.name}! You are being redirected to your admin dashboard.`,
                "success",
                {
                    'Admin': admin.name,
                    'Email': email,
                    'Login Time': new Date().toLocaleString()
                }
            );
        } else {
            alert(`Welcome ${admin.name}! Redirecting to dashboard...`);
        }

        // Store admin session
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminName", admin.name);
        localStorage.setItem("loginTime", new Date());

        // Show loading spinner if it exists
        const loadingSpinner = document.getElementById("loadingSpinner");
        if (loadingSpinner) {
            loadingSpinner.style.display = "inline";
        }

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = "admin.html";
        }, 2000);
    } else {
        showError("❌ Invalid credentials. Please check your email, password, and secret code.");
        // Log failed attempts for security monitoring
        console.warn("Failed admin login attempt:", { email, timestamp: new Date() });
    }
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
}
