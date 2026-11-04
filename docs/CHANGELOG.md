## [1.1.12] — 04/11/2026\n- Adiciona “Limpar seleção” aos filtros de mês, período personalizado e dias da base.\n- Reorganiza a barra em telas largas para colocar o desconto em uma segunda linha, mantendo o botão dentro do painel.\n- Ajusta o card diário para exibir o dia da semana em um elemento próprio logo abaixo da data.\n\n## [1.1.11] — 04/11/2026
- Exibe o dia da semana logo abaixo da data no card de detalhes do consumo diário.

## [1.1.10] — 04/11/2026\n- Ajusta a distribuição de larguras dos filtros em telas largas para manter o botão “Aplicar desconto” dentro do painel.\n- Permite que o campo de desconto reduza sua largura de forma controlada sem cortar o botão.\n\n# Histórico de versões

## [1.1.9] — 04/11/2026
- Sincroniza os filtros de mês e dias: a lista de dias exibe somente datas dos meses selecionados.
- Ao alterar os meses, atualiza a lista de dias e preserva apenas as datas ainda compatíveis.
- Mantém o filtro de período personalizado independente dos filtros de mês e dias.


## [1.1.8] — 04/11/2026
- Adiciona filtro de períodos personalizados com os intervalos 18/09/2026–20/10/2026 e 20/10/2026–19/11/2026.
- Ao selecionar períodos personalizados, eles passam a controlar o recorte de datas sem conflito com os filtros de mês e dias individuais.
- Permite selecionar um ou ambos os intervalos e associa descontos à seleção de períodos.


## [1.1.7] — 04/11/2026
- Fecha os menus de período e dias ao clicar fora deles.
- Mantém o menu aberto durante cliques nas opções e permite fechar com Esc.


## [1.1.6] — 04/11/2026
- Remove a mensagem de status do desconto abaixo do campo.
- Corrige os menus de seleção para não serem cortados pelo contêiner de filtros.
- Adiciona filtro multisseleção por datas individuais da base de consumo.
- Faz o card de custo estimado de energia exibir o valor líquido após desconto; o DRE mantém a dedução discriminada e evita descontar duas vezes.


## [1.1.5] — 04/11/2026
- Permite selecionar um ou vários meses no período de análise, inclusive todo o histórico.
- Mantém os controles financeiros em uma única linha; em telas estreitas, a faixa permite rolagem horizontal sem quebrar os campos.
- Ajusta o desconto para ser armazenado por combinação de meses selecionados.


## [1.1.4] — 04/11/2026
- Reorganiza os controles de período, tarifa e desconto em uma única linha em telas largas.
- Ajusta larguras e tipografia da tarifa-base; em telas menores, os controles se reorganizam sem sobreposição.


## [1.1.3] — 04/11/2026
- Adiciona campo de desconto em reais ao lado dos filtros de período e tarifa.
- Permite aplicar desconto por período selecionado, com persistência local no navegador.
- Exibe o desconto como dedução no DRE e calcula o total líquido após desconto.


## [1.1.2] — 04/11/2026
- Aumenta o card de detalhes do gráfico diário e fixa sua posição na tela para evitar recorte pela área rolável do gráfico.


## [1.1.1] — 04/11/2026
- Aumenta o tamanho dos valores de kWh e das barras no gráfico diário.
- Adiciona card flutuante ao passar o mouse ou focar o dia, com data, consumo, custo estimado e comparação com o dia anterior.
- Destaca em amarelo os dias cujo consumo supera o do dia imediatamente anterior.


## [1.1.0] — 04/11/2026
- Evolução para painel DRE de energia com paleta verde.
- Tarifa padrão configurada em R$ 1,1780/kWh e editável no painel.
- Consolidação das leituras diárias das planilhas de setembro, outubro e novembro de 2026.
- Indicadores de consumo, custo estimado, despesas adicionais e total de custos.
- Comparativo mensal, gráfico de consumo diário, histórico de despesas e exportação CSV.
- Leituras zeradas de novembro excluídas da base ativa por serem dados ainda indisponíveis.

## [1.0.0] — 04/11/2026
- Estrutura inicial, cadastro de lançamentos, filtros, histórico, CSV e extrator Cemig.
