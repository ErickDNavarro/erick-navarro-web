# Trust Audit Report — ericknavarro.ai

## Trust Score: 2.8 / 5.0 — Problemático

Activa detectores de BS en visitantes sofisticados. El sitio tiene contenido técnico real y buenas intenciones, pero visualmente y estructuralmente se confunde con una landing page de infoproducto. Un dueño de PYME con experiencia navegando internet cierra la pestaña antes de llegar a la sección de servicios.

---

## Diagnóstico por dimensión

### D1: Identidad verificable — 3.5/5

**Lo bueno**: Hay nombre real (Erick Navarro), foto real en sobre-mi.html y en el CTA final del index, teléfono de WhatsApp, email directo. El schema JSON-LD incluye datos de persona real.

**Lo que falta**: No hay links a LinkedIn, GitHub, ni ninguna red social (`"sameAs": []` está vacío en el JSON-LD). No hay forma de verificar que Erick Navarro existe fuera de esta web. Un visitante escéptico busca "Erick Navarro automatización" en Google y si no encuentra nada más que esta web, la confianza baja. Tampoco hay información legal mínima (CUIT, razón social, dirección física).

**Fix concreto**: Agregar links a LinkedIn y GitHub en el nav o footer. Llenar el array `sameAs` del schema. Considerar agregar un link a un perfil verificable (LinkedIn con historial laboral real).

### D2: Evidencia y prueba social — 2.0/5

**El problema central del sitio**. La página de casos (casos.html) tiene 3 case studies con métricas impresionantes (-95% tiempo, $4,200 ahorro mensual, etc.) pero **ninguno tiene nombre de empresa real**. Son "Empresa de logística, 50 empleados", "Ecommerce", etc. No hay testimonios con nombre y apellido de un cliente real. No hay logos de empresas.

Las métricas del hero ("+50% Reducción tiempo operativo", "24/7 Sistemas autónomos", "3x ROI promedio") no están respaldadas por nada. Son claims sueltos sin contexto. Un visitante sofisticado lee "3x ROI promedio" y piensa: "¿promedio de qué? ¿3 clientes? ¿300? ¿cómo lo calculaste?"

**Fix concreto**: Conseguir permiso de al menos 1-2 clientes reales para nombrarlos. Si hay NDA, usar formato "Empresa del rubro logístico en AMBA" con un testimonio real con nombre de la persona. Las stats del hero o se respaldan con datos reales o se sacan — mejor no tener métricas que tener métricas inventadas.

### D3: Especificidad vs. vaguedad — 3.5/5

**Lo bueno**: Los servicios están bien descritos con customer-voice titles ("Mi equipo vive haciendo lo mismo una y otra vez") que son concretos. El marquee de tecnologías (Python, OpenAI, LangChain, N8N, etc.) muestra stack real. La página sobre-mi tiene narrativa personal creíble.

**Lo mejorable**: El hero principal dice "Construyo automatizaciones que liberan ese tiempo" — es correcto pero genérico. Los precios ($990, $2,490, $5,900+) están pero sin contexto de qué incluye cada uno exactamente (más allá de bullets genéricos como "Hasta 3 flujos automatizados").

**Fix concreto**: En cada plan de pricing, agregar un ejemplo real: "Plan Starter ($990): por ejemplo, automatizar la generación de facturas desde tu CRM y enviarlas por email — ese tipo de complejidad".

### D4: Diseño y estética — 2.0/5

**El elefante en la habitación**. Fondo oscuro + acento naranja brillante (#ff4d00) + partículas animadas + cursor personalizado + efecto scramble en el badge + hero gigante de una línea = el combo exacto que usan las landing pages de infoproductos, cursos de "cómo hacerse millonario con IA", y estafas de marketing digital.

Elementos específicos que activan el detector de BS:
- El `particleCanvas` con líneas conectoras es idéntico al de cientos de templates de "tech landing page"
- El cursor personalizado con ring que sigue el mouse es un trope de "diseño premium" que se asocia con páginas sobreproducidas
- El badge animado que rota entre "DISPONIBLE PARA PROYECTOS / OPEN FOR BUSINESS / AUTOMATIZACIÓN CON IA" es urgencia artificial disfrazada de interactividad
- El noise overlay + glow effects = decoración sin función

Nada de esto es inherentemente malo, pero la combinación crea un look que un visitante de PYME asocia con "me quieren vender algo".

**Fix concreto**: No hace falta tirar todo. Opciones: (1) cambiar a fondo claro con acentos oscuros (rompe el patrón de gurú digital inmediatamente), (2) si mantenés el dark theme, eliminar al menos 2 de los 4 efectos decorativos (partículas, cursor custom, scramble, noise) — elegí los que más te gustan y sacá el resto, (3) agregar más contenido visual real (screenshots de dashboards, videos de proceso) que rompa la monotonía del "texto + animaciones".

### D5: Tono y copywriting — 3.5/5

**Lo bueno**: El copy empático funciona bien. "¿Tu negocio depende demasiado de vos?" es una pregunta legítima que conecta. "Contame tu caso" es invitador sin ser agresivo. El tono rioplatense ("vos", "contame", "laburando") es auténtico y diferenciador.

**Lo mejorable**: La frase "CONSULTA INICIAL GRATUITA" como primer elemento visible activa el mismo patrón de "te quiero vender" aunque la intención sea genuina. "Sistemas que se pagan solos en semanas" (en el schema y en varias partes) es una promesa que suena a infoproducto.

**Fix concreto**: Mover "CONSULTA INICIAL GRATUITA" a más abajo o reformularlo como algo menos publicitario. "Se paga solo en ~1 mes" puede reemplazarse con un ejemplo concreto: "El último cliente recuperó la inversión en 6 semanas — así fue cómo" con link al caso.

### D6: Transparencia — 3.0/5

**Lo bueno**: Los precios están publicados (raro y positivo en este rubro). El proceso de trabajo está descrito en servicios.html (Escucho → Propongo → Construyo → Ajusto). La garantía ("Definimos métricas juntos antes de empezar") es transparente.

**Lo que falta**: No hay política de privacidad. No hay términos de servicio. No hay información legal (CUIT, domicilio fiscal). El footer es mínimo sin información de contacto completa. No hay link a redes sociales verificables.

**Fix concreto**: Agregar al footer: link a política de privacidad (aunque sea básica), link a LinkedIn, y al menos ciudad/país. Crear una página mínima de "legal" o "términos" que muestre que hay una persona/empresa real detrás.

### D7: Coherencia técnica — 3.5/5

**Lo bueno**: El sitio usa tecnología real y bien implementada (GSAP, Schema.org, WebP, responsive). El chatbot con function calling es técnicamente sofisticado. Firebase hosting es una elección sólida.

**Lo mejorable**: Los null bytes en index.html (mencionados en la sesión anterior) son un problema técnico que no debería existir en un sitio de alguien que vende tecnología. El OG image no existe (`og-image.png` referenciado pero no creado). El `sameAs` vacío es un detalle técnico que muestra descuido.

**Fix concreto**: Limpiar los null bytes del HTML. Crear un OG image real. Llenar todos los campos de schema.org que están vacíos o con placeholders.

### D8: Diferenciación — 2.5/5

**El segundo problema grande**. Si tapo "Erick Navarro" del nav y pongo cualquier otro nombre, el sitio podría ser de cualquier consultor de automatización con IA de LATAM. La estructura (hero → servicios → pricing → CTA) es la misma que el 90% de los sitios de freelancers tech.

**Lo que SÍ diferencia**: El tono rioplatense, la foto real en sobre-mi, el chatbot con booking autónomo (cuando funcione), el hecho de que hay precios públicos.

**Lo que NO diferencia**: El diseño visual, la estructura de las páginas, los case studies sin nombres reales, las tecnologías listadas (todos listan las mismas).

**Fix concreto**: La diferenciación más poderosa que tenés disponible ya: **video**. Un video de 60 segundos de vos hablando directo a cámara, explicando qué hacés, mata el 80% de las objeciones de credibilidad. Ningún estafador/bot/template se toma el trabajo de hacer un video genuino hablando directo. Segunda opción: un blogpost técnico donde muestres cómo pensás (no contenido genérico de "5 beneficios de la IA" sino algo como "cómo automaticé X proceso para un cliente y qué aprendí").

---

## Top 5 fixes prioritarios

**1. Conseguir 1-2 testimonios/casos con nombre real** (impacto: altísimo, esfuerzo: medio)
Contactá a tus mejores clientes y pedí permiso para nombrarlos. Un solo caso con "Juan Pérez, dueño de TransporteYA" + su foto + una quote real vale más que 10 métricas anónimas.

**2. Grabar un video de 60 segundos** (impacto: altísimo, esfuerzo: bajo)
No necesita producción. Celular, buena luz, hablá directo: "Soy Erick, me dedico a automatizar procesos para PYMEs. Dejame mostrarte un ejemplo de lo que hago." Embed en el hero o en sobre-mi.

**3. Reducir efectos decorativos** (impacto: alto, esfuerzo: bajo)
Elegí 1 de estos 4 para conservar: partículas, cursor custom, text scramble, noise overlay. Sacá los otros 3. El sitio va a cargar más rápido y va a verse menos "sobreproducido".

**4. Agregar links a perfiles verificables** (impacto: alto, esfuerzo: bajo)
LinkedIn y GitHub en el footer. Que cualquiera pueda verificar que existís fuera de esta web.

**5. Crear página de privacidad/legal** (impacto: medio, esfuerzo: bajo)
Una página mínima con datos básicos: nombre completo, ubicación, email, y una política de privacidad simple. Señal de legitimidad.

---

## Punto de vista alternativo

Este diagnóstico tiene sesgo hacia la estética "sobria y corporativa". Hay mercados donde el dark theme + animaciones funciona perfecto — especialmente entre audiencias jóvenes, tech-native, o si el servicio se vende a startups. Si tu cliente ideal es un CTO de 28 años que trabaja en una startup de SaaS, el diseño actual probablemente le parece moderno y atractivo.

El problema es que tu target declarado son "PYMEs y emprendedores" — y el dueño promedio de una PYME en Argentina tiene 40-55 años, no es tech-native, y su referencia de "sitio profesional" es algo tipo una consultora (Deloitte, no un portfolio de diseñador). Para esa audiencia, el diseño actual activa alarmas.

También vale considerar: los dos feedbacks que recibiste son de 2 personas. Es una muestra chica. Antes de hacer cambios radicales, podrías probar con 5-10 personas más de tu target real y ver si el patrón se repite. Si 8 de 10 dicen lo mismo, el diagnóstico se confirma. Si solo 3 de 10 lo dicen, quizá el problema está en otro lado.
