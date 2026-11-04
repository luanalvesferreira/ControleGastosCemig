# Controle de Gastos — Cemig

Painel de DRE/controle financeiro de energia com paleta verde, consumo diário e estimativa de custo.

## Versão 1.1.0 — 04/11/2026
- Tarifa padrão: **R$ 1,1780/kWh**, editável no painel.
- Bases diárias consolidadas de setembro, outubro e novembro de 2026 em `src/dados-consumo.js`.
- Indicadores de consumo, custo estimado, despesas adicionais e custo total.
- DRE do período, comparação de custo mensal e gráfico diário.
- Cadastro de despesas adicionais, filtros e exportação CSV.
- Extrator de consumo Cemig em `extracao-cemig.js`.

## Executar
Abra `index.html` em um navegador moderno. Não exige instalação ou servidor.

Despesas adicionais e tarifa ficam no armazenamento local do navegador. As leituras-base ficam versionadas no código. Use Exportar CSV para guardar os dados filtrados.

## Como o cálculo funciona
`Custo estimado de energia = kWh apurados × tarifa configurada`.
`Total estimado = custo de energia + despesas adicionais`.

Este cálculo é uma estimativa e não reproduz necessariamente o valor final da fatura Cemig, que pode conter impostos, bandeiras tarifárias, distribuição, iluminação pública e outros componentes.

## Observação sobre novembro
As linhas com consumo zero na planilha de novembro foram interpretadas como dias sem leitura disponível e não são incluídas no total, para evitar subestimar o consumo. A base disponível contabiliza leituras de 1 a 3 de novembro.

## Estrutura
```
index.html
extracao-cemig.js
src/app.js
src/dados-consumo.js
src/styles.css
docs/CHANGELOG.md
```
