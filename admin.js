
// CHECK ADMIN LOGIN
if (!localStorage.getItem("adminLoggedIn")) {
    window.location.href = "adminlogin.html";
}

// 🔥 ACTIVITY LOG FUNCTION
function logActivity(message) {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.push({ message, time: new Date().toLocaleString() });
    localStorage.setItem("logs", JSON.stringify(logs));
}

// 📊 DISPLAY LOGS
function loadLogs() {
    let logContainer = document.getElementById("activityLog");
    let logs = JSON.parse(localStorage.getItem("logs")) || [];

    if (logs.length === 0) {
        logContainer.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>No activities yet</p></div>';
        return;
    }

    logContainer.innerHTML = "";
    logs.slice().reverse().forEach(log => {
        let logItem = document.createElement("div");
        logItem.className = "activity-item";
        logItem.innerHTML = `
            <div class="activity-message">${log.message}</div>
            <div class="activity-time"><i class="fas fa-clock"></i> ${log.time}</div>
        `;
        logContainer.appendChild(logItem);
    });
}

// 🍱 LOAD DONATIONS + REMOVE EXPIRED
function loadDonations() {
    let container = document.getElementById("donationList");
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let now = new Date();

    // Remove expired automatically
    donations = donations.filter(item => {
        if (!item.expiry) return true;
        let expiryTime = new Date(item.expiry);
        if (expiryTime < now) {
            logActivity(`Expired food removed: ${item.foodName}`);
            return false;
        }
        return true;
    });

    localStorage.setItem("donations", JSON.stringify(donations));
    container.innerHTML = "";

    if (donations.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="empty-state"><i class="fas fa-box"></i><p>No active donations</p></div></div>';
        return;
    }

    donations.forEach((item, index) => {
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-3";
        
        let coordinates = item.latitude && item.longitude ? 
            `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}` :
            (item.location || "Not provided");
        
        let statusBadge = item.status && item.status === "Accepted" ? 
            '<span class="badge bg-success">Accepted</span>' : 
            '<span class="badge bg-info">Pending</span>';

        col.innerHTML = `
            <div class="card card-donation h-100">
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <h5 class="card-title mb-0">🍴 ${item.foodName}</h5>
                        ${statusBadge}
                    </div>
                    <div style="font-size: 0.9rem; line-height: 1.8;">
                        <p><strong>Type:</strong> ${item.foodType}</p>
                        <p><strong>Servings:</strong> ${item.servings}</p>
                        <p><strong>Expiry:</strong> ${new Date(item.expiry).toLocaleString()}</p>
                        <p><strong>📍 Location:</strong> <code style="background: var(--light-bg); padding: 2px 6px; border-radius: 4px;">${coordinates}</code></p>
                        <p><strong>Address:</strong> ${item.address}</p>
                        <p><strong>Contact:</strong> ${item.contact}</p>
                        ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
                    </div>
                    <button class="btn btn-danger btn-sm btn-action mt-2 w-100" onclick="deleteDonation(${index})">
                        <i class="fas fa-trash"></i> Remove Donation
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// ❌ DELETE DONATION
function deleteDonation(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let removed = donations[index];
    donations.splice(index, 1);
    localStorage.setItem("donations", JSON.stringify(donations));

    logActivity(`Admin removed donation: ${removed.foodName}`);

    notificationManager.showModal(
        '🗑️ Donation Removed',
        `You have removed "${removed.foodName}" from the system.`,
        'info'
    );

    loadDonations();
    loadLogs();
}

// 🏢 LOAD NGO APPROVAL
function loadNGOs() {
    let container = document.getElementById("ngoList");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let ngos = users.filter(u => u.role === "ngo" && u.verificationStatus === "Pending");

    container.innerHTML = "";

    if (ngos.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="empty-state"><i class="fas fa-check-circle"></i><p>No pending NGO approvals</p></div></div>';
        return;
    }

    ngos.forEach((ngo, index) => {
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-3";
        
        col.innerHTML = `
            <div class="card card-ngo h-100">
                <div class="card-body">
                    <h5 class="card-title" style="color: var(--success-color);"><i class="fas fa-building"></i> ${ngo.ngoDetails.ngoName}</h5>
                    <div style="font-size: 0.9rem; line-height: 1.8; margin-bottom: 1rem;">
                        <p><strong>📧 Email:</strong> ${ngo.email}</p>
                        <p><strong>🆔 Registration:</strong> ${ngo.ngoDetails.ngoRegistration}</p>
                        <p><strong>📄 Description:</strong> ${ngo.ngoDetails.description || "Not provided"}</p>
                        <p><strong>👥 Beneficiaries:</strong> ${ngo.ngoDetails.beneficiaries || "Not specified"}</p>
                        <p><strong>📍 Location:</strong> ${ngo.ngoDetails.address}, ${ngo.ngoDetails.city}</p>
                    </div>
                    <span class="badge bg-warning mb-3">Pending Approval</span>

                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm btn-action flex-grow-1" onclick="approveNGO(${index})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger btn-sm btn-action flex-grow-1" onclick="rejectNGO(${index})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// ✅ APPROVE NGO
function approveNGO(index) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let ngos = users.filter(u => u.role === "ngo" && u.verificationStatus === "Pending");
    let selected = ngos[index];

    // Update verification status
    users.forEach(user => {
        if (user.email === selected.email) {
            user.verificationStatus = "Approved";
        }
    });

    localStorage.setItem("users", JSON.stringify(users));
    logActivity(`NGO approved: ${selected.ngoDetails.ngoName}`);

    notificationManager.showModal(
        '✅ NGO Approved!',
        `You have approved "${selected.ngoDetails.ngoName}". They can now access the platform.`,
        'success'
    );

    loadNGOs();
    loadLogs();
}

// ❌ REJECT NGO
function rejectNGO(index) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let ngos = users.filter(u => u.role === "ngo" && u.verificationStatus === "Pending");
    let selected = ngos[index];

    // Update verification status
    users.forEach(user => {
        if (user.email === selected.email) {
            user.verificationStatus = "Rejected";
        }
    });

    localStorage.setItem("users", JSON.stringify(users));
    logActivity(`NGO rejected: ${selected.ngoDetails.ngoName}`);

    notificationManager.showModal(
        '❌ NGO Rejected',
        `You have rejected the application for "${selected.ngoDetails.ngoName}".`,
        'info'
    );

    loadNGOs();
    loadLogs();
}

// 🚀 INIT - Load all dashboard data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadLogs();
    loadDonations();
    loadNGOs();
});

// 🚪 LOGOUT
function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    notificationManager.showModal(
        '👋 Goodbye!',
        'You have been logged out. Redirecting to admin login...',
        'info'
    );
    setTimeout(() => window.location.href = "adminlogin.html", 2000);
}
