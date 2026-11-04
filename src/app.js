(() => {
  "use strict";
  const STORAGE_KEY="cemig-dre-expenses-v1", RATE_KEY="cemig-dre-rate-v1", DISCOUNT_KEY="cemig-dre-discounts-v1";
  const $=id=>document.getElementById(id);
  const currency=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
  const number=new Intl.NumberFormat("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
  const monthNames={"2026-09":"Setembro 2026","2026-10":"Outubro 2026","2026-11":"Novembro 2026"};
  const readings=(window.CEMIG_BASE?.readings||[]).map(([date,kwh])=>({date,kwh:Number(kwh)}));
  let expenses=loadExpenses();
  let rate=loadRate();
  let discounts=loadDiscounts();
  function loadDiscounts(){try{const x=JSON.parse(localStorage.getItem(DISCOUNT_KEY)||"{}");return x&&typeof x==="object"?x:{}}catch{return {}}}
  function saveDiscounts(){localStorage.setItem(DISCOUNT_KEY,JSON.stringify(discounts))}
  function currentDiscount(){return Number(discounts[selectedMonth()||"all"]||0)}
  function syncDiscountInput(){$("discount-input").value=currentDiscount().toFixed(2);$("discount-feedback").textContent=currentDiscount()>0?"Desconto salvo para este período":""}
  function loadExpenses(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return []}}
  function loadRate(){const n=Number(localStorage.getItem(RATE_KEY));return Number.isFinite(n)&&n>=0?n:(window.CEMIG_BASE?.rateDefault||1.1780)}
  function saveExpenses(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(expenses))}catch{alert("Não foi possível salvar no navegador. Exporte seus dados para backup.")}}
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function fmtDate(s){return s.split("-").reverse().join("/")}
  function selectedMonth(){return $("filter-month").value}
  function inPeriod(date){return !selectedMonth()||date.startsWith(selectedMonth())}
  function periodReadings(){return readings.filter(r=>inPeriod(r.date))}
  function periodExpenses(){return expenses.filter(e=>inPeriod(e.date)).sort((a,b)=>b.date.localeCompare(a.date))}
  function sum(arr,fn){return arr.reduce((acc,x)=>acc+fn(x),0)}
  function renderMonthly(){
    const months=["2026-09","2026-10","2026-11"];
    const totals=months.map(m=>({month:m,kwh:sum(readings.filter(r=>r.date.startsWith(m)),r=>r.kwh)}));
    const max=Math.max(1,...totals.map(x=>x.kwh*rate));
    $("monthly-chart").innerHTML=totals.map(x=>{const cost=x.kwh*rate;return `<div class="bar-item"><div class="bar-value">${currency.format(cost)}</div><div class="bar-track"><div class="bar-fill ${x.month===selectedMonth()?"selected":""}" style="height:${Math.max(3,cost/max*100)}%" title="${number.format(x.kwh)} kWh"></div></div><div class="bar-label">${monthNames[x.month].split(" ")[0]}</div></div>`}).join("");
    $("monthly-summary").innerHTML=totals.map(x=>`<div><span>${monthNames[x.month]}</span><b>${number.format(x.kwh)} kWh</b></div>`).join("");
  }
  function renderDaily(data){
    $("chart-caption").textContent=data.length+" dias com leitura";
    if(!data.length){$("daily-chart").innerHTML='<div class="empty-state">Sem leituras para este período.</div>';return}
    const ordered=[...data].sort((a,b)=>a.date.localeCompare(b.date));
    const max=Math.max(1,...ordered.map(r=>r.kwh));
    $("daily-chart").innerHTML=ordered.map((r,i)=>{
      const day=r.date.slice(8), previous=ordered[i-1], higher=!!previous&&r.kwh>previous.kwh;
      const delta=previous?r.kwh-previous.kwh:0;
      const comparison=!previous?"Primeira leitura do período":higher?"Subiu "+number.format(delta)+" kWh em relação ao dia anterior":(delta<0?"Caiu ":"Manteve ")+number.format(Math.abs(delta))+" kWh em relação ao dia anterior";
      return '<div class="day-column '+(higher?'is-higher':'')+'" tabindex="0" aria-label="'+fmtDate(r.date)+': '+number.format(r.kwh)+' kWh"><span class="day-value">'+number.format(r.kwh)+'</span><div class="day-track"><div class="day-fill '+(higher?'higher':'')+'" style="height:'+Math.max(2,r.kwh/max*100)+'%"></div></div><small>'+day+'</small><div class="chart-tooltip"><b>'+fmtDate(r.date)+'</b><strong>'+number.format(r.kwh)+' <small>kWh</small></strong><span>'+currency.format(r.kwh*rate)+'</span><em class="'+(higher?'up':'')+'">'+comparison+'</em></div></div>';
    }).join("");
  }
  function renderReadings(data){
    $("readings-body").innerHTML=[...data].sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr><td>${fmtDate(r.date)}</td><td class="numeric">${number.format(r.kwh)} kWh</td><td class="numeric">${currency.format(r.kwh*rate)}</td></tr>`).join("");
    $("reading-count").textContent=data.length+" leituras";
  }
  function render(){
    const r=periodReadings(), e=periodExpenses();
    const kwh=sum(r,x=>x.kwh), energy=kwh*rate, other=sum(e,x=>x.value), gross=energy+other, discount=currentDiscount(), total=gross-discount;
    $("total-consumption").textContent=number.format(kwh)+" kWh";
    $("days-count").textContent=r.length+" dias com leitura";
    $("energy-cost").textContent=currency.format(energy);
    $("other-expenses").textContent=currency.format(other);
    $("grand-total").textContent=currency.format(total);
    $("dre-discount").textContent="− "+currency.format(discount);
    $("dre-kwh").textContent=number.format(kwh)+" kWh";
    $("dre-energy").textContent=currency.format(energy);
    $("dre-other").textContent=currency.format(other);
    $("dre-total").textContent=currency.format(total);
    $("history-body").innerHTML=e.map(x=>`<tr><td>${fmtDate(x.date)}</td><td>${esc(x.description)}</td><td><span class="tag">${esc(x.category)}</span></td><td class="numeric">${currency.format(x.value)}</td><td><button class="delete" data-delete="${esc(x.id)}" type="button">Excluir</button></td></tr>`).join("");
    $("empty-state").hidden=e.length>0;
    $("record-count").textContent=e.length+(e.length===1?" lançamento":" lançamentos");
    renderMonthly();renderDaily(r);renderReadings(r);
  }
  $("rate-input").value=rate.toFixed(4);
  $("save-rate").addEventListener("click",()=>{const next=Number($("rate-input").value);if(!Number.isFinite(next)||next<0){alert("Informe uma tarifa válida.");return}rate=next;localStorage.setItem(RATE_KEY,String(rate));$("rate-feedback").textContent="Tarifa aplicada: "+currency.format(rate)+"/kWh";render()});
  $("filter-month").addEventListener("change",()=>{syncDiscountInput();render()});
  $("apply-discount").addEventListener("click",()=>{const value=Number($("discount-input").value);const r=periodReadings(),e=periodExpenses();const gross=sum(r,x=>x.kwh*rate)+sum(e,x=>x.value);if(!Number.isFinite(value)||value<0){alert("Informe um desconto válido em reais.");return}if(value>gross){alert("O desconto não pode ser maior que o total de custos do período ("+currency.format(gross)+").");return}discounts[selectedMonth()||"all"]=value;saveDiscounts();$("discount-feedback").textContent=value>0?"Desconto aplicado: "+currency.format(value):"Desconto removido";render()});
  $("entry-date").value=new Date().toLocaleDateString("en-CA");
  $("entry-form").addEventListener("submit",ev=>{ev.preventDefault();const value=Number($("entry-value").value);const description=$("entry-description").value.trim();const date=$("entry-date").value;if(!date||!description||!Number.isFinite(value)||value<=0){alert("Preencha data, descrição e valor válido.");return}expenses.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date,description,category:$("entry-category").value,value});saveExpenses();$("entry-form").reset();$("entry-date").value=new Date().toLocaleDateString("en-CA");render()});
  $("history-body").addEventListener("click",ev=>{const b=ev.target.closest("[data-delete]");if(!b)return;if(!confirm("Excluir esta despesa?"))return;expenses=expenses.filter(e=>e.id!==b.dataset.delete);saveExpenses();render()});
  $("export-csv").addEventListener("click",()=>{const rows=[["Tipo","Data","Descrição","Categoria","Consumo (kWh)","Tarifa (R$/kWh)","Valor estimado (R$)"],...periodReadings().map(r=>["Consumo diário",r.date,"Leitura Cemig","Energia",r.kwh,rate,(r.kwh*rate).toFixed(2)]),...periodExpenses().map(e=>["Despesa adicional",e.date,e.description,e.category,"",rate,e.value.toFixed(2)])];const csv="\uFEFF"+rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="dre-cemig-"+(selectedMonth()||"historico")+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)});
  syncDiscountInput();
  render();
})();