// ═══════════════════════════════════════════════════════════════════════════════
// Analytics & Tracking Module
// ═══════════════════════════════════════════════════════════════════════════════
// SETUP INSTRUCTIONS:
// 1. Create GA4 property at https://analytics.google.com
// 2. Get Measurement ID (format: G-XXXXXXXXXX)
// 3. Replace GA4_MEASUREMENT_ID below
// 4. (Optional) Add Facebook Pixel ID at the Facebook Pixel section
// 5. (Optional) Add Google Ads conversion IDs at the Google Ads section
// ═══════════════════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────────────────────────────
const ANALYTICS_CONFIG = {
    ga4MeasurementId: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
    facebookPixelId: null, // Replace with your Facebook Pixel ID (e.g., '1234567890')
    googleAdsConversionId: null, // Replace with your Google Ads Conversion ID (e.g., 'AW-XXXXXXXXX')
    debug: false, // Set to true to log events to console
};

// ──────────────────────────────────────────────────────────────────────────────
// Privacy & Consent Management
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Check if user has Do Not Track (DNT) enabled
 */
function isDoNotTrackEnabled() {
    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || window.doNotTrack === '1';
}

/**
 * Check if analytics should be loaded based on privacy preferences
 */
function shouldLoadAnalytics() {
    if (isDoNotTrackEnabled()) {
        if (ANALYTICS_CONFIG.debug) {
            console.log('[Analytics] Do Not Track enabled - analytics disabled');
        }
        return false;
    }
    return true;
}

// ──────────────────────────────────────────────────────────────────────────────
// Google Analytics 4 (GA4) Setup
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Load Google Analytics 4 dynamically
 */
function loadGA4() {
    if (!ANALYTICS_CONFIG.ga4MeasurementId || ANALYTICS_CONFIG.ga4MeasurementId === 'G-XXXXXXXXXX') {
        if (ANALYTICS_CONFIG.debug) {
            console.warn('[Analytics] GA4 Measurement ID not configured');
        }
        return;
    }

    // Create script element for gtag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4MeasurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.ga4MeasurementId, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
    });

    window.gtag = gtag;

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] GA4 loaded with ID:', ANALYTICS_CONFIG.ga4MeasurementId);
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Facebook Pixel Setup (Optional)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Load Facebook Pixel dynamically (if configured)
 */
function loadFacebookPixel() {
    if (!ANALYTICS_CONFIG.facebookPixelId) {
        return;
    }

    // eslint-disable-next-line no-unused-vars
    !(function(f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', ANALYTICS_CONFIG.facebookPixelId);
    fbq('track', 'PageView');

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Facebook Pixel loaded with ID:', ANALYTICS_CONFIG.facebookPixelId);
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Event Tracking Functions
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Track event in GA4
 * @param {string} eventName - The event name
 * @param {object} eventData - Event parameters object
 */
function trackEvent(eventName, eventData = {}) {
    if (!window.gtag) {
        if (ANALYTICS_CONFIG.debug) {
            console.warn('[Analytics] gtag not available');
        }
        return;
    }

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Event tracked:', eventName, eventData);
    }

    window.gtag('event', eventName, eventData);
}

/**
 * Track Facebook Pixel event (if configured)
 * @param {string} eventName - Facebook Pixel event name
 * @param {object} eventData - Event data
 */
function trackFacebookPixelEvent(eventName, eventData = {}) {
    if (!window.fbq) {
        return;
    }

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Facebook Pixel event tracked:', eventName, eventData);
    }

    window.fbq('track', eventName, eventData);
}

// ──────────────────────────────────────────────────────────────────────────────
// Custom Event Trackers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Track form submission
 */
function trackContactFormSubmit() {
    trackEvent('contact_form_submit', {
        'event_category': 'engagement',
        'event_label': 'Contact Form'
    });
    trackFacebookPixelEvent('Contact');
}

/**
 * Track WhatsApp button clicks
 */
function trackWhatsAppClick(phoneNumber = '') {
    trackEvent('whatsapp_click', {
        'event_category': 'engagement',
        'event_label': 'WhatsApp',
        'phone_number': phoneNumber
    });
    trackFacebookPixelEvent('Contact');
}

/**
 * Track phone/WhatsApp link clicks
 */
function trackPhoneClick(phoneNumber = '') {
    trackEvent('phone_click', {
        'event_category': 'engagement',
        'event_label': 'Phone/WhatsApp Link',
        'phone_number': phoneNumber
    });
    trackFacebookPixelEvent('Contact');
}

/**
 * Track chatbot opening
 */
function trackChatbotOpen() {
    trackEvent('chatbot_open', {
        'event_category': 'engagement',
        'event_label': 'Chatbot'
    });
}

/**
 * Track chatbot message send
 */
function trackChatbotMessage(messageContent = '') {
    trackEvent('chatbot_message', {
        'event_category': 'engagement',
        'event_label': 'Chatbot Message',
        'message_length': messageContent.length
    });
}

/**
 * Track calendar (Cal.com) interaction
 */
function trackCalendarClick() {
    trackEvent('calendar_click', {
        'event_category': 'engagement',
        'event_label': 'Calendar/Cal.com'
    });
    trackFacebookPixelEvent('Contact');
}

/**
 * Track CTA button click
 */
function trackCtaClick(buttonText = '') {
    trackEvent('cta_click', {
        'event_category': 'engagement',
        'event_label': buttonText
    });
}

/**
 * Track service page view
 */
function trackServicePageView(serviceName = '') {
    trackEvent('service_page_view', {
        'event_category': 'page_view',
        'event_label': serviceName,
        'page_title': document.title,
        'page_path': window.location.pathname
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Event Delegation Setup
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Initialize event delegation for tracking
 */
function initializeEventDelegation() {
    // Track CTA button clicks (.btn-fill)
    document.addEventListener('click', function(event) {
        const ctaButton = event.target.closest('.btn-fill');
        if (ctaButton) {
            trackCtaClick(ctaButton.textContent.trim());
        }

        // Track WhatsApp float button
        const whatsappButton = event.target.closest('.whatsapp-float, [data-whatsapp-button]');
        if (whatsappButton) {
            const phoneNumber = whatsappButton.getAttribute('href') || '';
            trackWhatsAppClick(phoneNumber);
        }

        // Track phone links
        const phoneLink = event.target.closest('a[href^="tel:"], a[href^="https://wa.me"]');
        if (phoneLink) {
            const phone = phoneLink.getAttribute('href') || '';
            trackPhoneClick(phone);
        }

        // Track calendar interaction
        const calendarElement = event.target.closest('[data-calendly], iframe[src*="cal.com"]');
        if (calendarElement) {
            trackCalendarClick();
        }

        // Track chatbot interactions
        const chatbotOpen = event.target.closest('[data-chatbot-trigger], .chatbot-toggle, .chat-button');
        if (chatbotOpen) {
            trackChatbotOpen();
        }
    }, true);

    // Track form submissions
    document.addEventListener('submit', function(event) {
        const form = event.target;
        if (form.id === 'contact-form' || form.classList.contains('contact-form')) {
            trackContactFormSubmit();
        }
    }, true);

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Event delegation initialized');
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Service Page Detection
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Detect and track service page views
 */
function detectServicePageView() {
    const pathname = window.location.pathname.toLowerCase();
    const servicePages = {
        'automatizacion-ia': 'AI Automation',
        'desarrollo': 'Web Development',
        'consultoria': 'Consulting',
        'integracion': 'System Integration',
        'formacion': 'Training',
        'casos': 'Case Studies'
    };

    for (const [path, name] of Object.entries(servicePages)) {
        if (pathname.includes(path)) {
            trackServicePageView(name);
            return;
        }
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API for external use
// ──────────────────────────────────────────────────────────────────────────────

window.Analytics = {
    trackEvent: trackEvent,
    trackContactFormSubmit: trackContactFormSubmit,
    trackWhatsAppClick: trackWhatsAppClick,
    trackPhoneClick: trackPhoneClick,
    trackChatbotOpen: trackChatbotOpen,
    trackChatbotMessage: trackChatbotMessage,
    trackCalendarClick: trackCalendarClick,
    trackCtaClick: trackCtaClick,
    trackServicePageView: trackServicePageView,
    isDoNotTrackEnabled: isDoNotTrackEnabled,
    config: ANALYTICS_CONFIG
};

// ──────────────────────────────────────────────────────────────────────────────
// Initialization
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Initialize analytics on page load
 */
function initializeAnalytics() {
    if (!shouldLoadAnalytics()) {
        if (ANALYTICS_CONFIG.debug) {
            console.info('[Analytics] Analytics initialization skipped (privacy settings)');
        }
        return;
    }

    // Load GA4
    loadGA4();

    // Load Facebook Pixel (if configured)
    if (ANALYTICS_CONFIG.facebookPixelId) {
        loadFacebookPixel();
    }

    // Initialize event delegation
    initializeEventDelegation();

    // Track service page views
    detectServicePageView();

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Initialization complete');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    // DOM is already loaded
    initializeAnalytics();
}

// ──────────────────────────────────────────────────────────────────────────────
// Google Ads Conversion Tracking (Optional)
// ──────────────────────────────────────────────────────────────────────────────
/*
 * Uncomment and configure if using Google Ads
 *
 * function trackGoogleAdsConversion(conversionId, conversionLabel, value = null, currency = 'USD') {
 *     if (!ANALYTICS_CONFIG.googleAdsConversionId) {
 *         return;
 *     }
 *
 *     gtag('event', 'conversion', {
 *         'allow_custom_scripts': true,
 *         'send_to': `${ANALYTICS_CONFIG.googleAdsConversionId}/${conversionLabel}`,
 *         'value': value,
 *         'currency': currency
 *     });
 *
 *     if (ANALYTICS_CONFIG.debug) {
 *         console.log('[Analytics] Google Ads conversion tracked:', conversionLabel);
 *     }
 * }
 *
 * // Track form submission as conversion
 * function trackFormSubmissionAsConversion() {
 *     trackGoogleAdsConversion(ANALYTICS_CONFIG.googleAdsConversionId, 'contact_form_conversion');
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════════
// End of Analytics Module
// ═══════════════════════════════════════════════════════════════════════════════
