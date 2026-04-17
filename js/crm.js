/**
 * ═══════════════════════════════════════════════════════════════
 * ERICK NAVARRO - CRM INTEGRATION MODULE
 * ═══════════════════════════════════════════════════════════════
 *
 * Módulo centralizado para enviar leads a HubSpot CRM.
 * Todos los puntos de entrada (formulario, chatbot, Cal.com)
 * usan este módulo para crear contactos en el CRM.
 *
 * SETUP:
 * 1. Crear cuenta en https://app.hubspot.com/signup/crm
 * 2. Ir a Marketing > Forms > Create Form (non-HubSpot form)
 * 3. Copiar Portal ID y Form GUID
 * 4. Reemplazar los valores en CRM_CONFIG abajo
 * 5. Cambiar enabled: true
 *
 * Usage: <script src="js/crm.js"></script> (antes de chatbot.js)
 */

const CRM_CONFIG = {
    // ═══ HUBSPOT ═══
    portalId: '51358404',
    formGuid: 'deeae971-0785-429f-ac99-4c4ed8286d2a',
    enabled: true,
    apiUrl: 'https://api.hsforms.com/submissions/v3/integration/submit',

    // ═══ BREVO (Email Automation) ═══
    // SETUP: Crear cuenta en https://app.brevo.com
    // Ir a Settings > API Keys > Create API Key
    brevo: {
        apiKey: 'YOUR_BREVO_API_KEY',   // Reemplazar con tu API key de Brevo
        listId: null,                     // ID de la lista donde agregar contactos (opcional)
        enabled: false,                   // Cambiar a true después de configurar
    },

    // Logging en consola para debug
    debug: true,
};

/**
 * Envía un lead al CRM de HubSpot.
 *
 * @param {Object} leadData - Datos del lead
 * @param {string} leadData.nombre - Nombre completo
 * @param {string} leadData.email - Email del contacto
 * @param {string} [leadData.empresa] - Nombre de la empresa
 * @param {string} [leadData.servicio] - Servicio de interés
 * @param {string} [leadData.mensaje] - Descripción del proyecto o mensaje
 * @param {string} leadData.origen - Fuente del lead: "formulario_contacto" | "chatbot" | "cal_com"
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function enviarLeadCRM(leadData) {
    // Validación mínima
    if (!leadData.email) {
        if (CRM_CONFIG.debug) console.warn('[CRM] Lead descartado: sin email');
        return { success: false, message: 'Email requerido' };
    }

    if (!CRM_CONFIG.enabled) {
        if (CRM_CONFIG.debug) {
            console.log('[CRM] Modo deshabilitado. Lead que se enviaría:', leadData);
        }
        return { success: true, message: 'CRM deshabilitado (modo test)' };
    }

    // Enviar a Brevo en paralelo (no bloquea el flujo principal)
    enviarLeadBrevo(leadData).catch(err => {
        if (CRM_CONFIG.debug) console.warn('[Brevo] Error no-crítico:', err);
    });

    // Mapear campos al formato HubSpot
    const fields = [
        { name: 'firstname', value: leadData.nombre || '' },
        { name: 'email', value: leadData.email },
        { name: 'company', value: leadData.empresa || '' },
        { name: 'message', value: leadData.mensaje || '' },
        // Campos personalizados de HubSpot (crear en Settings > Properties)
        { name: 'servicio_interes', value: leadData.servicio || '' },
        { name: 'origen_lead', value: leadData.origen || 'web' },
    ];

    const payload = {
        fields: fields.filter(f => f.value !== ''), // Solo campos con valor
        context: {
            pageUri: window.location.href,
            pageName: document.title,
            hutk: getCookie('hubspotutk') || undefined, // Cookie de tracking de HubSpot
        },
        legalConsentOptions: {
            consent: {
                consentToProcess: true,
                text: 'Acepto el procesamiento de mis datos para contacto comercial.',
            }
        }
    };

    const url = `${CRM_CONFIG.apiUrl}/${CRM_CONFIG.portalId}/${CRM_CONFIG.formGuid}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok || response.status === 200) {
            if (CRM_CONFIG.debug) console.log('[CRM] Lead creado exitosamente:', leadData.email);
            return { success: true, message: 'Lead creado en HubSpot' };
        }

        const errorData = await response.json().catch(() => ({}));
        console.error('[CRM] Error al crear lead:', response.status, errorData);
        return { success: false, message: `Error ${response.status}` };
    } catch (error) {
        console.error('[CRM] Error de red:', error);
        return { success: false, message: 'Error de conexión' };
    }
}

/**
 * Envía un contacto a Brevo para email automation.
 * Brevo se encarga de las secuencias de bienvenida y nurturing.
 */
async function enviarLeadBrevo(leadData) {
    if (!CRM_CONFIG.brevo.enabled || !CRM_CONFIG.brevo.apiKey || CRM_CONFIG.brevo.apiKey === 'YOUR_BREVO_API_KEY') {
        if (CRM_CONFIG.debug) console.log('[Brevo] Deshabilitado. Contacto que se enviaría:', leadData.email);
        return { success: true, message: 'Brevo deshabilitado (modo test)' };
    }

    // Mapear origen a tag para segmentar en Brevo
    const origenToTag = {
        'formulario_contacto': 'via-formulario',
        'chatbot': 'via-chatbot',
        'cal_com': 'via-calcom',
    };

    const payload = {
        email: leadData.email,
        attributes: {
            FIRSTNAME: leadData.nombre || '',
            COMPANY: leadData.empresa || '',
            SERVICIO: leadData.servicio || '',
            MENSAJE: leadData.mensaje || '',
            ORIGEN: leadData.origen || 'web',
        },
        updateEnabled: true, // Actualiza si ya existe el contacto
    };

    // Agregar a lista específica si está configurada
    if (CRM_CONFIG.brevo.listId) {
        payload.listIds = [CRM_CONFIG.brevo.listId];
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CRM_CONFIG.brevo.apiKey,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok || response.status === 201 || response.status === 204) {
            if (CRM_CONFIG.debug) console.log('[Brevo] Contacto creado/actualizado:', leadData.email);
            return { success: true, message: 'Contacto agregado a Brevo' };
        }

        const errorData = await response.json().catch(() => ({}));
        // 409 = contacto ya existe (no es error si updateEnabled: true)
        if (response.status === 409) {
            if (CRM_CONFIG.debug) console.log('[Brevo] Contacto ya existía, actualizado:', leadData.email);
            return { success: true, message: 'Contacto ya existía en Brevo' };
        }

        console.error('[Brevo] Error:', response.status, errorData);
        return { success: false, message: `Error ${response.status}` };
    } catch (error) {
        console.error('[Brevo] Error de red:', error);
        return { success: false, message: 'Error de conexión' };
    }
}

/**
 * Lee una cookie por nombre (para hutk de HubSpot)
 */
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

/**
 * Helper: detecta si un texto contiene un email válido
 */
function detectarEmail(texto) {
    const match = texto.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    return match ? match[0] : null;
}

/**
 * Helper: detecta si un texto parece contener un nombre
 * (usado por el chatbot para captura progresiva)
 */
function detectarNombre(texto) {
    // Si el texto es corto (1-4 palabras) y no tiene caracteres especiales,
    // probablemente es un nombre
    const limpio = texto.trim();
    const palabras = limpio.split(/\s+/);
    if (palabras.length >= 1 && palabras.length <= 4 && /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(limpio)) {
        return limpio;
    }
    return null;
}

// Exponer globalmente
window.CRM = {
    enviarLead: enviarLeadCRM,
    detectarEmail,
    detectarNombre,
    config: CRM_CONFIG,
};
