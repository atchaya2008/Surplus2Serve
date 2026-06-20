// Map-related variables
let map;
let marker;
let selectedLocation = {
    lat: null,
    lng: null,
    address: null
};
let currentDeleteIndex = null;

// ============================================
// MAP & LOCATION FUNCTIONS
// ============================================

function openMapModal() {
    document.getElementById("mapModal").style.display = "block";
    
    // Simple map fallback - show instructions and allow manual coordinate entry
    const mapContainer = document.getElementById("mapContainer");
    if (mapContainer && mapContainer.style.backgroundColor !== 'rgb(200, 220, 255)') {
        mapContainer.style.backgroundColor = '#c8dcff';
        mapContainer.style.display = 'flex';
        mapContainer.style.alignItems = 'center';
        mapContainer.style.justifyContent = 'center';
        mapContainer.innerHTML = `
            <div style="text-align: center; color: #333; padding: 20px;">
                <i class="fas fa-map" style="font-size: 48px; color: #0d6efd; margin-bottom: 15px; display: block;"></i>
                <h5>📍 Location Picker</h5>
                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                    <strong>How to find your coordinates:</strong><br>
                    1. Open <a href="https://maps.google.com" target="_blank" style="color: #0d6efd; text-decoration: none;">Google Maps</a><br>
                    2. Right-click on your location<br>
                    3. Copy the latitude & longitude shown
                </p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px; border: 2px solid #0d6efd;">
                    <p style="margin-bottom: 10px; color: #666; font-size: 13px;"><strong>Enter Coordinates:</strong></p>
                    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <input type="number" id="latitudeInput" placeholder="Latitude" step="0.0001" min="-90" max="90" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                        <input type="number" id="longitudeInput" placeholder="Longitude" step="0.0001" min="-180" max="180" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
                    </div>
                    <button type="button" onclick="setCoordinatesFromInput()" style="padding: 8px 15px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-weight: 600;">Set Coordinates</button>
                </div>
            </div>
        `;
    }
}

function setCoordinatesFromInput() {
    const lat = parseFloat(document.getElementById('latitudeInput').value);
    const lng = parseFloat(document.getElementById('longitudeInput').value);
    
    if (isNaN(lat) || isNaN(lng)) {
        notificationManager.showModal('⚠️ Invalid Coordinates', 'Please enter valid coordinates.', 'warning');
        return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        notificationManager.showModal('⚠️ Out of Range', 'Lat: -90 to 90, Lng: -180 to 180', 'warning');
        return;
    }
    
    selectedLocation = {
        lat: lat,
        lng: lng,
        address: lat.toFixed(6) + ', ' + lng.toFixed(6)
    };
    
    document.getElementById('selectedLat').innerText = lat.toFixed(6);
    document.getElementById('selectedLng').innerText = lng.toFixed(6);
    document.getElementById('confirmBtn').disabled = false;
    notificationManager.showModal('✅ Coordinates Set', 'Click Confirm to save.', 'success');
}

function getCurrentLocationGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                selectedLocation = {
                    lat: lat,
                    lng: lng,
                    address: lat.toFixed(6) + ', ' + lng.toFixed(6)
                };
                
                document.getElementById('location').value = selectedLocation.address;
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;
                
                const displayText = '<i class="fas fa-check-circle" style="color: #28a745;"></i> GPS: ' + lat.toFixed(4) + ', ' + lng.toFixed(4);
                document.getElementById('locationText').innerHTML = displayText;
                document.getElementById('locationDisplay').classList.add('selected');
                
                notificationManager.showModal('📍 GPS Found!', 'Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6), 'success');
                closeMapModal();
            },
            (error) => {
                notificationManager.showModal('⚠️ GPS Failed', 'Enable location or use map picker.', 'warning');
            }
        );
    } else {
        notificationManager.showModal('⚠️ No Geolocation', 'Browser does not support GPS.', 'warning');
    }
}

function confirmLocation() {
    if (selectedLocation.lat && selectedLocation.lng) {
        document.getElementById("location").value = selectedLocation.address;
        document.getElementById("latitude").value = selectedLocation.lat;
        document.getElementById("longitude").value = selectedLocation.lng;
        
        const displayText = '<i class="fas fa-check-circle" style="color: #28a745;"></i> Location: ' + selectedLocation.lat.toFixed(4) + ', ' + selectedLocation.lng.toFixed(4);
        document.getElementById("locationText").innerHTML = displayText;
        document.getElementById("locationDisplay").classList.add("selected");
        
        notificationManager.showModal('✅ Location Confirmed!', 'Ready to submit donation.', 'success');
        setTimeout(() => closeMapModal(), 1500);
    } else {
        notificationManager.showModal('⚠️ No Location', 'Please select location first.', 'warning');
    }
}

function closeMapModal() {
    document.getElementById("mapModal").style.display = "none";
}

function placeMarker(location) {
    // Compatibility placeholder
}

window.onclick = function(event) {
    let modal = document.getElementById("mapModal");
    if (event.target === modal) {
        closeMapModal();
    }
};

// ============================================
// DONATION MANAGEMENT FUNCTIONS
// ============================================

function addDonation(event) {
    event.preventDefault();

    // Validate location selection
    if (!document.getElementById("location").value) {
        notificationManager.showModal('📍 Location Required', 'Please select location first.', 'warning');
        return;
    }

    let donation = {
        foodName: document.getElementById("foodName").value,
        foodType: document.getElementById("foodType").value,
        servings: document.getElementById("servings").value,
        expiry: document.getElementById("expiry").value,
        address: document.getElementById("address").value,
        contact: document.getElementById("contact").value,
        location: document.getElementById("location").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        notes: document.getElementById("notes").value,
        timestamp: new Date().toISOString(),
        status: "Pending",
        acceptedBy: null,
        acceptedAt: null
    };

    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    donations.push(donation);
    localStorage.setItem("donations", JSON.stringify(donations));

    // Reset form
    document.querySelector('.card form').reset();
    document.getElementById("locationDisplay").className = "location-display";
    document.getElementById("locationText").innerHTML = "No location selected";
    selectedLocation = { lat: null, lng: null, address: null };

    notificationManager.showModal('✅ Donation Posted!', 'Uploaded: ' + donation.foodName, 'success', {
        'Type': donation.foodType,
        'Servings': donation.servings,
        'Location': donation.latitude.toFixed(4) + ', ' + donation.longitude.toFixed(4)
    });
    
    displayDonations();
}

function displayDonations() {
    let container = document.getElementById("donationList");
    let donations = JSON.parse(localStorage.getItem("donations")) || [];

    container.innerHTML = "";

    if (donations.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No donations yet.</p></div>';
        return;
    }

    donations.forEach((item, index) => {
        let col = document.createElement("div");
        col.className = "col-md-4";
        
        let coordinates = parseFloat(item.latitude || 0).toFixed(4) + ', ' + parseFloat(item.longitude || 0).toFixed(4);
        let statusBadge = new Date() > new Date(item.expiry) ? '<span class="badge bg-danger">Expired</span>' : '<span class="badge bg-success">Active</span>';
        let html = '<div class="card shadow mb-4" style="border-left: 4px solid #10b981;"><div class="card-body">';
        html += '<div style="display: flex; justify-content: space-between;"><h5>🍴 ' + item.foodName + '</h5>' + statusBadge + '</div>';
        html += '<p><b>Type:</b> ' + item.foodType + '</p>';
        html += '<p><b>Servings:</b> ' + item.servings + '</p>';
        html += '<p><b>Expiry:</b> ' + new Date(item.expiry).toLocaleString() + '</p>';
        html += '<p><b>📍 Location:</b> <code>' + coordinates + '</code></p>';
        html += '<p><b>Address:</b> ' + item.address + '</p>';
        html += '<p><b>Contact:</b> ' + item.contact + '</p>';
        if (item.notes) html += '<p><b>Notes:</b> ' + item.notes + '</p>';
        html += '<button class="btn btn-danger btn-sm" onclick="deleteDonation(' + index + ')"><i class="fas fa-trash"></i> Delete</button>';
        html += '</div></div>';
        
        col.innerHTML = html;
        container.appendChild(col);
    });
}

function deleteDonation(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    
    // Validate index
    if (index < 0 || index >= donations.length) {
        alert('Invalid donation entry');
        return;
    }
    
    // Store the index globally for confirmation
    currentDeleteIndex = index;
    const deletedItem = donations[index];
    
    // Get the modal
    const modal = document.getElementById('notificationModal');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    
    if (!modal || !titleEl || !messageEl) {
        alert(`Are you sure you want to delete "${deletedItem.foodName}"?`);
        if (confirm('Confirm deletion?')) {
            confirmDeleteDonation();
        }
        return;
    }
    
    // Update modal content
    titleEl.innerHTML = '<span style="color: #dc3545;">⚠️ Confirm Delete</span>';
    messageEl.textContent = `Are you sure you want to delete "${deletedItem.foodName}"? This action cannot be undone.`;
    
    // Show modal using class
    modal.classList.add('active');
}

function confirmDeleteDonation() {
    if (currentDeleteIndex === null) {
        alert('Error: No donation selected for deletion');
        return;
    }
    
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    const deleteIndex = currentDeleteIndex;
    
    if (deleteIndex < 0 || deleteIndex >= donations.length) {
        alert('Error: Invalid donation entry');
        closeNotificationModal();
        return;
    }
    
    const deletedItem = donations[deleteIndex];
    donations.splice(deleteIndex, 1);
    localStorage.setItem("donations", JSON.stringify(donations));
    
    // Reset the global index
    currentDeleteIndex = null;
    
    closeNotificationModal();
    if (typeof notificationManager !== 'undefined') {
        notificationManager.showModal('🗑️ Deleted', 'Donation removed: ' + deletedItem.foodName, 'info');
    } else {
        alert('✅ Donation deleted: ' + deletedItem.foodName);
    }
    displayDonations();
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayDonations();
});