# Weather App — Backlog

| Campo | Valor |
| --- | --- |
| Versão | 0.1 (rascunho) |
| Entrada | [Plano técnico](../plans/weather-app-plan.md), versão 0.1, incluindo revisão P4.8 |
| Fonte normativa | [Spec](../specs/weather-app-spec.md), versão 0.2 |
| Status | Backlog proposto; implementação bloqueada pela aprovação de T-01 |

## Regras de execução

- IDs `T-NN` são estáveis. A ordem abaixo respeita dependências; tarefas sem relação de dependência podem seguir em paralelo, respeitando conflitos nos mesmos arquivos.
- **Dependências** são pré-requisitos diretos, não apenas ordem sugerida. Não iniciar uma tarefa enquanto suas dependências não estiverem concluídas.
- Critérios abaixo são resultados esperados, não evidência já obtida. Nenhuma tarefa está concluída por este documento existir.
- Cada tarefa de código inclui sua validação focada. Tarefas Test explicitam cobertura de regressão/integração, não adiam testes básicos até o fim.
- Para concluir alterações em código: testes focados e `pnpm lint`, `pnpm build`, `pnpm test`; executar também `pnpm test:e2e` quando o fluxo/UI ou E2E for alterado, conforme o plano. Documentação não exige essas suítes.
- Arquivos são prováveis e relativos à raiz. Não recriar, reverter ou descartar alterações existentes sem avaliar seu contexto.
- Usar a dona dos ACs da spec 4.10 para rastrear a entrega sem duplicar tarefas por história. IDs de AC abaixo são referências estáveis; as verificações de um mesmo comportamento em níveis diferentes têm objetivos distintos.
- Fora de escopo continuam backend, store global, cache/persistência, analytics, PWA e novas grandezas meteorológicas sem atualização da spec.

## Entrega 0 — Decisões e contratos aprovados

### T-01 — Aprovar as decisões que bloqueiam a implementação

- **Tipo:** Infra
- **Descrição:** fechar as decisões com Produto, UX, Engenharia e responsáveis legais; reconciliar spec e plano antes de codificar.
- **Referências:** RF1–RF6; RNF1–RNF9; seção 10 da spec e revisão P4.8.
- **Critérios de aceite:**
  - OQs bloqueantes da spec respondidas e status aprovado; reconciliado o conflito entre OQ-12 como bloqueio de release e sua exigência no critério de saída da spec.
  - Premissas não bloqueantes aceitas ou alteradas explicitamente, incluindo campos extras, persistência, tela inicial e tema; contratos e ACs afetados atualizados.
  - Regras explícitas para dados utilizáveis, fuso/horário/coordenadas inválidos, geocoding parcialmente inválido, datas duplicadas, mínima maior que máxima, leitura antiga e virada de dia, sem fallback silencioso.
  - Limites/ordem da busca, desempate de arredondamento, política de 429/CORS, licença, metas e matriz de testes registrados; tarefas afetadas deste backlog revisadas. Se decisão mudar o escopo, atualizar spec e plano antes de liberar dependentes.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`, `tasks/weather-app-tasks.md`.

### T-02 — Definir os contratos compartilhados

- **Tipo:** Data
- **Descrição:** materializar os tipos aprovados de domínio, estados e falhas, sem implementar consultas.
- **Referências:** RF1–RF5; Data Model e State Management do plano.
- **Critérios de aceite:** `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `Unit` e uniões de estado tipados em strict; campos indisponíveis usam `null`; estados não permitem dados de sucesso sem payload; Celsius é unidade interna; DTOs externos não são exportados como domínio; nenhuma duplicação independente da cidade selecionada.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.

### T-03 — Preparar fixtures e isolamento dos testes

- **Tipo:** Test
- **Descrição:** preparar infraestrutura mínima de Vitest/Testing Library e fixtures de geocoding/forecast.
- **Referências:** convenções da spec 4.0–4.1; RNF3.
- **Critérios de aceite:** fixtures reproduzem São Paulo, Tóquio, cinco datas, vazios, falhas e parciais; relógio/fuso são explícitos; mocks/timers são restaurados por teste; testes unitários não acessam APIs reais; reutilizar configuração existente e criar somente helpers necessários.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/setup.ts`, `tests/fixtures/geocoding.json`, `tests/fixtures/forecast.json`, `vite.config.ts`.

## Entrega 1 — Funções puras de apresentação

### T-04 — Implementar conversão e arredondamento de temperaturas

- **Tipo:** Data
- **Descrição:** fornecer funções puras para converter o Celsius original e preparar exibição na unidade ativa.
- **Referências:** RF4.3; AC-4.2, AC-4.6, AC-4.7.
- **Critérios de aceite:** cobrir 25 °C → 77 °F, 0 °C → 32 °F, −40 e a tabela da spec; arredondar só na exibição conforme decisão aprovada; não exibir zero negativo; `null` não vira zero; valores originais não são mutados; testes tabulares passam.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`, `tests/unit/temperature.test.ts`.

### T-05 — Implementar formatação de datas locais

- **Tipo:** Data
- **Descrição:** formatar data, dia da semana, rótulo Hoje e hora da leitura em pt-BR.
- **Referências:** RF2.2, RF3.1, RF3.3; AC-2.2, AC-3.2, AC-3.3, AC-3.4; EC-16.
- **Critérios de aceite:** fuso e instante recebidos explicitamente; datas civis não se deslocam pelo fuso do dispositivo; caso de Tóquio e virada de dia aprovados cobertos; hora exibida vem da leitura, não do dispositivo; testes com relógio fixo passam.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/lib/format.ts`, `tests/unit/format.test.ts`.

### T-06 — Implementar catálogo WMO e ícones locais

- **Tipo:** UI
- **Descrição:** mapear códigos documentados para descrição pt-BR e representação visual acessível.
- **Referências:** RF2.1, RF3.2, RNF9; AC-2.3, AC-3.7; catálogo do plano.
- **Critérios de aceite:** os 28 códigos do catálogo têm descrição e ícone; código desconhecido gera "Condição indisponível" e ícone neutro, sem ocultar outros dados; fixtures mantêm seus textos; cada código é testado; nenhum recurso remoto de ícone é solicitado.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`, `tests/unit/weatherCodes.test.ts`, recursos locais em `src/`.

## Entrega 2 — Acesso à Open-Meteo

### T-07 — Implementar geocoding com normalização

- **Tipo:** Data
- **Descrição:** consultar cidades com `fetch` nativo, parâmetros aprovados e retorno `City[]`.
- **Referências:** RF1.1, RF1.2; AC-1.1, AC-1.7, AC-1.8, AC-1.13, AC-5.3.
- **Critérios de aceite:** usar endpoint correto, termo trimado/codificado e `language=pt`; limite aprovado em T-01; preservar caracteres; campos opcionais ausentes viram `null`; vazio válido não é erro; resultados inválidos seguem regra aprovada; testes de URL/mapeamento com mock de `fetch` passam.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `tests/unit/weatherService.test.ts`.

### T-08 — Implementar forecast e normalização por data

- **Tipo:** Data
- **Descrição:** consultar clima atual e cinco dias numa chamada e montar `WeatherData`.
- **Referências:** RF2.1–RF2.2, RF3.1–RF3.5, RF5.5; AC-3.1, AC-3.2, AC-5.7, AC-5.12, AC-5.14, AC-5.16.
- **Critérios de aceite:** enviar coordenadas, `current`, `daily`, timezone IANA, Celsius e cinco dias; associar arrays brutos pelo mesmo índice e depois organizar por data; manter exatamente cinco datas consecutivas, excluindo excedentes e preenchendo ausências com `null`; atual ausente preserva previsão; nenhum dado utilizável gera falha; inconsistências seguem T-01; testes com arrays parciais/fora de ordem passam.
- **Dependências:** T-05, T-07.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `tests/unit/weatherService.test.ts`.

### T-09 — Tratar falhas, timeout e prazo de retry no serviço

- **Tipo:** Data
- **Descrição:** classificar erros de transporte/API/resposta e respeitar cancelamento.
- **Referências:** RF5.4, RF5.7; AC-5.4, AC-5.6, AC-5.10, AC-5.13, AC-5.16.
- **Critérios de aceite:** rede, HTTP não-2xx, JSON ilegível e ausência total de dados classificados; timeout aos 10 s aprovados limita a chamada e limpa timer; abort por substituição distinto de timeout; `Retry-After` legível válido vira prazo epoch, com regra aprovada para ausente/inválido; nenhuma falha retorna sucesso ou lista vazia artificial; testes com `fetch` mockado passam.
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `tests/unit/weatherService.test.ts`.

## Entrega 3 — Orquestração de consultas

### T-10 — Implementar o ciclo de busca no hook

- **Tipo:** Data
- **Descrição:** manter query e estados idle/loading/success/empty/error em `useWeather`.
- **Referências:** RF1.5, RF1.6, RF5.2–RF5.3; AC-1.4–1.6, AC-1.9, AC-1.12.
- **Critérios de aceite:** mínimo de caracteres e debounce aprovados; nenhuma consulta para vazio/curto; edição invalida imediatamente resultados antigos; respostas obsoletas não atualizam estado; campo limpo não afeta cidade/dados; cleanup cancela recursos; testes com serviço mockado verificam 299/300 ms e respostas fora de ordem.
- **Dependências:** T-09.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`, `tests/unit/useWeather.test.tsx`.

### T-11 — Implementar seleção de cidade e consulta meteorológica

- **Tipo:** Data
- **Descrição:** conectar seleção explícita ao ciclo idle/loading/success/partial/error do forecast.
- **Referências:** RF1.3–RF1.4, RF2–RF3, RF5.5; AC-1.3, AC-1.11, AC-5.9, AC-5.12, AC-5.14.
- **Critérios de aceite:** cidade selecionada fica disponível desde loading até erro; seleção nova invalida resposta anterior; dados antigos nunca são atribuídos à cidade nova; resposta válida/partial segue contrato aprovado; `selectedCity` derivada, sem estado concorrente; testes de transição e corrida passam.
- **Dependências:** T-10.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`, `tests/unit/useWeather.test.tsx`.

### T-12 — Implementar retry manual e unidade em memória

- **Tipo:** Data
- **Descrição:** expor callbacks de recuperação e alternância de unidade sem modificar dados Celsius.
- **Referências:** RF4, RF5.4, RF5.7–RF5.8; AC-4.1, AC-4.3, AC-4.5, AC-4.8, AC-5.5, AC-5.6, AC-5.11, AC-5.15.
- **Critérios de aceite:** retry repete termo/cidade da falha ativa, sem fila nem repetição automática; bloqueado em loading e antes de `retryAt`; liberar retry não envia request; respostas expiradas não alteram estado; unit começa Celsius e toggle não chama serviço nem altera dados; desmontagem limpa recursos; testes com relógio controlado passam.
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`, `tests/unit/useWeather.test.tsx`.

## Entrega 4 — Interface acessível e responsiva

### T-13 — Montar a estrutura visual e os estados de consulta

- **Tipo:** UI
- **Descrição:** preparar composição mobile-first, mensagens e região de status estável.
- **Referências:** RF5.1–RF5.6, RF6.1, RNF1–RNF2, RNF7, RNF9; AC-5.1–5.4, AC-5.8, AC-6.1, AC-6.2.
- **Critérios de aceite:** estados visuais recebem props/callbacks, sem rede; orientação inicial, loading, vazio e falha são distintos; anúncios não movem foco nem repetem estado; crédito/link Open-Meteo aprovado aparece fora dos blocos condicionais; estilos Tailwind, fontes e recursos locais; testes isolados verificam conteúdo e anúncios.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/App.tsx`, `src/main.tsx`, `src/styles/index.css`, `src/components/states/LoadingState.tsx`, `src/components/states/EmptyState.tsx`, `src/components/states/ErrorState.tsx`, `tests/unit/App.test.tsx`.

### T-14 — Construir busca e seleção acessíveis

- **Tipo:** UI
- **Descrição:** criar campo/lista controlados com callbacks de edição e seleção.
- **Referências:** RF1.1–RF1.4, RNF2; AC-1.1–1.3, AC-1.8, AC-1.13, AC-7.1, AC-7.3, AC-7.5.
- **Critérios de aceite:** nome/estado/país distinguem homônimas sem separadores vazios; seleção explícita por toque/clique/setas/Enter; combobox/listbox com label e item ativo identificável; Esc fecha sem apagar termo ou perder foco; resultados não entram no Tab; dados obsoletos não selecionáveis por contrato de props; testes de teclado/callbacks passam.
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`, `tests/unit/SearchBar.test.tsx`.

### T-15 — Renderizar clima atual e previsão

- **Tipo:** UI
- **Descrição:** compor dados normalizados com funções puras e grid de cinco dias.
- **Referências:** RF2–RF3, RF5.5, RNF1; AC-2.1–2.3, AC-3.1–3.7, AC-5.7, AC-5.12, AC-5.14.
- **Critérios de aceite:** temperatura/condição/ícone e hora da leitura atuais; Hoje e quatro datas seguintes com mínima/máxima rotuladas; sem valores horários na previsão; indisponíveis preservam layout/datas; alternativas textuais nos ícones; cinco dias alcançáveis verticalmente no mobile e visíveis no desktop conforme spec; testes de conteúdo e parcial passam.
- **Dependências:** T-04, T-05, T-06, T-13.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`, `tests/unit/CurrentWeather.test.tsx`, `tests/unit/ForecastList.test.tsx`.

### T-16 — Construir o controle de unidade

- **Tipo:** UI
- **Descrição:** criar controle acessível que apenas comunica a nova unidade.
- **Referências:** RF4.1–RF4.3, RNF2; AC-4.1, AC-4.4, AC-7.3.
- **Critérios de aceite:** unidade ativa visível e no nome/estado acessível; operar por clique/toque/Enter/Espaço; callback não executa rede; foco visível e área de toque conforme spec; testes de interação passam.
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`, `tests/unit/UnitToggle.test.tsx`.

### T-17 — Integrar hook e componentes na tela

- **Tipo:** UI
- **Descrição:** ligar uma única instância de `useWeather` à UI e derivar apresentação por unidade.
- **Referências:** RF1–RF6; AC-4.2–4.3, AC-4.5, AC-4.7–4.8, AC-5.5, AC-5.8–5.11, AC-6.2, AC-7.2.
- **Critérios de aceite:** fluxo completo funciona com serviço mockado; toggle atualiza todas as temperaturas sem chamada adicional, inclusive durante loading; retry respeita disponibilidade; foco segue busca → unidade → retry → crédito; ausência de persistência e Celsius após remontagem/reload; testes de integração verificam callbacks, dados e número de chamadas.
- **Dependências:** T-12, T-14, T-15, T-16.
- **Arquivos prováveis:** `src/App.tsx`, `tests/unit/App.test.tsx`.

## Entrega 5 — Regressão E2E, responsividade e acessibilidade

### T-18 — Preparar Playwright com rotas determinísticas

- **Tipo:** Test
- **Descrição:** reutilizar configuração existente e configurar interceptação dos dois endpoints.
- **Referências:** spec 4.0–4.1; RNF1, RNF3.
- **Critérios de aceite:** fixtures controladas e relógio/fuso fixos; nenhum acesso não previsto ao provedor; suporte a respostas atrasadas/falhas por rota; cenário explícito de 360 × 640 px além do perfil mobile existente; sem esperas arbitrárias; teste de inicialização passa.
- **Dependências:** T-03, T-17.
- **Arquivos prováveis:** `playwright.config.ts`, `tests/e2e/weather.spec.ts`, fixtures de teste.

### T-19 — Cobrir busca, seleção e unidade ponta a ponta

- **Tipo:** Test
- **Descrição:** provar o caminho principal e as regras de entrada no navegador.
- **Referências:** AC-1.1–1.9, AC-1.11–1.13, AC-2.1–2.3, AC-3.1–3.4, AC-3.6–3.7, AC-4.1–4.8.
- **Critérios de aceite:** selecionar homônimas e exibir dados da cidade correta; vazio/curto não consulta; trim/caracteres preservados; respostas obsoletas não aparecem; cinco dias/datas corretos; toggle altera todas as temperaturas sem requests; reload reinicia estado; casos tabulares numéricos ficam nos unitários, sem duplicação exaustiva.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.

### T-20 — Cobrir falhas, parciais e recuperação ponta a ponta

- **Tipo:** Test
- **Descrição:** exercitar estados e concorrência com respostas de rede controladas.
- **Referências:** AC-5.1–5.16, AC-6.1–6.2; EC-8–EC-20.
- **Critérios de aceite:** distinguir vazio, offline, erro HTTP, 429, JSON inválido e timeout; retry sem fila/automação recupera consulta correta; testar prazo de 429 e resposta expirada com tempo controlado; dados parciais preservam dias/seção válida, ausência total é erro; crédito permanece; alternância durante loading e troca de cidade não contaminam os dados.
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.

### T-21 — Validar layout mobile, desktop e toque

- **Tipo:** Test
- **Descrição:** medir layout real em navegador, não em JSDOM.
- **Referências:** RNF1; AC-3.5, AC-8.1–8.3.
- **Critérios de aceite:** 360 × 640, larguras 768/1280/1920 sem overflow horizontal nem corte essencial; em 1280 × 800 os cinco dias aparecem simultaneamente; mobile alcança tudo por rolagem vertical; controles ≥ 44 × 44 px conforme exceção da spec; nomes longos cobertos; defeitos encontrados corrigidos antes de concluir.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/e2e/responsive.spec.ts`, componentes e estilos afetados.

### T-22 — Validar teclado, nomes e contraste automatizados

- **Tipo:** Test
- **Descrição:** adicionar integração axe compatível e testes de acessibilidade no navegador.
- **Referências:** RNF2; AC-4.4, AC-5.8, AC-7.1–7.5.
- **Critérios de aceite:** manifesto/lockfile atualizados apenas para a integração necessária; axe sem violações críticas/sérias nos estados principais; ordem de Tab, setas/Enter/Esc, foco e nomes verificados; medir texto ≥ 4,5:1 e texto grande/ícones/bordas ≥ 3:1 sobre fundo composto; registrar medição complementar onde axe não cobrir; não declarar AA apenas com axe.
- **Dependências:** T-18.
- **Arquivos prováveis:** `package.json`, `pnpm-lock.yaml`, `tests/e2e/accessibility.spec.ts`, componentes/estilos afetados.

### T-23 — Verificar leitor de tela e zoom real

- **Tipo:** Test
- **Descrição:** executar protocolo manual de acessibilidade não demonstrável por emulação.
- **Referências:** RNF2; AC-5.8, AC-7.2–7.3, AC-8.4.
- **Critérios de aceite:** registrar navegador/versão, leitor de tela e resultado por estado; anúncios sem repetição ou perda de foco; em viewport de 1280 px e zoom real a 200%, conteúdo/controles acessíveis sem rolagem horizontal; CSS zoom/deviceScaleFactor não usados como evidência equivalente; defeitos tratados e verificação repetida.
- **Dependências:** T-21, T-22.
- **Arquivos prováveis:** `tests/manual/accessibility.md`, componentes/estilos quando houver correções.

## Entrega 6 — Evidências de qualidade e liberação

### T-24 — Verificar o contrato real de busca sem acento

- **Tipo:** Test
- **Descrição:** criar execução explícita e separada contra o geocoding real.
- **Referências:** RF1.1; AC-1.10.
- **Critérios de aceite:** "sao paulo" com idioma português contém o resultado esperado; execução não participa de `pnpm test` nem do E2E determinístico; registrar resultado e data; mudança/falha do provedor não é mascarada por fixture nem relaxamento do critério, e reabre OQ-13 quando aplicável.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/contract/geocoding.contract.test.ts`, configuração de execução separada, `package.json` se necessário.

### T-25 — Medir performance com protocolo aprovado

- **Tipo:** Test
- **Descrição:** medir feedback e tempo até renderizar resultados em 4G simulada.
- **Referências:** RNF5; OQ-11.
- **Critérios de aceite:** registrar dispositivo/navegador, perfil de rede, cache e condições aprovadas; 30 execuções válidas, loading ≤ 100 ms, p75 busca ≤ 2 s após envio e forecast ≤ 3 s após seleção conforme spec aprovada; publicar valores e falhas, sem trocar medição real por latência fixa de fixture; otimizações preservam ausência de cache de dados.
- **Dependências:** T-20.
- **Arquivos prováveis:** `tests/manual/performance.md`, scripts de medição somente se necessários, código afetado por correções.

### T-26 — Executar matriz de compatibilidade

- **Tipo:** Test
- **Descrição:** executar smoke dos fluxos principais na matriz aprovada.
- **Referências:** RNF6; OQ-11.
- **Critérios de aceite:** registrar duas versões estáveis mais recentes de Chrome/Firefox/Safari/Edge no release, Safari iOS e Chrome Android; distinguir navegador real de perfil emulado; registrar plataforma/versão/resultado por fluxo e corrigir incompatibilidades; Chromium/viewport sozinho não é evidência da matriz completa.
- **Dependências:** T-20, T-21, T-22.
- **Arquivos prováveis:** `playwright.config.ts` quando aplicável, `tests/manual/compatibility.md`, código afetado.

### T-27 — Verificar privacidade e idioma

- **Tipo:** Test
- **Descrição:** auditar comportamento observável do cliente sem introduzir telemetria.
- **Referências:** RNF7, RNF9; RF4.5.
- **Critérios de aceite:** ausência de armazenamento persistente de cidade/unidade/localização/histórico; sem analytics ou destinos além do provedor/hospedagem; fontes/ícones locais; reload não restaura dados; todas as strings controladas pela aplicação e descrições/datas em pt-BR; nomes próprios retornados pelo provedor seguem a limitação de localização documentada; logs de hospedagem atendem decisão aprovada.
- **Dependências:** T-20.
- **Arquivos prováveis:** `tests/e2e/privacy.spec.ts`, `tests/manual/privacy.md`, componentes/recursos afetados.

### T-28 — Validar usabilidade com as personas

- **Tipo:** Test
- **Descrição:** executar teste moderado do fluxo busca → seleção → leitura, conforme protocolo aprovado.
- **Referências:** RNF4; US1–US4; OQ-1.
- **Critérios de aceite:** cinco participantes distribuídos entre P1–P3; pelo menos quatro concluem sem ajuda; registrar resultados anonimizados e dificuldades, sem commitar dados pessoais; falhas geram ação explícita e nova avaliação antes da aprovação.
- **Dependências:** T-20, T-21, T-23.
- **Arquivos prováveis:** `tests/manual/usability.md`.

### T-29 — Configurar entrega estática e disponibilidade

- **Tipo:** Infra
- **Descrição:** aplicar a hospedagem e o monitoramento operacional aprovados, sem backend de aplicação.
- **Referências:** RNF7–RNF8; OQ-9, OQ-12.
- **Critérios de aceite:** build estático servido por HTTPS no caminho/base corretos; CI usa pnpm e valida lint/build/unit/E2E; definir meta e monitoramento da hospedagem separados do provedor; política de logs/retensão e licença aprovadas; nenhum analytics client-side; implantação smoke verificada e resultado registrado.
- **Dependências:** T-20, T-27.
- **Arquivos prováveis:** `.github/workflows/` no workflow de entrega necessário, `vite.config.ts`, `README.md`, documentação operacional em `plans/weather-app-plan.md`.

### T-30 — Consolidar rastreabilidade e liberar a entrega

- **Tipo:** Test
- **Descrição:** reunir evidências e verificar que nenhum requisito aprovado ficou sem cobertura.
- **Referências:** RF1–RF6; RNF1–RNF9; todos os ACs da spec.
- **Critérios de aceite:** cada AC tem teste/protocolo e resultado; contrato real e zoom manual incluídos; sem OQ bloqueante, falha conhecida impeditiva ou tarefa pré-requisito pendente; `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passam no estado final; medições e aceite humano atendem metas; crédito legal presente; atualizar status do backlog somente com evidência, sem marcar entrega por intenção.
- **Dependências:** T-23, T-24, T-25, T-26, T-27, T-28, T-29.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md`, relatório de evidências em `tests/manual/release.md`.

## Resumo das entregas e portões

| Entrega | Tarefas | Saída verificável |
| --- | --- | --- |
| 0 — Decisões e contratos | T-01–T-03 | Spec/plano aprovados, contratos e fixtures alinhados. |
| 1 — Funções puras | T-04–T-06 | Conversão, datas e WMO testados isoladamente. |
| 2 — Serviços | T-07–T-09 | Geocoding/forecast normalizados e falhas explícitas. |
| 3 — Estado | T-10–T-12 | Transições, concorrência, retry e unidade verificados. |
| 4 — UI integrada | T-13–T-17 | Componentes acessíveis e fluxo completo com serviço controlado. |
| 5 — Regressão | T-18–T-23 | E2E, mobile, layout e acessibilidade com evidências. |
| 6 — Liberação | T-24–T-30 | Contrato, qualidade não funcional e implantação aceitos. |

As dependências de cada tarefa prevalecem sobre os agrupamentos: T-13 pode avançar em paralelo aos serviços após os contratos; T-24 pode ser executada após T-07, sem aguardar E2E. Não exigir término de uma entrega inteira quando não houver dependência real.
