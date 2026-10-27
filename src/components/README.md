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

## ForecastList e ForecastCard

## Estados de apresentação

`LoadingState` anuncia via `role="status"` e aceita `message` opcional.
`ErrorState` recebe mensagem segura para o usuário, `onRetry` e `disabled`
opcional; anuncia o erro e mantém retry como botão nativo, sem submeter formulários.
`EmptyState` recebe `title` e `hint`, servindo tanto à orientação inicial quanto
à busca sem resultados. Estes componentes não fazem requests nem controlam foco.

P6.6–P6.8 foram autorizados como exceção limitada em 27/10/2026, incluindo
SearchBar manual, bootstrap, demonstração com mock e testes, sem API nem
aprovação global da spec/T-01.

## Previsão diária

`ForecastList` recebe `days`, `unit` e `today`; `ForecastCard` recebe `day`, `unit`
e `today`. `today` deve ser YYYY-MM-DD no fuso da cidade; não use a data do
dispositivo como substituto. Exemplo para a fixture fixa:

```tsx
<ForecastList days={mockWeatherData.days} unit="celsius" today="2026-10-29" />
```

O serviço futuro é responsável por fornecer cinco datas únicas, válidas e em
ordem, preservando registros incompletos. A lista não inventa dados: mantém a
ordem recebida e comunica vazio. `formatForecastDay` rejeita datas civis inválidas.
Os cards derivam máxima/mínima em °C/°F e apresentam condição acessível e
probabilidade máxima diária de chuva em %. Probabilidade nula/inválida é
indisponível; 0% é válido. A fixture mantém as probabilidades nulas.

P6.5 autoriza apenas componentes, helper, campo nullable e testes, sem API,
bootstrap ou aprovação global da spec. O grid usa duas, três ou cinco colunas nos
breakpoints solicitados. A validação visual em navegador/mobile fica para a
integração, pois o bootstrap da aplicação ainda não existe.
