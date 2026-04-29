// Luxury Hostels Authentication
class AuthManager {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Modal controls
        const modals = document.querySelectorAll('.modal, .auth-modal');
        modals.forEach(modal => {
            const closeBtns = modal.querySelectorAll('.close');
            closeBtns.forEach(btn => btn.onclick = () => this.closeModal(modal));
        });

        // Close modals on outside click
        window.onclick = (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('auth-modal')) {
                this.closeModal(e.target);
            }
        };
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            this.showAlert('Please fill all fields', 'error');
            return;
        }

        // Simulate API call
        const user = await this.validateCredentials(email, password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            app.currentUser = user;
            app.updateAuthUI();
            this.closeModal(document.getElementById('login-modal'));
            this.showAlert(`Welcome back, ${user.name}!`, 'success');
            window.location.href = 'hostels.html';
        } else {
            this.showAlert('Invalid credentials', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const userData = {
            name: document.getElementById('reg-name')?.value,
            email: document.getElementById('reg-email')?.value,
            phone: document.getElementById('reg-phone')?.value,
            password: document.getElementById('reg-password')?.value,
            confirmPassword: document.getElementById('reg-confirm-password')?.value
        };

        // Validation
        if (!this.validateRegisterData(userData)) {
            return;
        }

        // Simulate registration
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            joined: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(newUser));
        app.currentUser = newUser;
        app.updateAuthUI();

        this.closeModal();
        this.showAlert('Account created successfully!', 'success');
        window.location.href = 'hostels.html';
    }

    validateRegisterData(data) {
        if (!data.name || !data.email || !data.phone || !data.password) {
            this.showAlert('Please fill all fields', 'error');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            this.showAlert('Passwords do not match', 'error');
            return false;
        }

        if (data.password.length < 6) {
            this.showAlert('Password must be at least 6 characters', 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showAlert('Please enter valid email', 'error');
            return false;
        }

        return true;
    }

    async validateCredentials(email, password) {
        // Demo users - replace with real API
        const demoUsers = [
            { email: 'user@example.com', password: '123456', name: 'John Doe', phone: '9876543210' },
            { email: 'test@gmail.com', password: 'password', name: 'Jane Smith', phone: '9876543211' }
        ];

        return demoUsers.find(u => u.email === email && u.password === password);
    }

    closeModal(modal = document.querySelector('.modal.active, .auth-modal.active')) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showAlert(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <strong>H&H Luxury:</strong> ${message}<br>
            <small>support@H&HLuxury.com</small>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize auth
const auth = new AuthManager();

// Password toggle utility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}