/* Exact rectangular cutting paths. Photo coordinates are never used as cut dimensions. */
(function (root) {
  'use strict';
  const dimension = v => Number(v && v.inches);
  const f = n => Number(n.toFixed(6)).toString();
  function collect(job) {
    const result = [];
    (job.items || []).forEach((item, ii) => {
      if (item.type !== 'glass') return;
      (item.objects || []).forEach((object, oi) => {
        const w = dimension(object.w), h = dimension(object.h);
        const eligible = Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 && w <= 1800 && h <= 1800 &&
          (object.corners || []).length === 4 && !(object.cm || []).some(Boolean);
        result.push({key:ii + ':' + oi, itemIndex:ii, itemName:String(item.label||'Item '+(ii+1)), label:(item.label||'Item '+(ii+1)) + ' / Pane ' + (oi+1) + (object.label ? ' — ' + object.label : ''), w, h, eligible});
      });
    });
    return result;
  }
  function layout(panes) {
    if (!panes.length || panes.some(p => !p.eligible || !Number.isFinite(p.w) || !Number.isFinite(p.h) || p.w <= 0 || p.h <= 0)) throw new Error('Select valid rectangular panes.');
    let x=0,y=0,rowHeight=0,maxX=0,maxY=0;
    const placed=panes.map(p => {
      if(x && x+p.w>54){x=0;y+=rowHeight+1;rowHeight=0;}
      const r={...p,x:x*72,y:y*72,wpt:p.w*72,hpt:p.h*72};
      maxX=Math.max(maxX,x+p.w);maxY=Math.max(maxY,y+p.h);rowHeight=Math.max(rowHeight,p.h);x+=p.w+1;return r;
    });
    if(maxX>1800 || maxY>1800) throw new Error('Layout exceeds 150 feet. Export fewer panes together.');
    return {placed,maxX,maxY};
  }
  function svg(panes) {
    const {placed,maxX,maxY}=layout(panes);
    return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="'+f(maxX)+'in" height="'+f(maxY)+'in" viewBox="0 0 '+f(maxX*72)+' '+f(maxY*72)+'">\n'+
      placed.map(p=>'<path fill="none" stroke="#000000" stroke-width="0.1" d="M '+f(p.x)+' '+f(p.y)+' L '+f(p.x+p.wpt)+' '+f(p.y)+' L '+f(p.x+p.wpt)+' '+f(p.y+p.hpt)+' L '+f(p.x)+' '+f(p.y+p.hpt)+' Z"/>').join('\n')+'\n</svg>\n';
  }
  const slug=(name,fallback)=>String(name||'').normalize('NFC').replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/^-+|-+$/g,'').slice(0,60)||fallback;
  function files(panes) {
    const groups=new Map();for(const p of panes){const n=p.itemIndex??0;if(!groups.has(n))groups.set(n,[]);groups.get(n).push(p);}
    return [...groups].map(([n,ps])=>({name:String(n+1).padStart(2,'0')+'-'+slug(ps[0].itemName,'Item-'+(n+1))+'-1to1.svg',data:svg(ps)}));
  }
  function save(filename,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  root.SatinSVG={collect,svg,files,save};
})(typeof window !== 'undefined' ? window : globalThis);
