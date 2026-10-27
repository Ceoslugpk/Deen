// Walks every reachable screen from the five tabs and reports, per screen:
//   header text, back-button presence, horizontal overflow, clipped (nowrap) text,
//   pointer targets smaller than 44px, and any page errors.
// Usage: node qa-tools/screen-drill.cjs [depth] [width]
//   depth 1 = rows on each tab root (default), 2 = also rows one screen deeper
const { chromium } = require('playwright');
const DEPTH = Number(process.argv[2] || 1);
const WIDTH = Number(process.argv[3] || 390);

const PROBE = () => {
  const nodes = Array.from(document.querySelectorAll('div,span')).filter((n) => !n.closest('[aria-hidden="true"]'));
  const leaves = nodes.filter((n) => !n.children.length && (n.textContent || '').trim());
  const header = leaves
    .filter((n) => n.getBoundingClientRect().top < 240 && n.getBoundingClientRect().top > -10)
    .sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];
  const clipped = [];
  nodes.forEach((n) => {
    const cs = getComputedStyle(n);
    if (cs.whiteSpace !== 'nowrap' || cs.overflow === 'visible') return;
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (n.scrollWidth > n.clientWidth + 2) clipped.push((n.textContent || '').trim().slice(0, 28));
  });
  const small = [];
  nodes.forEach((n) => {
    if (getComputedStyle(n).cursor !== 'pointer') return;
    if (n.parentElement && getComputedStyle(n.parentElement).cursor === 'pointer') return; // inner text node
    const r = n.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    if (r.width < 44 || r.height < 44) small.push({ l: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18), w: Math.round(r.width), h: Math.round(r.height) });
  });
  return {
    header: header ? (header.textContent || '').trim().slice(0, 34) : null,
    back: document.querySelectorAll('[aria-label="Go back"]').length,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    clipped: clipped.slice(0, 3),
    small: small.slice(0, 3),
  };
};

// Pressable rows: RN Web marks them with cursor:pointer. Keep list-like rows only.
const LABELS = () => {
  const out = [];
  Array.from(document.querySelectorAll('div'))
    .filter((n) => !n.closest('[aria-hidden="true"]') && getComputedStyle(n).cursor === 'pointer')
    .forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.height < 28 || r.height > 200) return;
      if (r.width < window.innerWidth * 0.45) return;
      const t = (n.textContent || '').trim().replace(/\s+/g, ' ');
      if (!t || t.length > 70) return;
      out.push(t.slice(0, 40));
    });
  return [...new Set(out)];
};

// Scrolls a row whose text starts with `label` into view (native scrollIntoView handles
// nested scroll containers) and returns a point inside it.
const FIND = (label) => {
  const list = Array.from(document.querySelectorAll('div')).filter(
    (n) => !n.closest('[aria-hidden="true"]') && getComputedStyle(n).cursor === 'pointer' && (n.textContent || '').trim().replace(/\s+/g, ' ').startsWith(label)
  );
  for (const n of list) {
    n.scrollIntoView({ block: 'center' });
    const r = n.getBoundingClientRect();
    if (r.height >= 28 && r.height <= 200 && r.top > -10 && r.bottom < window.innerHeight - 100 && r.width > window.innerWidth * 0.4)
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  }
  return null;
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: WIDTH, height: 900 }, geolocation: { latitude: 25.2048, longitude: 55.2708 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)); });
  await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3200);
  await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
  await page.waitForTimeout(2800);

  const results = [];
  const gotoTab = async (tab) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await page.locator(`[role="button"][aria-label="${tab}"]`).first().click({ timeout: 4000 });
        await page.waitForTimeout(1500);
        return true;
      } catch (e) {
        await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
        await page.waitForTimeout(4000);
        await page.getByText('Use my location', { exact: false }).first().evaluate((n) => n.click()).catch(() => {});
        await page.waitForTimeout(2200);
      }
    }
    return false;
  };

  const visit = async (path, label, depth) => {
    const box = await page.evaluate(FIND, label);
    if (!box) { console.log('.. not found:', label); return; }
    await page.mouse.click(box.x, box.y);
    await page.waitForTimeout(2100);
    const probe = await page.evaluate(PROBE);
    const entry = { path: [...path, label].join(' > '), ...probe };
    results.push(entry);
    console.log(`${entry.path} -> ${entry.header} (back ${entry.back})${entry.overflow ? ' OVERFLOW' : ''}${entry.clipped.length ? ' CLIPPED ' + JSON.stringify(entry.clipped) : ''}${entry.small.length ? ' SMALL ' + JSON.stringify(entry.small) : ''}`);
    if (depth < DEPTH) {
      const inner = (await page.evaluate(LABELS)).slice(0, 5);
      for (const l of inner) await visit([...path, label], l, depth + 1);
    }
    if (probe.back) {
      await page.locator('[aria-label="Go back"]').first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1500);
    }
  };

  for (const tab of ['Tools', 'Quran', 'Library', 'Settings', 'Home']) {
    if (!(await gotoTab(tab))) { console.log('!! could not open tab', tab); continue; }
    const labels = [];
    // collect labels from a few scroll positions
    for (let step = 0; step < 6; step++) {
      const batch = await page.evaluate(LABELS);
      for (const l of batch) if (!labels.includes(l)) labels.push(l);
      await page.evaluate(() => {
        const sc = Array.from(document.querySelectorAll('div')).filter((n) => n.scrollHeight > n.clientHeight + 40 && n.clientHeight > 300 && !n.closest('[aria-hidden="true"]'));
        if (sc[0]) sc[0].scrollTop += Math.round(sc[0].clientHeight * 0.8);
      });
      await page.waitForTimeout(600);
    }
    for (const label of labels.slice(0, 22)) {
      await visit([tab], label, 1);
      if (!(await gotoTab(tab))) { console.log('!! lost tab', tab, 'after', label); break; }
    }
  }
  const bad = results.filter((r) => r.back < 1 || r.overflow || r.clipped.length || r.small.length);
  console.log(JSON.stringify({ depth: DEPTH, width: WIDTH, screens: results.length, bad, errors: [...new Set(errors)].slice(0, 6) }, null, 1));
  await b.close();
})();
