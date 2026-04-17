# Email Automation con Brevo — Setup y Secuencias

## Por qué Brevo

Brevo (ex Sendinblue) es la mejor opción gratuita para tu caso: 300 emails/día (9,000/mes), automatizaciones visuales incluidas en el plan free, y API REST para conectar con tu web. No necesitás pagar hasta que superes esos límites, que para un consultor independiente es mucho volumen.

---

## Paso 1: Crear cuenta en Brevo (5 min)

1. Ir a https://app.brevo.com/account/register
2. Registrate con ericknavarroia@gmail.com
3. Confirmar email
4. En el onboarding, elegí "Marketing Automation" como objetivo

## Paso 2: Obtener API Key (2 min)

1. Ir a **Settings → API Keys** (o SMTP & API en el menú)
2. Click **"Generate a new API key"**
3. Nombre: "Web Lead Capture"
4. Copiar la key (empieza con `xkeysib-...`)
5. Abrir `js/crm.js` y reemplazar:

```javascript
brevo: {
    apiKey: 'xkeysib-TU-KEY-AQUÍ',
    listId: null,        // Se configura en paso 3
    enabled: true,       // Cambiar a true
},
```

## Paso 3: Crear lista de contactos (3 min)

1. Ir a **Contacts → Lists → Create a list**
2. Nombre: "Leads Web"
3. Anotar el **List ID** (aparece en la URL o en los detalles de la lista)
4. Actualizar `js/crm.js`:

```javascript
listId: 3,  // El número de tu lista
```

## Paso 4: Crear atributos personalizados (5 min)

1. Ir a **Contacts → Settings → Contact Attributes**
2. Crear estos atributos (tipo Text):
   - `SERVICIO` — servicio de interés
   - `ORIGEN` — de dónde vino (formulario, chatbot, cal.com)
   - `MENSAJE` — descripción del proyecto
   - `COMPANY` — empresa (si no existe ya)

## Paso 5: Configurar las automatizaciones (20 min)

Ir a **Automations → Create an automation**

---

### Secuencia 1: Bienvenida (todos los leads)

**Trigger**: Contacto se agrega a la lista "Leads Web"

```
[Inmediato] Email 1: Bienvenida personal
    ↓ esperar 1 día
[Día 1] Email 2: Caso de éxito relevante
    ↓ esperar 2 días
[Día 3] Email 3: Invitación a consulta gratuita
```

#### Email 1 — Bienvenida (inmediato)

**Asunto**: Recibí tu mensaje, {{contact.FIRSTNAME}}
**De**: Erick Navarro <ericknavarroia@gmail.com>

```
Hola {{contact.FIRSTNAME}},

Gracias por escribirme. Quería confirmarte personalmente que recibí tu mensaje.

Soy Erick, me dedico a ayudar a empresas y emprendedores a automatizar esos procesos que les consumen tiempo y no generan valor directo.

En las próximas horas voy a revisar lo que me contaste y te respondo con mis ideas. Si mientras tanto querés adelantar, podés agendar directamente una videollamada conmigo (30 min, sin costo):

→ https://cal.com/erick-david-navarro-linares-wp8mtq

Hablamos pronto.

Erick Navarro
IA & Automatización
ericknavarro.ai
```

**Por qué funciona**: Confirma la recepción, humaniza (no es un bot), y ofrece el siguiente paso sin presión.

#### Email 2 — Caso de éxito (día 1)

**Asunto**: Cómo una PyME ahorró 20 horas/semana con una automatización simple
**De**: Erick Navarro <ericknavarroia@gmail.com>

```
Hola {{contact.FIRSTNAME}},

Te cuento algo que me pasó con un cliente hace poco.

Tenían un equipo de 3 personas que pasaba medio día copiando datos entre su sistema de ventas y un Excel. Todos los días, lo mismo.

Les armé una automatización que conecta ambos sistemas. Hoy esos datos fluyen solos, y esas 3 personas se dedican a atender clientes y cerrar ventas.

¿El resultado? 20+ horas/semana recuperadas y un equipo que por fin hace lo que genera ingresos.

Lo más interesante: no fue un proyecto de meses ni costó una fortuna. Fue cuestión de conectar las herramientas correctas.

Si tu negocio tiene procesos parecidos — repetitivos, manuales, que te roban tiempo — probablemente se puedan resolver de la misma forma.

¿Querés que lo charlemos? Son 30 minutos, sin compromiso:

→ https://cal.com/erick-david-navarro-linares-wp8mtq

Erick
```

**Por qué funciona**: Prueba social a través de historia concreta. No vende, muestra resultados.

#### Email 3 — Invitación directa (día 3)

**Asunto**: ¿Te sirve una opinión experta gratis, {{contact.FIRSTNAME}}?
**De**: Erick Navarro <ericknavarroia@gmail.com>

```
Hola {{contact.FIRSTNAME}},

Una última cosa y no te molesto más (a menos que me escribas vos 😄).

Ofrezco una videollamada de diagnóstico de 30 minutos totalmente gratuita. No es un pitch de ventas. Es una conversación honesta donde:

1. Me contás qué procesos te consumen más tiempo
2. Te digo cuáles se pueden automatizar (y cuáles no vale la pena)
3. Te llevo un mini-plan con pasos concretos

Si después de la llamada decidís que no es para vos, perfecto. Te quedás con el plan igualmente.

→ Elegí el horario que te convenga: https://cal.com/erick-david-navarro-linares-wp8mtq

Erick Navarro
ericknavarro.ai
```

**Por qué funciona**: Último empujón con valor real (el diagnóstico), sin presión, con humor para humanizar.

---

### Secuencia 2: Re-engagement (leads que no agendaron después de 7 días)

**Trigger**: 7 días después de agregarse a la lista Y no tiene deal en HubSpot

```
[Día 7] Email: Contenido de valor (guía o checklist)
```

#### Email — Recurso gratuito

**Asunto**: 5 procesos que toda PyME debería automatizar primero
**De**: Erick Navarro <ericknavarroia@gmail.com>

```
Hola {{contact.FIRSTNAME}},

Armé una lista rápida de los 5 procesos que más tiempo le roban a las empresas pequeñas, y que son los más fáciles de automatizar:

1. Respuestas a consultas frecuentes (chatbot + IA)
2. Carga de datos entre sistemas (integraciones automáticas)
3. Seguimiento de leads y clientes (CRM + automatización)
4. Generación de reportes (dashboards automáticos)
5. Envío de presupuestos y facturas (templates + triggers)

Si alguno de estos te suena familiar, probablemente estés dejando horas (y plata) sobre la mesa.

¿Querés que lo miremos juntos? → https://cal.com/erick-david-navarro-linares-wp8mtq

Erick
```

---

## Arquitectura completa del flujo

```
Visitante llega a la web
        │
        ├── Formulario de contacto ──┐
        ├── Chatbot (deja datos) ────┤
        └── Cal.com (agenda cita) ───┤
                                     │
                              ┌──────▼──────┐
                              │   crm.js    │
                              │  (módulo    │
                              │  central)   │
                              └──┬──────┬───┘
                                 │      │
                    ┌────────────▼┐  ┌──▼────────────┐
                    │  HubSpot   │  │    Brevo       │
                    │  (CRM +    │  │  (Email        │
                    │  pipeline) │  │   automation)  │
                    └────────────┘  └───────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  Secuencia de   │
                                   │  3 emails en    │
                                   │  3 días         │
                                   └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  ¿Agendó cita?  │
                                   │  Sí → Pipeline   │
                                   │  No → Email día 7│
                                   └─────────────────┘
```

## Métricas a monitorear

En Brevo → Dashboard vas a poder ver:

- **Open rate**: objetivo >40% (emails personales suelen tener tasas altas)
- **Click rate**: objetivo >10% (clicks en el link de Cal.com)
- **Conversion**: cuántos agendan consulta después de recibir la secuencia

## Costos

- Brevo Free: $0/mes (hasta 300 emails/día)
- Si creces mucho: plan Starter $9/mes (20,000 emails/mes)
