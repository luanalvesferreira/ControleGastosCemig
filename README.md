# Controle de Gastos — Cemig

Aplicação web para registrar despesas de energia, acompanhar consumo diário em kWh e consultar o histórico.

## v1.0.0 — 04/11/2026

- Dashboard com indicadores de despesas, consumo e média diária.
- Cadastro de conta de energia, consumo diário, taxas e outros lançamentos.
- Filtros por mês e categoria.
- Histórico com exclusão de lançamentos.
- Exportação CSV para Excel.
- Persistência local via localStorage.
- Script de extração do gráfico do Cemig Atende em JavaScript.

## Executar
Abra `index.html` em um navegador moderno. Não exige instalação nem servidor.

Os registros ficam armazenados no navegador/dispositivo atual. Use a exportação CSV para manter cópias de segurança.

## Extrair consumo do Cemig Atende
Consulte `extracao-cemig.js`. Selecione o mês no portal e aguarde o gráfico atualizar antes de executar o script no Console do navegador (F12). O script confere mês e quantidade de dias e copia os dados em TSV.

Valores zero podem representar dados ainda indisponíveis no portal. Confira antes de considerar como consumo real.

## Estrutura
```
index.html
extracao-cemig.js
src/app.js
src/styles.css
docs/CHANGELOG.md
```
