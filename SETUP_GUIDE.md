# Guia de Configuracion - Erick Navarro Web

## Resumen

Tu sitio tiene 4 integraciones que requieren configuracion externa:

| Integracion | Servicio | Costo | Archivo a editar |
|---|---|---|---|
| Formulario + auto-reply email | EmailJS | Gratis (200 emails/mes) | contacto.html |
| Calendario de citas | Cal.com | Gratis | contacto.html |
| WhatsApp auto-reply | WhatsApp Business App | Gratis | (configurar en celular) |
| Chatbot IA | Cloudflare Workers + API | ~$10-30/mes | js/chatbot.js + chatbot-worker/ |

---

## 1. EmailJS (Formulario de contacto + Auto-reply)

### Que hace
Cuando alguien llena el formulario en contacto.html:
- Te llega un email con los datos del cliente
- El cliente recibe un email automatico confirmando que recibiste su mensaje

### Setup (10 minutos)

1. Crear cuenta en https://www.emailjs.com (gratis)
2. **Agregar servicio de email**: Email Services > Add New Service > Gmail > conectar tu cuenta ericknavarroia@gmail.com
3. **Crear template de notificacion** (el que te llega a ti):
   - Email Templates > Create New Template
   - Subject: `Nuevo lead: {{from_name}} - {{servicio}}`
   - Body:
   ```
   Nuevo contacto desde la web:
   
   Nombre: {{from_name}}
   Email: {{from_email}}
   Empresa: {{empresa}}
   Servicio: {{servicio}}
   
   Proyecto:
   {{proyecto}}
   ```
   - Guardar > anotar el Template ID

4. **Crear template de auto-reply** (el que recibe el cliente):
   - Email Templates > Create New Template
   - To: `{{to_email}}`
   - Subject: `Erick Navarro - Recibi tu mensaje`
   - Body:
   ```
   Hola {{to_name}},
   
   Gracias por contactarme. Recibi tu mensaje y te respondere en menos de 24 horas.
   
   Si tu consulta es urgente, puedes escribirme por WhatsApp: https://wa.me/1155270357
   
   Saludos,
   Erick Navarro
   IA & Consulting
   ```
   - Guardar > anotar el Template ID

5. **Obtener credenciales**: Account > API Keys > copiar Public Key

6. **Editar contacto.html**: Buscar `EMAILJS_CONFIG` y reemplazar:
   ```javascript
   const EMAILJS_CONFIG = {
       publicKey: 'tu_public_key_aqui',
       serviceId: 'tu_service_id_aqui',
       templateNotify: 'template_notificacion_id',
       templateReply: 'template_autoreply_id',
   };
   ```

### Verificar
Enviar un formulario de prueba desde la web. Deberias recibir un email de notificacion y el "cliente" deberia recibir el auto-reply.

---

## 2. Cal.com (Calendario de citas con Google Calendar)

### Que hace
Un widget embebido en la pagina de contacto donde los clientes eligen fecha y hora. Se sincroniza con tu Google Calendar (bloquea horarios ocupados, crea evento automaticamente).

### Setup (15 minutos)

1. Crear cuenta en https://cal.com (gratis)
2. **Conectar Google Calendar**: Settings > Connected Calendars > Google Calendar > autorizar
3. **Crear tipo de evento**:
   - Event Types > New Event Type
   - Nombre: "Consulta Inicial Gratuita"
   - Duracion: 30 minutos
   - Ubicacion: Google Meet (genera link automatico)
   - Disponibilidad: Lunes a Viernes, 9:00 - 18:00
4. **Obtener tu calLink**: Es tu username + slug del evento, ej: `erick-navarro/consulta`

5. **Editar contacto.html**:
   - Buscar el bloque `<!-- Cal.com embed script`
   - Descomentar todo el bloque de script
   - Cambiar `calLink: "erick-navarro/consulta"` por tu calLink real
   - El div placeholder (`#cal-embed`) sera reemplazado automaticamente por el calendario

### Verificar
Abrir contacto.html, deberia aparecer el calendario con tus horarios disponibles.

---

## 3. WhatsApp Business Auto-Reply

### Que hace
Cuando alguien te escribe por WhatsApp (desde el boton de la web), recibe una respuesta automatica instantanea.

### Setup (5 minutos)

1. Descargar **WhatsApp Business** (no el WhatsApp normal) desde Play Store / App Store
2. Registrar con tu numero: 1155270357
3. Configurar perfil de empresa:
   - Nombre: Erick Navarro - IA & Consulting
   - Descripcion: Automatizacion de procesos con IA
   - Horario: Lun-Vie 9:00-18:00
4. **Mensaje de bienvenida**: Herramientas para la empresa > Mensaje de bienvenida:
   ```
   Hola! Gracias por contactar a Erick Navarro - IA & Consulting.
   
   Te respondere lo antes posible. Mientras tanto, puedes:
   - Agendar una consulta gratuita: [link a tu Cal.com]
   - Ver mis servicios: [link a tu web]/servicios.html
   
   Horario de atencion: Lun-Vie 9:00-18:00
   ```
5. **Mensaje de ausencia**: Herramientas para la empresa > Mensaje de ausencia:
   ```
   Hola! En este momento estoy fuera de horario.
   Te respondere el proximo dia habil.
   
   Si es urgente, puedes enviarme un email a: ericknavarroia@gmail.com
   ```
   - Configurar horario: fuera de 9:00-18:00 Lun-Vie

### No requiere cambios en la web
El boton de WhatsApp ya esta configurado correctamente en todas las paginas.

---

## 4. Chatbot IA Conversacional

### Estado actual
El chatbot ya funciona en MODO FALLBACK (sin API de IA) con respuestas pre-programadas sobre tus servicios. Aparece como boton flotante naranja en la esquina inferior izquierda de todas las paginas.

### Para activar el modo IA completo

Ver la guia detallada en `CHATBOT_SETUP.md`. Resumen rapido:

1. Crear cuenta en Cloudflare (gratis)
2. Instalar Wrangler CLI: `npm install -g wrangler`
3. Obtener API key de Anthropic (https://console.anthropic.com) u OpenAI
4. Desplegar el worker desde `chatbot-worker/worker.js`
5. Configurar el endpoint en `js/chatbot.js`

**Costo estimado**: ~$10-30/mes con 100 conversaciones diarias (Cloudflare Workers es gratis, el costo es solo de la API de IA).

---

## Orden de implementacion recomendado

1. **WhatsApp Business** (5 min, gratis, impacto inmediato)
2. **EmailJS** (10 min, gratis, profesionaliza el formulario)
3. **Cal.com** (15 min, gratis, automatiza el agendamiento)
4. **Chatbot IA** (30 min, requiere API key, el mas impresionante)

---

## Estructura de archivos

```
Erick Navarro Web/
  index.html              # Home page
  servicios.html          # Services hub
  automatizacion-ia.html  # Service: AI Automation
  desarrollo.html         # Service: Custom Development
  consultoria.html        # Service: Consulting
  integracion.html        # Service: System Integration
  formacion.html          # Service: Training
  casos.html              # Case Studies
  sobre-mi.html           # About Me
  contacto.html           # Contact (EmailJS + Cal.com)
  css/
    styles.css            # Shared styles
  js/
    main.js               # Shared JS (particles, cursor, GSAP, etc.)
    chatbot.js            # AI chatbot widget
  chatbot-worker/
    worker.js             # Cloudflare Worker para chatbot IA
  CHATBOT_SETUP.md        # Guia detallada del chatbot
  SETUP_GUIDE.md          # Esta guia
```
