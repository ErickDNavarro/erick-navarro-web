/**
 * ═══════════════════════════════════════════════════════════════
 * INVOICE EXTRACTION DEMO — Erick Navarro
 * ═══════════════════════════════════════════════════════════════
 *
 * Demo simulada (no llama a APIs externas) que reproduce el flujo
 * real de extracción de datos de facturas con IA. Pensada para
 * ser viral en redes y mostrar la propuesta de valor sin costo
 * por inferencia.
 *
 * Honestidad: se aclara en el UI que es una animación reproducible.
 * Los datos del JSON son del tipo y formato real que produciría
 * el sistema productivo.
 */

(function () {
    'use strict';

    const SAMPLES = {
        a: {
            label: 'Factura A · Proveedor',
            visual: {
                tipo: 'FACTURA A',
                num: '0001-00012847',
                fecha: '15/05/2026',
                emisor: 'TecnoSupply S.R.L.',
                cuitEmisor: '30-71429105-3',
                receptor: 'Erick Navarro IA & Consulting',
                cuitReceptor: '20-38456712-9',
                items: [
                    { desc: 'Notebook Dell Latitude 5450 i7', cant: 1, unit: 1240500.00, total: 1240500.00 },
                    { desc: 'Monitor LG UltraGear 27"', cant: 2, unit: 387200.00, total: 774400.00 },
                    { desc: 'Mouse logitech MX Master 3S', cant: 2, unit: 98750.00, total: 197500.00 }
                ],
                subtotal: 2212400.00,
                iva: 464604.00,
                totalFinal: 2677004.00
            },
            json: {
                tipo_comprobante: "FACTURA_A",
                numero: "0001-00012847",
                fecha: "2026-05-15",
                emisor: {
                    razon_social: "TecnoSupply S.R.L.",
                    cuit: "30-71429105-3",
                    condicion_iva: "RESPONSABLE_INSCRIPTO"
                },
                receptor: {
                    razon_social: "Erick Navarro IA & Consulting",
                    cuit: "20-38456712-9",
                    condicion_iva: "RESPONSABLE_INSCRIPTO"
                },
                items: [
                    { descripcion: "Notebook Dell Latitude 5450 i7", cantidad: 1, precio_unitario: 1240500.00, subtotal: 1240500.00 },
                    { descripcion: "Monitor LG UltraGear 27\"", cantidad: 2, precio_unitario: 387200.00, subtotal: 774400.00 },
                    { descripcion: "Mouse Logitech MX Master 3S", cantidad: 2, precio_unitario: 98750.00, subtotal: 197500.00 }
                ],
                totales: {
                    subtotal: 2212400.00,
                    iva_21: 464604.00,
                    total: 2677004.00
                },
                moneda: "ARS",
                validaciones: {
                    cuit_emisor_valido: true,
                    suma_items_coincide: true,
                    calculo_iva_correcto: true
                },
                confianza_extraccion: 0.987
            }
        },
        b: {
            label: 'Factura B · Servicio',
            visual: {
                tipo: 'FACTURA B',
                num: '0003-00004562',
                fecha: '22/05/2026',
                emisor: 'Servicios Contables Pérez',
                cuitEmisor: '27-25683471-4',
                receptor: 'Consumidor Final',
                cuitReceptor: '—',
                items: [
                    { desc: 'Honorarios contables Mayo 2026', cant: 1, unit: 285000.00, total: 285000.00 }
                ],
                subtotal: 235537.19,
                iva: 49462.81,
                totalFinal: 285000.00
            },
            json: {
                tipo_comprobante: "FACTURA_B",
                numero: "0003-00004562",
                fecha: "2026-05-22",
                emisor: {
                    razon_social: "Servicios Contables Pérez",
                    cuit: "27-25683471-4",
                    condicion_iva: "RESPONSABLE_INSCRIPTO"
                },
                receptor: {
                    razon_social: "Consumidor Final",
                    cuit: null,
                    condicion_iva: "CONSUMIDOR_FINAL"
                },
                items: [
                    { descripcion: "Honorarios contables Mayo 2026", cantidad: 1, precio_unitario: 285000.00, subtotal: 285000.00 }
                ],
                totales: {
                    subtotal: 235537.19,
                    iva_21: 49462.81,
                    total: 285000.00
                },
                moneda: "ARS",
                validaciones: {
                    cuit_emisor_valido: true,
                    suma_items_coincide: true,
                    calculo_iva_correcto: true
                },
                confianza_extraccion: 0.992
            }
        }
    };

    const STEPS = [
        { label: 'Cargando documento', ms: 400 },
        { label: 'Detectando layout y campos', ms: 700 },
        { label: 'Extrayendo datos con IA', ms: 900 },
        { label: 'Validando CUIT y cálculo de IVA', ms: 600 },
        { label: 'Listo', ms: 200 }
    ];

    function fmt(n) {
        return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
    }

    function renderInvoiceVisual(v) {
        const itemsHtml = v.items.map(i =>
            `<tr><td>${i.desc}</td><td class="num">${i.cant}</td><td class="num">$${fmt(i.unit)}</td><td class="num">$${fmt(i.total)}</td></tr>`
        ).join('');
        return `
            <div class="inv-doc">
                <div class="inv-head">
                    <div class="inv-type">${v.tipo}</div>
                    <div class="inv-num">N° ${v.num}</div>
                </div>
                <div class="inv-meta">
                    <div><span>Fecha:</span> ${v.fecha}</div>
                </div>
                <div class="inv-parties">
                    <div>
                        <strong>EMISOR</strong>
                        <div>${v.emisor}</div>
                        <div class="inv-cuit">CUIT: ${v.cuitEmisor}</div>
                    </div>
                    <div>
                        <strong>RECEPTOR</strong>
                        <div>${v.receptor}</div>
                        <div class="inv-cuit">CUIT: ${v.cuitReceptor}</div>
                    </div>
                </div>
                <table class="inv-table">
                    <thead><tr><th>Descripción</th><th class="num">Cant</th><th class="num">P. Unit</th><th class="num">Total</th></tr></thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <div class="inv-totals">
                    <div><span>Subtotal:</span> $${fmt(v.subtotal)}</div>
                    <div><span>IVA 21%:</span> $${fmt(v.iva)}</div>
                    <div class="inv-total-final"><span>TOTAL:</span> $${fmt(v.totalFinal)}</div>
                </div>
            </div>
        `;
    }

    function syntaxHighlight(json) {
        const str = JSON.stringify(json, null, 2);
        return str
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                function (match) {
                    let cls = 'jn';
                    if (/^"/.test(match)) {
                        cls = /:$/.test(match) ? 'jk' : 'js';
                    } else if (/true|false/.test(match)) {
                        cls = 'jb';
                    } else if (/null/.test(match)) {
                        cls = 'jl';
                    }
                    return `<span class="${cls}">${match}</span>`;
                });
    }

    async function runDemo(root, sampleKey) {
        const sample = SAMPLES[sampleKey];
        if (!sample) return;

        const doc = root.querySelector('.inv-demo-doc');
        const stepsEl = root.querySelector('.inv-demo-steps');
        const jsonEl = root.querySelector('.inv-demo-json code');
        const metricsEl = root.querySelector('.inv-demo-metrics');
        const buttons = root.querySelectorAll('.inv-demo-btn');
        const replayBtn = root.querySelector('.inv-demo-replay');

        buttons.forEach(b => b.disabled = true);
        if (replayBtn) replayBtn.style.display = 'none';

        // Reset
        jsonEl.innerHTML = '';
        metricsEl.innerHTML = '';
        stepsEl.innerHTML = STEPS.map((s, i) =>
            `<div class="inv-step" data-i="${i}"><span class="inv-step-dot"></span> ${s.label}</div>`
        ).join('');

        // Show document
        doc.innerHTML = renderInvoiceVisual(sample.visual);
        doc.classList.add('scanning');

        const startTime = performance.now();

        // Progress through steps
        for (let i = 0; i < STEPS.length; i++) {
            const stepEl = stepsEl.querySelector(`[data-i="${i}"]`);
            stepEl.classList.add('active');
            await new Promise(r => setTimeout(r, STEPS[i].ms));
            stepEl.classList.remove('active');
            stepEl.classList.add('done');
        }
        doc.classList.remove('scanning');

        // Type out JSON
        const fullJson = JSON.stringify(sample.json, null, 2);
        const highlighted = syntaxHighlight(sample.json);
        const plainLen = fullJson.length;
        const totalDuration = 1200; // ms para tipear todo
        const charsPerFrame = Math.max(4, Math.ceil(plainLen / (totalDuration / 16)));

        // Estrategia: pintamos el HTML ya highlighted incrementalmente usando el plain como reference
        // Simplificado: tipeamos plain text rápido, luego reemplazamos con highlighted al final
        let cursor = 0;
        while (cursor < plainLen) {
            cursor = Math.min(plainLen, cursor + charsPerFrame);
            jsonEl.textContent = fullJson.slice(0, cursor);
            await new Promise(r => setTimeout(r, 16));
        }
        jsonEl.innerHTML = highlighted;

        // Show metrics
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
        const conf = (sample.json.confianza_extraccion * 100).toFixed(1);
        metricsEl.innerHTML = `
            <div class="inv-metric"><span class="inv-metric-val">${elapsed}s</span><span class="inv-metric-lbl">Tiempo</span></div>
            <div class="inv-metric"><span class="inv-metric-val">${conf}%</span><span class="inv-metric-lbl">Confianza</span></div>
            <div class="inv-metric"><span class="inv-metric-val">✓</span><span class="inv-metric-lbl">Validado</span></div>
        `;

        buttons.forEach(b => b.disabled = false);
        if (replayBtn) replayBtn.style.display = 'inline-flex';
    }

    function init() {
        const root = document.getElementById('invoice-demo');
        if (!root) return;

        root.querySelectorAll('.inv-demo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.sample;
                runDemo(root, key);
            });
        });

        const replay = root.querySelector('.inv-demo-replay');
        if (replay) {
            replay.addEventListener('click', () => {
                const last = root.dataset.lastSample || 'a';
                runDemo(root, last);
            });
        }

        // Track last sample for replay
        root.querySelectorAll('.inv-demo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                root.dataset.lastSample = btn.dataset.sample;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
