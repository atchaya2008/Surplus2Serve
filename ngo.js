let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Check if user is logged in and is an NGO
if (!currentUser || currentUser.role !== "ngo") {
    setTimeout(() => {
        notificationManager.showModal(
            '⚠️ Authentication Required',
            'Please login as NGO to access this page.',
            'warning'
        );
        setTimeout(() => window.location.href = "loginpage.html", 2000);
    }, 500);
}

// ============================================
// LOAD AVAILABLE DONATIONS FOR NGO
// ============================================
function loadDonations() {
    let container = document.getElementById("donationList");
    if (!container) return;

    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let available = donations.filter(item => !item.status || item.status === "Pending");

    container.innerHTML = "";

    if (available.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h5>No Available Foods</h5>
                    <p>Currently, there are no surplus foods available. Please check back later!</p>
                </div>
            </div>
        `;
        return;
    }

    available.forEach((item, globalIndex) => {
        // Find the actual index in the original donations array
        let actualIndex = donations.findIndex(d => d === item);
        
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-3";
        
        let coordinates = item.latitude && item.longitude ? 
            `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}` :
            (item.location || "Not provided");
        
        let expiryDate = new Date(item.expiry);
        let timeLeft = expiryDate - new Date();
        let hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        let urgencyBadge = hoursLeft < 1 ? '<span class="badge bg-danger">Urgent!</span>' : 
                           hoursLeft < 6 ? '<span class="badge bg-warning">Soon</span>' : 
                           '<span class="badge bg-info">Available</span>';

        col.innerHTML = `
            <div class="card shadow mb-4" style="border-top: 3px solid var(--success-color); height: 100%;">
                <div class="card-body d-flex flex-column">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <h5 class="card-title mb-0">🍴 ${item.foodName}</h5>
                        ${urgencyBadge}
                    </div>
                    
                    <div style="font-size: 0.9rem; line-height: 1.8; flex-grow: 1;">
                        <p><strong>Type:</strong> ${item.foodType}</p>
                        <p><strong>Servings:</strong> ${item.servings}</p>
                        <p><strong>Expiry:</strong> ${new Date(item.expiry).toLocaleString()}</p>
                        <p><strong>📍 Location:</strong> <code style="background: var(--light-bg); padding: 2px 6px; border-radius: 4px;">${coordinates}</code></p>
                        <p><strong>Address:</strong> ${item.address}</p>
                        <p><strong>📞 Contact:</strong> ${item.contact}</p>
                        ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
                    </div>

                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button class="btn btn-success btn-sm flex-grow-1" onclick="acceptDonation(${actualIndex})">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        <button class="btn btn-warning btn-sm flex-grow-1" onclick="rejectDonation(${actualIndex})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

// ============================================
// ACCEPT DONATION
// ============================================
function acceptDonation(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let selected = donations[index];

    if (!selected) return;

    selected.status = "Accepted";
    selected.acceptedBy = currentUser.email;
    selected.acceptedAt = new Date().toISOString();

    localStorage.setItem("donations", JSON.stringify(donations));
    
    // Show modal success notification
    notificationManager.showModal(
        '✅ Donation Accepted!',
        `You have successfully accepted "${selected.foodName}". The donor will be notified.`,
        'success',
        {
            'Item': selected.foodName,
            'Quantity': `${selected.servings} servings`,
            'Location': `${parseFloat(selected.latitude || 0).toFixed(4)}, ${parseFloat(selected.longitude || 0).toFixed(4)}`,
            'Donor Contact': selected.contact
        }
    );
    
    loadDonations();
    loadAccepted();
}

// ============================================
// REJECT DONATION
// ============================================
function rejectDonation(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let selected = donations[index];

    if (!selected) return;

    selected.status = "Rejected";

    localStorage.setItem("donations", JSON.stringify(donations));
    
    notificationManager.showModal(
        '❌ Donation Rejected',
        `You have rejected "${selected.foodName}". It will remain available for other NGOs.`,
        'info'
    );
    
    loadDonations();
}

// ============================================
// LOAD ACCEPTED FOODS
// ============================================
function loadAccepted() {
    let container = document.getElementById("acceptedList");
    if (!container) return;

    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let accepted = donations.filter(item =>
        item.status === "Accepted" && item.acceptedBy === currentUser.email
    );

    container.innerHTML = "";

    if (accepted.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-box"></i>
                    <h5>No Accepted Foods Yet</h5>
                    <p>You haven't accepted any foods yet. Start by browsing available donations!</p>
                </div>
            </div>
        `;
        return;
    }

    accepted.forEach((item, index) => {
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-3";
        
        let acceptedTime = new Date(item.acceptedAt);
        let coordinates = item.latitude && item.longitude ? 
            `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}` :
            (item.location || "Not provided");

        col.innerHTML = `
            <div class="card shadow mb-4 h-100" style="border-left: 4px solid var(--success-color); background-color: #f0fdf4;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title" style="color: var(--success-color);"><i class="fas fa-check-circle"></i> ${item.foodName}</h5>
                    
                    <div style="font-size: 0.9rem; line-height: 1.8; flex-grow: 1;">
                        <p><strong>Type:</strong> ${item.foodType}</p>
                        <p><strong>Servings:</strong> ${item.servings}</p>
                        <p><strong>📍 Location:</strong> <code style="background: white; padding: 2px 6px; border-radius: 4px;">${coordinates}</code></p>
                        <p><strong>Address:</strong> ${item.address}</p>
                        <p><strong>📞 Donor Contact:</strong> ${item.contact}</p>
                        <p><strong>✅ Accepted:</strong> ${acceptedTime.toLocaleString()}</p>
                    </div>

                    <div style="margin-top: 12px;">
                        <button class="btn btn-danger btn-sm w-100" onclick="cancelAcceptance(${index})">
                            <i class="fas fa-undo"></i> Cancel Acceptance
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

// ============================================
// CANCEL ACCEPTANCE
// ============================================
function cancelAcceptance(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let accepted = donations.filter(item =>
        item.status === "Accepted" && item.acceptedBy === currentUser.email
    );
    let selected = accepted[index];
    let actualIndex = donations.findIndex(d => d === selected);

    if (!selected) return;

    selected.status = "Pending";
    selected.acceptedBy = null;

    localStorage.setItem("donations", JSON.stringify(donations));
    
    notificationManager.showModal(
        '↩️ Acceptance Cancelled',
        `You have cancelled the acceptance of "${selected.foodName}". It is now available again.`,
        'info'
    );
    
    loadAccepted();
    loadDonations();
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    localStorage.removeItem("loggedInUser");
    notificationManager.showModal(
        '👋 Goodbye!',
        'You have been logged out. Redirecting to home page...',
        'info'
    );
    setTimeout(() => window.location.href = "index.html", 2000);
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    loadDonations();
    loadAccepted();
});