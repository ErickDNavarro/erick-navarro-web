/**
 * ═══════════════════════════════════════════════════════════════
 * ERICK NAVARRO AI CHATBOT WIDGET
 * ═══════════════════════════════════════════════════════════════
 *
 * A self-contained, dark-themed chat widget with built-in fallback
 * knowledge base and optional API integration.
 *
 * Usage: Include this single file in your HTML:
 * <script src="js/chatbot.js"></script>
 *
 * The chatbot will initialize automatically when the page loads.
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CHATBOT_CONFIG = {
    // Set to your Cloudflare Worker URL to enable AI mode
    // Example: 'https://your-worker.your-subdomain.workers.dev/chat'
    apiEndpoint: 'https://erick-chatbot-production.ericknavarroia.workers.dev/chat',

    // When true, uses built-in keyword matching fallback
    fallbackMode: false,

    // Built-in knowledge base (fallback when API is unavailable)
    knowledgeBase: {
        services: {
            automatizacion: {
                title: "Tareas repetitivas",
                description: "Si tu equipo pasa horas haciendo lo mismo una y otra vez, eso se puede automatizar. Erick te ayuda a eliminar esas tareas para que se enfoquen en lo que importa. ¿Querés contarle tu caso? Son 30 minutos gratis.",
                keywords: ["automatización", "automatizacion", "agentes", "ia", "inteligencia artificial", "workflow", "chatbot", "repetitivo", "manual", "data entry"]
            },
            desarrollo: {
                title: "Herramientas a medida",
                description: "Cuando ningún software del mercado resuelve tu problema, Erick te construye uno. Apps, dashboards, plataformas — a medida de tu negocio. ¿Te interesa charlarlo? La consulta es gratuita.",
                keywords: ["desarrollo", "aplicación", "app", "web", "mobile", "dashboard", "herramienta", "plataforma"]
            },
            consultoria: {
                title: "No sé por dónde empezar",
                description: "Es normal no saber qué automatizar primero. Erick te ayuda a armar un plan claro: qué vale la pena, qué no, cuánto cuesta y cuánto lleva. ¿Querés que lo charlen? 30 minutos sin costo.",
                keywords: ["consultoría", "consultoria", "estrategia", "diagnóstico", "roadmap", "no sé", "empezar", "plan"]
            },
            integracion: {
                title: "Sistemas desconectados",
                description: "Si pasás horas copiando datos de un sistema a otro, eso tiene solución. Erick conecta tus herramientas para que la información fluya sola. ¿Querés verlo con él? Consulta gratis.",
                keywords: ["integración", "integracion", "erp", "crm", "base de datos", "api", "sistemas", "conectar", "copiar datos"]
            },
            formacion: {
                title: "Capacitación en IA",
                description: "Si tu equipo le tiene miedo a la IA o no sabe cómo usarla, Erick da workshops prácticos donde salen usando las herramientas con confianza. ¿Te interesa? Pueden charlarlo en una videollamada gratis.",
                keywords: ["formación", "formacion", "capacitación", "capacitacion", "workshop", "curso", "entrenamiento", "training", "miedo", "equipo"]
            }
        },
        contact: {
            email: "ericknavarroia@gmail.com",
            whatsapp: "1155270357",
            whatsappUrl: "https://wa.me/1155270357",
            calLink: "https://cal.com/erick-david-navarro-linares-wp8mtq",
            availability: "Lunes a Viernes, 9:00 - 18:00 (hora Argentina)",
            keywords: ["contacto", "contact", "email", "whatsapp", "llamada", "call", "teléfono", "telefono", "agendar", "schedule", "reunión", "reunion", "disponibilidad", "cita"]
        },
        pricing: {
            consultation: "Eso depende mucho de cada caso. Lo mejor es que lo charlen en una videollamada de 30 minutos — es gratis y sin compromiso. ¿Querés que te busque un horario?",
            keywords: ["precio", "costo", "cuanto", "cuánto", "tarifa", "presupuesto", "budget", "cost", "price", "vale", "cobrar"]
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// CSS STYLES (Injected via <style> tag)
// ═══════════════════════════════════════════════════════════════

const CHATBOT_STYLES = `
    /* Chatbot Container */
    #chatbot-button {
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff4d00 0%, #ff8c00 100%);
        border: none;
        cursor: pointer;
        z-index: 9997;
        box-shadow: 0 4px 20px rgba(255, 77, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-size: 28px;
    }

    #chatbot-button:hover {
        transform: scale(1.12);
        box-shadow: 0 6px 28px rgba(255, 77, 0, 0.6);
    }

    #chatbot-button:active {
        transform: scale(0.95);
    }

    /* Chat Window */
    #chatbot-window {
        position: fixed;
        bottom: 100px;
        left: 30px;
        width: 400px;
        height: 500px;
        background: #0d0d0d;
        border: 1px solid rgba(255, 77, 0, 0.15);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        z-index: 9997;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 77, 0, 0.1);
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Inter', sans-serif;
    }

    #chatbot-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    /* Header */
    .chatbot-header {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 77, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, rgba(255,77,0,0.05) 0%, rgba(255,140,0,0.02) 100%);
        border-radius: 16px 16px 0 0;
    }

    .chatbot-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }

    .chatbot-badge {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #ff4d00 0%, #ff8c00 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
    }

    .chatbot-title {
        font-size: 16px;
        font-weight: 600;
        color: #eaeaea;
    }

    .chatbot-close {
        background: none;
        border: none;
        color: #777;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .chatbot-close:hover {
        color: #ff4d00;
        transform: rotate(90deg);
    }

    /* Messages Container */
    .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #050505;
    }

    .chatbot-messages::-webkit-scrollbar {
        width: 6px;
    }

    .chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
    }

    .chatbot-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 77, 0, 0.3);
        border-radius: 3px;
    }

    .chatbot-messages::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 77, 0, 0.5);
    }

    /* Message Styles */
    .chatbot-message {
        display: flex;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .chatbot-message.user {
        justify-content: flex-end;
    }

    .chatbot-message.bot {
        justify-content: flex-start;
    }

    .chatbot-bubble {
        padding: 12px 16px;
        border-radius: 12px;
        max-width: 80%;
        word-wrap: break-word;
        font-size: 14px;
        line-height: 1.5;
    }

    .chatbot-bubble.user {
        background: linear-gradient(135deg, #ff4d00 0%, #ff8c00 100%);
        color: #fff;
        border-radius: 12px 4px 12px 12px;
    }

    .chatbot-bubble.bot {
        background: #0d0d0d;
        color: #eaeaea;
        border: 1px solid rgba(255, 77, 0, 0.15);
        border-radius: 4px 12px 12px 12px;
    }

    /* Typing Indicator */
    .chatbot-typing {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: #0d0d0d;
        border: 1px solid rgba(255, 77, 0, 0.15);
        border-radius: 4px 12px 12px 12px;
        max-width: 80%;
    }

    .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 77, 0, 0.6);
        animation: typingAnimation 1.4s infinite;
    }

    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes typingAnimation {
        0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
        }
        30% {
            opacity: 1;
            transform: translateY(-10px);
        }
    }

    /* Input Area */
    .chatbot-input-area {
        padding: 12px;
        border-top: 1px solid rgba(255, 77, 0, 0.1);
        display: flex;
        gap: 8px;
        background: #0d0d0d;
        border-radius: 0 0 16px 16px;
    }

    .chatbot-input {
        flex: 1;
        background: #050505;
        border: 1px solid rgba(255, 77, 0, 0.15);
        border-radius: 8px;
        padding: 10px 12px;
        color: #eaeaea;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;
    }

    .chatbot-input:focus {
        border-color: rgba(255, 77, 0, 0.4);
        background: #0a0a0a;
        box-shadow: 0 0 0 2px rgba(255, 77, 0, 0.1);
    }

    .chatbot-input::placeholder {
        color: #777;
    }

    .chatbot-send {
        background: linear-gradient(135deg, #ff4d00 0%, #ff8c00 100%);
        border: none;
        color: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chatbot-send:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 77, 0, 0.4);
    }

    .chatbot-send:active {
        transform: translateY(0);
    }

    .chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    /* Mobile Responsive */
    @media (max-width: 600px) {
        #chatbot-window {
            width: calc(100% - 20px);
            height: calc(100% - 120px);
            bottom: 80px;
            left: 10px;
            right: 10px;
        }

        .chatbot-bubble {
            max-width: 90%;
        }

        .chatbot-typing {
            max-width: 90%;
        }
    }

    /* Utility Classes */
    .chatbot-hidden {
        display: none !important;
    }
`;

// ═══════════════════════════════════════════════════════════════
// CHATBOT CLASS
// ═══════════════════════════════════════════════════════════════

class ChatbotWidget {
    constructor(config = {}) {
        this.config = { ...CHATBOT_CONFIG, ...config };
        this.isOpen = false;
        this.isLoading = false;
        this.messageHistory = [];
        // ═══ CRM Lead Capture State ═══
        this.leadData = { nombre: '', email: '', servicio: '', mensaje: '', origen: 'chatbot' };
        this.captureState = 'idle'; // idle | asking_contact | asking_name | asking_email | done
        this.interactionCount = 0;
        this.init();
    }

    init() {
        // Inject CSS
        this.injectStyles();

        // Create DOM elements
        this.createElements();

        // Attach event listeners
        this.attachListeners();

        // Show welcome message on first load
        this.showWelcomeMessage();
    }

    injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = CHATBOT_STYLES;
        document.head.appendChild(styleEl);
    }

    createElements() {
        // Chat Button
        this.button = document.createElement('button');
        this.button.id = 'chatbot-button';
        this.button.innerHTML = '💬';
        this.button.title = 'Asistente IA';
        document.body.appendChild(this.button);

        // Chat Window
        this.window = document.createElement('div');
        this.window.id = 'chatbot-window';

        this.window.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-content">
                    <div class="chatbot-badge">EN</div>
                    <div class="chatbot-title">Asistente IA</div>
                </div>
                <button class="chatbot-close" title="Cerrar">✕</button>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input-area">
                <input
                    type="text"
                    class="chatbot-input"
                    placeholder="Escribe tu pregunta..."
                    autocomplete="off"
                />
                <button class="chatbot-send" title="Enviar">➤</button>
            </div>
        `;

        document.body.appendChild(this.window);

        // Cache DOM references
        this.messagesContainer = this.window.querySelector('.chatbot-messages');
        this.input = this.window.querySelector('.chatbot-input');
        this.sendBtn = this.window.querySelector('.chatbot-send');
        this.closeBtn = this.window.querySelector('.chatbot-close');
    }

    attachListeners() {
        // Toggle window
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-scroll on new messages
        const observer = new MutationObserver(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        });
        observer.observe(this.messagesContainer, { childList: true });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.window.classList.add('open');
        this.input.focus();
    }

    close() {
        this.isOpen = false;
        this.window.classList.remove('open');
    }

    showWelcomeMessage() {
        const welcome = "¡Hola! Soy el asistente de Erick. Contame, ¿qué proceso de tu negocio te está llevando más tiempo del que debería?";
        this.addBotMessage(welcome);
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // Add user message to history
        this.messageHistory.push({ role: 'user', content: text });
        this.addUserMessage(text);

        // Clear input
        this.input.value = '';
        this.input.focus();

        // Get response
        this.getResponse(text);
    }

    addUserMessage(text) {
        const msgEl = document.createElement('div');
        msgEl.className = 'chatbot-message user';
        msgEl.innerHTML = `<div class="chatbot-bubble user">${this.escapeHtml(text)}</div>`;
        this.messagesContainer.appendChild(msgEl);
    }

    addBotMessage(text) {
        const msgEl = document.createElement('div');
        msgEl.className = 'chatbot-message bot';
        msgEl.innerHTML = `<div class="chatbot-bubble bot">${this.escapeHtml(text)}</div>`;
        this.messagesContainer.appendChild(msgEl);

        // Add to history
        this.messageHistory.push({ role: 'assistant', content: text });
    }

    showTyping() {
        const msgEl = document.createElement('div');
        msgEl.className = 'chatbot-message bot';
        msgEl.innerHTML = `
            <div class="chatbot-typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        msgEl.id = 'typing-indicator';
        this.messagesContainer.appendChild(msgEl);
    }

    removeTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    async getResponse(userMessage) {
        this.sendBtn.disabled = true;
        this.showTyping();
        this.interactionCount++;

        try {
            // ═══ CRM: Check if we're in lead capture flow ═══
            const captureResponse = this.handleLeadCapture(userMessage);
            if (captureResponse) {
                this.removeTyping();
                this.addBotMessage(captureResponse);
                return;
            }

            let response;

            // Use API if configured, otherwise fallback to knowledge base
            if (this.config.apiEndpoint && !this.config.fallbackMode) {
                response = await this.getAIResponse(userMessage);
            } else {
                response = this.getFallbackResponse(userMessage);
            }

            this.removeTyping();
            this.addBotMessage(response);

            // ═══ CRM: After 3+ interactions, offer to capture lead ═══
            if (this.interactionCount >= 3 && this.captureState === 'idle') {
                this.captureState = 'asking_contact';
                setTimeout(() => {
                    this.addBotMessage("Por cierto, si querés que Erick te contacte directamente para charlar sobre tu caso, dejame tu nombre y email y él se comunica con vos. ¿Te interesa?");
                }, 1500);
            }
        } catch (error) {
            this.removeTyping();
            this.addBotMessage("Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.");
            console.error('Chatbot error:', error);
        } finally {
            this.sendBtn.disabled = false;
        }
    }

    /**
     * Maneja el flujo de captura de leads paso a paso.
     * Retorna un string si estamos en flujo de captura, null si no.
     */
    handleLeadCapture(userMessage) {
        const lower = userMessage.toLowerCase().trim();

        // Detectar si el usuario voluntariamente da su email en cualquier momento
        if (this.captureState !== 'done' && window.CRM) {
            const emailDetected = window.CRM.detectarEmail(userMessage);
            if (emailDetected) {
                this.leadData.email = emailDetected;
                if (!this.leadData.nombre) {
                    this.captureState = 'asking_name';
                    return `¡Genial! Tomé nota de tu email (${emailDetected}). ¿Cómo te llamas para que Erick sepa con quién hablar?`;
                } else {
                    // Ya tenemos nombre y email, enviar lead
                    this.captureState = 'done';
                    this.submitLead();
                    return `¡Perfecto, ${this.leadData.nombre}! Erick va a recibir tus datos y se va a comunicar con vos a la brevedad. Mientras tanto, podés seguir preguntándome lo que necesites.`;
                }
            }
        }

        switch (this.captureState) {
            case 'asking_contact':
                // User responds to "¿Te interesa?"
                if (/sí|si|dale|bueno|claro|ok|vale|porfa|por favor|quiero|yes/.test(lower)) {
                    this.captureState = 'asking_name';
                    return '¡Genial! ¿Cómo te llamas?';
                } else if (/no|ahora no|después|despues|luego/.test(lower)) {
                    this.captureState = 'done'; // Don't ask again
                    return 'Sin problema. Si en algún momento querés que Erick te contacte, solo decime. ¿En qué más puedo ayudarte?';
                }
                return null; // Not a clear yes/no, let normal flow handle it

            case 'asking_name':
                // Capture name
                this.leadData.nombre = userMessage.trim();
                // Detect service interest from conversation history
                this.leadData.servicio = this.detectServiceFromHistory();
                this.leadData.mensaje = this.getConversationSummary();
                this.captureState = 'asking_email';
                return `Mucho gusto, ${this.leadData.nombre}. ¿Cuál es tu email para que Erick te escriba?`;

            case 'asking_email':
                // Capture email
                const email = window.CRM ? window.CRM.detectarEmail(userMessage) : userMessage.trim();
                if (email) {
                    this.leadData.email = email;
                    this.captureState = 'done';
                    this.submitLead();
                    return `¡Listo, ${this.leadData.nombre}! Erick va a recibir tus datos y se va a comunicar con vos pronto. Mientras tanto, podés seguir preguntándome lo que necesites.`;
                } else {
                    return 'Hmm, no pude detectar un email válido. ¿Podrías escribirlo de nuevo? (ej: nombre@empresa.com)';
                }

            default:
                return null; // Not in capture flow
        }
    }

    /**
     * Envía el lead capturado al CRM
     */
    submitLead() {
        if (window.CRM) {
            window.CRM.enviarLead(this.leadData).then(result => {
                if (CRM_CONFIG?.debug || window.CRM?.config?.debug) {
                    console.log('[Chatbot→CRM] Lead enviado:', result);
                }
            });
        }
    }

    /**
     * Detecta el servicio de interés basándose en el historial
     */
    detectServiceFromHistory() {
        const history = this.messageHistory.map(m => m.content).join(' ').toLowerCase();
        const services = this.config.knowledgeBase?.services || {};
        for (const [key, service] of Object.entries(services)) {
            if (service.keywords?.some(kw => history.includes(kw))) {
                return service.title;
            }
        }
        return 'Consulta general';
    }

    /**
     * Resume la conversación para el campo mensaje del CRM
     */
    getConversationSummary() {
        return this.messageHistory
            .filter(m => m.role === 'user')
            .map(m => m.content)
            .slice(0, 5) // Máx 5 mensajes del usuario
            .join(' | ');
    }

    async getAIResponse(userMessage) {
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                history: this.messageHistory.slice(0, -1) // Exclude the last user message we just added
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || "No se pudo obtener una respuesta.";
    }

    getFallbackResponse(userMessage) {
        const kb = this.config.knowledgeBase;
        const lowerMessage = userMessage.toLowerCase();

        // Check pricing keywords
        if (kb.pricing.keywords.some(kw => lowerMessage.includes(kw))) {
            return `${kb.pricing.consultation}\n\nLos precios de nuestros servicios varían según la complejidad y alcance de tu proyecto. Te recomiendo agendar una consulta gratuita para discutir tus necesidades específicas.\n\n📞 ${kb.contact.whatsapp} (WhatsApp)\n📧 ${kb.contact.email}\n\n${kb.contact.availability}`;
        }

        // Check contact/scheduling keywords
        if (kb.contact.keywords.some(kw => lowerMessage.includes(kw))) {
            return `¡Perfecto! Puedo ayudarte a agendar una consulta.\n\n📱 WhatsApp: ${kb.contact.whatsapp}\n📧 Email: ${kb.contact.email}\n🔗 También puedes usar Cal.com para agendar directamente\n\n${kb.contact.availability}`;
        }

        // Check for specific services
        for (const [key, service] of Object.entries(kb.services)) {
            if (service.keywords.some(kw => lowerMessage.includes(kw))) {
                return `${service.title}\n\n${service.description}`;
            }
        }

        // Default response for unmatched queries
        return "No tengo la respuesta exacta a tu pregunta, pero Erick puede ayudarte. ¿Te gustaría agendar una consulta gratuita para discutir tu caso específico?\n\n📱 WhatsApp: " + kb.contact.whatsapp + "\n📧 Email: " + kb.contact.email;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE ON PAGE LOAD
// ═══════════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatbot = new ChatbotWidget();
    });
} else {
    window.chatbot = new ChatbotWidget();
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotWidget;
}
