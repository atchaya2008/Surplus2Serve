# 🌍 Surplus2Serve - Platform Documentation

## 📌 Quick Links
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [File Structure](#-file-structure)
- [Admin Credentials](#-admin-credentials)
- [Color Theme](#-color-theme)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

**Surplus2Serve** is a community-driven web platform that connects food donors (businesses, restaurants, caterers) with NGOs and charitable organizations. The platform helps reduce food waste while providing nutritious meals to those in need.

### **Key Mission**
> Bridging the gap between surplus food and hungry communities through a seamless digital platform.

---
## Live Demo

[Visit Surplus2Serve Website](https://surplus2serve.vercel.app/)

## ✨ Features

### **For Everyone**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Intuitive user interface
- ✅ Consistent color theme and branding
- ✅ Fast and secure platform
- ✅ Real-time notifications

### **For Donors/Businesses**
- 📝 List surplus food items with details
- 🗺️ Specify pickup/delivery location
- 📊 Track donation history
- ⭐ View impact metrics
- 💬 Communicate with NGOs
- 🏆 Build reputation and impact score

### **For NGOs/Organizations**
- 🔍 Browse available donations
- 📦 Request specific food items
- 🎯 Manage beneficiaries
- 📈 Generate impact reports
- 📞 Contact donors directly
- 🤝 Build partnerships

### **For Admins**
- 👥 Manage all users
- 📋 Monitor donations
- 🔍 Verify organizations
- 💼 Generate analytics
- ⚙️ System settings

---

## 🚀 Installation

### **Requirements**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Text editor (VS Code, Sublime Text, etc.)
- Web server (optional for local testing)

### **Steps**

1. **Clone or Download** the project files
   ```bash
   # Using git
   git clone <repository-url>
   
   # Or download ZIP and extract
   ```

2. **Navigate to project folder**
   ```bash
   cd Suplus2serve
   ```

3. **Open in browser**
   - Double-click `index.html` to open locally
   - OR use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js
     npx http-server
     ```

4. **Access the application**
   - Local: `http://localhost:8000`
   - Or simply open `index.html` in your browser

---

## 🎮 Usage

### **Home Page** (`index.html`)
- Overview of the platform
- Call-to-action buttons for donors and NGOs
- Information about how it works
- Contact details and form
- Footer with links and licenses

### **User Registration** (`registerpage.html`)
1. Click "Register" on any page
2. Enter your details
3. Select your role (Donor or NGO)
4. Fill role-specific information
5. Click "Create Account"

### **User Login** (`loginpage.html`)
1. Enter your email
2. Enter your password
3. Select your role
4. Click "Login"

### **Admin Login** (`adminlogin.html`)
1. Enter admin email: `admin@surplus2serve.com`
2. Enter password: `Admin@2024`
3. Enter secret code: `SURPLUS2SERVE`
4. Click "Login"

### **Donor Dashboard** (`donor.html`)
- Post surplus food
- View posted donations
- Track requests and status
- View past donations

### **NGO Dashboard** (`ngo.html`)
- Browse available donations
- Request food items
- View accepted requests
- Manage collected items

---

## 📁 File Structure

```
Suplus2serve/
│
├── index.html                 # 🏠 Home/Landing Page
├── loginpage.html             # 👤 User Login
├── loginpage.js               # Login Logic
├── registerpage.html          # 📝 Registration Page
├── registerpage.js            # Registration Logic
├── registerpage.css           # Registration Styles
│
├── adminlogin.html            # 🔐 Admin Login
├── adminlogin.js              # Admin Auth Logic
├── admin.html                 # 📊 Admin Dashboard
├── admin.js                   # Admin Features
│
├── donor.html                 # 🤝 Donor Dashboard
├── donor.js                   # Donor Functions
│
├── ngo.html                   # 🙏 NGO Dashboard
├── ngo.js                     # NGO Functions
├── ngo.css                    # NGO Styles
│
├── accepted.html              # ✅ Donation Status
│
├── style.css                  # 🎨 Global Styles
├── script.js                  # 🔧 Global Scripts
│
├── GUIDELINES.md              # 📚 Developer Guidelines
├── README.md                  # 📖 This File
└── LICENSE                    # ⚖️ MIT License
```

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@surplus2serve.com |
| **Password** | Admin@2024 |
| **Secret Code** | SURPLUS2SERVE |

> ⚠️ **Important**: Change these credentials in production!

---

## 🎨 Color Theme

### **Primary Colors**
- **Blue** `#3b82f6` - Main actions, links, primary buttons
- **Green** `#10b981` - Success, NGO actions, secondary CTA
- **Red** `#ef4444` - Errors and alerts
- **Orange** `#f59e0b` - Warnings

### **Neutral Colors**
- **Light** `#f8fafc` - Light backgrounds
- **Dark** `#1e293b` - Footer and dark sections
- **Gray** `#64748b` - Text and secondary content

### **How to Change Theme**

Edit `style.css` (lines 7-21):

```css
:root {
    --primary-color: #3b82f6;      /* Change this */
    --success-color: #10b981;      /* And this */
    --danger-color: #ef4444;       /* And more... */
    /* ... other colors ... */
}
```

All colors throughout the platform will update automatically! ✨

---

## 📱 Responsive Design

The platform is fully responsive:

| Device | Breakpoint | Features |
|--------|-----------|----------|
| **Phone** | < 576px | Single column, touch-friendly |
| **Tablet** | 576px - 768px | Two columns, optimized layout |
| **Desktop** | 768px - 1200px | Three columns, full features |
| **Large Desktop** | > 1200px | Expanded layout, all features |

**Test Responsiveness:**
- Resize browser window
- Use DevTools (F12 → Ctrl+Shift+M)
- Test on actual devices

---

## 🔧 Customization

### **Change Logo/Branding**
Edit `index.html` (line 104):
```html
<a class="navbar-brand" href="#home">
    <i class="fas fa-handshake brand-icon"></i>
    <span class="brand-text">Surplus2Serve</span>
</a>
```

### **Update Contact Information**
Edit `index.html` (Contact Section):
```html
<p>
    123 Main Street<br>
    City, State 12345
</p>
<p>
    Main: +1 (555) 123-4567<br>
    Email: info@surplus2serve.com
</p>
```

### **Add New Pages**
1. Create `newpage.html`
2. Include CSS and JS:
   ```html
   <link rel="stylesheet" href="style.css">
   <script src="script.js"></script>
   ```
3. Add link to navbar
4. Test on mobile

### **Update Admin Credentials**
Edit `adminlogin.js` (lines 5-9):
```javascript
const ADMIN_CREDENTIALS = {
    email: "your@email.com",
    password: "YourPassword123",
    secret: "YOURSECRETCODE"
};
```

---

## 🐛 Troubleshooting

### **Issue: Styles not loading**
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check if `style.css` is in the same folder
- Verify CSS file is linked in HTML head

### **Issue: JavaScript not working**
**Solution:**
- Open DevTools (F12)
- Check Console tab for errors
- Verify JavaScript files are linked
- Check file paths are correct

### **Issue: Forms not submitting**
**Solution:**
- Ensure all required fields are filled
- Check browser console for errors
- Verify form IDs match in HTML and JavaScript
- Test on different browser

### **Issue: Not responsive on mobile**
**Solution:**
- Add viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Test in mobile device browser
- Check media queries in CSS
- Use DevTools mobile view

### **Issue: Admin login not working**
**Solution:**
- Double-check credentials
- Ensure email format is correct
- Secret code is case-sensitive (SURPLUS2SERVE)
- Clear browser localStorage
- Try incognito/private mode

---

## 🚀 Deployment

### **Steps to Deploy**

1. **Upload to Web Server**
   - Use FTP or File Manager
   - Upload all files to server
   - Set `index.html` as home page

2. **Update URLs**
   - Replace local paths with absolute URLs
   - Update form submission endpoints
   - Configure API endpoints

3. **Security**
   - Enable HTTPS
   - Set secure headers
   - Protect admin credentials
   - Validate all inputs

4. **Testing**
   - Test all features
   - Check responsive design
   - Verify form submissions
   - Test on different browsers

---

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully Supported |
| Firefox | Latest | ✅ Fully Supported |
| Safari | Latest | ✅ Fully Supported |
| Edge | Latest | ✅ Fully Supported |
| IE 11 | - | ⚠️ Limited Support |

---

## 📚 External Libraries

The platform uses:

- **Bootstrap 5.3.2** - Responsive framework
  - CDN: https://getbootstrap.com/docs/5.3/
  
- **Font Awesome 6.4.0** - Icon library
  - CDN: https://fontawesome.com/
  
- Modern CSS3 and JavaScript ES6+

---

## 📝 License

This project is licensed under the **MIT License**.

**License Details:**
- Use freely for personal and commercial projects
- Modify and distribute
- Include license notice

See LICENSE file for complete terms.

---

## 📞 Support

### **Getting Help**
1. Check GUIDELINES.md for developer documentation
2. Review code comments in files
3. Check browser console for errors
4. Test in different browsers
5. Contact development team

### **Reporting Issues**
- Document the issue in detail
- Include browser and device info
- Provide steps to reproduce
- Include screenshots if possible

---

## 🎓 Learning Resources

### **Web Development**
- MDN Web Docs: https://developer.mozilla.org/
- CSS-Tricks: https://css-tricks.com/
- JavaScript.info: https://javascript.info/

### **Bootstrap**
- Bootstrap Docs: https://getbootstrap.com/docs/5.3/
- Bootstrap Examples: https://getbootstrap.com/docs/5.3/examples/

### **Git & Version Control**
- Git Guide: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/

---

## 🗺️ Roadmap

### **Version 2.0 (Future)**
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Payment integration
- [ ] Impact analytics
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Auto-matching algorithm
- [ ] Blockchain verification

---

## 👥 Contributors

- Development Team
- UI/UX Designers
- Quality Assurance
- Community Members

---

## 📖 Additional Documentation

For detailed information, see:
- [GUIDELINES.md](GUIDELINES.md) - Developer guidelines
- Code comments in HTML/CSS/JavaScript files
- External library documentation

---

**Last Updated:** April 19, 2024  
**Version:** 1.0  
**Status:** Active Development

---

<div align="center">

### Made with ❤️ for a better world

**Surplus2Serve - Reducing Waste, Reducing Hunger**

</div>
