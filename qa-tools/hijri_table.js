// Derive the Umm al-Qura month-start table from AlAdhan's own hToG endpoint,
// then the app can convert exactly with no network ever again.
// Stored as: for each Hijri year, 12 Gregorian "day numbers" (days since
// 1970-01-01) marking the first day of Muharram .. Dhu al-Hijjah.
const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DAY=86400000;
const dayNum=(y,m,d)=>Math.round(Date.UTC(y,m-1,d)/DAY);

async function hToG(hy,hm,hd){
  for(let a=0;a<6;a++){
    try{
      const r=await fetch(`https://api.aladhan.com/v1/hToG?date=${String(hd).padStart(2,'0')}-${String(hm).padStart(2,'0')}-${hy}`);
      if(r.status===429){await sleep(1600*(a+1));continue;}
      const j=await r.json();
      const g=j?.data?.gregorian;
      if(g) return dayNum(Number(g.year),Number(g.month.number),Number(g.day));
      await sleep(700);
    }catch(e){await sleep(700);}
  }
  return null;
}

(async()=>{
  const Y0=1440, Y1=1461;              // 22 Hijri years = 2026 +/- ~11 years
  const table={};
  let fails=0;
  for(let y=Y0;y<=Y1;y++){
    const months=[]; let ok=true;
    for(let m=1;m<=12;m++){
      const v=await hToG(y,m,1);
      if(v==null){ok=false;fails++;break;}
      months.push(v);
      await sleep(230);
    }
    if(ok) table[y]=months;
    process.stdout.write(ok?'.':'x');
  }
  console.log(`\n\nyears ok: ${Object.keys(table).length}   failed lookups: ${fails}`);

  // validate: every month start must be 29 or 30 days after the previous
  let bad=[];
  const years=Object.keys(table).map(Number).sort((a,b)=>a-b);
  for(const y of years){
    for(let m=0;m<12;m++){
      const cur=table[y][m];
      const next = m<11 ? table[y][m+1] : table[y+1]?.[0];
      if(next==null) continue;
      const len=next-cur;
      if(len!==29 && len!==30) bad.push(`${y}/${m+1} = ${len} days`);
    }
  }
  console.log('month lengths not 29/30:', bad.length? bad.join(', ') : 'none');

  const out={epoch:'1970-01-01', method:'umm_al_qura', source:'aladhan hToG',
             firstYear:years[0], lastYear:years[years.length-1], years:table};
  fs.writeFileSync('/home/user/geo/hijri_table.json', JSON.stringify(out, null, 0));
  const size=fs.statSync('/home/user/geo/hijri_table.json').size;
  console.log(`wrote ${size} bytes  (${years[0]}..${years[years.length-1]})`);
})();
