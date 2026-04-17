---
name: case-study-builder
description: "Genera casos de estudio profesionales a partir de datos crudos de proyectos. Transforma información dispersa (notas, métricas, descripciones informales) en narrativas antes/después convincentes con métricas verificables, contexto técnico específico, y formato listo para publicar en web o como PDF. Usá este skill cuando el usuario quiera crear un caso de estudio, documentar un proyecto completado, mostrar resultados de un cliente, armar portfolio de trabajos, necesite 'prueba social' o 'social proof' para su web, o quiera convertir datos de un proyecto en contenido de marketing. También aplica cuando dice 'quiero mostrar lo que hice', 'necesito ejemplos de mi trabajo', 'cómo presento mis resultados', o 'armar portfolio'."
---

# Case Study Builder — De datos crudos a prueba social convincente

## Propósito

El problema más común en sitios de servicios profesionales es la falta de evidencia concreta. Los consultores, freelancers y agencias tienen proyectos reales con resultados reales, pero nunca los documentan de forma que genere confianza. Terminan con frases vagas como "ayudamos a empresas a optimizar sus procesos" cuando podrían tener "automatizamos el proceso de facturación de [empresa], reduciendo de 4 horas diarias a 12 minutos".

Este skill toma lo que el usuario sabe sobre un proyecto (aunque sea informal y desordenado) y lo transforma en un caso de estudio estructurado, específico, y verificable.

## Principios fundamentales

### La especificidad genera confianza

La diferencia entre un caso de estudio que convence y uno que no está en los detalles concretos:

**No convence**: "Automatizamos procesos para una empresa de logística, ahorrando tiempo y dinero."

**Convence**: "Para TransporteYA (15 empleados, Buenos Aires), automatizamos la generación de remitos que antes hacían manualmente en Excel. El proceso pasó de 45 minutos por remito a 2 minutos. Con ~30 remitos diarios, el equipo recuperó 21 horas semanales que ahora dedican a atención al cliente."

La segunda versión tiene: nombre (o tipo) de empresa, tamaño, ubicación, problema específico, solución técnica, métrica de antes, métrica de después, impacto calculado, y uso del tiempo recuperado.

### La honestidad supera al marketing

Un caso de estudio con limitaciones admitidas genera más confianza que uno perfecto. Si el proyecto tuvo desafíos, incluirlos. Si los resultados fueron buenos pero no espectaculares, no inflarlos. El lector sofisticado detecta la exageración y descarta todo el caso.

### Verificabilidad > grandeza

"Reducimos el tiempo de respuesta de 24 horas a 2 horas" es más poderoso que "transformamos radicalmente la experiencia del cliente" aunque el segundo suene más impresionante. Lo primero es verificable; lo segundo es humo.

## Proceso

### 1. Entrevista de extracción

El usuario rara vez tiene los datos organizados. Hacé preguntas específicas para extraer la información. No pidas todo junto — usá una conversación natural.

**Datos mínimos necesarios**:
- ¿Quién era el cliente? (nombre, industria, tamaño, ubicación — si hay NDA, usar descripción anónima pero específica: "empresa de logística con 15 empleados en CABA")
- ¿Cuál era el problema concreto? (no "necesitaban automatizar" sino "¿qué hacían manualmente? ¿cuánto tiempo les tomaba? ¿quién lo hacía? ¿cada cuánto?")
- ¿Qué construiste/implementaste? (tecnologías, integraciones, herramientas)
- ¿Cuál fue el resultado medible? (tiempo ahorrado, errores reducidos, ingresos aumentados, etc.)
- ¿Cuánto tardó el proyecto? (timeline)
- ¿Hubo algún desafío o limitación?

**Datos opcionales que enriquecen mucho**:
- Una cita textual del cliente
- El costo del proyecto vs. el ahorro generado (ROI)
- Qué pasó después (¿el cliente volvió? ¿escalaron la solución?)
- Screenshots o demos del antes/después

### 2. Calcular métricas derivadas

Con los datos crudos, calculá métricas que el usuario quizá no pensó:

- **Tiempo ahorrado por semana/mes/año**: Si un proceso de 45min se redujo a 2min y se hace 30 veces al día, eso son 21.5 horas/semana = 1,118 horas/año
- **Costo del tiempo ahorrado**: Si la hora del empleado cuesta ~$X, el ahorro anual es $Y
- **ROI**: Si el proyecto costó $Z y ahorra $Y/año, el ROI es del N% y se paga solo en M meses
- **Tasa de error**: Si antes había X errores por semana y ahora Y, la reducción es del N%
- **Velocidad de respuesta**: Tiempo de procesamiento antes vs. después

Siempre mostrá el cálculo para que sea verificable. No solo "ahorro de $50,000/año" sino "30 procesos/día × 43 min ahorrados × $15/hora = $161/día = $3,864/mes".

### 3. Estructura del caso de estudio

Generá el caso de estudio en formato Markdown, listo para publicar en web:

```markdown
# [Título orientado a resultado, no a proceso]
<!-- Mal: "Automatización de procesos para empresa de logística" -->
<!-- Bien: "De 4 horas diarias en Excel a 12 minutos: automatización de remitos para TransporteYA" -->

## El desafío
[Describir la situación del cliente ANTES. Ser específico: qué hacían, cómo lo hacían, cuánto les costaba (en tiempo, dinero, o frustración). El lector debe poder imaginarse el dolor.]

## La solución
[Qué se construyó/implementó. Incluir detalles técnicos suficientes para que un profesional del área entienda la complejidad, pero no tanto que un no-técnico se pierda. Mencionar tecnologías y herramientas específicas.]

## Los resultados

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| [Métrica 1] | [valor] | [valor] | [%/x] |
| [Métrica 2] | [valor] | [valor] | [%/x] |

[Párrafo expandiendo los resultados con contexto. Incluir el cálculo del ahorro/ROI.]

## Detalles técnicos
[Para el lector técnico: stack usado, integraciones, arquitectura básica. Esto agrega credibilidad porque demuestra competencia real.]

## Timeline
[Cuánto duró el proyecto, de principio a fin.]

---
**Industria**: [X] | **Tamaño**: [X empleados] | **Duración**: [X semanas] | **Stack**: [tecnologías principales]
```

### 4. Generar variantes de formato

Dependiendo de dónde se va a usar, generá las variantes necesarias:

- **Web (HTML/Markdown)**: El formato principal. Pensado para una página de casos de estudio en el sitio.
- **Resumen corto (1 párrafo)**: Para incluir en la home o en una lista de proyectos. Máximo 3 oraciones con la métrica más impactante.
- **Snippet para redes**: Versión ultra-corta para LinkedIn/Twitter. Formato: "Problema → Solución → Resultado en una métrica."

### 5. Revisión de credibilidad

Antes de entregar, revisá el caso de estudio contra estos criterios:

- ¿Cada claim tiene un dato que lo respalde?
- ¿Las métricas son verificables (se muestra el cálculo)?
- ¿Se mencionan limitaciones o desafíos?
- ¿El tono es informativo, no vendedor?
- ¿Un escéptico podría leer esto sin activar su detector de BS?
- ¿Se incluye suficiente detalle técnico para demostrar competencia?

Si algún criterio falla, ajustá antes de entregar.

## Cuando el usuario no tiene datos precisos

Esto pasa seguido. El usuario dice "hice un proyecto para una empresa y le ahorré mucho tiempo" pero no tiene números exactos. En este caso:

1. Ayudá a reconstruir estimaciones razonables: "¿Más o menos cuántas veces por día hacían ese proceso? ¿Les tomaba minutos u horas?"
2. Marcá las estimaciones como tales: "~30 procesos/día (estimado)" en lugar de presentarlas como datos exactos
3. Usá rangos si hay incertidumbre: "entre 15 y 25 horas semanales"
4. Nunca inventés datos. Si no hay información suficiente para una métrica, omitila en vez de fabricarla.

## Punto de vista alternativo

No todos los casos de estudio necesitan métricas duras. Para servicios creativos, consultoría estratégica, o proyectos donde el valor es difícil de cuantificar, una narrativa bien contada con el contexto del desafío y la solución puede ser más apropiada que forzar números. Si el proyecto no se presta a métricas cuantitativas, adaptá el formato: más narrativa, más contexto cualitativo, más detalle del proceso de pensamiento.
