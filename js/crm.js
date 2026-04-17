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
    // ═══ REEMPLAZAR ESTOS VALORES ═══
    portalId: '51357778',
    formGuid: '0d562004-d81b-44ca-8252-ee611a0844aa',
    enabled: true,
    // ═════════════════════════════════

    // HubSpot Forms API endpoint
    apiUrl: 'https://api.hsforms.com/submissions/v3/integration/submit',

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
