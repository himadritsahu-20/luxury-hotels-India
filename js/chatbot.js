// Luxury Hostels AI Chatbot
class Chatbot {
    constructor() {
        this.messages = [];
        this.responses = {
            greetings: [
                "Hello! 👋 Welcome to <strong>H&H Luxury Hostels</strong>. Ready to book your 5-star stay?",
                "Namaste! 🙏 <strong>H&H Luxury</strong> - India's premium hostel booking.",
                "Hi! 😊 How can I help you find the perfect luxury hostel?",
            ],
            goa: "🌴 **Goa**: Zostel Goa Luxury Wing (₹3500/night) - AC rooms, pool, rooftop lounge. Perfect for beach vibes!",
            manali: "🏔️ **Manali**: The Hosteller Premium (₹4200/night) - Mountain views, jacuzzi, bonfire area. Himalayan luxury!",
            rishikesh: "🕉️ **Rishikesh**: Moustache Deluxe (₹3800/night) - River view, yoga deck, infinity pool. Spiritual luxury!",
            payment: "💳 **PhonePe Payments**: UPI, Cards, Net Banking. Instant confirmation. Secure & 100% Indian! 🇮🇳",
            booking: "📅 **Booking Process**: 1️⃣ Choose hostel 2️⃣ Login 3️⃣ Select dates 4️⃣ Pay with PhonePe 5️⃣ Get instant confirmation!",
            price: "💰 **Prices start at ₹3500/night** for 5-star luxury hostels. All include AC, breakfast & premium amenities.",
            regions: "🗺️ **Top Regions**: Goa, Manali, Rishikesh, Jaipur, Mumbai, Kerala, Spiti, Kasol, Gokarna, Pondicherry",

            payment: "💳 **H&H PhonePe Payments**: UPI/Cards/Netbanking. Secure booking powered by H&H Luxury.",
            booking: "📅 **H&H Booking**: 1️⃣ Choose 2️⃣ Login 3️⃣ PhonePe 4️⃣ Confirmed! support@H&HLuxury.com"
        };
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('chatbot-toggle')?.addEventListener('click', () => this.toggleChatbot());
        document.getElementById('close-chatbot')?.addEventListener('click', () => this.toggleChatbot());
        document.getElementById('chatbot-send')?.addEventListener('click', () => this.sendMessage());

        const input = document.getElementById('chatbot-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        // Welcome message
        this.addMessage('bot', this.responses.greetings[0]);
    }

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        chatbot.classList.toggle('active');
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        // Get AI response
        const response = this.getAIResponse(message.toLowerCase());
        setTimeout(() => this.addMessage('bot', response), 800);
    }

    sendQuickMessage(query) {
        this.addMessage('user', query);
        const response = this.responses[query] || "Great question! Let me check our luxury hostels for you.";
        setTimeout(() => this.addMessage('bot', response), 500);
    }

    getAIResponse(message) {
        // Smart keyword matching
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.responses.greetings[Math.floor(Math.random() * this.responses.greetings.length)];
        }
        if (message.includes('goa')) return this.responses.goa;
        if (message.includes('manali')) return this.responses.manali;
        if (message.includes('rishikesh')) return this.responses.rishikesh;
        if (message.includes('payment') || message.includes('pay')) return this.responses.payment;
        if (message.includes('book') || message.includes('booking')) return this.responses.booking;
        if (message.includes('price') || message.includes('cost')) return this.responses.price;
        if (message.includes('region') || message.includes('place')) return this.responses.regions;

        return "That's a great question! 😊 We have 5-star luxury hostels across India. Tell me your destination or check our hostels page!";
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="avatar ${sender}">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot
const chatbot = new Chatbot();
window.chatbot = chatbot;