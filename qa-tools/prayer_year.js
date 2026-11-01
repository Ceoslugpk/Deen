// Sweep a full year and several cities, on-device vs aladhan API.
const adhan = require('adhan');

const CITIES = [
  { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, tz: 'Asia/Dubai' },
  { name: 'London',    lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'Karachi',   lat: 24.8607, lon: 67.0011, tz: 'Asia/Karachi' },
  { name: 'New York',  lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  { name: 'Cairo',     lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' },
  { name: 'Istanbul',  lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul' },
];

// app method id -> adhan configuration
const METHODS = [
  { id: 8, name: 'Gulf Region', custom: (p) => { p.fajrAngle = 19.5; p.ishaAngle = 0; p.ishaInterval = 90; } },
  { id: 4, name: 'Umm al-Qura', key: 'UmmAlQura' },
  { id: 3, name: 'Muslim World League', key: 'MuslimWorldLeague' },
  { id: 5, name: 'Egyptian Authority', key: 'Egyptian' },
  { id: 1, name: 'Karachi', key: 'Karachi' },
  { id: 2, name: 'North America', key: 'NorthAmerica' },
];

const NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const loc = (d, tz) => new Date(d).toLocaleString('en-GB', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit' });
const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const diffOf = (a, b) => { let d = toMin(a) - toMin(b); if (d > 720) d -= 1440; if (d < -720) d += 1440; return d; };

function deviceTimes(city, m, date, school) {
  const coords = new adhan.Coordinates(city.lat, city.lon);
  const params = m.key ? adhan.CalculationMethod[m.key]() : adhan.CalculationMethod.Other();
  if (m.custom) m.custom(params);
  params.madhab = school === 1 ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const pt = new adhan.PrayerTimes(coords, date, params);
  return { Fajr: loc(pt.fajr, city.tz), Sunrise: loc(pt.sunrise, city.tz), Dhuhr: loc(pt.dhuhr, city.tz),
           Asr: loc(pt.asr, city.tz), Maghrib: loc(pt.maghrib, city.tz), Isha: loc(pt.isha, city.tz) };
}

(async () => {
  const results = {};
  for (const city of CITIES) {
    let day = new Date(Date.UTC(2026, 0, 1));
    for (let i = 0; i < 365; i += 5) {           // every 5th day of 2026
      const d = new Date(day.getTime() + i * 86400000);
      const ds = d.toISOString().slice(0, 10);
      for (const m of METHODS) {
        const school = i % 2;                     // alternate Shafi / Hanafi
        let api;
        try {
          const r = await fetch(`https://api.aladhan.com/v1/timings/${ds}?latitude=${city.lat}&longitude=${city.lon}&method=${m.id}&school=${school}`);
          if (!r.ok) throw new Error('HTTP ' + r.status);
          api = (await r.json()).data.timings;
        } catch (e) { continue; }
        const dev = deviceTimes(city, m, d, school);
        for (const n of NAMES) {
          const dd = Math.abs(diffOf(dev[n], api[n]));
          const k = m.name;
          (results[k] ||= []).push(dd);
          (results['__ALL__'] ||= []).push(dd);
        }
      }
    }
  }
  console.log('On-device (adhan) vs aladhan API — 6 cities x ~73 days x 6 methods\n');
  const order = Object.entries(results).filter(([k]) => k !== '__ALL__').sort((a, b) => a[0].localeCompare(b[0]));
  for (const [k, arr] of order) {
    arr.sort((a, b) => a - b);
    const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
    const p95 = arr[Math.floor(arr.length * 0.95)];
    console.log(`  ${k.padEnd(21)} n=${String(arr.length).padStart(5)}  mean ${mean.toFixed(2)}m  median ${arr[Math.floor(arr.length/2)]}m  p95 ${p95}m  max ${arr[arr.length-1]}m`);
  }
  const all = results['__ALL__'].sort((a, b) => a - b);
  const mean = all.reduce((s, x) => s + x, 0) / all.length;
  console.log(`\n  ${'OVERALL'.padEnd(21)} n=${String(all.length).padStart(5)}  mean ${mean.toFixed(2)}m  median ${all[Math.floor(all.length/2)]}m  p95 ${all[Math.floor(all.length*0.95)]}m  max ${all[all.length-1]}m`);
  const within1 = all.filter((x) => x <= 1).length / all.length * 100;
  const within2 = all.filter((x) => x <= 2).length / all.length * 100;
  console.log(`  within 1 min: ${within1.toFixed(1)}%   within 2 min: ${within2.toFixed(1)}%`);
})();
