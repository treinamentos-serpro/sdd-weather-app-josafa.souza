# Weather App — Backlog

| Campo | Valor |
| --- | --- |
| Versão | 0.7 (rascunho estimado e priorizado) |
| Entrada | [Plano técnico](../plans/weather-app-plan.md), versão 0.1, incluindo P4.8 |
| Fonte normativa | [Spec](../specs/weather-app-spec.md), versão 0.2 |
| Status | Proposta; implementação bloqueada até concluir T-01 |

## Regras

- **Exceção autorizada — P6.1:** o usuário autorizou em 27/10/2026 implementar apenas os cinco tipos de domínio de T-02 e uma fixture local em `src/mocks/weatherData.ts`, antes de T-01. Não aprova a spec, não conclui T-01/T-02 integralmente (uniões de estado/erros continuam pendentes) nem libera UI, API ou demais tarefas. A fixture tipada é sintética, com as cinco datas fixas da spec 4.1; para simular Hoje durante desenvolvimento, fixar o relógio em 29/10/2026 no fuso de São Paulo. Importar `mockWeatherData` de `src/mocks/weatherData.ts` apenas explicitamente no desenvolvimento, nunca como fallback de falha da API.
- IDs são estáveis: T-01–T-30 preservam uma parte do escopo original; T-31 em diante representam os desdobramentos. Número não indica posição de execução.
- Cada linha é uma tarefa com título, descrição, critérios de aceite, dependências diretas, arquivos prováveis e tipo. Arquivos relativos à raiz; cada tarefa altera no máximo dois arquivos relevantes.
- Dependências listam tarefas, não ordem implícita dos grupos. Tarefas independentes podem avançar em paralelo, mas alterações no mesmo arquivo exigem coordenação.
- A leitura segue decisões → tipos → funções puras → services → hook → componentes → integração → testes → hardening. Componentes controlados não recebem dependência artificial de serviços/hooks: sua ligação acontece em T-17. IDs anteriores são preservados, mesmo quando sua posição muda.
- Implementação e testes de regressão são entregas distintas. A tarefa de implementação deve ser validada com testes existentes/apropriados; só considerar o conjunto funcional aceito após sua tarefa Test. Não criar uma segunda implementação para atender testes.
- Para código, executar testes focados e o checklist `pnpm lint`, `pnpm build`, `pnpm test`; fluxos/UI exigem também E2E pertinente. Documentação não exige essas suítes. Falha de baseline deve ser registrada, nunca escondida.
- Critérios são expectativas, não resultados já obtidos. Nenhuma tarefa está concluída por este documento existir.
- Não presumir respostas às OQs. Se uma decisão mudar a spec/plano, revisar as tarefas afetadas antes de iniciar dependentes. Não implementar backend, cache, analytics, persistência ou novas grandezas fora de escopo.

## Contrato de aceite — P5.3

Estes critérios complementam **cada linha**, sem substituir seu resultado específico:

1. **Rastreabilidade:** registrar IDs RF/RNF/AC indicados na tarefa na evidência correspondente. As decisões da Entrega 0 referenciam OQs e atualizam os ACs afetados; nenhuma OQ é considerada resolvida apenas por ter responsável sugerido.
2. **Implementação:** demonstrar o comportamento com entrada/ação/saída da spec aprovada, confirmar tipagem/build e executar o checklist aplicável. Registrar comando e resultado; uma tarefa de implementação não fica concluída só porque o arquivo foi criado.
3. **Test:** executar os casos especificados e registrar comando/ambiente e resultado; assertion deve falhar se a regra for violada. Sem rede real na suíte principal, esperas arbitrárias, mocks que substituam o próprio alvo ou teste ignorado usado como evidência de sucesso.
4. **Infra/documentação:** evidência deve identificar configuração/decisão efetiva, aprovador quando necessário, data e verificação. Uma proposta, relatório vazio ou descrição de intenção não satisfaz o aceite.
5. **Falha:** resultado que não atinge limite ou contém defeito impeditivo bloqueia a conclusão. Correção e reexecução precisam de evidência; não diminuir limiar, ocultar erro, fabricar dado ou retirar caso para obter aprovação.
6. **Pendências:** números e contratos abaixo reproduzem a spec atual. Se T-01 aprovar alteração, atualizar referências e expectativas no backlog antes de executar a tarefa afetada. RF2.3 só gera implementação/teste adicional se OQ-3 aprovar campos extras.

Não estabelecer percentual de cobertura arbitrário: o portão é a evidência para cada AC aprovado, inclusive AC-1.10 de contrato real e AC-8.4 manual. As tarefas Test verificam ACs de várias histórias sem duplicar o teste por dona da história.

## Entrega 0 — Decisões antes de implementar

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-31 | Fechar escopo e leitura temporal | Obter decisões de Produto sobre o conteúdo e sua validade. | OQ-2–OQ-6/OQ-18 e virada do dia com resposta e aprovação registradas; campos/unidades, cidade única, idade máxima e ação de refresh expressos em valores/regras testáveis; RF2–RF3/ACs atualizados, sem "a definir" no escopo aprovado. | Nenhuma | `specs/weather-app-spec.md` | Infra |
| T-32 | Fechar contrato e licença do provedor | Decidir busca, limites e recuperação com responsáveis técnicos/legais. | OQ-9, OQ-13 e OQ-17 respondidas; limite/ordenação da busca, grafia/homônimas, timeout, 429/CORS e obrigações de atribuição definidos; prioridade de RF6 reconciliada com licença. | Nenhuma | `specs/weather-app-spec.md` | Infra |
| T-33 | Fechar critérios de UX e qualidade | Aprovar textos, tema, acessibilidade, arredondamento e protocolos. | OQ-1, OQ-8, OQ-10, OQ-11, OQ-14–OQ-16 respondidas ou premissas formalmente aceitas; protocolo, metas, browsers e desempate de arredondamento verificáveis. | Nenhuma | `specs/weather-app-spec.md` | Infra |
| T-34 | Definir validação de respostas | Fechar casos ambíguos de dados inválidos. | Definidos dados utilizáveis, fuso/hora/coordenadas inválidos, geocoding parcialmente inválido, datas duplicadas e mínima maior que máxima; cada regra tem AC verificável, sem descarte silencioso. | T-31, T-32 | `specs/weather-app-spec.md` | Data |
| T-35 | Fechar privacidade e operação | Aprovar persistência, hospedagem, logs e disponibilidade. | OQ-7/OQ-12 respondidas e aprovadas; serviço de hospedagem, dados retidos/prazo, meta mensal e método de medição definidos; conflito aprovação/release resolvido; RNF7–RNF8 atualizados. | Nenhuma | `specs/weather-app-spec.md` | Infra |
| T-36 | Sincronizar contratos e backlog | Incorporar decisões da spec ao plano e às tarefas. | Plano e backlog refletem todas as decisões T-31–T-35; contratos, fixtures propostas e dependências não contradizem os ACs aprovados. | T-33, T-34, T-35 | `plans/weather-app-plan.md`, `tasks/weather-app-tasks.md` | Infra |
| T-01 | Aprovar passagem para implementação | Conferir o gate documental, não decidir todos os temas numa tarefa só. | Todos os itens do critério de saída da spec com evidência, status aprovado por responsável identificado e sem OQ bloqueante para código; RF1–RF6/RNF1–RNF9 e ACs permanecem coerentes com plano/backlog revisados. | T-36 | `specs/weather-app-spec.md` | Infra |

## Entrega 1 — Tipos → funções puras

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-02 | Definir tipos compartilhados | Declarar domínio, estados discriminados e erros. | `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `Unit` e estados seguem contrato aprovado, com `null` para ausência, Celsius interno, sem DTO externo na UI; TypeScript strict passa (RF1–RF5). | T-01 | `src/types/weather.ts` | Data |
| T-04 | Implementar conversão pura | Derivar a temperatura exibida sem alterar Celsius original. | 25 → 77 °F, 0 → 32 °F e −40 → −40 °F; 22,4 °C exibe 22 °C/72 °F; −0,4 °C exibe 0 °C/31 °F; empate segue decisão aprovada; `null` indisponível, entrada intacta e nenhuma rede (RF4.3; AC-4.2, AC-4.6, AC-4.7). | T-02 | `src/lib/temperature.ts` | Data |
| T-05 | Implementar datas e horários locais | Formatar datas e leitura em pt-BR. | Data civil preservada, Hoje e leitura usam fuso da cidade e instante explícito; não depende implicitamente do fuso do dispositivo (RF2.2, RF3.3; AC-2.2, AC-3.2–3.4). | T-02 | `src/lib/format.ts` | Data |
| T-06 | Implementar catálogo WMO | Retornar descrição e chave de ícone locais. | Todos os 28 códigos do plano mapeados; desconhecido usa descrição indisponível e ícone neutro, sem ocultar dados válidos (RF2.1, RF3.2, RNF9; AC-2.3, AC-3.7). | T-02 | `src/lib/weatherCodes.ts` | Data |

## Entrega 2 — Services → hook

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-07 | Implementar geocoding | Consultar e normalizar cidades com `fetch`. | URL, idioma e limite aprovados; termo trimado/codificado preserva caracteres; opcionais viram `null`; vazio válido distinto de erro (RF1.1–RF1.2; AC-1.1, AC-1.7–1.8, AC-1.13, AC-5.3). | T-02 | `src/services/weatherService.ts` | Data |
| T-08 | Implementar forecast normalizado | Produzir dados atuais e registros diários por data. | Enviar `current=temperature_2m,weather_code`, daily min/max/condição, timezone da cidade e Celsius; sete dias recebidos resultam em cinco posições hoje + 4; ausência de 30/10 mantém 31/10 na data correta com 30/10 nulo; atual ausente preserva previsão; nenhum dado utilizável é erro (RF2–RF3, RF5.5; AC-3.1–3.2, AC-5.7, AC-5.12, AC-5.14, AC-5.16). | T-05, T-07 | `src/services/weatherService.ts` | Data |
| T-09 | Implementar erros e timeout | Classificar falhas, cancelamento e prazo de retry. | Rede/HTTP/JSON inválido/sem dados têm classificação explícita; timeout após 10 s aprovados; `Retry-After` válido gera prazo, sem retry automático; abort de substituição não vira erro exibível (RF5.4, RF5.7; AC-5.4, AC-5.6, AC-5.10, AC-5.13). | T-08 | `src/services/weatherService.ts` | Data |
| T-10 | Implementar busca no hook | Coordenar query, debounce e estado da geocodificação. | idle/loading/success/empty/error; um caractere ou espaços não consultam; digitação contínua até 299 ms não envia, aos 300 ms envia uma busca pelo termo atual; edição invalida resultados antigos; limpar termo preserva clima; desmontagem cancela recursos (RF1.5–RF1.6; AC-1.4–1.6, AC-1.9, AC-1.12). | T-09 | `src/hooks/useWeather.ts` | Data |
| T-11 | Implementar seleção e estado meteorológico | Coordenar cidade e forecast independente da busca. | Cidade explícita desde loading; `selectedCity` derivada; resposta obsoleta ignorada; success/partial/error distintos, sem dados da cidade anterior (RF1.3–RF1.4, RF5.5; AC-1.3, AC-1.11, AC-5.9, AC-5.14). | T-10 | `src/hooks/useWeather.ts` | Data |
| T-12 | Implementar retry manual | Repetir só a consulta ativa que falhou. | Três acionamentos antes da resposta enviam uma tentativa, com mesmo termo/cidade; nenhuma fila; sem ação do usuário por 10 s após falha não há request; loading e prazo 429 desabilitam retry; liberar botão não consulta; resposta expirada nunca muda estado (RF5.4, RF5.7–RF5.8; AC-5.5–5.6, AC-5.11, AC-5.15). | T-11 | `src/hooks/useWeather.ts` | Data |
| T-39 | Implementar unidade no hook | Manter apenas a preferência em memória. | Unidade inicial Celsius; toggle só muda `unit`, sem request ou mutação de dados; funciona enquanto forecast carrega; sem persistência (RF4; AC-4.1, AC-4.3, AC-4.5, AC-4.8). | T-12 | `src/hooks/useWeather.ts` | Data |

## Entrega 3 — Componentes isolados

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-40 | Criar indicador de loading | Renderizar carregamento a partir de props. | Indicador acessível durante consulta, sem acesso à rede ou mudança de foco (RF5.2; AC-5.2, AC-5.9). | T-02 | `src/components/states/LoadingState.tsx` | UI |
| T-41 | Criar estado vazio | Distinguir orientação inicial e busca sem resultados. | Mensagens aprovadas em pt-BR; empty sugere revisar grafia sem retry; componente não envia requests (RF5.1, RF5.3; AC-5.1, AC-5.3). | T-02 | `src/components/states/EmptyState.tsx` | UI |
| T-42 | Criar estado de erro | Receber mensagem, callback e disponibilidade de retry. | Mensagem não expõe detalhe técnico; retry chama callback e respeita disabled; sem rede interna (RF5.4; AC-5.4, AC-5.10–5.11). | T-02 | `src/components/states/ErrorState.tsx` | UI |
| T-14 | Criar busca acessível | Campo e lista controlados com callbacks. | Homônimas distinguíveis, sem separadores vazios; seleção explícita; combobox/listbox com label, setas/Enter/Esc e foco preservado, resultados fora do Tab (RF1, RNF2; AC-1.1–1.3, AC-1.8, AC-7.1, AC-7.3, AC-7.5). | T-02 | `src/components/SearchBar.tsx` | UI |
| T-15 | Criar clima atual | Apresentar somente seção atual e sua ausência. | Temperatura/condição/ícone e hora de leitura com texto alternativo; `null` indisponível sem ocultar campos válidos; unidade derivada (RF2, RF5.5; AC-2.1–2.3, AC-5.12, AC-5.14). | T-04, T-05, T-06 | `src/components/CurrentWeather.tsx` | UI |
| T-45 | Criar cartão diário | Renderizar um registro diário sem dados externos. | Data, mínima/máxima rotuladas, condição/ícone acessíveis; Hoje e unidade derivada; valores ausentes não viram zero (RF3.2–RF3.3; AC-3.3, AC-3.7, AC-5.12). | T-04, T-05, T-06 | `src/components/ForecastCard.tsx` | UI |
| T-46 | Criar lista de cinco dias | Compor cartões em grid responsivo. | Cinco datas em ordem com chave estável por data; sem subdivisão horária; lacunas preservam posição; nenhuma rolagem horizontal (RF3.1, RF3.4–RF3.5; AC-3.1–3.2, AC-3.5–3.6, AC-5.7). | T-45 | `src/components/ForecastList.tsx` | UI |
| T-16 | Criar controle de unidade | Comunicar troca por callback tipado. | Unidade ativa visível e acessível; clique/toque/Enter/Espaço; foco visível, sem request interno (RF4.1, RNF2; AC-4.1, AC-4.4, AC-7.3). | T-02 | `src/components/UnitToggle.tsx` | UI |
| T-43 | Preparar estilos globais e fonte local | Aplicar Tailwind e diretriz visual vigente. | Tema dark glassmorphism conforme plano/instruções, fonte local sem destino externo; estados de foco e cores permitem os limiares da spec (RNF1–RNF2, RNF7; AC-7.4). | T-02 | `src/styles/index.css` | UI |
| T-13 | Criar composição visual da tela | Montar shell, crédito e região de anúncio estável. | Crédito aprovado fora de blocos condicionais, link Open-Meteo com nome acessível; região de status sem duplicação; shell sem dados mockados de produção ou rede (RF6, RNF2; AC-5.8, AC-6.1–6.2). | T-40, T-41, T-42, T-43 | `src/App.tsx` | UI |
| T-44 | Preparar bootstrap React | Ligar ponto de entrada e tipos Vite. | Entrada monta `App` e importa estilos, sem consulta automática, store global ou roteador (RF5.1; AC-5.1). | T-43, T-13 | `src/main.tsx`, `src/vite-env.d.ts` | Infra |

## Entrega 4 — Integração

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-17 | Conectar hook e componentes | Ligar uma instância do hook ao fluxo completo. | Uma instância do hook; 25 °C e mín/max da fixture mudam às temperaturas °F da spec sem request adicional; resposta durante loading usa unidade atual; Tab segue busca → unidade → retry → crédito omitindo indisponíveis; anúncios não movem foco/repetem; reload limpa cidade e volta Celsius (RF1–RF6; AC-4.2–4.3, AC-4.5, AC-4.7–4.8, AC-5.8, AC-7.2). | T-39, T-13, T-14, T-15, T-46, T-16, T-44 | `src/App.tsx` | UI |

## Entrega 5 — Testes isolados e de integração

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-03 | Preparar fixtures unitárias | Registrar respostas controladas da spec. | JSONs parseáveis; São Paulo com 25 °C/código 2/leitura 09:45 e datas 29/10–02/11/2026/min/max/códigos idênticos à spec 4.1; Tóquio e variantes de erro/ausência derivadas explicitamente nos testes; nenhuma fixture apresentada como dado real (spec 4.0–4.1). | T-02 | `tests/fixtures/geocoding.json`, `tests/fixtures/forecast.json` | Test |
| T-37 | Testar conversão de unidade com Vitest | Validar funções puras com testes tabulares, sem React ou rede. | 25 °C → 77 °F, 0 °C → 32 °F, −40 °C → −40 °F e tabela de AC-4.6 passam; inclui arredondamento aprovado, ausência, zero negativo e ida/volta com Celsius original intacto (AC-4.2, AC-4.6, AC-4.7). | T-03, T-04 | `tests/unit/temperature.test.ts` | Test |
| T-38 | Testar formatação temporal | Fixar relógio e fusos distantes. | Tóquio, Hoje e virada aprovada mantêm datas/leitura corretas e pt-BR (AC-2.2, AC-3.2–3.4; EC-16). | T-03, T-05 | `tests/unit/format.test.ts` | Test |
| T-51 | Testar catálogo WMO | Percorrer todos os códigos e fallback. | 28 códigos testados individualmente e código 999 neutro, com textos da fixture preservados (AC-2.3, AC-3.7; spec 4.1). | T-03, T-06 | `tests/unit/weatherCodes.test.ts` | Test |
| T-52 | Testar serviço de geocoding | Mockar `fetch`, não o alvo do teste. | URL codificada, idioma, opcionais, caracteres e vazio verificados sem API real (AC-1.1, AC-1.7–1.8, AC-1.13, AC-5.3). | T-03, T-07 | `tests/unit/geocodingService.test.ts` | Test |
| T-53 | Testar forecast com mock de fetch | Executar serviço real com `fetch` mockado no Vitest, sem API real. | URL/parâmetros, cinco datas, excedentes, lacunas e atual ausente verificados sem deslocamentos nem zeros fabricados; não mockar o serviço alvo; restaurar `fetch` após cada teste (AC-3.1–3.2, AC-5.7, AC-5.12, AC-5.14, AC-5.16). | T-03, T-08 | `tests/unit/forecastService.test.ts` | Test |
| T-54 | Testar falhas de transporte/API | Mockar `fetch` no Vitest para simular rejeições, timeout e prazo de 429. | Rede, HTTP 4xx/5xx e JSON ilegível geram erro, não sucesso; aos 9.999 ms chamada ainda ativa e aos 10.000 ms timeout; 429 testa segundos, data HTTP, passado, ausente e inválido; abort por substituição distinto; sem API real, mocks/timers restaurados (AC-5.4, AC-5.6, AC-5.10, AC-5.13, AC-5.16). | T-03, T-09 | `tests/unit/weatherServiceErrors.test.ts` | Test |
| T-55 | Testar busca no hook | Mockar serviço e controlar timers/respostas. | 299/300 ms, termo curto/vazio, limpeza e respostas invertidas produzem estados esperados sem rede (AC-1.4–1.6, AC-1.9, AC-1.12). | T-03, T-10 | `tests/unit/useWeatherSearch.test.tsx` | Test |
| T-56 | Testar forecast no hook | Controlar seleção e resolução de promises. | Nova cidade vence resposta antiga; loading/success/partial/error e contexto da cidade corretos (AC-1.3, AC-1.11, AC-5.9, AC-5.14). | T-03, T-11 | `tests/unit/useWeatherForecast.test.tsx` | Test |
| T-57 | Testar retry no hook | Controlar tempo e cliques repetidos. | Uma tentativa ativa, mesma consulta, sem fila/automação; resposta expirada ignorada e prazo 429 respeitado (AC-5.5–5.6, AC-5.11, AC-5.15). | T-03, T-12 | `tests/unit/useWeatherRetry.test.tsx` | Test |
| T-58 | Testar unidade no hook | Observar estado e chamadas do serviço. | Celsius inicial, unidade ativa durante loading, nenhuma chamada no toggle, dados originais preservados (AC-4.1, AC-4.3, AC-4.5, AC-4.8). | T-03, T-39 | `tests/unit/useWeatherUnit.test.tsx` | Test |
| T-63 | Testar componente de loading | Renderizar com Vitest/Testing Library e consultar status por papel/nome. | Indicador acessível aparece conforme props, sem alterar elemento previamente focado nem acessar rede (AC-5.2, AC-5.9). | T-03, T-40 | `tests/unit/LoadingState.test.tsx` | Test |
| T-64 | Testar componente de estado vazio | Renderizar variantes inicial e sem resultados com Vitest/Testing Library. | Variante inicial orienta busca; empty informa ausência de cidades e sugere revisar grafia; nenhuma delas oferece retry; sem rede (AC-5.1, AC-5.3). | T-03, T-41 | `tests/unit/EmptyState.test.tsx` | Test |
| T-65 | Testar componente de erro | Verificar mensagem e callback com Vitest/Testing Library e `userEvent`. | Mensagem distinta de empty e sem detalhes técnicos; ação habilitada chama callback uma vez por clique; desabilitada não chama callback por clique/teclado; sem rede (AC-5.4, AC-5.10–5.11). | T-03, T-42 | `tests/unit/ErrorState.test.tsx` | Test |
| T-59 | Testar busca acessível | Exercitar resultados e navegação. | Rótulos/nomes sem campos vazios, setas/Enter/Esc e callbacks corretos; teste por queries acessíveis (AC-1.1–1.3, AC-1.8, AC-7.1, AC-7.3, AC-7.5). | T-03, T-14 | `tests/unit/SearchBar.test.tsx` | Test |
| T-60 | Testar clima atual | Verificar dados normais e ausências. | Conteúdo atual, hora no fuso e alternativas textuais; parcial mantém dados válidos (AC-2.1–2.3, AC-5.12, AC-5.14). | T-03, T-15 | `tests/unit/CurrentWeather.test.tsx` | Test |
| T-61 | Testar cartão diário | Verificar rótulos e condição. | Data, min/max, unidade, ausências e fallback acessíveis (AC-3.3, AC-3.7, AC-5.12). | T-03, T-45 | `tests/unit/ForecastCard.test.tsx` | Test |
| T-62 | Testar lista diária | Verificar ordem e cardinalidade no DOM. | Cinco datas em ordem, lacuna não desloca outros dias, sem subdivisões horárias; layout real fica no E2E (AC-3.1–3.2, AC-3.6, AC-5.7). | T-03, T-46 | `tests/unit/ForecastList.test.tsx` | Test |
| T-66 | Testar controle de unidade | Exercitar unidade e teclado por props. | Nome indica unidade ativa, Enter/Espaço/clique disparam callback, sem serviço (AC-4.1, AC-4.4, AC-7.3). | T-03, T-16 | `tests/unit/UnitToggle.test.tsx` | Test |
| T-67 | Testar composição de App | Integrar UI/hook com serviço mockado. | Inicial com zero chamadas; loading/empty/error/success/partial produzem conteúdos distintos; anúncio uma vez por mudança e foco preservado; crédito em cada estado; contagem de geocoding e forecast inalterada após toggle, inclusive durante loading; serviço mockado, não o hook alvo da integração (AC-4.2–4.3, AC-4.8, AC-5.1–5.2, AC-5.8–5.9, AC-6.1–6.2, AC-7.2–7.3). | T-03, T-17 | `tests/unit/App.test.tsx` | Test |
| T-68 | Aceitar regressão unitária integrada | Conferir o conjunto dos testes isolados antes do aceite E2E. | `pnpm lint`, `pnpm build` e `pnpm test` passam com todos os testes predecessores; mocks/timers não contaminam testes vizinhos; registrar comandos/resultados, sem casos ignorados como evidência dos ACs (RF1–RF6; RNF3). | T-37, T-38, T-51, T-52, T-53, T-54, T-55, T-56, T-57, T-58, T-63, T-64, T-65, T-59, T-60, T-61, T-62, T-66, T-67 | `tasks/weather-app-tasks.md` | Test |

## Entrega 6 — Testes E2E

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-18 | Preparar Playwright determinístico | Configurar rotas e ambiente controlado. | Ambos os endpoints interceptados; request não previsto ao provedor falha; relógio/fuso fixos; cenário explícito 360 × 640 além do perfil mobile (spec 4.0, RNF1). | T-03, T-17 | `playwright.config.ts`, `tests/e2e/helpers/routes.ts` | Test |
| T-19 | Testar fluxo principal E2E desktop e mobile | Executar busca → seleção → clima atual/previsão → alternância com Playwright nos dois viewports. | Mesmo fluxo passa em desktop 1280 × 800 e mobile 360 × 640 com toque habilitado; homônimas, cidade, clima e cinco dias corretos; no mobile selecionar/trocar unidade por toque e alcançar os cinco dias por rolagem vertical sem overflow horizontal; ambos os endpoints interceptados; contagem de requests não aumenta no toggle; reload reinicia Celsius; relatório identifica resultado em cada viewport (AC-1.1–1.3, AC-2.1, AC-3.1–3.5, AC-4.1–4.5, AC-4.7, AC-8.1). | T-18, T-68 | `tests/e2e/weather.spec.ts` | Test |
| T-20 | Testar erros e recuperação E2E | Exercitar falhas e parciais no navegador. | Vazio, rede, HTTP, JSON, timeout e 429 distintos; retry recupera consulta correta sem fila/automação; parcial preserva dados e crédito (AC-5.1–5.16, AC-6.1–6.2). | T-18 | `tests/e2e/errors.spec.ts` | Test |
| T-47 | Testar concorrência E2E | Resolver respostas em ordens controladas. | Busca/cidade antiga nunca substitui a atual; campo limpo não repopula; toggle durante loading usa unidade atual (AC-1.5, AC-1.11–1.12, AC-4.8). | T-18 | `tests/e2e/concurrency.spec.ts` | Test |
| T-21 | Medir layout e toque | Verificar dimensões no navegador. | Larguras 360/768/1280/1920 sem overflow; 360 × 640 alcança cinco dias verticalmente; 1280 × 800 mostra cinco dias juntos; controles ≥ 44 × 44 px conforme exceção (RNF1; AC-3.5, AC-8.1–8.3). | T-18 | `tests/e2e/responsive.spec.ts` | Test |
| T-48 | Adicionar integração axe | Instalar só o necessário à auditoria automatizada. | Dependência compatível com Playwright declarada e lockfile atualizado, sem runtime SDK de telemetria (RNF2). | T-01 | `package.json`, `pnpm-lock.yaml` | Infra |
| T-22 | Testar acessibilidade automatizada | Exercitar axe, foco e nomes no navegador. | Zero violações críticas/sérias; setas/Enter/Esc e Tab conforme spec; texto ≥ 4,5:1 e texto grande/ícones/bordas ≥ 3:1 com evidência complementar onde axe não medir (RNF2; AC-4.4, AC-5.8, AC-7.1–7.5). | T-18, T-48 | `tests/e2e/accessibility.spec.ts` | Test |
| T-27 | Verificar privacidade e idioma | Inspecionar cliente sem instrumentação de produção. | Sem storage de dados, analytics ou destinos extras; recursos locais; reload limpa estado; strings da aplicação pt-BR, nomes próprios conforme provedor; rede/armazenamento verificados (RNF7, RNF9). | T-18 | `tests/e2e/privacy.spec.ts` | Test |

## Entrega 7 — Hardening, operação e liberação

| ID | Título | Descrição curta | Critérios de aceite | Dependências | Arquivos prováveis | Tipo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-29 | Configurar entrega estática | Preparar build e caminho da hospedagem aprovada sem backend. | Base/caminho da hospedagem documentados; `pnpm build` passa e preview do artefato carrega assets no caminho previsto; publicação efetiva e smoke ficam em T-49 (RNF8; OQ-12 aprovada). | T-17, T-35 | `vite.config.ts`, `README.md` | Infra |
| T-49 | Configurar CI de validação e entrega | Automatizar checklist e publicar somente após sucesso. | Run registra `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e` com sucesso; publicação depende de todos os checks; pnpm/lockfile e browsers Playwright instalados; artefato publicado por HTTPS e smoke da URL registra resultado (stack, RNF6/RNF8). | T-19, T-20, T-47, T-21, T-22, T-27, T-29 | `.github/workflows/weather-app.yml` | Infra |
| T-50 | Definir operação e disponibilidade | Registrar configuração operacional da hospedagem. | Monitoramento mensal separado do provedor, meta e retenção de logs aprovadas, sem analytics client-side; evidência de configuração e smoke registrada (RNF7–RNF8). | T-49, T-35 | `plans/weather-app-plan.md` | Infra |
| T-23 | Verificar leitor de tela e zoom | Executar protocolo manual de acessibilidade. | Registrar browser/versão/leitor e resultados por estado; zoom real 200% em viewport 1280 px mantém operação sem scroll horizontal; não substituir por CSS zoom/emulação (RNF2; AC-5.8, AC-7.2–7.3, AC-8.4). | T-21, T-22 | `tests/manual/accessibility.md` | Test |
| T-24 | Verificar contrato real sem acento | Executar teste explícito separado. | Busca real "sao paulo" em português contém cidade esperada; fora da suíte unit/E2E padrão; falha não é mascarada nem expectativa relaxada (AC-1.10). | T-07 | `tests/contract/geocoding.contract.test.ts`, `vitest.contract.config.ts` | Test |
| T-25 | Medir performance | Executar protocolo aprovado em rede 4G simulada. | Registrar ambiente e 30 execuções válidas no build publicado; loading ≤ 100 ms, p75 busca ≤ 2 s após envio, previsão ≤ 3 s após seleção conforme spec aprovada; não medir latência fixa de fixture como desempenho real (RNF5). | T-49 | `tests/manual/performance.md` | Test |
| T-26 | Executar matriz de browsers | Verificar plataformas reais aprovadas. | Duas versões estáveis mais recentes de Chrome/Firefox/Safari/Edge, Safari iOS e Chrome Android com resultado por fluxo no build publicado; perfil emulado não comprova browser real (RNF6). | T-49 | `tests/manual/compatibility.md` | Test |
| T-28 | Validar usabilidade | Executar sessão moderada com personas. | Cinco participantes P1–P3, pelo menos quatro concluem sem ajuda; resultados anonimizados registrados, sem dados pessoais no Git (RNF4). | T-19, T-21, T-23 | `tests/manual/usability.md` | Test |
| T-30 | Consolidar evidências e liberar | Conferir rastreabilidade e gate final. | Todos os ACs têm teste/protocolo e resultado; checklist final passa no mesmo estado/artefato avaliado; contrato, zoom, performance, compatibilidade, privacidade e aceite humano incluídos; nenhuma falha impeditiva/OQ bloqueante; release aprovado, não presumido. | T-68, T-23, T-24, T-25, T-26, T-27, T-28, T-49, T-50 | `tasks/weather-app-tasks.md`, `tests/manual/release.md` | Test |

## Delegação preparada — P5.8

O [prompt autocontido de T-01](./t-01-coding-agent-prompt.md) está pronto para a próxima sessão do Coding Agent. T-01 continua sendo **gate documental**, não implementação: o prompt exige evidências de T-36/T-31–T-35 e autorização humana antes de registrar aprovação, e instrui parar sem código quando houver bloqueios. A preparação do prompt não conclui nenhuma tarefa nem autoriza T-02.

## Estimativa e prioridade — P5.7

### Escalas e uso

- **P0:** desbloqueia implementação ou compõe o primeiro fluxo integrado utilizável e sua proteção mínima. Executar primeiro, respeitando dependências.
- **P1:** valida robustez, acessibilidade, compatibilidade e operação da v1. Pode seguir após a primeira demonstração interna, mas continua obrigatório quando exigido pela spec.
- **P2:** melhoria opcional ou posterior à v1. **Nenhuma tarefa atual é P2:** não há melhoria opcional aprovada no backlog. Não rebaixar testes, privacidade ou obrigações legais para criar uma distribuição artificial.
- **P (pequeno):** regra/arquivo localizado e baixa incerteza; **M (médio):** múltiplos casos ou integração limitada; **G (grande relativo):** alta incerteza, concorrência ou coordenação externa. Não são horas nem prazo; espera por aprovadores, participantes e plataformas é separada do esforço.
- Um G pode alterar apenas um arquivo: tamanho depende do comportamento e risco, não só da contagem de arquivos. Antes de executar um G, revisar a estimativa e dividir novamente se houver unidades independentes, preservando IDs e rastreabilidade.
- Prioridade não substitui dependência nem MoSCoW. Publicação/aceite continuam nos gates definidos; P1 não significa dispensável. Estimativas pressupõem T-01 aprovado e ferramentas existentes funcionais; recalibrar após decisões ou mudança de escopo.

### Classificação de todas as tarefas

| Tarefa | Prioridade | Tamanho | Principal fator da estimativa |
| --- | --- | --- | --- |
| T-01 | P0 | P | Gate documental após decisões consolidadas. |
| T-02 | P0 | M | Contratos e uniões de estado compartilhados. |
| T-03 | P0 | P | Duas fixtures de referência. |
| T-04 | P0 | P | Conversão e arredondamento puros. |
| T-05 | P0 | M | Datas civis, fuso e meia-noite. |
| T-06 | P0 | M | Cobertura completa e localização WMO. |
| T-07 | P0 | M | Parâmetros, opcionais e validação de cidades. |
| T-08 | P0 | G | Arrays paralelos, grade local e dados parciais. |
| T-09 | P0 | M | Timeout, abort e formatos de prazo HTTP. |
| T-10 | P0 | G | Debounce, invalidação e respostas fora de ordem. |
| T-11 | P0 | M | Cidade da operação e estados parciais. |
| T-12 | P0 | M | Retry sem fila e controle de prazo. |
| T-13 | P0 | P | Shell, crédito e região de anúncio. |
| T-14 | P0 | M | Combobox acessível e seleção explícita. |
| T-15 | P0 | M | Dados atuais, unidade e ausências. |
| T-16 | P0 | P | Controle de unidade por callback. |
| T-17 | P0 | G | Ligação entre estado, ações e apresentação. |
| T-18 | P0 | M | Rede interceptada e contexto determinístico. |
| T-19 | P0 | M | Fluxo completo em desktop e mobile. |
| T-20 | P1 | G | Matriz de falhas, prazos e recuperação. |
| T-21 | P1 | M | Medições em quatro larguras. |
| T-22 | P1 | M | Axe, interação e contraste composto. |
| T-23 | P1 | M | Protocolo manual de leitor e zoom real. |
| T-24 | P1 | P | Um contrato real, sujeito ao provedor. |
| T-25 | P1 | M | Trinta medições e análise p75. |
| T-26 | P1 | G | Matriz de versões e dispositivos reais. |
| T-27 | P1 | M | Inspeção de rede, storage e textos. |
| T-28 | P1 | G | Recrutamento e cinco sessões moderadas. |
| T-29 | P1 | P | Base do build e preview estático. |
| T-30 | P1 | M | Consolidar evidências do mesmo artefato. |
| T-31 | P0 | M | Decisões de escopo e validade temporal. |
| T-32 | P0 | G | Provedor, licença e alinhamento legal/técnico. |
| T-33 | P0 | G | Aprovação multidisciplinar de UX e metas. |
| T-34 | P0 | G | Regras ainda abertas de validade dos dados. |
| T-35 | P0 | M | Privacidade e decisões operacionais. |
| T-36 | P0 | M | Sincronização de plano e tarefas. |
| T-37 | P0 | P | Testes numéricos tabulares. |
| T-38 | P0 | M | Relógio/fusos e datas de referência. |
| T-39 | P0 | P | Preferência em memória, sem rede. |
| T-40 | P0 | P | Apresentação de loading isolada. |
| T-41 | P0 | P | Duas variantes de orientação. |
| T-42 | P0 | P | Mensagem e callback de recuperação. |
| T-43 | P0 | M | Tema, fonte local e foco. |
| T-44 | P0 | P | Bootstrap e import de estilos. |
| T-45 | P0 | M | Conteúdo diário e alternativas textuais. |
| T-46 | P0 | P | Composição e ordem dos cartões. |
| T-47 | P1 | M | Resolução controlada de corridas no navegador. |
| T-48 | P1 | P | Dependência e lockfile da integração axe. |
| T-49 | P1 | M | Checks, browsers, publicação e smoke. |
| T-50 | P1 | M | Evidência operacional e retenção de logs. |
| T-51 | P0 | P | Percorrer catálogo e fallback. |
| T-52 | P0 | M | Fixtures e parâmetros do geocoding. |
| T-53 | P0 | M | Associação por data e parciais. |
| T-54 | P0 | M | Mock de transporte e limites temporais. |
| T-55 | P0 | M | Timers e respostas invertidas. |
| T-56 | P0 | M | Seleção concorrente e transições. |
| T-57 | P0 | M | Prazo, fila e ausência de automação. |
| T-58 | P0 | P | Unidade e contagem de chamadas. |
| T-59 | P0 | M | Teclado, lista e callbacks. |
| T-60 | P0 | P | Render de atual válido/parcial. |
| T-61 | P0 | P | Conteúdo de um cartão. |
| T-62 | P0 | P | Ordem e cardinalidade no DOM. |
| T-63 | P0 | P | Indicador e foco preservado. |
| T-64 | P0 | P | Orientação sem retry. |
| T-65 | P0 | P | Retry habilitado/desabilitado. |
| T-66 | P0 | P | Teclado e unidade por props. |
| T-67 | P0 | M | Integração real de hook/UI com serviço mockado. |
| T-68 | P0 | P | Execução conjunta e registro do checklist. |

### Sequência sugerida por resultado visível

Os agrupamentos técnicos anteriores continuam sendo o catálogo de dependências. A execução deve puxar o menor conjunto que produz o próximo resultado, e trazer seus testes junto — não terminar todos os services antes de começar qualquer UI. Dentro de cada conjunto, seguir as dependências diretas das linhas T-NN.

| Marco / fatia | Tarefas novas nesse marco | Resultado demonstrável e condição de aceite |
| --- | --- | --- |
| 0 — Desbloquear decisões | T-31, T-32, T-33, T-35 → T-34 → T-36 → T-01, respeitando dependências específicas | Spec/plano aprovados; nenhuma implementação antes desse gate. Trabalho de decisão não é uma fatia funcional. |
| 1 — Primeira tela visível (habilitadora) | T-02, T-03, T-40, T-41, T-42, T-43, T-13, T-44; T-63, T-64, T-65 | Aplicação abre com orientação inicial, estilos locais e crédito, sem chamada automática. Estados isolados verificados pelos testes. Não é ainda uma fatia ponta a ponta de consulta; não apresentar fixtures como previsão real. |
| 2 — Consultar e interpretar o clima (primeira fatia vertical completa) | T-04, T-05, T-06, T-07, T-08, T-09, T-10, T-11, T-12, T-39, T-14, T-15, T-45, T-46, T-16, T-17; T-37, T-38, T-51–T-62, T-66, T-67, T-68, T-18, T-19 | Input → geocoding → seleção → forecast → estado → clima atual/cinco dias e unidade; fluxo aprovado em desktop/mobile com rotas controladas. Testes isolados acompanham cada alvo; a aplicação usa serviços reais, sem dados fictícios embutidos. Demonstração interna, ainda sem aceite de release. |
| 3 — Recuperar falhas e usar com autonomia (fatia de robustez transversal) | T-20, T-47, T-21, T-48, T-22, T-27, T-23, T-24 | Validar no navegador rede/timeout/429/parciais, corridas, teclado, leitor de tela, toque, zoom e privacidade; registrar contrato real separadamente. A lógica de erro/acessibilidade já nasce nos componentes e serviços da fatia 2, não é adiada para esta fase; aqui se completa a evidência. |
| 4 — Entregar e aceitar a v1 | T-29, T-49, T-50, T-25, T-26, T-28, T-30 | Artefato publicado, smoke e operação configurados; performance, compatibilidade e usabilidade medidas; liberar somente após gate final. Publicar para verificação não equivale a aprovar release. |

**Limite do grafo atual:** T-17 depende de todo o hook e dos componentes de previsão/unidade. Portanto, uma fatia integrada de "só buscar cidades" não pode ser declarada concluída antes desses pré-requisitos. A fatia 2 é relativamente larga, apesar das tarefas pequenas. Para reduzi-la no futuro, aprovar uma divisão adicional de T-17 e dos contratos de composição, registrando novas dependências e testes antes de executar; esta estimativa não remove gates nem marca tarefas parcialmente feitas como concluídas.

É possível mostrar componentes controlados em seus testes durante a construção da fatia 2, mas isso não substitui integração nem justifica um segundo App de demonstração. Nenhuma fatia exige concluir P1 antes de demonstrar internamente o núcleo P0; todas as exigências da spec continuam obrigatórias para a v1. Não somar P/M/G como dias ou prometer data sem capacidade de equipe e confirmação das dependências externas.

## Rastreabilidade funcional — P5.6

Cobertura por **sub-requisito**, para não esconder lacunas sob um RF amplo. "Previsto" significa que existem tarefas correspondentes, não que o requisito foi implementado ou testado. T-02 fornece contratos e T-17 integra os fluxos; a tabela destaca os responsáveis diretos pelo comportamento. As tarefas de decisão não contam como implementação.

| Requisito da spec | Comportamento | Tarefas de implementação | Tarefas de verificação | Cobertura / pendência |
| --- | --- | --- | --- | --- |
| RF1.1 | Digitar termo, trim e preservar caracteres | T-07, T-10, T-14, T-17 | T-52, T-55, T-59, T-19, T-24 | Previsto; limites e grafia dependem de T-32/OQ-13. |
| RF1.2 | Resultados com nome, estado e país disponíveis | T-07, T-14 | T-52, T-59, T-19 | Previsto; homônimas indistinguíveis dependem de T-32. |
| RF1.3 | Seleção explícita define cidade das consultas | T-11, T-14, T-17 | T-56, T-59, T-19 | Previsto, incluindo clique/toque/teclado. |
| RF1.4 | Cidade selecionada destacada junto aos dados | T-11, T-17 | T-56, T-67, T-19 | Previsto; preservar identificação durante loading/erro. |
| RF1.5 | Dois caracteres não brancos e debounce de 300 ms | T-10 | T-55, T-19 | Previsto sob AS-6; confirmar valores em T-32. |
| RF1.6 | Invalidar resultados antigos e limpar busca | T-10, T-14, T-17 | T-55, T-59, T-47 | Previsto; não limpar a cidade/dados selecionados. |
| RF2.1 | Temperatura, descrição pt-BR e ícone atuais | T-08, T-06, T-15, T-17 | T-53, T-51, T-60, T-19 | Previsto, incluindo fallback de condição desconhecida. |
| RF2.2 | Horário da leitura no fuso IANA da cidade | T-08, T-05, T-15 | T-53, T-38, T-60 | Previsto; fuso/horário inválido e idade máxima dependem de T-31/T-34. |
| RF2.3 | Campos meteorológicos adicionais, se aprovados | — | — | **Sem tarefa de implementação/teste específica:** conteúdo ainda não definido em OQ-3. T-31 decide e T-36 cria tarefas/ACs se houver inclusão. |
| RF3.1 | Exatamente hoje local + quatro dias | T-08, T-05, T-46, T-17 | T-53, T-38, T-62, T-19, T-21 | Previsto; virada de dia depende de T-31. |
| RF3.2 | Data, mínima, máxima, descrição e ícone por dia | T-08, T-04, T-05, T-06, T-45 | T-53, T-37, T-38, T-51, T-61, T-19 | Previsto, incluindo rótulos e alternativas textuais. |
| RF3.3 | Primeiro dia identificado como Hoje | T-05, T-45, T-46 | T-38, T-61, T-62, T-19 | Previsto sob AS-4; confirmação em T-31/OQ-6. |
| RF3.4 | Previsão diária, sem granularidade horária | T-08, T-46 | T-53, T-62 | Previsto; confirmação em T-31/OQ-4. |
| RF3.5 | Associar valores por data sem deslocar lacunas | T-08, T-45, T-46 | T-53, T-61, T-62, T-20 | Previsto; datas duplicadas/inválidas dependem de T-34. |
| RF4.1 | Controle visível de alternância °C/°F | T-39, T-16, T-17 | T-58, T-66, T-19, T-22 | Previsto para toque, clique e teclado. |
| RF4.2 | Celsius como unidade inicial | T-39, T-16, T-17 | T-58, T-66, T-19 | Previsto. |
| RF4.3 | Atualizar todas as temperaturas e seus símbolos | T-04, T-39, T-15, T-45, T-17 | T-37, T-58, T-60, T-61, T-67, T-19, T-47 | Previsto para campos mínimos; arredondamento depende de T-33/OQ-16; extras seguem RF2.3. |
| RF4.4 | Alternar sem nova busca nem perder cidade | T-39, T-17 | T-58, T-67, T-19 | Previsto; contagem de chamadas verifica ausência de requests. |
| RF4.5 | Unidade não persiste e reload volta a Celsius | T-39, T-17 | T-58, T-19, T-27 | Previsto sob AS-8; confirmação em T-35/OQ-7. |
| RF5.1 | Orientação inicial sem consulta automática | T-41, T-13, T-44, T-17 | T-64, T-67, T-20 | Previsto; texto/conteúdo inicial decidido em T-33/OQ-8. |
| RF5.2 | Loading em busca/forecast com digitação disponível | T-10, T-11, T-40, T-14, T-17 | T-55, T-56, T-63, T-67, T-20 | Previsto; indicador não bloqueia campo nem desloca foco. |
| RF5.3 | Sem resultados sugere revisar grafia | T-07, T-10, T-41, T-17 | T-52, T-55, T-64, T-20 | Previsto; empty não oferece retry nem dispara forecast. |
| RF5.4 | Falha explícita, retry manual e prazo de 429 | T-09, T-10, T-11, T-12, T-42, T-17 | T-54, T-55, T-56, T-57, T-65, T-20 | Previsto; regras finais de timeout/429 e CORS em T-32. |
| RF5.5 | Preservar dados parciais; falhar sem dado utilizável | T-08, T-09, T-11, T-15, T-45, T-46, T-17 | T-53, T-54, T-56, T-60, T-61, T-62, T-20 | Previsto; definição de dados utilizáveis/inconsistentes em T-34. |
| RF5.6 | Anunciar mudanças a tecnologias assistivas | T-13, T-17 | T-67, T-22, T-23 | Previsto; região estável, foco preservado, sem anúncio repetido. |
| RF5.7 | Não repetir falhas automaticamente | T-09, T-12 | T-54, T-57, T-20 | Previsto; temporização comprova ausência de request sem ação. |
| RF5.8 | Retry indisponível em andamento, sem fila | T-12, T-42, T-17 | T-57, T-65, T-20 | Previsto; três acionamentos geram no máximo uma tentativa ativa. |
| RF6.1 | Crédito e link conforme licença do provedor | T-13, T-17 | T-67, T-20 | Previsto; texto, obrigações e prioridade reconciliados em T-32/OQ-9. |

### Requisitos sem tarefa correspondente

- **RF2.3 é a única lacuna condicional de implementação:** não existem campos extras aprovados nem AC específico na spec. Não tratar T-31/T-36 como código entregue. Se OQ-3 aprovar extras, criar tarefas Data/UI/Test e seus ACs, cobrir unidade/acessibilidade e atualizar esta matriz antes de liberar o escopo.
- **Os demais 27 sub-requisitos têm tarefas de implementação e verificação previstas.** Isso não elimina as pendências de decisão registradas na tabela nem o bloqueio de T-01.
- RNFs e tarefas de operação/qualidade continuam válidos; esta tabela não os substitui. T-68 e T-30 consolidam evidências, mas não contam como implementação direta dos RFs.

## Tarefas de teste explícitas — P5.5

| Cobertura solicitada | Tarefas dedicadas | Evidência exigida |
| --- | --- | --- |
| Conversão de unidade | T-37 | Vitest tabular com valores-limite e dados originais preservados. |
| Services com mock de `fetch` | T-52, T-53, T-54 | Requisições e normalização/falhas verificadas sem chamar API real. |
| Componentes loading/erro/vazio | T-63, T-65, T-64 | Testing Library verifica conteúdo acessível, foco e interação de retry por variante. |
| Fluxo principal E2E incluindo mobile | T-19 | Playwright executa o fluxo completo em desktop e 360 × 640 com toque, com resultado separado por viewport. |

T-18 prepara os ambientes e rotas; T-21 mede layout e toque em várias larguras. Nenhuma delas substitui a execução ponta a ponta mobile exigida em T-19. O gate T-68 inclui os testes unitários acima; T-49 depende de T-19 e só publica após E2E aprovado, incluindo ambos os viewports. AC-1.10 continua sendo o único teste de busca sem acento contra o serviço real, em tarefa separada (T-24).

## Desdobramento da revisão de granularidade — P5.2

| Escopo original grande/misto | Divisão preservando a parcela do ID original |
| --- | --- |
| T-01: decidir todos os temas e aprovar | T-31–T-35 decisões por assunto; T-36 sincronização; T-01 apenas gate. |
| T-03: fixtures e infraestrutura genérica | T-03 só duas fixtures; T-18 configuração E2E; configuração existente de Vitest reutilizada. |
| T-04–T-06: funções e seus testes | Implementação nos IDs originais; T-37, T-38 e T-51 testes. |
| T-07–T-09: services e testes | Implementação por operação/falhas; T-52–T-54 testes correspondentes. |
| T-10–T-12: hook, unidade e testes | Busca, forecast e retry preservados; T-39 unidade; T-55–T-58 testes. |
| T-13: shell, estados, estilo e bootstrap | T-13 shell; T-40–T-44 estados/estilo/bootstrap; T-63–T-65 testes de estado. |
| T-14–T-17: componentes e integração com testes | T-15 só clima atual; T-45 cartão, T-46 lista; T-59–T-62/T-66 testes; T-17 ligação de UI/hook, T-67 teste de App. |
| T-20: erros e concorrência E2E | T-20 erros/parciais; T-47 corrida e unidade durante loading. |
| T-22: instalação e auditoria | T-48 dependências; T-22 testes no navegador. |
| T-29: hospedagem, CI e operação | T-29 entrega estática; T-49 workflow; T-50 monitoramento/logs. |

Tarefas Test não incluem corrigir genericamente todos os componentes/serviços: um defeito encontrado bloqueia o aceite e deve gerar correção pequena no alvo responsável, com novo T-NN e dependência registrada. Arquivos de relatório/manual só serão criados na execução das tarefas correspondentes, não nesta fase documental.

## Dependências e ordem — P5.4

- T-31/T-32/T-33/T-35 podem ser discutidas em paralelo, mas todas editam a spec e precisam de integração coordenada; T-34 depende dos contratos e escopo, T-36 consolida e T-01 autoriza código.
- T-02 precede funções, dados e UI. Cada teste depende de seu alvo e das fixtures T-03; tipos compartilhados não dependem de React, serviços ou testes.
- T-07 → T-08 → T-09 evita edições concorrentes no serviço; T-10 → T-11 → T-12 → T-39 faz o mesmo no hook. Isso representa construção incremental no mesmo arquivo, não acoplamento de uma API à outra.
- T-13 precede T-44, que monta `App`; T-17 só liga a UI depois do hook e de todos os componentes necessários.
- T-68 exige as 19 tarefas unitárias/de integração; o aceite do fluxo principal E2E T-19 depende desse gate. Preparação de rotas e testes especializados podem avançar independentemente enquanto não houver dependência real.
- T-29 prepara o artefato/base; T-49 publica e verifica o smoke; T-50 registra operação. Performance e compatibilidade finais avaliam esse build publicado, não apenas o servidor Vite.
- Publicação em T-49 não equivale a liberação: T-30 é o aceite final, após evidências manuais, contrato e metas. Se o hardening alterar o build, reexecutar checks e evidências afetadas no novo artefato antes do aceite.
- Toda dependência aparece antes da tarefa consumidora nesta lista. IDs não foram renumerados; não inserir dependências artificiais apenas para fazer o número crescer.
