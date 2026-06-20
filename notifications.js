/* ============================================
   SURPLUS2SERVE - NOTIFICATION SYSTEM
   Modal Dialogs & Email Notifications
   ============================================ */

// Notification Service Manager
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.initializeModals();
    }

    // Load notifications from localStorage
    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    }

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Create a new notification
    createNotification(data) {
        const notification = {
            id: Date.now(),
            type: data.type, // 'post', 'acceptance', 'registration', 'approval'
            title: data.title,
            message: data.message,
            recipientRole: data.recipientRole, // 'donor', 'ngo', 'admin'
            recipientEmail: data.recipientEmail,
            senderEmail: data.senderEmail,
            senderName: data.senderName,
            timestamp: new Date().toISOString(),
            read: false,
            additionalData: data.additionalData || {}
        };

        this.notifications.push(notification);
        this.saveNotifications();
        this.sendEmailNotification(notification);
        return notification;
    }

    // Send email notification
    sendEmailNotification(notification) {
        // This would integrate with backend email service
        const emailData = {
            to: notification.recipientEmail,
            subject: notification.title,
            template: notification.type,
            data: {
                title: notification.title,
                message: notification.message,
                senderName: notification.senderName,
                timestamp: new Date(notification.timestamp).toLocaleString(),
                additionalData: notification.additionalData
            }
        };

        // Log for demonstration (replace with actual API call)
        console.log('📧 Email Notification Sent:', emailData);
        
        // In production, send to backend:
        // fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) })
    }

    // Get notifications for user
    getNotificationsForUser(email, role) {
        return this.notifications.filter(n => 
            n.recipientEmail === email || n.recipientRole === role
        );
    }

    // Get unread count
    getUnreadCount(email, role) {
        return this.getNotificationsForUser(email, role).filter(n => !n.read).length;
    }

    // Mark as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    // Delete notification
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
    }

    // Initialize modal elements
    initializeModals() {
        // Create modal HTML
        if (!document.getElementById('notificationModal')) {
            const modalHTML = `
                <div id="notificationModal" class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 id="modalTitle">Notification</h5>
                            <button type="button" class="modal-close" onclick="closeNotificationModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p id="modalMessage"></p>
                            <div id="additionalInfo"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onclick="closeNotificationModal()">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    // Show modal notification
    showModal(title, message, type = 'success', additionalData = null) {
        const modal = document.getElementById('notificationModal');
        const titleEl = document.getElementById('modalTitle');
        const messageEl = document.getElementById('modalMessage');
        const infoEl = document.getElementById('additionalInfo');

        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Add icon based on type
        const icons = {
            'success': '✓',
            'error': '✗',
            'info': 'ℹ',
            'warning': '⚠'
        };

        titleEl.innerHTML = `<span class="modal-icon modal-${type}">${icons[type]}</span> ${title}`;

        // Add additional information if provided
        if (additionalData) {
            infoEl.innerHTML = `
                <div class="modal-additional-info">
                    ${Object.entries(additionalData).map(([key, value]) => 
                        `<p><strong>${key}:</strong> ${value}</p>`
                    ).join('')}
                </div>
            `;
        } else {
            infoEl.innerHTML = '';
        }

        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    // Hide modal
    hideModal() {
        const modal = document.getElementById('notificationModal');
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Global notification manager instance
const notificationManager = new NotificationManager();

// Close modal function
function closeNotificationModal() {
    notificationManager.hideModal();
}

// Donor Posts Surplus Food - Notify NGOs
function notifyNGOsOfNewPost(donorEmail, donorName, foodDetails, donorContact) {
    // Get all registered NGOs (would come from database)
    const ngos = JSON.parse(localStorage.getItem('registeredNGOs') || '[]');
    
    ngos.forEach(ngo => {
        notificationManager.createNotification({
            type: 'post',
            title: '🍴 New Surplus Food Available!',
            message: `${donorName} has posted surplus food: ${foodDetails.itemName} (${foodDetails.quantity})`,
            recipientRole: 'ngo',
            recipientEmail: ngo.email,
            senderEmail: donorEmail,
            senderName: donorName,
            additionalData: {
                'Item': foodDetails.itemName,
                'Quantity': foodDetails.quantity,
                'Quality': foodDetails.quality,
                'Donor': donorName,
                'Location': donorContact.location,
                'Contact': donorContact.phone
            }
        });
    });
}

// NGO Accepts Food - Notify Donor
function notifyDonorOfAcceptance(ngoEmail, ngoName, donorEmail, donorName, postId, foodDetails) {
    notificationManager.createNotification({
        type: 'acceptance',
        title: '✅ Food Accepted!',
        message: `${ngoName} has accepted your surplus food: ${foodDetails.itemName}`,
        recipientRole: 'donor',
        recipientEmail: donorEmail,
        senderEmail: ngoEmail,
        senderName: ngoName,
        additionalData: {
            'Organization': ngoName,
            'Item': foodDetails.itemName,
            'Quantity': foodDetails.quantity,
            'Acceptance Time': new Date().toLocaleString(),
            'Post ID': postId
        }
    });

    // Remove post from available list
    removePostFromAvailable(postId);
}

// Remove post from available food list
function removePostFromAvailable(postId) {
    const availablePosts = JSON.parse(localStorage.getItem('availablePosts') || '[]');
    const updatedPosts = availablePosts.filter(post => post.id !== postId);
    localStorage.setItem('availablePosts', JSON.stringify(updatedPosts));
    console.log(`Post ${postId} removed from available list`);
}

// NGO Registration - Notify Admin
function notifyAdminOfNGORegistration(ngoData) {
    const adminEmails = JSON.parse(localStorage.getItem('adminEmails') || '[]');
    
    adminEmails.forEach(adminEmail => {
        notificationManager.createNotification({
            type: 'registration',
            title: '🆕 New NGO Registration',
            message: `${ngoData.name} has registered as an NGO`,
            recipientRole: 'admin',
            recipientEmail: adminEmail,
            senderEmail: ngoData.email,
            senderName: 'System',
            additionalData: {
                'Organization': ngoData.name,
                'Email': ngoData.email,
                'Registration Number': ngoData.registrationNumber,
                'Beneficiaries': ngoData.beneficiaries,
                'Status': 'Pending Approval'
            }
        });
    });
}

// Admin Approves NGO - Notify NGO and Admins
function notifyNGOofApproval(ngoEmail, ngoName, approvedBy) {
    const adminEmails = JSON.parse(localStorage.getItem('adminEmails') || '[]');
    
    // Notify NGO
    notificationManager.createNotification({
        type: 'approval',
        title: '🎉 Registration Approved!',
        message: `Your NGO "${ngoName}" has been approved and is now active!`,
        recipientRole: 'ngo',
        recipientEmail: ngoEmail,
        senderEmail: 'admin@surplus2serve.com',
        senderName: 'Admin Team',
        additionalData: {
            'Organization': ngoName,
            'Approved By': approvedBy,
            'Status': 'Active'
        }
    });

    // Notify all admins
    adminEmails.forEach(adminEmail => {
        notificationManager.createNotification({
            type: 'approval',
            title: '✅ NGO Approved',
            message: `Admin has approved NGO: ${ngoName}`,
            recipientRole: 'admin',
            recipientEmail: adminEmail,
            senderEmail: 'system@surplus2serve.com',
            senderName: 'System',
            additionalData: {
                'Organization': ngoName,
                'Approved By': approvedBy
            }
        });
    });
}

// Donor Posts Food - Notify Admin
function notifyAdminOfNewPost(donorEmail, donorName, foodDetails) {
    const adminEmails = JSON.parse(localStorage.getItem('adminEmails') || '[]');
    
    adminEmails.forEach(adminEmail => {
        notificationManager.createNotification({
            type: 'post',
            title: '📝 New Food Post',
            message: `${donorName} has posted surplus food: ${foodDetails.itemName}`,
            recipientRole: 'admin',
            recipientEmail: adminEmail,
            senderEmail: donorEmail,
            senderName: donorName,
            additionalData: {
                'Item': foodDetails.itemName,
                'Quantity': foodDetails.quantity,
                'Quality': foodDetails.quality,
                'Donor': donorName,
                'Status': 'Active'
            }
        });
    });
}

// Display notifications in dashboard
function displayNotifications(email, role) {
    const userNotifications = notificationManager.getNotificationsForUser(email, role);
    const container = document.getElementById('notificationsContainer');
    
    if (!container) return;

    if (userNotifications.length === 0) {
        container.innerHTML = '<p class="no-notifications">No notifications yet</p>';
        return;
    }

    container.innerHTML = userNotifications.map(notif => `
        <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
            <div class="notification-header">
                <h5 class="notification-title">${getNotificationIcon(notif.type)} ${notif.title}</h5>
                <span class="notification-time">${formatTime(notif.timestamp)}</span>
            </div>
            <p class="notification-message">${notif.message}</p>
            <div class="notification-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="markAsRead(${notif.id})">
                    ${notif.read ? 'Read' : 'Mark as Read'}
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteNotification(${notif.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Get icon for notification type
function getNotificationIcon(type) {
    const icons = {
        'post': '🍴',
        'acceptance': '✅',
        'registration': '🆕',
        'approval': '🎉'
    };
    return icons[type] || 'ℹ️';
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return date.toLocaleDateString();
}

// Mark notification as read
function markAsRead(notifId) {
    notificationManager.markAsRead(notifId);
    const element = document.querySelector(`[data-id="${notifId}"]`);
    if (element) {
        element.classList.remove('unread');
        element.classList.add('read');
    }
}

// Delete notification
function deleteNotification(notifId) {
    if (confirm('Delete this notification?')) {
        notificationManager.deleteNotification(notifId);
        const element = document.querySelector(`[data-id="${notifId}"]`);
        if (element) {
            element.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => element.remove(), 300);
        }
    }
}

// Get unread count
function getUnreadNotificationCount(email, role) {
    return notificationManager.getUnreadCount(email, role);
}
