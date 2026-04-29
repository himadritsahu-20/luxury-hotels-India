// Luxury Hostels India - Main Application
class LuxuryHostelsApp {
    constructor() {
        this.hostelsData = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Load hostels data
        await this.loadHostels();

        // Initialize components
        this.initNavigation();
        this.initSearch();
        this.initAuth();
        this.initChatbot();

        // Page-specific initialization
        if (document.getElementById('hostels-grid')) {
            this.displayHostels(this.hostelsData);
        }

        if (document.getElementById('regions-grid')) {
            this.displayRegions();
        }
    }

    async loadHostels() {
        try {
            const response = await fetch('data/hostels.json');
            this.hostelsData = await response.json().hostels;
            window.hostelsData = this.hostelsData; // Global access
        } catch (error) {
            console.error('Failed to load hostels:', error);
            // Fallback data
            this.hostelsData = [
                {
                    id: 1, name: "Zostel Goa Luxury", location: "Anjuna, Goa",
                    region: "Goa", price: 3500, rating: 4.9,
                    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
                    features: ["AC Rooms", "Pool", "Breakfast", "Rooftop"]
                }
            ];
        }
    }

    initNavigation() {
        // Mobile hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    initSearch() {
        const searchInput = document.getElementById('search-hostels');
        const regionFilter = document.getElementById('region-filter');

        if (searchInput) {
            searchInput.addEventListener('input', this.filterHostels.bind(this));
        }

        if (regionFilter) {
            regionFilter.innerHTML = '<option value="">All Regions</option>' +
                [...new Set(this.hostelsData.map(h => h.region))]
                    .map(region => `<option value="${region}">${region}</option>`)
                    .join('');
            regionFilter.addEventListener('change', this.filterHostels.bind(this));
        }
    }

    displayHostels(hostels) {
        const grid = document.getElementById('hostels-grid');
        if (!grid) return;

        grid.innerHTML = hostels.map(hostel => `
            <div class="hostel-card" onclick="app.bookHostel(${hostel.id})">
                <img src="${hostel.image}" alt="${hostel.name}" loading="lazy">
                <div class="hostel-info">
                    <h3>${hostel.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${hostel.location}</p>
                    <div class="rating">⭐ ${hostel.rating}</div>
                    <div class="price">₹${hostel.price.toLocaleString()}/night</div>
                    <ul class="features">
                        ${hostel.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
                        ${hostel.features.length > 3 ? '<li>+${hostel.features.length-3} more</li>' : ''}
                    </ul>
                    <button class="book-btn">Book Now</button>
                </div>
            </div>
        `).join('');
    }

    displayRegions() {
        const regions = [...new Set(this.hostelsData.map(h => h.region))];
        const grid = document.getElementById('regions-grid');
        if (!grid) return;

        grid.innerHTML = regions.map(region => {
            const regionHostels = this.hostelsData.filter(h => h.region === region);
            return `
                <div class="region-card" onclick="window.location.href='hostels.html?region=${region}'">
                    <div class="region-image" style="background-image: url('${regionHostels[0]?.image}')">
                        <div class="region-overlay"></div>
                    </div>
                    <div class="region-info">
                        <h3>${region}</h3>
                        <p>${regionHostels.length} Luxury Hostels</p>
                        <div class="region-stats">
                            <span>Starting ₹${Math.min(...regionHostels.map(h => h.price)).toLocaleString()}</span>
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterHostels() {
        const search = (document.getElementById('search-hostels')?.value || '').toLowerCase();
        const region = document.getElementById('region-filter')?.value || '';

        let filtered = this.hostelsData;

        if (search) {
            filtered = filtered.filter(h =>
                h.name.toLowerCase().includes(search) ||
                h.location.toLowerCase().includes(search) ||
                h.region.toLowerCase().includes(search)
            );
        }

        if (region) {
            filtered = filtered.filter(h => h.region === region);
        }

        this.displayHostels(filtered);
    }

    bookHostel(id) {
        const hostel = this.hostelsData.find(h => h.id === id);
        if (!hostel) return;

        // Check login
        if (!this.currentUser) {
            document.getElementById('loginBtn')?.click();
            return;
        }

        // Redirect to booking page
        window.location.href = `booking.html?id=${id}`;
    }

    initAuth() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.updateAuthUI();
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            if (this.currentUser) {
                loginBtn.innerHTML = `${this.currentUser.name} <i class="fas fa-sign-out-alt"></i>`;
                loginBtn.onclick = () => this.logout();
                loginBtn.className = 'user-profile';
            } else {
                loginBtn.innerHTML = 'Login';
                loginBtn.onclick = () => {
                    document.getElementById('login-modal')?.classList.add('active');
                };
            }
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthUI();
        window.location.reload();
    }
}

// Initialize app
const app = new LuxuryHostelsApp();
window.app = app;