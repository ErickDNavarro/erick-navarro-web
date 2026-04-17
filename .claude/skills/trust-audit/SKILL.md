---
name: trust-audit
description: "Auditoría anti-patrón de estafa para sitios web. Analiza páginas web (HTML, screenshots, o URLs) buscando señales que erosionan la confianza del visitante: claims sin evidencia, diseño genérico de 'landing page de gurú', urgencia artificial, fotos de stock, falta de identidad personal verificable, y similitud con infoproductos/MLM. Devuelve un Trust Score con diagnóstico detallado y fixes accionables priorizados. Usá este skill siempre que necesites evaluar credibilidad, confianza, o profesionalismo de un sitio web — incluso si el usuario solo dice 'revisá mi web', 'qué opinás de mi página', 'parece profesional?', 'cómo puedo generar más confianza', o 'por qué no convierte'."
---

# Trust Audit — Auditoría Anti-Patrón de Estafa

## Propósito

Este skill existe porque hay un problema real y frecuente: muchos sitios web de servicios profesionales legítimos terminan pareciéndose a landing pages de infoproductos, MLM, o estafas — no porque lo sean, sino porque copian las mismas plantillas, el mismo tono, y los mismos patrones visuales. El resultado es que visitantes inteligentes (exactamente el tipo de cliente que querés atraer) se van en segundos porque su detector de BS se activa.

La auditoría identifica exactamente qué señales están activando ese detector y proporciona fixes concretos y priorizados.

## Cuándo usar este skill

- El usuario quiere evaluar si su web "se ve profesional" o "genera confianza"
- Alguien le dio feedback negativo sobre la credibilidad de su sitio
- La web tiene buen tráfico pero mala conversión (posible problema de confianza)
- Se quiere diferenciar de competidores genéricos
- Antes de lanzar o rediseñar un sitio de servicios

## Proceso de auditoría

### 1. Recopilar el material

Necesitás al menos uno de estos:
- Los archivos HTML del sitio (ideal — podés analizar código + contenido)
- Screenshots de las páginas principales
- URL pública para visitar con el navegador

Si tenés acceso a los HTML, leelos. Si solo hay una URL, usá las herramientas de navegador para visitar el sitio y tomar screenshots.

### 2. Analizar las 8 dimensiones de confianza

Evaluá cada dimensión en una escala de 1-5 (1 = señal de alarma fuerte, 5 = genera confianza activa):

#### D1: Identidad verificable
- ¿Hay nombre real, foto real (no stock/AI), ubicación?
- ¿Se puede verificar que la persona existe? (LinkedIn, GitHub, redes)
- ¿La foto es consistente con el texto? (no es un modelo de banco de imágenes)
- **Red flag**: Iniciales en lugar de foto, sin nombre completo, sin ubicación geográfica

#### D2: Evidencia y prueba social
- ¿Hay casos de estudio con datos verificables (nombres, métricas, antes/después)?
- ¿Los testimonios parecen reales? (nombre completo, empresa, cargo, foto)
- ¿Hay logos de clientes reales?
- **Red flag**: Claims genéricos ("ahorramos miles de horas"), testimonios sin apellido, métricas sin contexto

#### D3: Especificidad vs. vaguedad
- ¿Los servicios están descritos con suficiente detalle técnico?
- ¿Se menciona el stack tecnológico, las herramientas, la metodología?
- ¿Los precios tienen justificación o contexto?
- **Red flag**: Frases como "soluciones a medida", "transformación digital", "llevá tu negocio al siguiente nivel" sin sustancia detrás

#### D4: Diseño y estética
- ¿El diseño se diferencia de templates genéricos de landing pages?
- ¿Los colores, tipografía, y layout comunican profesionalismo o "venta agresiva"?
- ¿Hay demasiado dark background + neon accent? (patrón típico de infoproductos)
- **Red flag**: Fondo oscuro + acentos brillantes + hero gigante con headline de una línea + CTA agresivo = combo de "gurú digital"

#### D5: Tono y copywriting
- ¿El tono es consultivo o vendedor?
- ¿Se habla de los problemas del cliente o de lo genial que es el servicio?
- ¿Hay urgencia artificial? ("últimos cupos", "precio por tiempo limitado")
- **Red flag**: Exceso de signos de exclamación, promesas de resultados garantizados, countdown timers

#### D6: Transparencia
- ¿Hay página de "sobre mí" con información real?
- ¿Se explica el proceso de trabajo?
- ¿Los precios son claros o hay "contactanos para cotizar" en todo?
- ¿Hay política de privacidad, términos, información legal?
- **Red flag**: Cero información sobre quién está detrás, solo un formulario de contacto

#### D7: Coherencia técnica
- ¿El sitio carga rápido?
- ¿Es responsive y funcional en mobile?
- ¿Los links funcionan?
- ¿Hay errores de consola, imágenes rotas, elementos mal alineados?
- **Red flag**: Un sitio que vende "automatización y tecnología" pero tiene bugs visibles destruye credibilidad instantáneamente

#### D8: Diferenciación
- ¿Si tapo el logo/nombre, podría ser cualquier otro sitio del mismo rubro?
- ¿Hay algo único — una perspectiva, un enfoque, un nicho?
- ¿El contenido refleja experiencia real o suena a template rellenado?
- **Red flag**: Todo el contenido podría haber salido de un generador de landing pages con solo cambiar el nombre

### 3. Calcular el Trust Score

```
Trust Score = promedio ponderado de las 8 dimensiones

Pesos:
- D1 Identidad verificable: x1.5 (la más importante para servicios personales)
- D2 Evidencia y prueba social: x1.5
- D3 Especificidad: x1.2
- D4 Diseño: x1.0
- D5 Tono: x1.0
- D6 Transparencia: x1.2
- D7 Coherencia técnica: x0.8
- D8 Diferenciación: x1.0

Score = (D1*1.5 + D2*1.5 + D3*1.2 + D4*1.0 + D5*1.0 + D6*1.2 + D7*0.8 + D8*1.0) / 9.2

Rangos:
- 4.0-5.0: Excelente — genera confianza activa
- 3.0-3.9: Aceptable — no espanta pero no convence
- 2.0-2.9: Problemático — activa detectores de BS en visitantes sofisticados
- 1.0-1.9: Crítico — parece estafa o infoproducto genérico
```

### 4. Generar el reporte

El output debe ser un archivo Markdown con esta estructura:

```markdown
# Trust Audit Report — [nombre del sitio]

## Trust Score: X.X / 5.0 — [Excelente/Aceptable/Problemático/Crítico]

## Resumen ejecutivo
[2-3 oraciones: el diagnóstico central. ¿Qué impresión da el sitio en los primeros 5 segundos? ¿Qué tipo de visitante se va y por qué?]

## Diagnóstico por dimensión

### D1: Identidad verificable — X/5
[Qué se encontró, qué falta, por qué importa]

### D2: Evidencia y prueba social — X/5
[...]

[... las 8 dimensiones ...]

## Top 5 fixes prioritarios
[Ordenados por impacto/esfuerzo. Cada fix debe ser concreto y accionable — no "mejorá la confianza" sino "agregá un caso de estudio con nombre del cliente, problema específico, solución técnica implementada, y métrica de resultado verificable"]

## Punto de vista alternativo
[Qué podría decir alguien que NO está de acuerdo con este diagnóstico. ¿Hay casos donde el diseño actual funciona bien? ¿Para qué audiencia SÍ genera confianza? Esto es importante para que el usuario tome decisiones informadas, no solo siga instrucciones ciegamente.]
```

### 5. Punto de vista alternativo (obligatorio)

Cada reporte DEBE incluir una sección de contrapunto. La auditoría tiene sesgos inherentes — por ejemplo, privilegia la estética "sobria y corporativa" sobre la "bold y disruptiva". Un sitio con score bajo en D4 podría estar conectando perfecto con su audiencia real. El contrapunto ayuda al usuario a calibrar el diagnóstico contra su realidad.

## Notas para la ejecución

- Si el sitio tiene múltiples páginas, priorizá: home > servicios > sobre mí > contacto > resto
- Sé específico en los diagnósticos: no "el copy podría mejorar" sino "la frase 'soluciones integrales de automatización' en el hero no dice nada concreto — el visitante no sabe qué hacés hasta que scrollea 3 pantallas"
- Cuando señales un problema, mostrá un ejemplo real del sitio siendo auditado
- Los fixes deben incluir ejemplos concretos de cómo implementarlos, no solo qué cambiar
