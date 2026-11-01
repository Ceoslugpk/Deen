// Compare on-device (adhan) prayer times against the aladhan.com API
// the app currently uses, for Abu Dhabi, across the app's six methods.
const adhan = require('adhan');

const LAT = 24.4539, LON = 54.3773;   // Abu Dhabi
const TZ = 'Asia/Dubai';

// The app's PRAYER_METHODS: [8 Gulf Region, 4 Umm al-Qura, 3 MWL, 5 Egyptian, 1 Karachi, 2 NorthAmerica]
const APP_METHODS = [
  { id: 8, name: 'Gulf Region',        adhanKey: 'Dubai' },
  { id: 4, name: 'Umm al-Qura',        adhanKey: 'UmmAlQura' },
  { id: 3, name: 'Muslim World League',adhanKey: 'MuslimWorldLeague' },
  { id: 5, name: 'Egyptian Authority', adhanKey: 'Egyptian' },
  { id: 1, name: 'Karachi',            adhanKey: 'Karachi' },
  { id: 2, name: 'North America',      adhanKey: 'NorthAmerica' },
];

const NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function local(utcDate) {
  // format a UTC Date into Asia/Dubai wall-clock HH:MM
  const s = new Date(utcDate).toLocaleString('en-GB', { timeZone: TZ, hour12: false, hour: '2-digit', minute: '2-digit' });
  return s;
}
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

async function apiTimings(method, school, dateStr) {
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${LAT}&longitude=${LON}&method=${method}&school=${school}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  const t = j.data.timings;
  return {
    Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr,
    Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha,
  };
}

function device(methodKey, date) {
  const coords = new adhan.Coordinates(LAT, LON);
  const params = adhan.CalculationMethod[methodKey]();
  const pt = new adhan.PrayerTimes(coords, date, params);
  return {
    Fajr: local(pt.fajr), Sunrise: local(pt.sunrise), Dhuhr: local(pt.dhuhr),
    Asr: local(pt.asr), Maghrib: local(pt.maghrib), Isha: local(pt.isha),
  };
}

(async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  console.log(`Abu Dhabi (${LAT}, ${LON})  ${dateStr}  —  adhan (device) vs aladhan.com (API)\n`);

  let grandMax = 0, grandN = 0, grandSum = 0;

  for (const m of APP_METHODS) {
    for (const school of [0, 1]) {   // 0 = Shafi, 1 = Hanafi
      let api, dev;
      try { api = await apiTimings(m.id, school, dateStr); }
      catch (e) { console.log(`${m.name} (school ${school}): API failed - ${e.message}`); continue; }
      dev = device(m.adhanKey, today);
      // adhan's Madhab param only affects Asr
      const madhab = school === 1 ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
      const coords = new adhan.Coordinates(LAT, LON);
      const params = adhan.CalculationMethod[m.adhanKey]();
      params.madhab = madhab;
      const pt = new adhan.PrayerTimes(coords, today, params);
      dev = { Fajr: local(pt.fajr), Sunrise: local(pt.sunrise), Dhuhr: local(pt.dhuhr),
              Asr: local(pt.asr), Maghrib: local(pt.maghrib), Isha: local(pt.isha) };

      const diffs = NAMES.map((n) => {
        let d = toMin(dev[n]) - toMin(api[n]);
        if (d > 720) d -= 1440; if (d < -720) d += 1440;
        return { n, dev: dev[n], api: api[n], d };
      });
      const max = Math.max(...diffs.map((x) => Math.abs(x.d)));
      grandMax = Math.max(grandMax, max);
      grandN += diffs.length;
      grandSum += diffs.reduce((s, x) => s + Math.abs(x.d), 0);
      console.log(`${m.name.padEnd(20)} school=${school}  max diff ${String(max).padStart(3)} min   ` +
        diffs.map((x) => `${x.n}:${x.d >= 0 ? '+' : ''}${x.d}`).join(' '));
    }
  }
  console.log(`\nAcross ${grandN} prayer times: mean |diff| = ${(grandSum / grandN).toFixed(2)} min, worst = ${grandMax} min`);
})();
