/*
 * Controle de Gastos Cemig — extrator de consumo diário
 * Execute no Console do navegador (F12) com o gráfico do Cemig Atende aberto.
 *
 * Antes de executar:
 * 1. Selecione o mês e ano desejados no portal.
 * 2. Aguarde o gráfico terminar de atualizar.
 * 3. Ajuste MES, ANO e DIAS abaixo.
 *
 * O script lê os dados do gráfico via React Fiber, valida o período e copia TSV.
 * Não envia dados para nenhum servidor.
 */
(() => {
  const MES = 11;       // 1 = janeiro ... 12 = dezembro
  const ANO = 2026;
  const DIAS = new Date(ANO, MES, 0).getDate();
  const nomeMes = String(MES).padStart(2, "0");
  const canvas = document.querySelector('canvas[data-testid="canvas"]');
  let fiber = canvas?.[Object.keys(canvas || {}).find(k => k.startsWith("__reactFiber$"))];

  while (fiber) {
    const data = fiber.memoizedProps?.data;
    if (data?.labels && data?.datasets?.[0]?.data) {
      const values = data.datasets[0].data;
      const expectedLabel = `01/${nomeMes}`;
      if (values.length !== DIAS || !data.labels.some(label => label === expectedLabel)) {
        console.error(`O gráfico não parece estar em ${nomeMes}/${ANO}. Selecione o período correto e aguarde a atualização.`);
        console.log("Rótulos:", data.labels.filter(Boolean));
        console.log("Quantidade de valores:", values.length, "| Esperado:", DIAS);
        return;
      }
      const rows = ["Data\tConsumo (kWh)"];
      values.forEach((value, index) => {
        const day = String(index + 1).padStart(2, "0");
        rows.push(`${day}/${nomeMes}/${ANO}\t${Number(value).toFixed(2).replace(".", ",")}`);
      });
      const output = rows.join("\n");
      console.table(values.map((value,index) => ({
        Data: `${String(index + 1).padStart(2,"0")}/${nomeMes}/${ANO}`,
        "Consumo (kWh)": Number(value).toFixed(2)
      })));
      if (typeof copy === "function") {
        copy(output);
        console.log("Tabela copiada! Cole no Excel com Ctrl+V.");
      } else {
        console.log("Copie o TSV abaixo:", output);
      }
      return;
    }
    fiber = fiber.return;
  }
  console.error("Não foi possível localizar os dados do gráfico. Confirme se o gráfico do Cemig Atende está aberto.");
})();