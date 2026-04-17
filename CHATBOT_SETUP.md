# AI Chatbot Widget - Setup & Integration Guide

## Quick Start

### 1. Add to Your Website (Fallback Mode)

Add this single line to your HTML `<head>` or before closing `</body>`:

```html
<script src="js/chatbot.js"></script>
```

That's it! The chatbot will appear as a floating button in the bottom-left corner with the built-in knowledge base.

## File Locations

- **Widget Code**: `/js/chatbot.js` (21 KB, 652 lines)
- **Worker Code**: `/chatbot-worker/worker.js` (15 KB, 423 lines)

## Features

### chatbot.js (Client-Side Widget)

✓ Floating chat button with orange gradient (56px circle)
✓ Smooth slide-up animation for chat window
✓ Header with "EN" badge, title, and close button
✓ User messages (right, orange bubbles)
✓ Bot messages (left, dark card bubbles)
✓ Typing indicator (3 bouncing dots animation)
✓ Auto-scrolling message area
✓ Responsive design (full-width on mobile)
✓ Custom CSS injection (no external files needed)
✓ Built-in knowledge base with 5 service categories
✓ Smart keyword matching
✓ Dark theme matching Erick's site design
✓ Z-index: 9997 (below WhatsApp widget at 9998)

### worker.js (Backend API)

✓ Cloudflare Worker deployment-ready
✓ Supports Anthropic (Claude) or OpenAI APIs
✓ Handles conversation history
✓ CORS enabled for secure cross-origin requests
✓ Rate limiting (10 requests/minute per IP)
✓ 30-second request timeout
✓ Comprehensive system prompt about Erick's services
✓ Health check endpoint (/health)
✓ Error handling and logging

## Advanced Setup: Enable AI Mode

### Step 1: Deploy Cloudflare Worker

```bash
# Install Wrangler CLI
npm install -g wrangler

# Create project directory
mkdir chatbot-worker
cd chatbot-worker

# Copy worker.js into src/index.js
cp worker.js src/index.js

# Create wrangler.toml
```

**wrangler.toml**:
```toml
name = "erick-chatbot"
main = "src/index.js"
compatibility_date = "2024-12-16"

[env.production]
env = "production"

[[env.production.kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your_kv_namespace_id"
```

### Step 2: Set Environment Variables

In Cloudflare Dashboard → Workers & Pages → your worker → Settings → Environment Variables:

**For Anthropic Claude:**
```
ANTHROPIC_API_KEY = sk-ant-...
ALLOWED_ORIGIN = https://yourdomain.com
```

**For OpenAI GPT-4:**
```
OPENAI_API_KEY = sk-proj-...
ALLOWED_ORIGIN = https://yourdomain.com
```

### Step 3: Create KV Namespace

```bash
wrangler kv:namespace create "RATE_LIMIT_KV"
# Note the ID and add to wrangler.toml

wrangler kv:namespace create "RATE_LIMIT_KV" --preview
```

### Step 4: Deploy

```bash
wrangler deploy --env production
```

You'll get a URL like: `https://erick-chatbot.yourdomain.workers.dev`

### Step 5: Update Website Config

In your HTML, before the chatbot script:

```html
<script>
  // Configure chatbot to use AI
  const CHATBOT_CONFIG = {
    apiEndpoint: 'https://erick-chatbot.yourdomain.workers.dev/chat',
    fallbackMode: false  // Disable fallback, use API
  };
</script>
<script src="js/chatbot.js"></script>
```

## Configuration Options

### chatbot.js

At the top of `js/chatbot.js`, modify `CHATBOT_CONFIG`:

```javascript
const CHATBOT_CONFIG = {
    // API endpoint for AI responses
    apiEndpoint: null,  // Set to your Cloudflare Worker URL
    
    // Use built-in knowledge base (fallback)
    fallbackMode: true,
    
    // Customize knowledge base
    knowledgeBase: {
        // ... edit services, contact info, etc
    }
};
```

### worker.js

At the top of `worker.js`, modify `CONFIG`:

```javascript
const CONFIG = {
    // Provider: 'anthropic' or 'openai'
    AI_PROVIDER: 'anthropic',
    
    // Model selection
    MODEL: {
        anthropic: 'claude-sonnet-4-5-20250514',
        openai: 'gpt-4o-mini'
    },
    
    // Rate limiting
    RATE_LIMIT: {
        windowMs: 60 * 1000,      // 1 minute
        maxRequests: 10,           // 10 requests per minute
    },
    
    // Timeout
    TIMEOUT_MS: 30000,            // 30 seconds
};
```

## API Reference

### POST /chat

**Request:**
```json
{
  "message": "What services do you offer?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "response": "We offer AI automation, custom development, consulting...",
  "usage": {
    "input_tokens": 156,
    "output_tokens": 87
  }
}
```

### GET /health

Returns worker status for monitoring:
```json
{
  "status": "ok",
  "timestamp": "2024-12-16T10:30:00.000Z"
}
```

## Built-in Knowledge Base

The chatbot responds intelligently to keywords:

**Services:**
- `automatización`, `automatizacion`, `ia`, `workflow`, `chatbot`
- `desarrollo`, `aplicación`, `web`, `mobile`, `dashboard`
- `consultoría`, `consultoria`, `estrategia`, `roadmap`
- `integración`, `integracion`, `erp`, `crm`, `api`
- `formación`, `formacion`, `workshop`, `capacitación`

**Pricing:**
- `precio`, `costo`, `cuanto`, `cuánto`, `presupuesto`
- Returns: Free 30-min consultation + link to WhatsApp

**Contact:**
- `contacto`, `email`, `whatsapp`, `agendar`, `reunión`
- Returns: Contact options + business hours

**Unmatched:**
- Suggests booking free consultation

## Customization

### Change Welcome Message

Edit `showWelcomeMessage()` in `js/chatbot.js`:

```javascript
showWelcomeMessage() {
    const welcome = "Your custom welcome message here";
    this.addBotMessage(welcome);
}
```

### Add More Knowledge

Edit `CHATBOT_CONFIG.knowledgeBase` in `js/chatbot.js`:

```javascript
myService: {
    title: "Service Name",
    description: "Detailed description...",
    keywords: ["keyword1", "keyword2"]
}
```

### Change Colors/Design

Edit `CHATBOT_STYLES` CSS in `js/chatbot.js`:

```css
/* Change accent color */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);

/* Change button size */
width: 64px; height: 64px;  /* was 56px */

/* Change window size */
width: 500px;  /* was 400px */
height: 600px; /* was 500px */
```

### Customize System Prompt

Edit `SYSTEM_PROMPT` in `worker.js` to change AI behavior.

## Troubleshooting

**Chatbot doesn't appear:**
- Check browser console for errors
- Verify `js/chatbot.js` is in correct path
- Check z-index doesn't conflict with other elements

**API requests fail:**
- Check CORS headers (should allow your domain)
- Verify API key is set in Cloudflare
- Check network tab in DevTools
- Ensure worker endpoint is correct

**Rate limiting blocks requests:**
- Check IP in KV: `RATE_LIMIT:xxx`
- Adjust `maxRequests` in worker.js CONFIG
- Clear KV namespace if needed

**AI responses are slow:**
- Normal for API calls (1-5 seconds)
- Increase `TIMEOUT_MS` if needed
- Check Cloudflare Worker analytics

## Cost Estimation

**Free Tier:**
- Cloudflare Workers: 100,000 requests/day free
- KV Storage: 1 GB free read/write per day

**API Costs (per 1000 tokens):**
- Anthropic Claude: ~$3 (input) / ~$15 (output)
- OpenAI GPT-4o Mini: ~$0.15 (input) / ~$0.60 (output)

**Estimate:** With 100 daily chats (10 min each), ~$10-30/month

## Support

For issues or customization requests, contact:
- Email: ericknavarroia@gmail.com
- WhatsApp: +54 11 5527-0357

---

**Last Updated:** April 15, 2024
**Version:** 1.0 Production-Ready
