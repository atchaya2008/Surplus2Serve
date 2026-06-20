
const loginForm = document.getElementById("loginForm");
const role = document.getElementById("role");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

const secretField = document.getElementById("secretCodeField");
const secretInput = document.getElementById("secretCode");


// 🔥 Predefined users
const predefinedUsers = [
    {
        fullName: "Demo Donor",
        email: "donor@gmail.com",
        password: "1234",
        role: "donor"
    },
    {
        fullName: "Demo NGO",
        email: "ngo@gmail.com",
        password: "1234",
        role: "ngo",
        verificationStatus: "Approved"
    }
];

// 🔐 Secret code
const SECRET_CODE = "FOOD123";

// Show/hide secret code field safely
role.addEventListener("change", () => {
    if (role.value.toLowerCase() === "admin") {
        if (secretField) secretField.style.display = "block";
    } else {
        if (secretField) secretField.style.display = "none";
    }
});

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();
    errorMessage.textContent = "";

    let selectedRole = role.value.toLowerCase();
    let enteredEmail = email.value.trim().toLowerCase();
    let enteredPassword = password.value.trim();

    if (!selectedRole || !enteredEmail || !enteredPassword) {
        errorMessage.textContent = "Please fill all fields.";
        return;
    }

    

    // 🔥 DONOR / NGO LOGIN

    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // normalize stored users
    storedUsers = storedUsers.map(u => ({
        ...u,
        email: u.email.toLowerCase(),
        role: u.role.toLowerCase()
    }));

    let allUsers = [...storedUsers, ...predefinedUsers];

    let user = allUsers.find(u =>
        u.email === enteredEmail &&
        u.password === enteredPassword &&
        u.role === selectedRole
    );

    if (!user) {
        errorMessage.textContent = "Invalid credentials.";
        return;
    }

    if (user.role === "ngo" && user.verificationStatus !== "Approved") {
        errorMessage.textContent = "NGO not approved yet.";
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    notificationManager.showModal(
        '✅ Login Successful!',
        `Welcome ${user.fullName}! Redirecting to your dashboard...`,
        'success'
    );

    setTimeout(() => {
        if (user.role === "donor") {
            window.location.href = "donor.html";
        } else {
            window.location.href = "ngo.html";
        }
    }, 2000);

});