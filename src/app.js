(() => {
  "use strict";
  const STORAGE_KEY = "controle-gastos-cemig-v1";
  const $ = (id) => document.getElementById(id);
  const currency = new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"});
  const number = new Intl.NumberFormat("pt-BR", {minimumFractionDigits:2,maximumFractionDigits:2});
  let entries = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter(x => x && typeof x.id === "string" && typeof x.date === "string") : [];
    } catch (error) {
      console.warn("Não foi possível ler os lançamentos salvos.", error);
      return [];
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
    catch (error) { alert("Não foi possível salvar. Verifique o espaço disponível no navegador."); }
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function filtered() {
    const month = $("filter-month").value;
    const category = $("filter-category").value;
    return entries.filter(e => (!month || e.date.startsWith(month)) && (!category || e.category === category))
      .sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }
  function render() {
    const data = filtered();
    const expenses = data.reduce((s,e) => s + (Number(e.value)||0),0);
    const kwhEntries = data.filter(e => e.kwh !== null && Number.isFinite(Number(e.kwh)));
    const kwh = kwhEntries.reduce((s,e) => s + Number(e.kwh),0);
    $("total-expenses").textContent = currency.format(expenses);
    $("total-consumption").textContent = number.format(kwh) + " kWh";
    $("daily-average").textContent = number.format(kwhEntries.length ? kwh/kwhEntries.length : 0) + " kWh";
    $("expense-period").textContent = $("filter-month").value ? "Mês selecionado" : "Todos os lançamentos";
    $("record-count").textContent = data.length + (data.length === 1 ? " registro" : " registros");
    $("history-body").innerHTML = data.map(e => `<tr>
      <td>${escapeHtml(e.date.split("-").reverse().join("/"))}</td>
      <td>${escapeHtml(e.description)}</td>
      <td><span class="tag">${escapeHtml(e.category)}</span></td>
      <td class="numeric">${e.kwh === null ? "—" : number.format(Number(e.kwh)) + " kWh"}</td>
      <td class="numeric">${e.value === null ? "—" : currency.format(Number(e.value))}</td>
      <td><button class="delete" type="button" data-delete="${escapeHtml(e.id)}" aria-label="Excluir lançamento">Excluir</button></td>
    </tr>`).join("");
    $("empty-state").hidden = data.length > 0;
  }
  $("entry-date").value = new Date().toLocaleDateString("en-CA");
  $("entry-form").addEventListener("submit", event => {
    event.preventDefault();
    const description = $("entry-description").value.trim();
    const valueRaw = $("entry-value").value;
    const kwhRaw = $("entry-kwh").value;
    const value = valueRaw === "" ? null : Number(valueRaw);
    const kwh = kwhRaw === "" ? null : Number(kwhRaw);
    if (!description) return alert("Informe uma descrição.");
    if (value === null && kwh === null) return alert("Informe um valor ou consumo.");
    if ((value !== null && (!Number.isFinite(value) || value < 0)) || (kwh !== null && (!Number.isFinite(kwh) || kwh < 0))) return alert("Informe números válidos e não negativos.");
    entries.push({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),date:$("entry-date").value,description,category:$("entry-category").value,value,kwh});
    save(); $("entry-form").reset(); $("entry-date").value = new Date().toLocaleDateString("en-CA"); render();
  });
  $("history-body").addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const item = entries.find(e => e.id === button.dataset.delete);
    if (!item || !confirm("Excluir este lançamento?")) return;
    entries = entries.filter(e => e.id !== item.id); save(); render();
  });
  $("filter-month").addEventListener("change", render);
  $("filter-category").addEventListener("change", render);
  $("clear-filters").addEventListener("click", () => {$("filter-month").value="";$("filter-category").value="";render();});
  $("export-csv").addEventListener("click", () => {
    const rows = [["Data","Descrição","Categoria","Consumo (kWh)","Valor (R$)"],...filtered().map(e=>[e.date,e.description,e.category,e.kwh ?? "",e.value ?? ""])];
    const csv = "\uFEFF" + rows.map(row => row.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(";")).join("\r\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href=url; a.download="controle-gastos-cemig.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
  render();
})();