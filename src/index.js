// kdot-shim SDK · sovereign single-file library · MIT · AI-Native Solutions
// Extracted from kdot-shim/index.html · 6820 bytes of source logic
// Public-safe: no primes/glyphs/dyad references

import { jsonToDot, dotToJson, measure, bytesToDotPattern } from './encode.mjs';
const SAMPLES = {
  agent: {
    sender: 'alpha',
    receiver: 'delta',
    function: 'search',
    payload: 'query',
    context: 'session',
    routing: 'theta'
  },
  rest: {
    status: 'ok',
    code: 200,
    message: 'query done',
    items: [
      { id: 'inv_023', total: 2400 },
      { id: 'inv_041', total: 780 }
    ]
  },
  kcc: {
    kcc: { balance: 24100, ledger: 'fallcolony' },
    signer: 'simon',
    mint: { nft: 'doctrine-ritual-dual', block: 17 }
  },
  nested: {
    user: {
      name: 'simon',
      kcc: { balance: 24100, ledger: 'fallcolony' },
      agents: ['alpha', 'delta', 'theta', 'omega']
    },
    session: 'current',
    ts: 1751932800000
  },
  paginated: {
    items: Array.from({ length: 12 }, (_, i) => ({
      id: `item_${i}`,
      name: `sample ${i}`,
      status: i % 2 === 0 ? 'ok' : 'pending'
    })),
    count: 12,
    total: 100,
    page: 1,
    has_more: true
  }
};
const inputEl = $('input');
const semTog = $('semantic-toggle');
function renderMeasure(obj) {
  try {
    const dot = jsonToDot(obj, { semantic: semTog.checked });
    const m = measure(obj);
    $('json-bytes').textContent = m.jsonBytes + 'B';
    $('dot-bytes').textContent = m.dotBytes + 'B';
    $('ratio').textContent = m.ratio.toFixed(2) + 'x';
    $('mode').textContent = m.modeName;
    const lines = [];
    for (let i = 0; i < dot.length; i++) {
      const b = dot[i];
      const c1 = (b >> 2) & 0x3F;
      const bits = c1.toString(2).padStart(6, '0');
      const line = bits.split('').map((bit, j) => bit === '1'
        ? `<span>${symbols[j]}</span>`
        : `<span class="off">·</span>`).join('');
      lines.push(line);
    }
    $('dots').innerHTML = lines.join(' ');
    // Hex
    $('hex').textContent = Array.from(dot).map(b => b.toString(16).padStart(2, '0')).join(' ');
    // Decoded
    const back = dotToJson(dot);
    $('decoded').textContent = JSON.stringify(back, null, 2);
    // Roundtrip
    const ok = JSON.stringify(back) === JSON.stringify(obj);
    if (ok) {
      $('roundtrip-result').textContent = '✓ roundtrip verified · lossless';
      $('roundtrip-result').className = 'check pass';
    } else {
      $('roundtrip-result').textContent = '✗ roundtrip mismatch';
      $('roundtrip-result').className = 'check fail';
    }
  } catch (e) {
    $('json-bytes').textContent = '—';
    $('dot-bytes').textContent = '—';
    $('ratio').textContent = '—';
    $('mode').textContent = 'error';
    $('dots').textContent = e.message;
    $('hex').textContent = '';
    $('decoded').textContent = '';
    $('roundtrip-result').textContent = '✗ ' + e.message;
    $('roundtrip-result').className = 'check fail';
  }
}
function encode() {
  try {
    const obj = JSON.parse(inputEl.value);
    renderMeasure(obj);
  } catch (e) {
    $('roundtrip-result').textContent = '✗ invalid JSON: ' + e.message;
    $('roundtrip-result').className = 'check fail';
  }
}
$('encode-btn').addEventListener('click', encode);
$('roundtrip-btn').addEventListener('click', encode);
semTog.addEventListener('change', encode);
inputEl.addEventListener('input', () => {
  clearTimeout(inputEl._t);
  inputEl._t = setTimeout(encode, 300);
});
  btn.addEventListener('click', () => {
    inputEl.value = JSON.stringify(SAMPLES[btn.dataset.sample], null, 2);
    encode();
  });
});
// Tabs
  t.addEventListener('click', () => {
    t.classList.add('active');
  });
});
// Benchmark
const BENCHMARK_URLS = [
  { name: 'fallcolony/manifest', url: 'https://sjgant80-hub.github.io/fallcolony/manifest.json' },
  { name: 'fallcolony/agents', url: 'https://sjgant80-hub.github.io/fallcolony/agents.json' },
  { name: 'suzen/manifest', url: 'https://sjgant80-hub.github.io/suzen/manifest.json' },
];
const SYNTH = [
  { name: 'agent-msg · search', body: SAMPLES.agent },
  { name: 'agent-msg · delta→theta', body: { sender:'delta', receiver:'theta', function:'score', payload:'query', context:'response', routing:'omega' } },
];
$('run-benchmark').addEventListener('click', async () => {
  tbody.innerHTML = '';
  $('bench-status').textContent = 'fetching…';
  const rows = [];
  for (const t of BENCHMARK_URLS) {
    try {
      const r = await fetch(t.url);
      if (!r.ok) { addRow(tbody, t.name, '—', '—', 'HTTP ' + r.status, 'fail'); continue; }
      const obj = await r.json();
      const m = measure(obj);
      rows.push(m);
      addRow(tbody, t.name, m.jsonBytes + 'B', m.dotBytes + 'B', m.ratio.toFixed(2) + 'x', m.modeName);
    } catch (e) {
      addRow(tbody, t.name, '—', '—', e.message, 'fail');
    }
  }
  for (const s of SYNTH) {
    const m = measure(s.body);
    rows.push(m);
    addRow(tbody, s.name, m.jsonBytes + 'B', m.dotBytes + 'B', m.ratio.toFixed(2) + 'x', m.modeName);
  }
  $('bench-status').textContent = `done · ${rows.length} payloads`;
  // Summary
  const summary = $('bench-summary');
  if (rows.length) {
    const totalJson = rows.reduce((s, r) => s + r.jsonBytes, 0);
    const totalDot = rows.reduce((s, r) => s + r.dotBytes, 0);
    const weighted = totalJson / totalDot;
    const avg = rows.reduce((s, r) => s + r.ratio, 0) / rows.length;
    summary.innerHTML = `
      <div class="stat"><div class="label">total json</div><div class="value">${totalJson}B</div></div>
      <div class="stat"><div class="label">total dot</div><div class="value">${totalDot}B</div></div>
      <div class="stat"><div class="label">unweighted avg</div><div class="value">${avg.toFixed(2)}x</div></div>
      <div class="stat hero"><div class="label">byte-weighted</div><div class="value">${weighted.toFixed(2)}x</div></div>
    `;
  }
});
function addRow(tbody, name, j, d, ratio, mode) {
  const tr = document.createElement('tr');
  const modeClass = mode === 'agent-block' ? 'agent' : mode === 'dict-varint' ? 'dict' : '';
  tr.innerHTML = `<td>${name}</td><td class="num">${j}</td><td class="num">${d}</td><td class="num">${ratio}</td><td class="${modeClass}">${mode}</td>`;
  tbody.appendChild(tr);
}
// Init with agent sample
inputEl.value = JSON.stringify(SAMPLES.agent, null, 2);
encode();
// SW register (best-effort)
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// Named exports for the primary API surface
export { renderMeasure };
export { encode };
export { addRow };
export { $ };

export { SAMPLES };
export { BENCHMARK_URLS };
export { SYNTH };
