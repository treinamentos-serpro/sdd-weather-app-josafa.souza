# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa deseja uma aplicação de previsão do tempo para que usuários consultem as condições meteorológicas de cidades escolhidas por eles. A experiência deve permitir verificar o clima atual e a previsão para cinco dias, alternar entre Celsius e Fahrenheit e funcionar em dispositivos móveis.

## Requisitos Funcionais

- **RF1 — Buscar cidades:** permitir que o usuário pesquise cidades pelo nome e selecione a cidade desejada.
- **RF2 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF3 — Consultar previsão:** exibir a previsão do tempo para cinco dias da cidade selecionada.
- **RF4 — Alternar unidades:** permitir alternar entre Celsius e Fahrenheit e atualizar as temperaturas exibidas.
- **RF5 — Informar estados da consulta:** apresentar estados de carregamento, ausência de resultados e falha ao buscar dados, com orientação clara ao usuário.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** a interface deve se adaptar a dispositivos móveis e a telas maiores, mantendo legíveis as informações e utilizáveis os controles.
- **RNF2 — Acessibilidade:** controles devem ter nomes acessíveis e ser operáveis por teclado; textos e elementos visuais devem manter contraste adequado.
- **RNF3 — Resiliência:** falhas de conexão ou indisponibilidade do serviço de dados não devem deixar a interface sem explicação ou sem possibilidade de nova tentativa.
- **RNF4 — Usabilidade:** busca, consulta e troca de unidade devem ser compreensíveis e diretas, inclusive em telas pequenas.

## Revisão da classificação

- **RF1 — funcional:** define a ação de pesquisar e selecionar uma cidade.
- **RF2 — funcional:** define a informação que o sistema deve consultar e exibir.
- **RF3 — funcional:** define a exibição da previsão de cinco dias.
- **RF4 — funcional:** define a ação de alternar unidades e atualizar temperaturas.
- **RF5 — funcional:** define os estados e mensagens que o sistema deve apresentar durante uma consulta.
- **RNF1 — não-funcional:** define a adaptação da interface a diferentes tamanhos de tela.
- **RNF2 — não-funcional:** define critérios de acessibilidade dos controles e do conteúdo.
- **RNF3 — não-funcional:** define o comportamento esperado diante de falhas de rede ou do provedor.
- **RNF4 — não-funcional:** define a qualidade esperada da experiência de uso.

**Itens classificados incorretamente:** nenhum. Responsividade e acessibilidade já constam como não-funcionais; resiliência também está coberta. Isso não define, por si só, uma meta mensurável de disponibilidade.

## Requisitos Não-Funcionais Sugeridos

As sugestões abaixo complementam os RNFs atuais e ainda precisam de validação antes de serem tratadas como critérios de aceite.

- **Sugestão NF1 — Performance:** definir metas para tempo de resposta da busca e carregamento da previsão em uma conexão típica. Como ponto de partida para discussão, considerar feedback de carregamento imediato, resultados de busca em até 2 segundos e previsão em até 3 segundos; validar esses limites com o produto e o provedor.
- **Sugestão NF2 — Disponibilidade:** definir uma meta mensal de disponibilidade para a aplicação hospedada e acompanhar separadamente a disponibilidade do Open-Meteo, que é uma dependência externa. Um alvo como 99,5% pode ser avaliado após a escolha da hospedagem; não é uma decisão confirmada.
- **Sugestão NF3 — Compatibilidade:** especificar os navegadores e versões suportados, por exemplo, as duas versões estáveis mais recentes de Chrome, Firefox, Safari e Edge, e verificar os fluxos principais neles.
- **Sugestão NF4 — Privacidade:** limitar os dados enviados ao provedor ao necessário para buscar a cidade e a previsão; não persistir cidade, localização ou histórico no navegador sem uma decisão explícita sobre finalidade e consentimento.

## Riscos

Probabilidade e impacto são estimativas de discovery, a revalidar com o produto.

### Riscos técnicos

| # | Risco | Probabilidade | Impacto | Mitigação sugerida |
| --- | --- | --- | --- | --- |
| RT1 | Serviço meteorológico (Open-Meteo) indisponível ou com limites de uso | Média | Alto | Tratar erros, informar o usuário e permitir nova tentativa; debounce na busca para reduzir chamadas; isolar o acesso em `src/services/` para permitir trocar de provedor. |
| RT2 | Uso comercial incompatível com a licença/plano gratuito do provedor (A13) | Média | Alto | Confirmar o tipo de uso antes da spec; incluir atribuição exigida; planejar plano pago ou provedor alternativo se necessário. |
| RT3 | Conexão instável ou ausente | Média | Médio | Exibir estado de erro claro, timeout nas requisições e ação de tentar novamente. |
| RT4 | Resposta da API com formato inesperado, campos ausentes ou mudança de contrato | Baixa | Alto | Validar/normalizar a resposta na camada de serviço, tipar o contrato e cobrir com testes usando fixtures; degradar com mensagem de erro em vez de quebrar a tela. |
| RT5 | Fuso horário e datas incorretos (dia atual deslocado para cidades de outros fusos) | Média | Médio | Usar o fuso retornado pela API para a cidade; formatar datas explicitamente; testar casos com fusos diferentes. |
| RT6 | Conversão ou apresentação incorreta das unidades | Baixa | Alto | Validar a conversão com testes unitários e garantir que todas as temperaturas exibidas acompanhem a unidade selecionada. |
| RT7 | Condições de corrida na busca (resposta antiga sobrescreve a mais recente) | Média | Médio | Cancelar requisições anteriores (AbortController) ou ignorar respostas obsoletas; testar digitação rápida. |
| RT8 | Texto da API em idioma diferente do pt-BR (A21) | Média | Baixo | Solicitar idioma pt na geocodificação e mapear códigos de clima para textos e ícones próprios. |
| RT9 | Regressão de performance em redes lentas ou aparelhos modestos (efeitos de glassmorphism, bundle) | Média | Médio | Definir metas (NF1), medir com Lighthouse, limitar efeitos de blur e acompanhar o tamanho do bundle. |
| RT10 | Incompatibilidade entre navegadores (ex.: `backdrop-filter` no Safari) | Baixa | Médio | Definir navegadores suportados (NF3), prever fallback visual e testar fluxos principais em E2E. |

### Riscos de produto

| # | Risco | Probabilidade | Impacto | Mitigação sugerida |
| --- | --- | --- | --- | --- |
| RP1 | Nomes de cidades iguais ou ambíguas levam o usuário à cidade errada | Alta | Médio | Exibir estado e país em cada resultado e a cidade selecionada de forma destacada. |
| RP2 | Previsão de cinco dias interpretada de formas diferentes | Média | Médio | Aplicar D2 (hoje + 4 dias) e explicitar as datas na interface. |
| RP3 | Escopo indefinido ou crescente (A5, A6, A19) | Alta | Alto | Fechar a lista de campos e o que fica fora da v1 antes da spec; priorizar com MoSCoW. |
| RP4 | Ausência de métrica de sucesso e de validação com usuários (A1, A2) | Média | Médio | Definir indicador de sucesso e validar as personas e um protótipo com poucos usuários. |
| RP5 | Controles ou conteúdo difíceis de usar em telas pequenas | Média | Médio | Projetar mobile-first e verificar larguras de tela diferentes. |
| RP6 | Acessibilidade insuficiente, sobretudo contraste no tema escuro com transparência | Média | Alto | Adotar meta WCAG 2.1 AA (A15), checar contraste, testar navegação por teclado e leitor de tela. |
| RP7 | Tela inicial vazia ou pouco orientadora sem geolocalização (D6, A12) | Média | Médio | Definir estado inicial com orientação clara ou cidade sugerida. |
| RP8 | Falta de conformidade com privacidade/LGPD se houver persistência local ou telemetria (A14, A22) | Baixa | Alto | Não persistir nem coletar dados sem decisão explícita e consentimento; informar o uso na interface. |
| RP9 | Expectativa de uso offline ou de dados "em tempo real" não atendida (pergunta 8) | Média | Médio | Comunicar o horário da última atualização; decidir e documentar a política de cache. |
| RP10 | Prazo ou capacidade da equipe incompatíveis com o escopo (A20) | Média | Médio | Entregar por fatias (busca → clima atual → previsão → unidades) com MVP definido. |

## Perguntas em Aberto

1. Qual fonte de dados meteorológicos será utilizada e quais são seus limites de uso?
2. Os cinco dias de previsão incluem o dia atual?
3. Qual deve ser a unidade padrão na primeira visita?
4. A busca deve sugerir cidades enquanto o usuário digita? Como serão desambiguados resultados homônimos?
5. A aplicação deve detectar a localização do usuário ou mostrar uma cidade inicial automaticamente?
6. Quais idiomas e formatos de data devem ser suportados?
7. É necessário manter a última cidade consultada ou oferecer favoritos?
8. A aplicação deve oferecer dados recentes quando o dispositivo estiver offline?
9. Quais informações, além da temperatura e da condição geral, devem aparecer no clima atual e na previsão?

## Suposições

- O usuário escolhe a cidade por meio de busca; não há requisito confirmado de geolocalização automática.
- A aplicação depende de uma conexão com a internet para obter dados meteorológicos atualizados.
- A consulta não exige conta ou autenticação, pois isso não foi mencionado no briefing.
- “Cinco dias” descreve o horizonte da previsão, mas a inclusão do dia atual ainda precisa ser confirmada.
- Celsius e Fahrenheit são as únicas unidades de temperatura necessárias para a primeira versão.
- O uso em dispositivos móveis é prioritário o bastante para exigir uma interface responsiva, sem excluir o uso em telas maiores.

## Personas

As personas abaixo são hipóteses de discovery derivadas do briefing, não perfis validados por pesquisa com usuários. As métricas descrevem sucesso do ponto de vista de cada pessoa; devem ser validadas em entrevistas ou testes de usabilidade.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso para a pessoa |
| --- | --- | --- | --- |
| **Viajante planejador** | Escolher roupas, horários e atividades com base nas condições previstas no destino. | Pesquisa com antecedência em desktop; consulta novamente no celular durante a viagem. | Encontra a cidade correta e entende a previsão dos dias da viagem em uma única consulta, sem precisar recorrer a outra fonte para esclarecer as datas. |
| **Pessoa organizando o dia a dia** | Decidir o que vestir e se precisa levar guarda-chuva antes de sair. | Consulta rápida no celular, geralmente pouco antes de sair de casa. | Consegue identificar a condição atual e a previsão relevante para o dia em poucos segundos e tomar sua decisão sem ambiguidade. |
| **Pessoa coordenando atividade ao ar livre** | Avaliar se as condições dos próximos dias são adequadas para um compromisso ou atividade externa. | Compara dias e, quando necessário, cidades em desktop; verifica a decisão final no celular. | Identifica rapidamente o dia mais adequado (ou percebe que nenhum dia atende ao que precisa) com informação suficiente para decidir se mantém ou altera os planos. |

## Decisões

As decisões D1–D5 abaixo foram confirmadas pelo solicitante para destravar a especificação. A escolha do provedor não encerra a validação de licença e limites de uso, mantida como risco e lacuna A13.

| # | Decisão | Justificativa | Resolve |
| --- | --- | --- | --- |
| D1 | **Fonte de dados:** Open-Meteo (geocoding + forecast), sem API key. | Não exige chave de API e oferece busca de cidades e previsão no mesmo provedor, simplificando integração e testes. | Resolve a escolha da fonte na pergunta 1; limites de uso e adequação da licença ao contexto da empresa continuam pendentes (A13). Também fornece contexto (estado/país) para desambiguar homônimas, mas não define o fluxo de busca (pergunta 4). |
| D2 | **"5 dias" = hoje + 4 dias seguintes** (5 datas no total). | Mostra o dia atual no horizonte da previsão, o que é mais útil para o usuário. As datas são exibidas explicitamente na interface. | Pergunta 2 e o risco de interpretação da previsão. |
| D3 | **Unidade padrão:** Celsius (°C), com alternância para °F. | °C é o padrão no público-alvo (pt-BR). A alternância continua disponível (RF4). | Pergunta 3. |
| D4 | **Sem autenticação e sem persistência de servidor.** | O briefing não exige conta. Evita backend, armazenamento de dados pessoais e preocupações de privacidade. | Confirma a suposição de ausência de autenticação. Parcialmente a pergunta 7: favoritos e última cidade não serão guardados em servidor (persistência local no navegador não foi decidida). |
| D5 | **Idioma da UI:** pt-BR (datas e números no formato brasileiro). | Público-alvo brasileiro. Evita internacionalização na primeira versão. | Pergunta 6. |
| D6 | **Sem geolocalização automática na v1.** | O usuário escolhe a cidade pela busca; isso evita solicitar permissão de localização sem necessidade confirmada. | Pergunta 5. Geolocalização pode ser considerada como melhoria futura. |

### Perguntas ainda em aberto

- **4 — Busca e desambiguação:** haverá sugestões enquanto o usuário digita? O contexto de estado e país será suficiente para escolher entre cidades homônimas? **Impacto:** define o fluxo de busca e a apresentação dos resultados; a fonte escolhida fornece contexto geográfico, mas o comportamento das sugestões ainda não foi definido.
- **7 — Persistência local:** a última cidade consultada ou favoritos serão mantidos no navegador? **Impacto:** afeta a experiência em visitas futuras e exige definir o que armazenar localmente; não haverá persistência em servidor (D4).
- **8 — Uso offline:** dados recentes devem continuar disponíveis sem conexão? **Impacto:** exige estratégia de cache e regras para indicar a idade dos dados; por enquanto, assume-se conexão para obter informações atualizadas.
- **9 — Conteúdo meteorológico:** quais campos, além de temperatura e condição geral, devem aparecer no clima atual e na previsão? **Impacto:** define o contrato de dados, a hierarquia visual e a densidade das telas.

## Análise cética do briefing (ambiguidades e lacunas)

Leitura crítica do briefing original, além das perguntas 1–9 acima. Cada item abaixo continua **sem resposta** até decisão do produto; o texto "Impacto" descreve o que acontece se seguirmos assim mesmo.

| # | Ambiguidade / lacuna | Pergunta em aberto | Impacto de seguir sem resposta |
| --- | --- | --- | --- |
| A1 | **Objetivo de negócio não declarado.** O briefing diz o que construir, não por quê. | Qual problema/resultado a empresa espera (engajamento, ferramenta interna, vitrine)? Como saberemos que deu certo? | Sem métrica de sucesso, não há critério para priorizar, cortar escopo ou declarar a v1 pronta; risco de entregar algo "completo" sem valor percebido. |
| A2 | **Público e contexto de uso vagos** ("usuários"). | Quem são, onde estão (Brasil? global?) e em que situação consultam? As personas propostas foram validadas com usuários reais? | As três personas são hipóteses, não evidência de pesquisa; se forem tratadas como fatos, podem orientar UX e prioridades erradas e gerar retrabalho após o primeiro feedback. |
| A3 | **"Funcionar em dispositivos móveis" é ambíguo.** | É web responsivo, PWA instalável ou app nativo? Quais tamanhos mínimos de tela? | Escolha errada muda stack, distribuição e custo (loja de apps, instalação, offline); o RNF1 só cobre web responsivo. |
| A4 | **"Cidades escolhidas por eles"**: uma ou várias ao mesmo tempo? | O usuário compara/acompanha várias cidades ou vê uma por vez? | Estado único vs. lista muda modelo de dados, layout e testes; mudar depois é refatoração estrutural. |
| A5 | **"Clima atual" não definido.** | Quais campos (sensação térmica, umidade, vento, UV, precipitação, nascer/pôr do sol)? De quando é a leitura (frescor aceitável)? | Contrato de dados e UI indefinidos; a equipe pode implementar só temperatura e ser reprovada na revisão, ou superdimensionar. (Relacionada à pergunta 9.) |
| A6 | **Previsão: granularidade.** | Previsão diária apenas, ou também por hora? Mostrar mínima/máxima, probabilidade de chuva, ícones? | Diária vs. horária altera chamadas à API, volume de dados e telas. |
| A7 | **Fuso horário e definição de "hoje".** | "Hoje" é na data do usuário ou da cidade consultada? | Datas e o dia atual da previsão (D2) podem aparecer deslocados, sobretudo em cidades de outros fusos. |
| A8 | **Unidades além da temperatura.** | Vento (km/h, m/s, mph), precipitação (mm) e pressão também alternam com °C/°F, ou seguem unidade fixa? | Mistura de sistemas (°F com km/h) gera inconsistência; RF4 cobre só temperatura. |
| A9 | **Persistência da escolha de unidade.** | A unidade escolhida é lembrada entre visitas? | Se a decisão é "sim" depois, entra armazenamento local e questão de privacidade (NF4); se "não", o usuário reseleciona sempre. |
| A10 | **Regras da busca não especificadas.** | Mínimo de caracteres, tolerância a acentos/erros de digitação, limite de resultados, tratamento de entrada vazia, busca por CEP/coordenadas? | Comportamento inconsistente e casos de borda sem critério de aceite; testes ambíguos. (Complementa a pergunta 4.) |
| A11 | **Distinção entre "sem resultados" e "falha".** | Como diferenciar cidade inexistente, erro de rede, limite de uso excedido e dados parciais? Qual o texto/ação de cada um? | RF5 e RNF3 ficam genéricos; usuário recebe mensagem enganosa (ex.: "cidade não encontrada" quando a rede caiu). |
| A12 | **Estado inicial da tela.** | O que aparece antes de qualquer busca (tela vazia, cidade padrão, exemplos)? Com D6, não há localização automática. | Primeira impressão fraca ou tela vazia sem orientação; decisão afeta teste de aceitação do fluxo inicial. |
| A13 | **Licença e termos do Open-Meteo (D1).** | O uso é comercial? A API gratuita é destinada a uso não comercial e exige atribuição; a empresa precisa de plano pago ou de outro provedor? | Risco jurídico/contratual e de bloqueio por limite de uso em produção; troca tardia de provedor impacta toda a camada de dados. |
| A14 | **Atribuição e conformidade.** | Quais créditos/links de atribuição, política de privacidade e conformidade (LGPD) são necessários? | Exposição a descumprimento de licença ou de lei, descoberta só perto da entrega. |
| A15 | **Nível de acessibilidade esperado.** | A meta é WCAG 2.1 AA? Há exigência legal/contratual (ex.: órgão público)? | RNF2 diz "adequado", sem padrão verificável; impossível declarar conformidade ou automatizar auditoria. |
| A16 | **Metas mensuráveis ausentes.** | Quais limites de performance, disponibilidade e navegadores suportados serão adotados (NF1–NF3 são só sugestões)? | Requisitos não testáveis; discussões subjetivas na revisão e risco de regressões não detectadas. |
| A17 | **Hospedagem, ambiente e operação.** | Onde será publicado, quem opera, como é feito deploy, monitoramento e suporte? | Disponibilidade e custos indefinidos; não dá para validar NF2 nem planejar entrega. |
| A18 | **Design e marca.** | Existe identidade visual/protótipo? O tema escuro (glassmorphism) é requisito ou preferência? | Retrabalho de interface e contraste (impacta RNF2) se a empresa tiver guia de marca. |
| A19 | **Escopo excluído não declarado.** | Fora da v1: alertas meteorológicos, mapas, qualidade do ar, notificações, compartilhamento, histórico? | Expansão silenciosa de escopo (scope creep) ou expectativas frustradas de stakeholders. |
| A20 | **Prazo, orçamento e equipe.** | Qual a data-alvo e o que é obrigatório (MVP) vs. desejável? | Sem prioridade (MoSCoW) não há como cortar escopo se o prazo apertar. |
| A21 | **Idioma dos dados do provedor.** | Nomes de cidades e descrições de condição virão em pt-BR? Haverá tradução dos códigos de clima? | D5 (UI em pt-BR) pode ser quebrada por textos em inglês vindos da API. |
| A22 | **Observabilidade e analytics.** | Haverá métricas de uso ou registro de erros? Com qual consentimento? | Sem telemetria não medimos A1; com telemetria sem decisão, conflito com NF4/privacidade. |

### Priorização sugerida

- **Bloqueiam a spec (resolver primeiro):** A3, A5, A6, A7, A11, A13, A15.
- **Bloqueiam o plano técnico:** A4, A8, A12, A16, A17, A21.
- **Podem seguir como suposição explícita:** A9, A10, A18, A19, A20, A22, A1, A2, A14.
