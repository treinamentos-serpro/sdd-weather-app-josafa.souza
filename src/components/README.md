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

## Estados de apresentação

`LoadingState` anuncia via `role="status"` e aceita `message` opcional.
`ErrorState` recebe mensagem segura para o usuário, `onRetry` e `disabled`
opcional; anuncia o erro e mantém retry como botão nativo, sem submeter formulários.
`EmptyState` recebe `title` e `hint`, servindo tanto à orientação inicial quanto
à busca sem resultados. Estes componentes não fazem requests nem controlam foco.

P6.6–P6.8 foram autorizados como exceção limitada em 27/10/2026, incluindo
SearchBar manual, bootstrap, demonstração com mock e testes, sem API nem
aprovação global da spec/T-01.

## ForecastList e ForecastCard

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
integração da demonstração P6.7 e à revisão P6.8.

## SearchBar e App demonstrativo

`SearchBar` recebe `onSearch(city)` e `disabled`, usa formulário `role="search"`
com label e submit manual (Enter/botão). Não envia termo vazio e aplica trim.
Não implementa o autocomplete de produção: esta divergência foi aprovada apenas
para a demonstração local P6.7. `App` compõe componentes, mantém unidade e estado
da demonstração localmente e nunca solicita dados. O seletor mantém os cinco
estados reproduzíveis, inclusive loading estático.

## Revisão de UI e acessibilidade — P6.8

| Ponto encontrado | Melhoria aplicada | Evidência |
| --- | --- | --- |
| Texto branco no botão em hover tinha contraste 3,51:1 | Texto night-900 no hover; normal permanece branco/accent-600 (4,58:1) | Playwright calcula contraste das cores computadas e exige ≥4,5:1 |
| Sem atalho para contornar header/controles | Link "Pular para o conteúdo", visível ao foco, main focável e nomeado | Teclado no Chromium |
| Retry removia o próprio botão, deixando foco sem destino útil | Busca/retry direcionam foco ao main após renderização; seletor não rouba foco | Testing Library e Playwright |
| Resultados/vazio não tinham anúncio dinâmico | Região status persistente para sucesso/vazio; loading usa status, erro usa alert | Queries por role e testes de integração |
| Texto longo da temperatura indisponível podia pressionar o layout | Limites de largura, quebra de palavra e hero menor no mobile | Testes de componentes; grid/browser de 320px a 1280px |
| Marca/controle de unidade podiam encolher ou esticar indevidamente | Marca sem shrink e grupo de unidade compacto | Header e controles no navegador |

Roles, labels associados, títulos, `aria-pressed` e botões nativos foram
preservados. Os controles têm alvos mínimos de 44px e foco visível. O grid
mantém 2/3/5 colunas; cinco estados foram verificados sem overflow horizontal
em 320, 360, 768 e 1280px no Chromium, incluindo acesso ao último card por
rolagem vertical. Estes testes não equivalem a uma certificação WCAG completa.

Validação final: `pnpm lint` passou; `pnpm build` passou;
`pnpm test` passou (69 testes em 10 arquivos);
`pnpm exec playwright test tests/e2e/ui.spec.ts --project=chromium --workers=1`
passou (6 testes).
O teste E2E bloqueia requests externos, incluindo fontes, para não depender de
rede nem compartilhar dados com terceiros.

Pendências: validar com leitor de tela real, zoom de 200%/400%, forced-colors,
fontes definitivas e Safari/iOS real. O projeto mobile/WebKit foi tentado após
instalar browsers/bibliotecas, mas a sessão fecha durante a automação neste
ambiente (`WebKitWebView ... automation is not allowed in the context`).
Não tratar essa execução como aprovada nem remover os testes para ocultar a falha.
