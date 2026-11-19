/** Controlled production-WEB comparison, NOT a physical Android/iOS frame-rate benchmark.
 * Serve each revision separately, then run against each URL on the same otherwise idle machine.
 * INDOPAK_URL=http://127.0.0.1:8106 INDOPAK_ZOOM_PROFILE=/tmp/zoom-before.json node tests/profile-indopak-zoom-web.cjs
 * INDOPAK_URL=http://127.0.0.1:8107 INDOPAK_ZOOM_PROFILE=/tmp/zoom-after.json node tests/profile-indopak-zoom-web.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { makePage, gotoPage, pause } = require('./verify-indopak-web.cjs');
const output = process.env.INDOPAK_ZOOM_PROFILE || '/tmp/islamic-r100-zoom-profile.json';
(async () => {
  const browser = await chromium.launch();
  const report = { method: 'Production WEB, page 274, 12 real zoom-button clicks per fresh context. Six-times Chromium CPU throttle; click capture to next animation frame observing changed SVG width. Includes React/layout work, not screen presentation or total/native frame rate.',
    url: process.env.INDOPAK_URL || 'http://127.0.0.1:8106', cpuThrottle: 6, profiles: [] };
  try {
    for (const [name, viewport] of [['phone', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }], ['cover', { width: 280, height: 720 }]]) {
      const own = await makePage(browser), { page } = own;
      await page.setViewportSize(viewport); await gotoPage(page, 274); await page.waitForTimeout(400);
      const cdp = await own.context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
      await page.evaluate(() => {
        window.__zoomSamples = []; window.__zoomLong = [];
        const observer = new PerformanceObserver(list => window.__zoomLong.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration }))));
        observer.observe({ type: 'longtask', buffered: false });
        document.addEventListener('click', event => {
          if (!event.target.closest('[data-testid="indopak-zoom"]')) return;
          const svg = document.querySelector('[data-testid="indopak-page-svg"]'), width = svg.getAttribute('width'), start = performance.now();
          const sample = { start, from: Number(width), frames: [] }; window.__zoomSamples.push(sample); let last = start;
          const frame = time => {
            sample.frames.push(time - last); last = time;
            if (svg.getAttribute('width') !== width) {
              sample.to = Number(svg.getAttribute('width')); sample.duration = performance.now() - start;
              sample.scroll = { x: document.querySelector('[data-testid="indopak-horizontal-scroll"]').scrollLeft,
                y: document.querySelector('[data-testid="indopak-vertical-scroll"]').scrollTop };
            } else if (performance.now() - start < 10000) requestAnimationFrame(frame);
            else sample.timeout = true;
          }; requestAnimationFrame(frame);
        }, true);
      });
      for (let i = 0; i < 12; i++) { await page.getByTestId('indopak-zoom').click(); await pause(page); await page.waitForTimeout(100); }
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      const content = await page.evaluate(() => {
        const svg = document.querySelector('[data-testid="indopak-page-svg"]'), v = document.querySelector('[data-testid="indopak-page-viewport"]'), r = svg.getBoundingClientRect(), bounds = v.getBoundingClientRect();
        return { paths: svg.querySelectorAll('path').length, pageSize: { width: r.width, height: r.height }, pageViewport: { width: bounds.width, height: bounds.height } };
      });
      const samples = await page.evaluate(() => window.__zoomSamples.map(sample => ({ ...sample,
        longTasks: window.__zoomLong.filter(e => e.start < sample.start + sample.duration && e.start + e.duration > sample.start) })));
      assert.equal(samples.length, 12); assert.ok(samples.every(s => !s.timeout && Number.isFinite(s.duration) && s.duration > 0));
      for (const [kind, values] of Object.entries(own.errors)) assert.deepEqual(values, [], `${kind} errors`);
      const durations = samples.map(s => s.duration).sort((a, b) => a - b);
      const summary = { medianMs: (durations[5] + durations[6]) / 2, maxMs: Math.max(...durations),
        overlappingLongTasks: samples.reduce((sum, sample) => sum + sample.longTasks.length, 0) };
      report.profiles.push({ name, viewport, ...content, summary, samples, errors: own.errors });
      console.log(JSON.stringify({ name, viewport, ...summary }));
      await cdp.detach(); await own.context.close();
    }
  } finally {
    fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(report, null, 2)); await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
