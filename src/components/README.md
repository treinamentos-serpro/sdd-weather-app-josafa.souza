# Componentes

## UnitToggle

Componente controlado: recebe `unit: Unit` e `onChange(unit: Unit)`. Os dois botões
usam `aria-pressed` e pertencem ao grupo "Unidade de temperatura". Tab e Shift+Tab
movem o foco; Enter e Espaço acionam o botão focado. O consumidor atualiza `unit`
para refletir a seleção; o componente não converte temperaturas nem faz requests.

P6.3 foi autorizado em 27/10/2026 como exceção limitada ao gate T-01, apenas para
este componente e testes isolados (RF4.1, RNF2; AC-4.4, AC-7.3). Isso não aprova a
spec nem libera integração, API ou outras tarefas de UI. O tipo `Unit` pertence à
entrega P6.1.

## CurrentWeather

Recebe `city`, `current` (nullable) e `unit`. Usa helpers locais para temperatura e
condição WMO; o ícone é um símbolo Unicode local com nome acessível, sem serviço de
imagens. Métricas ficam indisponíveis quando ausentes; precipitação exige duração
positiva do intervalo, exibida em minutos. A fixture conserva as novas métricas
como `null`, sem inventar medidas reais.

P6.4 foi autorizado em 27/10/2026 como exceção limitada para componente,
helpers e testes. RF2.3/AC-2.4 registram as quatro métricas aprovadas; T-01 continua
bloqueando a integração/API. `formatTemperature` usa o arredondamento inteiro de
`Intl.NumberFormat('pt-BR')` (empates afastados de zero), apenas na exibição;
OQ-16 continua pendente de aprovação formal dessa política para a aplicação.
