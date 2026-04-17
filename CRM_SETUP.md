# CRM Setup — HubSpot Free + Integración Web

Guía paso a paso para conectar tu web con HubSpot CRM. Al terminar, cada lead que entre por formulario, chatbot o Cal.com aparecerá automáticamente en tu pipeline de ventas.

---

## Paso 1: Crear cuenta en HubSpot (5 min)

1. Ir a https://app.hubspot.com/signup/crm
2. Registrarte con tu email de negocio (ericknavarroia@gmail.com)
3. Seleccionar "Free CRM" — no necesitas plan pago
4. Completar el onboarding básico

## Paso 2: Obtener tu Hub ID (2 min)

1. Ir a Settings (engranaje arriba a la derecha)
2. En la URL verás algo como: `app.hubspot.com/settings/12345678/...`
3. Ese número (`12345678`) es tu **Hub ID**
4. Reemplazar `YOUR_HUB_ID` en `contacto.html` e `index.html`:
   ```html
   <script src="//js.hs-scripts.com/12345678.js"></script>
   ```

## Paso 3: Crear un formulario en HubSpot (10 min)

Esto es lo que permite recibir leads desde tu web.

1. Ir a **Marketing → Forms → Create Form**
2. Elegir **"Non-HubSpot form"** (importante — tu formulario ya existe en tu web)
3. Configurar los campos:
   - First name (firstname) — obligatorio
   - Email (email) — obligatorio
   - Company (company)
   - Message (message)
4. Además, crear estas **propiedades personalizadas** en Settings → Properties → Create Property:
   - `servicio_interes` (tipo: Single-line text, grupo: Contact information)
   - `origen_lead` (tipo: Single-line text, grupo: Contact information)
5. Guardar el formulario
6. De la URL del formulario o de la sección de sharing, copiar:
   - **Portal ID** (mismo que Hub ID)
   - **Form GUID** (un UUID largo como `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

## Paso 4: Configurar crm.js (2 min)

Abrir `js/crm.js` y reemplazar:

```javascript
const CRM_CONFIG = {
    portalId: '12345678',           // ← Tu Portal ID
    formGuid: 'a1b2c3d4-...',      // ← Tu Form GUID  
    enabled: true,                   // ← Cambiar a true
    // ...
};
```

## Paso 5: Configurar pipeline de ventas (10 min)

1. Ir a **CRM → Deals → Board**
2. Editar las etapas del pipeline para tu negocio:
   - **Nuevo Lead** — acaba de llegar
   - **Consulta Agendada** — tiene cita en Cal.com
   - **Propuesta Enviada** — le mandaste presupuesto
   - **Negociación** — están ajustando detalles
   - **Cerrado Ganado** / **Cerrado Perdido**

## Paso 6: Conectar Cal.com con HubSpot (10 min)

Cal.com puede enviar datos a HubSpot automáticamente cuando alguien agenda una cita.

### Opción A: Integración nativa de Cal.com (recomendado)

1. En Cal.com, ir a **Settings → Apps & Integrations**
2. Buscar **HubSpot** e instalar
3. Autorizar con tu cuenta de HubSpot
4. En tu Event Type, activar la integración de HubSpot
5. Cada reserva creará/actualizará un contacto en HubSpot automáticamente

### Opción B: Webhook + Zapier/Make (alternativa gratuita)

Si la integración nativa no está disponible en tu plan:

1. En Cal.com, ir a **Settings → Webhooks**
2. Crear un webhook con trigger: **Booking Created**
3. En Zapier (zapier.com), crear un Zap:
   - Trigger: **Webhook by Zapier** (Catch Hook)
   - Copiar la URL del webhook de Zapier en Cal.com
   - Action: **HubSpot → Create/Update Contact**
   - Mapear campos:
     - Email → `attendees[0].email`
     - First Name → `attendees[0].name`
     - `origen_lead` → "cal_com"
     - `servicio_interes` → "Consulta gratuita"

### Opción C: Webhook directo a HubSpot Forms API

1. En Cal.com, ir a **Settings → Webhooks**
2. Trigger: **Booking Created**
3. URL: `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`
4. Cal.com enviará el payload, pero necesitarás un worker intermedio para transformar el formato. Puedes usar el Cloudflare Worker que ya tienes.

## Paso 7: Verificar que todo funciona

### Test del formulario:
1. Ir a tu web → Contacto
2. Llenar y enviar el formulario
3. Abrir la consola del navegador (F12) → buscar `[CRM]`
4. Verificar en HubSpot → Contacts que apareció el lead

### Test del chatbot:
1. Abrir el chatbot en tu web
2. Chatear 3+ mensajes sobre un servicio
3. Cuando pregunte si querés que Erick te contacte, decir "sí"
4. Dar nombre y email
5. Verificar en consola: `[Chatbot→CRM] Lead enviado`
6. Verificar en HubSpot → Contacts

### Test de Cal.com:
1. Agendar una cita de prueba
2. Verificar que aparece en HubSpot → Contacts
3. El campo `origen_lead` debería decir "cal_com"

---

## Arquitectura del flujo

```
┌─────────────┐     ┌──────────┐     ┌─────────────┐
│ Formulario  │────→│          │     │             │
│ de contacto │     │          │     │             │
├─────────────┤     │  crm.js  │────→│  HubSpot    │
│  Chatbot    │────→│ (módulo  │     │  Forms API  │
│  (después   │     │  central)│     │             │
│  de 3 msgs) │     │          │     │             │
└─────────────┘     └──────────┘     └──────┬──────┘
                                            │
┌─────────────┐                             │
│  Cal.com    │─── webhook directo ─────────┘
│  (citas)    │    o vía Zapier
└─────────────┘

Todos los leads → HubSpot CRM → Pipeline de ventas
```

## Campos que se envían por cada fuente

| Campo | Formulario | Chatbot | Cal.com |
|-------|-----------|---------|---------|
| nombre | ✓ | ✓ | ✓ |
| email | ✓ | ✓ | ✓ |
| empresa | ✓ | — | — |
| servicio | ✓ (select) | ✓ (auto-detectado) | "Consulta gratuita" |
| mensaje | ✓ (proyecto) | ✓ (resumen chat) | — |
| origen | "formulario_contacto" | "chatbot" | "cal_com" |

## Costos

- HubSpot Free CRM: **$0/mes** (hasta 1,000,000 contactos)
- Cal.com Free: **$0/mes** (1 tipo de evento)
- Zapier Free (si lo usas): **$0/mes** (100 tasks/mes)
- Total: **$0/mes** para empezar

## Próximos pasos opcionales

- **Email sequences**: Configurar secuencias automáticas de follow-up en HubSpot
- **Lead scoring**: Puntuar leads según origen y engagement
- **WhatsApp Business API**: Conectar WhatsApp para captura automática (requiere Meta Business)
- **Dashboard**: Crear reportes en HubSpot para ver conversión por canal
