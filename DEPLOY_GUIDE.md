# Guía de Deploy — Erick Navarro Web

## Variables de entorno necesarias en Cloudflare Workers

Ir a: Cloudflare Dashboard > Workers > erick-chatbot-production > Settings > Variables

| Variable | Valor | Dónde obtenerla |
|----------|-------|-----------------|
| `OPENAI_API_KEY` | `sk-...` | https://platform.openai.com/api-keys |
| `CAL_API_KEY` | `cal_live_...` | Cal.com > Settings > Developer > API Keys > Create |
| `CAL_EVENT_TYPE_ID` | número (ej: `12345`) | Ver sección abajo |
| `ALLOWED_ORIGIN` | tu dominio (ej: `https://ericknavarroia.com`) | Tu dominio cuando lo tengas |

### Cómo obtener el CAL_EVENT_TYPE_ID

1. Entrá a https://app.cal.com
2. Andá a "Event Types" en el menú lateral
3. Hacé click en el evento que querés usar (ej: "Consulta de 30 minutos")
4. En la URL vas a ver algo como: `https://app.cal.com/event-types/12345`
5. Ese número (`12345`) es tu `CAL_EVENT_TYPE_ID`

Alternativa por API:
```bash
curl -s https://api.cal.com/v2/event-types \
  -H "Authorization: Bearer TU_CAL_API_KEY" \
  -H "cal-api-version: 2024-08-13" | jq '.data[] | {id, title}'
```

### Cómo crear la Cal.com API Key

1. Entrá a https://app.cal.com/settings/developer/api-keys
2. Click "Create API Key"
3. Nombre: "Chatbot Web"
4. Expiración: "Never" (o lo que prefieras)
5. Copiá el token que empieza con `cal_live_`

## Deploy del Worker

```bash
cd chatbot-worker
wrangler deploy
```

## Verificar que funciona

```bash
# Health check
curl https://erick-chatbot-production.ericknavarroia.workers.dev/health

# Test de chat
curl -X POST https://erick-chatbot-production.ericknavarroia.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, tengo un equipo que pierde mucho tiempo en tareas manuales", "history": []}'
```

## Pendientes que requieren dominio

- [ ] Cambiar `ALLOWED_ORIGIN` en Cloudflare Workers al dominio real
- [ ] Configurar DNS del dominio para Firebase Hosting
- [ ] Configurar GA4 con el dominio real
- [ ] Configurar HubSpot tracking con el dominio real
- [ ] Actualizar el JSON-LD schema con el dominio real en todos los HTML
- [ ] Crear OG image real para compartir en redes sociales

## Stack actual del ecosistema

| Componente | Estado | Servicio |
|-----------|--------|----------|
| Hosting | Configurado | Firebase Hosting |
| Chatbot AI | Listo para deploy | Cloudflare Worker + OpenAI gpt-4o-mini |
| Booking autónomo | Listo para deploy | Cal.com API v2 (function calling) |
| Formulario contacto | Funcionando | EmailJS |
| Calendario embed | Funcionando | Cal.com embed |
| CRM | Pendiente config | HubSpot Free (placeholder en contacto.html) |
| Analytics | Pendiente config | GA4 (necesita Measurement ID) |
| WhatsApp | Funcionando | wa.me link directo |
