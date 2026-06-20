document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded - Initializing registration form");
    
    const form = document.getElementById("registerForm");
    const roleSelect = document.getElementById("role");
    const errorMessage = document.getElementById("errorMessage");
    const donorFields = document.getElementById("donorFields");
    const ngoFields = document.getElementById("ngoFields");

    if (!form) {
        console.error("Form element not found!");
        return;
    }

    // ✅ Handle role change to show/hide fields
    roleSelect.addEventListener("change", function () {
        console.log("Role changed to:", this.value);
        donorFields.classList.add("hidden");
        ngoFields.classList.add("hidden");

        if (this.value === "donor") {
            donorFields.classList.remove("hidden");
        } else if (this.value === "ngo") {
            ngoFields.classList.remove("hidden");
        }
    });

    // ✅ Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Form submission triggered");
        
        // Clear previous errors
        errorMessage.textContent = "";
        errorMessage.classList.remove("show");

        try {
            // Get form values
            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const role = roleSelect.value;

            console.log("Form Data:", { fullName, email, phone, role });

            // ✅ Validate basic fields
            if (!fullName || !email || !phone || !password || !confirmPassword || !role) {
                showError("Please fill all required fields.");
                return;
            }

            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                return;
            }

            if (password.length < 6) {
                showError("Password must be at least 6 characters long.");
                return;
            }

            // Create user object
            let userData = {
                fullName,
                email,
                phone,
                password,
                role,
                verificationStatus: role === "ngo" ? "Pending" : "Approved",
                createdAt: new Date().toISOString()
            };

            // ✅ Validate Donor Fields
            if (role === "donor") {
                const address = document.getElementById("donorAddress").value.trim();
                const city = document.getElementById("donorCity").value.trim();
                const pincode = document.getElementById("donorPincode").value.trim();

                if (!address || !city || !pincode) {
                    showError("Please fill all donor required fields.");
                    return;
                }

                userData.organization = document.getElementById("organization").value.trim();
                userData.address = address;
                userData.city = city;
                userData.pincode = pincode;
            }

            // ✅ Validate NGO Fields
            if (role === "ngo") {
                const ngoName = document.getElementById("ngoName").value.trim();
                const ngoRegistration = document.getElementById("ngoRegistration").value.trim();
                const ngoDescription = document.getElementById("ngoDescription").value.trim();
                const address = document.getElementById("ngoAddress").value.trim();
                const city = document.getElementById("ngoCity").value.trim();
                const pincode = document.getElementById("ngoPincode").value.trim();
                const beneficiaries = document.getElementById("beneficiaries").value;

                if (!ngoName || !ngoRegistration || !ngoDescription || !address || !city || !pincode || !beneficiaries) {
                    showError("Please fill all NGO required fields.");
                    return;
                }

                userData.ngoDetails = {
                    ngoName,
                    ngoRegistration,
                    ngoDescription,
                    address,
                    city,
                    pincode,
                    beneficiaries
                };
            }

            // ✅ Get existing users
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // ✅ Check for duplicate email
            if (users.some(user => user.email === email)) {
                showError("This email is already registered. Please use a different email.");
                return;
            }

            // ✅ Save user to localStorage
            users.push(userData);
            localStorage.setItem("users", JSON.stringify(users));
            console.log("User saved to localStorage:", userData);

            // ✅ Notify admin if NGO
            if (role === "ngo") {
                try {
                    if (typeof notificationManager !== 'undefined' && notificationManager.createNotification) {
                        notificationManager.createNotification({
                            type: 'registration',
                            title: '🆕 New NGO Registration',
                            message: userData.ngoDetails.ngoName + ' has registered and is awaiting approval.',
                            recipientRole: 'admin',
                            senderEmail: userData.email,
                            senderName: userData.ngoDetails.ngoName,
                            additionalData: {
                                'Organization': userData.ngoDetails.ngoName,
                                'Registration ID': userData.ngoDetails.ngoRegistration,
                                'Email': userData.email,
                                'Beneficiaries': userData.ngoDetails.beneficiaries,
                                'Status': 'Pending Approval'
                            }
                        });
                    }
                } catch (notifError) {
                    console.warn('Notification error:', notifError);
                }
            }

            // ✅ Show success message
            if (typeof notificationManager !== 'undefined' && notificationManager.showModal) {
                notificationManager.showModal(
                    '✅ Success!',
                    'Account created successfully. Redirecting to login...',
                    'success'
                );
            } else {
                alert('✅ Account created successfully! Redirecting to login page...');
            }

            // ✅ Redirect after 2 seconds
            setTimeout(() => {
                console.log("Redirecting to login page");
                window.location.href = "loginpage.html";
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            showError("An unexpected error occurred. Please try again.");
        }
    });

    // ✅ Helper function to show errors
    function showError(message) {
        console.error("Validation Error:", message);
        errorMessage.textContent = message;
        errorMessage.classList.add("show");
        errorMessage.style.display = "block";
    }
});