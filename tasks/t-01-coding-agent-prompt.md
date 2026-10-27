# T-01 — Prompt de delegação ao Coding Agent

Copie o conteúdo a partir de "Contexto" para a próxima sessão. Este documento prepara a delegação; **não executa T-01 nem aprova a spec**.

## Contexto

Você é o Coding Agent do SDD Weather App. Execute somente a tarefa **T-01 — Aprovar passagem para implementação**, do [backlog](./weather-app-tasks.md). A tarefa é **Infra, P0, tamanho P** e corresponde a um **gate documental**, não a desenvolvimento de UI ou acesso a dados.

O fluxo do projeto é Spec → Plan → Tasks → Code → Test → Review → Ship. A [spec](../specs/weather-app-spec.md) é a fonte normativa; o [plano](../plans/weather-app-plan.md) define arquitetura e contratos; o backlog define dependências. Havendo conflito, registre o bloqueio e solicite decisão, sem escolher unilateralmente qual requisito abandonar.

O produto previsto é uma aplicação React + Vite, TypeScript strict, Tailwind dark glassmorphism, Open-Meteo sem chave, Vitest/Testing Library, Playwright, Biome e pnpm. Decisões já registradas: hoje + quatro dias, Celsius padrão, UI pt-BR, sem autenticação/persistência de servidor e sem geolocalização automática. Isso é contexto, **não autorização para escrever código nesta tarefa**.

No momento em que este prompt foi preparado, a spec 0.2, o plano 0.1 e o backlog 0.7 continuam em rascunho. Releia os arquivos reais ao executar: estes números e o estado atual não substituem a evidência persistida na próxima sessão.

## Objetivo e limite de autoridade

Verificar se as decisões e documentos necessários para começar a implementação foram aprovados pelos responsáveis. Somente registrar aprovação já concedida de forma explícita e verificável; o agente **não é o aprovador de Produto, UX, Engenharia ou Jurídico**.

**Não executar T-02, não renomear outra tarefa como T-01 e não gerar arquivos em `src/` ou `tests/`.** A função habitual do Coding Agent de produzir código não se aplica ao escopo documental específico desta tarefa. Se a intenção da próxima sessão for começar a programar, primeiro concluir este gate e abrir uma delegação separada para T-02.

## Dependências obrigatórias

Dependência direta: **T-36 — Sincronizar contratos e backlog**.

Verifique também a evidência da cadeia:

| Tarefa | Evidência necessária |
| --- | --- |
| T-31 | Escopo, campos/unidades, cidade única, validade temporal da leitura e virada do dia decididos. |
| T-32 | Busca/limites, licença/atribuição, timeout e política de 429/CORS decididos. |
| T-33 | UX, tela inicial, tema, acessibilidade, arredondamento e protocolos/metas aprovados. |
| T-34 | Dados utilizáveis e regras para coordenadas/fuso/hora inválidos, geocoding parcial, datas duplicadas e mínima maior que máxima definidos com ACs. |
| T-35 | Privacidade, hospedagem, logs, disponibilidade e conflito entre aprovação/release resolvidos. |
| T-36 | Plano e backlog sincronizados com essas decisões, sem contratos ou critérios contraditórios. |

Uma tarefa listada, um responsável sugerido ou uma premissa escrita **não** comprova conclusão. Evidência deve identificar decisão, responsável/aprovador, data e referência verificável, sem inventar informação.

## Arquivos e permissões

Leia antes de agir:

- [Instruções do projeto](../.github/copilot-instructions.md).
- [Agentes do projeto](../AGENTS.md) e [Code Agent](../.github/agents/code.agent.md).
- [Spec](../specs/weather-app-spec.md), principalmente requisitos, ACs, rastreabilidade e seção 10.
- [Plano](../plans/weather-app-plan.md), principalmente revisão P4.8 e portões de aprovação.
- [Backlog](./weather-app-tasks.md), principalmente T-01 e T-31–T-36.
- [Instruções de commit](../.github/instructions/commit.instructions.md), apenas se houver autorização explícita de commit na sessão de execução.

**Único arquivo de alteração previsto em T-01:** [specs/weather-app-spec.md](../specs/weather-app-spec.md). Alterar apenas o registro de aprovação/status/versionamento documental necessário, se todas as evidências existirem e houver aprovação humana explícita.

Plano, backlog e instruções são somente leitura nesta delegação. Inconsistências que exijam alterá-los devem voltar para T-36; não ampliar o escopo para "corrigir tudo". Preserve alterações locais e conteúdo preexistente. Não instalar dependências, modificar configurações, fazer push ou commit automaticamente.

## Critérios de aceite verificáveis

1. **Dependência satisfeita:** T-36 tem resultado verificável e reflete decisões concluídas de T-31–T-35. Cite a localização de cada evidência na resposta.
2. **Critério de saída da spec atendido:** conferir os quatro itens da seção 10 no estado real do documento. Na versão de referência, OQ-2, OQ-4, OQ-6, OQ-9, OQ-10, OQ-11, OQ-12, OQ-13, OQ-16, OQ-17 e OQ-18 precisam de resposta; premissas relevantes, incluindo OQ-3/OQ-7, precisam de aceite formal ou revisão dos requisitos.
3. **Sem aprovação implícita:** OQ-12 apresenta conflito entre bloqueio para release e sua presença no gate da spec. Exigir reconciliação explícita por T-35/T-36; não excluir esse item do gate por interpretação do agente.
4. **Rastreabilidade íntegra:** RF1–RF6 e RNF1–RNF9 coerentes com contratos e tarefas; cada sub-requisito aprovado tem AC/teste ou justificativa condicional explícita. RF2.3 só permanece condicional se a decisão de OQ-3 não aprovar campos extras; se aprovar, novos ACs/tarefas precisam existir antes de liberar.
5. **Status fiel:** somente se os itens anteriores e a autorização humana estiverem comprovados, registrar na spec aprovação por responsável identificado, data real e referência das evidências; remover/revisar avisos de rascunho apenas no escopo da spec que se tornarem incompatíveis com a aprovação. Nenhuma afirmação de implementação ou release concluído.
6. **Bloqueio explícito:** se faltar decisão, evidência, autorização ou houver contradição, manter o documento sem aprovação e reportar T-01 **bloqueada**, com lista exata de itens faltantes e tarefa/responsável para desbloqueio. Não executar dependentes nem inventar defaults.
7. **Escopo preservado:** nenhuma modificação fora da spec, nenhum código de produção/teste criado e nenhuma alteração alheia revertida.

## Sequência de execução

1. Inspecione `git status --short` e leia os arquivos indicados. Não altere o índice nem descarte mudanças existentes.
2. Monte na resposta uma checklist de evidências para dependências, OQs, rastreabilidade e autorização. Registre como pendente o que não puder comprovar.
3. Se houver pendência, pare antes de editar. Solicite esclarecimento/aprovação pela ferramenta de perguntas disponível; se não houver resposta, conclua com o estado bloqueado. O escopo não inclui resolver as decisões de T-31–T-35.
4. Se todos os critérios estiverem satisfeitos e a aprovação humana for explícita, faça a menor alteração documental necessária na spec.
5. Revise o diff da spec e valide whitespace. Não avance para código, ainda que o gate tenha sido aceito.

## Validação

- Execute `git diff --check -- specs/weather-app-spec.md` e inspecione `git diff -- specs/weather-app-spec.md`.
- Confirme com `git status --short` que a tarefa não introduziu mudanças fora da spec; alterações anteriores podem continuar presentes.
- Se alterar status/versionamento ou links, confira consistência do cabeçalho, seção 10 e referências da própria spec. Evidências ausentes ou documentos contraditórios bloqueiam a aprovação mesmo que whitespace passe.
- **Não rodar `pnpm lint`, `pnpm build`, `pnpm test` ou E2E:** T-01 é documental, conforme a exceção expressa nas instruções do projeto. Esses comandos não comprovam aprovação de produto.
- Não marcar T-01 como concluída no backlog nesta delegação, pois esse arquivo está fora do escopo de edição; informar o resultado e evidência na resposta para atualização posterior pelo responsável.

## Formato da resposta final

Entregue em pt-BR:

1. **Resultado:** T-01 aprovada com evidência, ou bloqueada. Diferencie o registro pelo agente da aprovação humana.
2. **Checklist:** critério/dependência, evidência e status; para bloqueios, responsável ou tarefa de origem.
3. **Arquivos alterados:** listar somente o que realmente mudou, ou "nenhum".
4. **Validação:** comandos executados e resultados; indicar suítes de código não executadas por ser documentação.
5. **Próximo passo:** se bloqueada, decisões necessárias; se aprovada, T-02 pode ser delegada em outra tarefa, sem executá-la agora.
