# Weather App — Especificação de Produto

| Campo | Valor |
| --- | --- |
| Versão | 0.2 (rascunho para aprovação) |
| Entrada | [`discovery.md`](./discovery.md) |
| Status | Rascunho detalhado; não aprovar nem liberar até resolver os bloqueios da seção 10 |

> Convenção de rastreabilidade: **RF** = requisito funcional, **US** = user story,
> **AC** = critério de aceite, **RNF** = requisito não-funcional, **EC** = edge
> case, **OQ** = open question. Referências a **D#**, **A#**, **RT#** e **RP#**
> apontam para decisões, lacunas e riscos do discovery.

---

## 1. Overview

### 1.1 Problema

Pessoas precisam decidir rapidamente o que vestir, se levam guarda-chuva, ou
se mantêm um compromisso ou viagem, e para isso querem consultar o clima atual e
a previsão dos próximos dias de uma cidade escolhida por elas.

### 1.2 Produto

Uma aplicação web responsiva de previsão do tempo que permite:

- buscar uma cidade pelo nome e selecioná-la;
- ver as condições atuais dessa cidade;
- ver a previsão para cinco dias (hoje + 4);
- alternar a exibição de temperatura entre °C e °F;
- entender claramente quando a consulta está carregando, falhou ou não retornou nada.

### 1.3 Objetivos da v1

| # | Objetivo | Como será verificado |
| --- | --- | --- |
| O1 | Usuário encontra a cidade correta e vê o clima em uma única consulta. | Fluxo busca → seleção → clima completo sem sair da tela (AC-1.x, AC-2.x). |
| O2 | A informação é compreensível em celular. | Todos os ACs executados em viewport de 360 px (RNF1). |
| O3 | Falhas nunca deixam o usuário sem explicação ou saída. | Cada estado de erro tem mensagem e ação (AC-5.x, EC). |

> A métrica de sucesso de negócio não foi definida (A1); ver OQ-1.

### 1.4 Personas

Hipóteses do discovery, ainda não validadas com usuários (A2):

| ID | Persona | Objetivo | Contexto |
| --- | --- | --- | --- |
| P1 | Viajante planejador | Planejar roupas e atividades no destino | Desktop com antecedência; celular na viagem |
| P2 | Pessoa organizando o dia a dia | Decidir o que vestir / levar guarda-chuva | Celular, consulta rápida antes de sair |
| P3 | Pessoa coordenando atividade ao ar livre | Escolher o melhor dia para um compromisso externo | Desktop para comparar; celular para confirmar |

### 1.5 Decisões já fechadas (herdadas do discovery)

| ID | Decisão |
| --- | --- |
| D1 | Fonte de dados: Open-Meteo (geocoding + forecast), sem API key. |
| D2 | "5 dias" = hoje + 4 dias seguintes (5 datas). |
| D3 | Unidade padrão: Celsius, com alternância para Fahrenheit. |
| D4 | Sem autenticação e sem persistência em servidor. |
| D5 | Idioma da interface: pt-BR; datas e números no formato brasileiro. |
| D6 | Sem geolocalização automática na v1. |

---

## 2. Functional Requirements

Prioridade segue MoSCoW. Tudo marcado **Must** compõe o MVP.

### RF1 — Buscar e selecionar cidade (Must)

- RF1.1 O usuário digita o nome de uma cidade em um campo de busca. Espaços nas extremidades são removidos antes da consulta; acentos, hífens e apóstrofos fazem parte do termo.
- RF1.2 O sistema apresenta uma lista de cidades correspondentes, cada uma com nome, região/estado (quando disponível) e país.
- RF1.3 O usuário seleciona uma cidade da lista; a cidade selecionada passa a ser o contexto de RF2 e RF3.
- RF1.4 A cidade selecionada é exibida de forma destacada (nome, região/estado, país) junto aos dados meteorológicos.
- RF1.5 A busca só é disparada com pelo menos dois caracteres não brancos, após 300 ms sem digitação (**AS-6**).
- RF1.6 Ao alterar o termo, resultados do termo anterior deixam de ser selecionáveis até chegar a resposta do termo atual. Se o campo for limpo, a lista e o estado da busca são limpos; respostas anteriores não podem repopular a lista.

### RF2 — Exibir clima atual (Must)

- RF2.1 Para a cidade selecionada, o sistema exibe as condições atuais com, no mínimo: temperatura atual, descrição textual da condição (pt-BR) e representação visual da condição (ícone).
- RF2.2 O sistema informa o horário de referência fornecido pelo provedor ("atualizado às HH:mm"), formatado no fuso horário IANA da cidade; não substitui esse horário pela hora do dispositivo.
- RF2.3 Campos adicionais (sensação térmica, umidade, vento etc.) dependem de **OQ-3**; se adotados, seguem os mesmos critérios de unidade (RF4) e acessibilidade (RNF2).

### RF3 — Exibir previsão de cinco dias (Must)

- RF3.1 O sistema exibe exatamente cinco dias: o dia atual da cidade e os quatro seguintes (D2).
- RF3.2 Cada dia exibe, no mínimo: a data (dia da semana e dia/mês em pt-BR), temperatura mínima, temperatura máxima, descrição textual e ícone da condição.
- RF3.3 O primeiro item é identificado como "Hoje".
- RF3.4 A granularidade é diária; previsão horária está fora da v1 (ver Out of Scope e OQ-4, que registra a confirmação desta premissa).
- RF3.5 Cada valor da previsão é associado à data local retornada pelo provedor, não à posição no array; datas ausentes não deslocam os dados dos dias seguintes.

### RF4 — Alternar unidade de temperatura (Must)

- RF4.1 Um controle visível permite alternar entre °C e °F.
- RF4.2 A unidade padrão ao abrir a aplicação é °C (D3).
- RF4.3 Ao alternar, **todas** as temperaturas exibidas (atual, mínimas, máximas e quaisquer campos adicionais de temperatura) são atualizadas e exibem o símbolo da unidade ativa.
- RF4.4 A alternância não dispara nova busca de cidade nem perde a cidade selecionada.
- RF4.5 Na v1, a unidade escolhida não persiste: após recarregar a página, volta a °C (**AS-8**). Alterar essa regra exige decisão em **OQ-7**.

### RF5 — Comunicar estados da consulta (Must)

- RF5.1 **Estado inicial:** antes de qualquer busca, a tela exibe orientação sobre como começar (ex.: "Busque uma cidade para ver a previsão"). Conteúdo exato depende de **OQ-8**.
- RF5.2 **Carregando:** enquanto busca cidades ou dados meteorológicos, o sistema exibe indicação de carregamento, sem bloquear a digitação no campo de busca.
- RF5.3 **Sem resultados:** quando a busca retorna zero cidades, o sistema informa que nenhuma cidade foi encontrada e sugere revisar a grafia.
- RF5.4 **Falha:** quando a busca ou a consulta meteorológica falha (rede, timeout, resposta HTTP não-2xx ou resposta ilegível), o sistema exibe mensagem distinta de "sem resultados" e oferece nova tentativa manual. Para HTTP 429, respeita `Retry-After` válido antes de habilitar a nova tentativa.
- RF5.5 **Dados parciais:** quando campos ou dias estão ausentes, nulos ou inválidos, o sistema exibe os dados válidos e sinaliza cada ausência, sem inventar valores nem deslocar dados entre datas. Se nenhuma seção contiver dados utilizáveis, comunica falha e oferece retry.
- RF5.6 As mensagens de estado são anunciadas a tecnologias assistivas (ver RNF2).
- RF5.7 Uma consulta com falha não é repetida automaticamente; uma nova tentativa só ocorre por ação explícita do usuário.
- RF5.8 Enquanto uma tentativa está em andamento, o controle de retry fica indisponível e acionamentos repetidos não criam nem enfileiram novas requisições.

### RF6 — Atribuição da fonte de dados (Should)

- RF6.1 A interface exibe crédito à fonte de dados conforme exigência da licença do provedor (texto e link definidos em **OQ-9**).

---

## 3. User Stories

As histórias usam as três personas do [discovery](./discovery.md#personas), identificadas como P1–P3 na seção 1.4. "RNF central" indica o RNF que define o valor da história; a ligação completa com critérios de aceite e RNFs relevantes está em [4.10](#410-rastreabilidade).

| ID | Persona | História | RFs | RNF central |
| --- | --- | --- | --- | --- |
| US1 | P1 | Como viajante planejador, quero buscar a cidade de destino pelo nome e selecioná-la entre resultados identificados por estado e país para consultar o destino correto, mesmo quando houver cidades homônimas. | RF1 | — |
| US2 | P2 | Como pessoa organizando o dia a dia, quero ver a temperatura e a condição atual da cidade selecionada para decidir o que vestir antes de sair de casa. | RF2 | — |
| US3 | P1 | Como viajante planejador, quero consultar a previsão de hoje e dos quatro dias seguintes com datas explícitas para planejar roupas e atividades da viagem sem confundir os dias. | RF3 | — |
| US4 | P3 | Como pessoa coordenando atividade ao ar livre, quero comparar as temperaturas mínimas, máximas e condições previstas para os cinco dias da cidade escolhida para decidir se mantenho ou altero a data do compromisso. | RF3 | — |
| US5 | P1 | Como viajante planejador, quero alternar todas as temperaturas exibidas entre °C e °F para interpretar as condições do destino na unidade com que estou familiarizado. | RF4 | — |
| US6 | P2 | Como pessoa organizando o dia a dia, quero distinguir carregamento, ausência de resultados e falhas e repetir a consulta quando ela falhar para saber se devo aguardar, revisar a busca ou refazer a consulta. | RF5 | RNF3 |
| US7 | P2 | Como pessoa organizando o dia a dia, quero buscar e selecionar minha cidade, ler o clima atual e a previsão, alternar a unidade e acompanhar os estados da consulta com teclado ou leitor de tela para consultar o clima com autonomia. | RF1, RF2, RF3, RF4, RF5 | RNF2 |
| US8 | P2 | Como pessoa organizando o dia a dia, quero buscar minha cidade, consultar o clima atual e a previsão e acionar os controles em uma interface legível no celular para organizar minha saída sem precisar de zoom ou rolagem horizontal da página. | RF1, RF2, RF3, RF4, RF5 | RNF1 |

---

## 4. Acceptance Criteria

Critérios organizados **por requisito funcional**, no formato **Given / When / Then**. As palavras-chave ficam em inglês e o conteúdo em pt-BR; **And** acrescenta condições ou resultados ao passo anterior. Cada critério indica os sub-requisitos que cobre e serve de base direta para os testes automatizados.

### 4.0 Convenções para testes

- **Respostas controladas.** "O provedor retorna…" descreve uma resposta simulada e determinística. Critérios marcados **[contrato]** verificam o comportamento real do Open-Meteo e devem rodar separados da suíte principal.
- **Relógio e fuso fixos.** Quando o resultado depende de data ou hora, a pré-condição fixa o relógio e o fuso horário do dispositivo.
- **Textos pendentes.** Quando a redação final depende de uma Open Question, o critério verifica a presença e a finalidade do elemento, não o texto exato.
- **Requisições.** "Requisição de busca" é a consulta de cidades (geocodificação); "requisição de previsão" é a consulta de clima atual e previsão.
- **IDs estáveis.** AC-1.x a AC-6.x pertencem a RF1–RF6. AC-7.x e AC-8.x são critérios transversais de RNF2 e RNF1 aplicados aos fluxos funcionais. Novos critérios recebem o próximo número livre; IDs não são reutilizados.

### 4.1 Dados de referência

Usados sempre que o critério não indicar outros valores.

| Elemento | Valor |
| --- | --- |
| Data e hora do dispositivo | quinta-feira, 29/10/2026, 10:00, fuso America/Sao_Paulo |
| Cidade selecionada | São Paulo — São Paulo — Brasil, fuso America/Sao_Paulo |
| Clima atual | 25 °C (77 °F); código de condição 2 ("Parcialmente nublado"); leitura às 09:45 |

| Data | Dia | Mín. °C | Máx. °C | Mín. °F | Máx. °F | Código | Descrição esperada |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 29/10 | Hoje (qui) | 18 | 27 | 64 | 81 | 2 | Parcialmente nublado |
| 30/10 | sex | 17 | 26 | 63 | 79 | 61 | Chuva fraca |
| 31/10 | sáb | 16 | 24 | 61 | 75 | 3 | Nublado |
| 01/11 | dom | 15 | 22 | 59 | 72 | 0 | Céu limpo |
| 02/11 | seg | 17 | 25 | 63 | 77 | 80 | Pancadas de chuva fracas |

Os códigos seguem a classificação de condições do provedor (padrão WMO). O plano técnico deve entregar um catálogo que cubra todos os códigos documentados pelo provedor, com descrição pt-BR e ícone; código ausente do catálogo usa o fallback de AC-2.3/AC-3.7. Testes automatizados devem percorrer o catálogo completo.

### 4.2 RF1 — Buscar e selecionar cidade

Histórias: US1, US7, US8.

#### AC-1.1 — Resultados com nome, estado e país

*Cobre: RF1.1, RF1.2*

- **Given** o provedor retorna "São Paulo — São Paulo — Brasil" para o termo "São Paulo"
- **When** o usuário digita "São Paulo" no campo de busca e para de digitar
- **Then** uma lista de resultados é exibida
- **And** um item contém o nome "São Paulo", o estado "São Paulo" e o país "Brasil"

#### AC-1.2 — Cidades homônimas distinguíveis

*Cobre: RF1.2*

- **Given** o provedor retorna, para "Santa Cruz", os resultados "Santa Cruz — Calabarzon — Filipinas" e "Santa Cruz — Metro Manila — Filipinas"
- **When** a lista de resultados é exibida
- **Then** cada item exibe o próprio estado ("Calabarzon" ou "Metro Manila") e o país "Filipinas"
- **And** os textos dos dois itens são diferentes

#### AC-1.3 — Seleção de cidade

*Cobre: RF1.3, RF1.4*

- **Given** a lista de resultados exibe "São Paulo — São Paulo — Brasil"
- **When** o usuário seleciona esse item por clique ou toque
- **Then** a lista de resultados é fechada
- **And** a cidade selecionada é exibida em destaque com nome, estado e país
- **And** uma requisição de previsão é iniciada para a localização desse resultado

A seleção por teclado é coberta por AC-7.1.

#### AC-1.4 — Mínimo de caracteres

*Cobre: RF1.5, AS-6*

- **Given** o campo de busca está vazio
- **When** o usuário digita um único caractere ("S") e aguarda 1 segundo
- **Then** nenhuma requisição de busca é feita
- **And** nenhuma lista, mensagem de "sem resultados" ou mensagem de falha é exibida

#### AC-1.5 — Respostas fora de ordem

*Cobre: RF1.1, RF1.2*

- **Given** o provedor responde à busca "Rio de Janeiro" antes de responder à busca "Rio"
- **When** o usuário digita "Rio", aguarda a requisição ser enviada e, antes da resposta, completa o termo para "Rio de Janeiro"
- **Then** enquanto a busca mais recente está pendente, resultados de "Rio" não podem ser selecionados
- **And** quando a resposta mais recente chega, a lista exibe apenas resultados de "Rio de Janeiro"
- **And** a resposta de "Rio", ao chegar, não substitui a lista

#### AC-1.6 — Termo apenas com espaços

*Cobre: RF1.5*

- **Given** o campo de busca está vazio
- **When** o usuário digita três espaços e aguarda 1 segundo
- **Then** nenhuma requisição de busca é feita
- **And** nenhuma lista, mensagem de "sem resultados" ou mensagem de falha é exibida

#### AC-1.7 — Espaços nas extremidades são ignorados

*Cobre: RF1.1*

- **Given** o campo de busca está vazio
- **When** o usuário digita "  Recife  " e para de digitar
- **Then** a requisição de busca usa o termo "Recife", sem os espaços das extremidades

#### AC-1.8 — Resultado sem estado ou sem país

*Cobre: RF1.2*

- **Given** o provedor retorna um resultado com nome e país, mas sem estado, e outro com nome e estado, mas sem país
- **When** a lista de resultados é exibida
- **Then** cada item exibe apenas as informações disponíveis
- **And** nenhum item contém separador sobrando, campo vazio, "undefined" ou "null"

#### AC-1.9 — Uma requisição por termo digitado

*Cobre: RF1.1, RF1.5, AS-6*

- **Given** o campo de busca está vazio
- **When** o usuário digita "Recife" com intervalo menor que 300 ms entre as teclas e para de digitar
- **Then** exatamente uma requisição de busca é feita, com o termo "Recife"
- **And** essa requisição ocorre somente depois de 300 ms sem digitação

#### AC-1.10 — Busca sem acento [contrato]

*Cobre: RF1.1*

- **Given** o serviço real de geocodificação do provedor
- **When** é feita uma busca por "sao paulo", solicitando nomes em português
- **Then** "São Paulo — São Paulo — Brasil" está entre os resultados

A tolerância a acentos é do provedor, confirmada em 27/10/2026. Se o comportamento mudar, este critério falha e a regra volta para OQ-13.

#### AC-1.11 — Nova seleção substitui a anterior

*Cobre: RF1.3, RF1.4*

- **Given** São Paulo está selecionada e a requisição de previsão dessa cidade ainda não respondeu
- **When** o usuário busca e seleciona "Recife — Pernambuco — Brasil"
- **Then** Recife passa a ser a cidade em destaque
- **And** a resposta de São Paulo, ao chegar, é descartada e não aparece na tela

#### AC-1.12 — Campo limpo durante busca pendente

*Cobre: RF1.6*

- **Given** uma busca por "Recife" já foi enviada e ainda não respondeu
- **When** o usuário apaga todo o conteúdo do campo
- **Then** a lista de resultados é fechada e nenhum estado de "sem resultados" ou falha é exibido
- **And** nenhuma nova requisição é enviada para o termo vazio
- **And** a resposta tardia de "Recife" é ignorada e não reabre a lista
- **And** a cidade já selecionada e seus dados não são alterados

#### AC-1.13 — Caracteres válidos preservados

*Cobre: RF1.1, RF1.2*

- **Given** o provedor retorna o nome de cidade "Pau-d'Arco" com hífen e apóstrofo
- **When** o usuário busca e recebe esse resultado
- **Then** o termo é enviado como texto codificado e o nome é exibido sem remover ou reinterpretar esses caracteres
- **And** a lista aguarda seleção explícita; nenhum resultado é selecionado automaticamente

### 4.3 RF2 — Exibir clima atual

Histórias: US2, US7, US8.

#### AC-2.1 — Dados mínimos do clima atual

*Cobre: RF2.1*

- **Given** São Paulo está selecionada e o provedor retorna o clima atual de referência
- **When** os dados são exibidos
- **Then** a área de clima atual mostra o valor 25 acompanhado de "°C"
- **And** mostra a descrição "Parcialmente nublado"
- **And** mostra um ícone da condição com alternativa textual equivalente à descrição

#### AC-2.2 — Horário de referência no fuso da cidade

*Cobre: RF2.2, AS-4*

- **Given** o dispositivo está em 28/10/2026, 23:30, no fuso America/Sao_Paulo
- **And** Tóquio está selecionada e o provedor informa a leitura atual às 11:30 do horário local de Tóquio
- **When** os dados são exibidos
- **Then** o horário de referência da leitura é exibido como 11:30
- **And** o horário do dispositivo (23:30) não aparece como horário da leitura
- **And** o horário é identificado como a hora da leitura, não como a hora atual do dispositivo

#### AC-2.3 — Código de condição desconhecido

*Cobre: RF2.1*

- **Given** o provedor retorna o clima atual com um código de condição sem descrição conhecida (ex.: 999)
- **When** os dados são exibidos
- **Then** a descrição é "Condição indisponível" e um ícone neutro é exibido
- **And** a temperatura e o horário de referência continuam visíveis
- **And** nenhuma mensagem de falha é exibida

RF2.3 não tem critério próprio: os campos adicionais dependem de OQ-3. Quando forem definidos, cada campo recebe um critério AC-2.x e segue AC-4.2 (unidade) e AC-7.3 (nome acessível).

### 4.4 RF3 — Exibir previsão de cinco dias

Histórias: US3, US4, US7, US8.

#### AC-3.1 — Exatamente cinco dias

*Cobre: RF3.1*

- **Given** São Paulo está selecionada e o provedor retorna sete dias de previsão a partir de 29/10/2026
- **When** a previsão é exibida
- **Then** exatamente cinco dias são exibidos, de 29/10 a 02/11

#### AC-3.2 — "Hoje" e datas consecutivas

*Cobre: RF3.1, RF3.3, RF3.5*

- **Given** o relógio e a cidade dos dados de referência
- **When** a previsão é exibida
- **Then** o primeiro dia é rotulado "Hoje" e exibe a data 29/10
- **And** os dias seguintes são 30/10, 31/10, 01/11 e 02/11, nessa ordem e sem repetição

#### AC-3.3 — Conteúdo de cada dia

*Cobre: RF3.2*

- **Given** a previsão de referência
- **When** a previsão é exibida
- **Then** cada dia exibe o dia da semana abreviado e a data no formato dd/mm (ex.: "sex" e "30/10")
- **And** exibe a temperatura mínima e a máxima, identificadas como tal por rótulo visível ou nome acessível (ex.: 30/10 com mínima 17 °C e máxima 26 °C)
- **And** exibe a descrição esperada e o ícone da condição

#### AC-3.4 — "Hoje" segue o fuso da cidade

*Cobre: RF3.1, RF3.3, AS-4*

- **Given** o dispositivo está em 28/10/2026, 23:30, no fuso America/Sao_Paulo
- **And** Tóquio está selecionada (29/10/2026, 11:30 no horário local) e o provedor retorna a previsão de Tóquio a partir de 29/10
- **When** a previsão é exibida
- **Then** o dia rotulado "Hoje" é 29/10
- **And** o último dia exibido é 02/11

#### AC-3.5 — Cinco dias no celular

*Cobre: RF3.1, RNF1*

- **Given** viewport de 360 × 640 px e a previsão de referência exibida
- **When** o usuário percorre a área de previsão
- **Then** os cinco dias são alcançáveis com rolagem vertical da página
- **And** nem a página nem a área de previsão exigem rolagem horizontal

#### AC-3.6 — Granularidade diária

*Cobre: RF3.4*

- **Given** a previsão de referência exibida
- **When** o usuário percorre a área de previsão
- **Then** cada um dos cinco itens representa um dia inteiro
- **And** nenhum item exibe subdivisões ou valores por horário

#### AC-3.7 — Código desconhecido na previsão

*Cobre: RF3.2*

- **Given** um dia da previsão retorna código de condição sem descrição conhecida
- **When** a previsão é exibida
- **Then** a descrição desse dia é "Condição indisponível" e o ícone é neutro
- **And** as temperaturas e os demais dias válidos continuam visíveis
- **And** nenhuma mensagem de falha é exibida apenas por causa desse código

### 4.5 RF4 — Alternar unidade de temperatura

Histórias: US5, US7, US8.

#### AC-4.1 — Celsius por padrão

*Cobre: RF4.1, RF4.2*

- **Given** a aplicação é aberta pela primeira vez
- **When** São Paulo é selecionada e os dados são exibidos
- **Then** o controle de unidade está visível e indica °C como unidade ativa
- **And** todas as temperaturas exibidas usam "°C"

#### AC-4.2 — Conversão de todas as temperaturas

*Cobre: RF4.3*

- **Given** os dados de referência exibidos em °C
- **When** o usuário alterna para °F
- **Then** o clima atual mostra 77 °F
- **And** as mínimas e máximas dos cinco dias correspondem às colunas °F da tabela de referência
- **And** nenhuma temperatura exibida mantém "°C"

#### AC-4.3 — Alternância preserva a cidade

*Cobre: RF4.4*

- **Given** São Paulo está selecionada e os dados estão exibidos
- **When** o usuário alterna a unidade
- **Then** nenhuma requisição de busca é feita
- **And** São Paulo continua em destaque como cidade selecionada

#### AC-4.4 — Controle operável por teclado

*Cobre: RF4.1, RNF2*

- **Given** os dados de referência exibidos em °C
- **When** o usuário foca o controle de unidade com Tab e pressiona Enter ou Espaço
- **Then** a unidade ativa passa a ser °F
- **And** o nome acessível do controle indica °F como unidade ativa

#### AC-4.5 — Unidade não persiste entre visitas

*Cobre: RF4.5, AS-8*

- **Given** o usuário alternou a unidade para °F
- **When** a página é recarregada
- **Then** a unidade ativa volta a ser °C

Premissa a confirmar em OQ-7 antes da aprovação.

#### AC-4.6 — Arredondamento e valores-limite

*Cobre: RF4.3, AS-15*

- **Given** o provedor retorna temperaturas de 22,4 °C, −0,4 °C, 0 °C e −40 °C
- **When** os valores são exibidos em °C e, depois, em °F
- **Then** a exibição corresponde à tabela abaixo, em qualquer posição (clima atual, mínima ou máxima)
- **And** nenhum valor é exibido como "−0"

| Valor do provedor | Exibição em °C | Exibição em °F |
| --- | --- | --- |
| 22,4 °C | 22 °C | 72 °F |
| −0,4 °C | 0 °C | 31 °F |
| 0 °C | 0 °C | 32 °F |
| −40 °C | −40 °C | −40 °F |

#### AC-4.7 — Ida e volta sem desvio

*Cobre: RF4.3*

- **Given** os dados de referência exibidos em °C
- **When** o usuário alterna para °F e depois de volta para °C
- **Then** todas as temperaturas são idênticas às exibidas antes da primeira alternância

#### AC-4.8 — Alternância durante o carregamento

*Cobre: RF4.3*

- **Given** uma cidade foi selecionada e a requisição de previsão ainda não respondeu
- **When** o usuário alterna para °F e, em seguida, os dados chegam
- **Then** todas as temperaturas aparecem em °F

### 4.6 RF5 — Comunicar estados da consulta

Histórias: US6, US7, US8.

#### AC-5.1 — Estado inicial

*Cobre: RF5.1*

- **Given** a aplicação é aberta sem nenhuma busca anterior
- **When** o carregamento da página termina
- **Then** a área principal exibe uma orientação para buscar uma cidade
- **And** não há indicador de carregamento, mensagem de falha nem dado meteorológico
- **And** nenhuma requisição ao provedor é feita

Válido enquanto OQ-8 não definir uma cidade sugerida.

#### AC-5.2 — Carregamento da busca

*Cobre: RF5.2*

- **Given** o provedor demora 2 s para responder à busca
- **When** o usuário digita "Recife" e para de digitar
- **Then** um indicador de carregamento da busca fica visível até a resposta
- **And** o campo de busca mantém o foco e continua aceitando digitação

#### AC-5.3 — Busca sem resultados

*Cobre: RF5.3*

- **Given** o provedor responde com sucesso e retorna uma lista vazia para "xyzxyzxyz"
- **When** a resposta chega
- **Then** uma mensagem informa que nenhuma cidade foi encontrada e sugere revisar a grafia
- **And** não há botão "Tentar novamente"
- **And** nenhuma requisição de previsão é feita

#### AC-5.4 — Falha na busca

*Cobre: RF5.4*

- **Given** a requisição de busca falha por erro de rede ou resposta HTTP fora da faixa 2xx, incluindo 429 (limite de uso)
- **When** o usuário digita "Recife" e para de digitar
- **Then** é exibida uma mensagem de falha com texto diferente da mensagem de AC-5.3
- **And** há uma ação "Tentar novamente"; para HTTP 429 com cabeçalho `Retry-After` válido, a ação fica desabilitada até o prazo informado
- **And** sem prazo válido, a ação fica disponível imediatamente e só executa nova requisição após acionamento do usuário
- **And** a mensagem não exibe código HTTP, detalhes técnicos nem texto do provedor em inglês

#### AC-5.5 — Tentar novamente

*Cobre: RF5.4, RF5.7*

- **Given** uma mensagem de falha está exibida para a busca "Recife" ou para a previsão de Recife
- **When** o usuário aciona "Tentar novamente"
- **Then** a mesma consulta é refeita, com o mesmo termo de busca ou a mesma cidade
- **And** o indicador de carregamento volta a ser exibido
- **And** se a nova tentativa tiver sucesso, a mensagem de falha desaparece e os dados são exibidos

#### AC-5.6 — Tempo limite

*Cobre: RF5.4, AS-7*

- **Given** o provedor não responde a uma requisição de busca ou de previsão
- **When** passam 10 s desde o início da requisição
- **Then** o indicador de carregamento desaparece
- **And** a mensagem de falha correspondente (AC-5.4 ou AC-5.10) é exibida com "Tentar novamente"
- **And** qualquer resposta da tentativa expirada é ignorada, mesmo que chegue antes de uma nova tentativa
- **And** se houver nova tentativa, somente a resposta dessa tentativa pode atualizar a interface

#### AC-5.7 — Previsão incompleta

*Cobre: RF5.5, RF3.5*

- **Given** o provedor retorna previsão para 29/10, 31/10, 01/11 e 02/11, sem dados para 30/10
- **When** a previsão é exibida
- **Then** os dados de 29/10, 31/10, 01/11 e 02/11 permanecem associados às respectivas datas
- **And** a posição de 30/10 exibe "indisponível", sem deslocar os dados de outros dias
- **And** a previsão mantém cinco posições, sem quebra de layout

#### AC-5.8 — Anúncio dos estados

*Cobre: RF5.6*

- **Given** um leitor de tela está ativo
- **When** o estado muda para carregando, sem resultados, falha, dados disponíveis ou dados parciais
- **Then** a mudança é anunciada por uma região de status (`role="status"` ou equivalente)
- **And** o foco do usuário não é movido
- **And** a mesma mudança não é anunciada repetidamente enquanto o estado não mudar

#### AC-5.9 — Carregamento da previsão

*Cobre: RF5.2*

- **Given** o provedor demora 2 s para responder à previsão
- **When** o usuário seleciona São Paulo
- **Then** um indicador de carregamento é exibido na área de clima
- **And** São Paulo já aparece em destaque como cidade selecionada
- **And** nenhum dado de uma cidade selecionada anteriormente é exibido como se fosse de São Paulo

#### AC-5.10 — Falha na previsão

*Cobre: RF5.4*

- **Given** a busca funcionou, mas a requisição de previsão falha por erro de rede ou resposta HTTP 4xx/5xx
- **When** o usuário seleciona São Paulo
- **Then** a área de clima exibe uma mensagem de falha com ação "Tentar novamente"
- **And** para HTTP 429 com cabeçalho `Retry-After` válido, a ação fica desabilitada até o prazo informado
- **And** sem prazo válido para HTTP 429, a ação fica disponível imediatamente e só executa nova requisição após acionamento do usuário
- **And** São Paulo continua em destaque como cidade selecionada
- **And** a mensagem não exibe código HTTP, detalhes técnicos nem texto do provedor em inglês

#### AC-5.11 — Tentativas repetidas

*Cobre: RF5.4, RF5.8*

- **Given** uma mensagem de falha está exibida
- **When** o usuário aciona "Tentar novamente" três vezes seguidas, antes que a primeira nova tentativa responda
- **Then** há no máximo uma requisição em andamento para essa consulta
- **And** o controle "Tentar novamente" fica indisponível até a tentativa terminar
- **And** nenhuma tentativa adicional é enfileirada

#### AC-5.12 — Campo ausente na resposta

*Cobre: RF5.5*

- **Given** a resposta não traz a temperatura atual e traz como `null` a máxima de 30/10, mas contém os demais dados de referência válidos
- **When** os dados são exibidos
- **Then** a temperatura atual aparece como "indisponível"
- **And** a máxima de 30/10 aparece como "indisponível", sem afetar a mínima ou os outros dias
- **And** a descrição atual, o horário de referência e os demais dados válidos são exibidos normalmente
- **And** nenhum valor padrão, como zero, é usado para substituir campo ausente, nulo ou não numérico

#### AC-5.13 — Resposta ilegível

*Cobre: RF5.4, RF5.5*

- **Given** o provedor responde com conteúdo que não pode ser interpretado (ex.: corpo vazio ou formato inválido)
- **When** a resposta chega
- **Then** é exibida a mensagem de falha correspondente (AC-5.4 para busca, AC-5.10 para previsão)
- **And** a tela nunca fica em branco

#### AC-5.14 — Seção atual ausente, previsão válida

*Cobre: RF5.5*

- **Given** a resposta contém previsão válida para os cinco dias, mas não contém dados utilizáveis de clima atual
- **When** os dados são exibidos
- **Then** a área de clima atual informa "indisponível"
- **And** a previsão dos cinco dias continua visível e associada às datas corretas
- **And** a ausência do clima atual não é apresentada como falha de toda a consulta

#### AC-5.15 — Sem repetição automática

*Cobre: RF5.7*

- **Given** uma busca ou previsão falhou e a mensagem de falha está visível
- **When** o usuário não aciona "Tentar novamente" durante 10 s
- **Then** nenhuma nova requisição é enviada
- **And** a mensagem de falha e a ação de retry permanecem disponíveis

#### AC-5.16 — Resposta sem dados utilizáveis

*Cobre: RF5.4, RF5.5*

- **Given** a resposta é JSON válido, mas não contém nenhum campo utilizável de clima atual nem de previsão
- **When** a resposta é processada
- **Then** a área meteorológica exibe estado de falha com ação "Tentar novamente"
- **And** nenhum valor padrão ou dado de uma consulta anterior é exibido

### 4.7 RF6 — Atribuição da fonte de dados

Sem história própria (requisito de licença).

#### AC-6.1 — Crédito à fonte

*Cobre: RF6.1*

- **Given** a aplicação está carregada
- **When** o usuário percorre a página até o fim
- **Then** há um link cujo nome acessível contém "Open-Meteo" e que aponta para o site do provedor

O texto exato e outras exigências de licença dependem de OQ-9.

#### AC-6.2 — Crédito em todos os estados

*Cobre: RF6.1*

- **Given** a aplicação está em um destes estados: inicial, carregando, sem resultados, falha ou dados exibidos
- **When** o usuário percorre a página até o fim
- **Then** o crédito de AC-6.1 está presente

### 4.8 Critérios transversais — teclado e leitor de tela (RNF2)

Aplicados a RF1–RF5 (US7).

#### AC-7.1 — Seleção de resultado por teclado

*Cobre: RF1.3, RNF2*

- **Given** o foco está no campo de busca e a lista exibe pelo menos dois resultados
- **When** o usuário pressiona ↓ duas vezes e depois Enter
- **Then** o segundo resultado é selecionado, com o mesmo efeito de AC-1.3

#### AC-7.2 — Ordem e visibilidade do foco

*Cobre: RF1, RF4, RF5, RNF2*

- **Given** a aplicação está em qualquer estado definido em RF5
- **When** o usuário navega com Tab a partir do início da página
- **Then** busca, controle de unidade (quando visível), retry (quando disponível) e atribuição recebem foco nessa ordem
- **And** controles ocultos ou indisponíveis não recebem foco
- **And** cada elemento focado exibe um indicador de foco visível
- **And** os resultados da busca não entram na sequência do Tab; são percorridos com ↑/↓ (AC-7.1)

#### AC-7.3 — Nomes acessíveis

*Cobre: RF1, RF2, RF3, RF4, RNF2*

- **Given** os dados de referência exibidos
- **When** um leitor de tela percorre a página
- **Then** o campo de busca, a lista de resultados, o controle de unidade e a área do clima atual têm nomes acessíveis que descrevem sua função e estado
- **And** cada dia da previsão é anunciado com data, mínima, máxima e condição (ex.: "Sexta-feira, 30 de outubro, mínima 17 graus, máxima 26 graus, chuva fraca")

#### AC-7.4 — Contraste no tema escuro

*Cobre: RNF2*

- **Given** a aplicação em qualquer estado (inicial, carregando, sem resultados, falha ou dados exibidos)
- **When** o contraste é medido com ferramenta automatizada
- **Then** texto normal tem contraste de pelo menos 4,5:1
- **And** texto grande, ícones informativos e bordas de controles têm contraste de pelo menos 3:1

#### AC-7.5 — Fechar lista com Esc

*Cobre: RF1, RNF2*

- **Given** o foco está no campo de busca e a lista de resultados está aberta
- **When** o usuário pressiona Esc
- **Then** a lista é fechada
- **And** o foco permanece no campo e o texto digitado é mantido

### 4.9 Critérios transversais — responsividade (RNF1)

Aplicados a RF1–RF5 (US8).

#### AC-8.1 — Uso no celular

*Cobre: RF1, RF2, RF3, RNF1*

- **Given** viewport de 360 × 640 px
- **When** o usuário busca e seleciona São Paulo e percorre os dados de referência
- **Then** a página não tem rolagem horizontal
- **And** nenhum dado essencial é truncado; nomes e descrições completos permanecem visíveis ou disponíveis no nome acessível do elemento

#### AC-8.2 — Telas largas

*Cobre: RF3, RNF1*

- **Given** viewport de 1280 × 800 px
- **When** os dados de referência são exibidos
- **Then** os cinco dias da previsão ficam visíveis ao mesmo tempo, sem rolagem
- **And** nenhum conteúdo é cortado ou causa rolagem horizontal

#### AC-8.3 — Área de toque

*Cobre: RF1, RF4, RF5, RNF1*

- **Given** qualquer viewport entre 360 e 1920 px de largura
- **When** os controles interativos são medidos
- **Then** cada controle tem área de toque mínima de 44 × 44 px, exceto links dentro de texto corrido

#### AC-8.4 — Zoom de 200 %

*Cobre: RF1, RF2, RF3, RNF1, RNF2*

- **Given** viewport de 1280 px com zoom do navegador em 200 %
- **When** os dados de referência são exibidos
- **Then** todas as informações e controles continuam acessíveis e operáveis sem rolagem horizontal da página
- **And** a rolagem vertical da página permanece permitida

### 4.10 Rastreabilidade

Cobertura por sub-requisito:

| Sub-requisito | Critérios |
| --- | --- |
| RF1.1 | AC-1.1, AC-1.5, AC-1.7, AC-1.9, AC-1.10, AC-1.13 |
| RF1.2 | AC-1.1, AC-1.2, AC-1.5, AC-1.8, AC-1.13 |
| RF1.3 | AC-1.3, AC-1.11, AC-7.1 |
| RF1.4 | AC-1.3, AC-1.11 |
| RF1.5 | AC-1.4, AC-1.6, AC-1.9 |
| RF1.6 | AC-1.12 |
| RF2.1 | AC-2.1, AC-2.3 |
| RF2.2 | AC-2.2 |
| RF2.3 | — (depende de OQ-3) |
| RF3.1 | AC-3.1, AC-3.2, AC-3.4, AC-3.5 |
| RF3.2 | AC-3.3, AC-3.7 |
| RF3.3 | AC-3.2, AC-3.4 |
| RF3.4 | AC-3.6 |
| RF3.5 | AC-3.2, AC-5.7 |
| RF4.1 | AC-4.1, AC-4.4 |
| RF4.2 | AC-4.1 |
| RF4.3 | AC-4.2, AC-4.6, AC-4.7, AC-4.8 |
| RF4.4 | AC-4.3 |
| RF4.5 | AC-4.5 |
| RF5.1 | AC-5.1 |
| RF5.2 | AC-5.2, AC-5.9 |
| RF5.3 | AC-5.3 |
| RF5.4 | AC-5.4, AC-5.5, AC-5.6, AC-5.10, AC-5.11, AC-5.13, AC-5.16 |
| RF5.5 | AC-5.7, AC-5.12, AC-5.13, AC-5.14, AC-5.16 |
| RF5.6 | AC-5.8 |
| RF5.7 | AC-5.5, AC-5.15 |
| RF5.8 | AC-5.11 |
| RF6.1 | AC-6.1, AC-6.2 |

Cobertura por requisito e história:

| RF | User Stories | Critérios |
| --- | --- | --- |
| RF1 | US1, US7, US8 | AC-1.1 – AC-1.13, AC-7.1, AC-7.2, AC-7.3, AC-7.5, AC-8.1, AC-8.3, AC-8.4 |
| RF2 | US2, US7, US8 | AC-2.1 – AC-2.3, AC-7.3, AC-8.1, AC-8.4 |
| RF3 | US3, US4, US7, US8 | AC-3.1 – AC-3.7, AC-5.7, AC-7.3, AC-8.1, AC-8.2, AC-8.4 |
| RF4 | US5, US7, US8 | AC-4.1 – AC-4.8, AC-7.2, AC-7.3, AC-8.3 |
| RF5 | US6, US7, US8 | AC-5.1 – AC-5.16, AC-7.2, AC-8.3 |
| RF6 | — | AC-6.1, AC-6.2 |

Cobertura por história:

- **Dona:** cada AC pertence a exatamente uma história (coluna "ACs próprios"). A tarefa de implementação e o teste automatizado do AC são criados uma única vez, a partir da dona. O prefixo do ID (AC-1.x, AC-2.x…) continua indicando o RF.
- **Compartilhados:** ACs de outra história que também precisam passar para esta ser aceita. Não geram tarefa nem teste duplicado.
- **Ordem:** US2–US8 partem de uma cidade selecionada (AC-1.3) e, por isso, dependem de US1. US7 e US8 são transversais: seus critérios entram como restrições das tarefas de US1–US6, não como etapa final.
- **OQs pendentes:** decisões que podem alterar os ACs ou a verificação dos RNFs da história. OQ-2 (plataforma) e OQ-12 (hospedagem e logs) afetam o release inteiro e não se repetem por história. Ao resolver uma OQ, atualizar os ACs afetados e estas tabelas.

| US | Persona | RFs | ACs próprios | ACs compartilhados | RNFs relevantes | OQs pendentes |
| --- | --- | --- | --- | --- | --- | --- |
| US1 | P1 | RF1 | AC-1.1 – AC-1.13 | — | RNF4, RNF5, RNF7, RNF9 | OQ-1, OQ-7, OQ-11, OQ-13 |
| US2 | P2 | RF2 | AC-2.1 – AC-2.3 | AC-5.12, AC-5.14 | RNF3, RNF4, RNF5, RNF9 | OQ-1, OQ-3, OQ-6, OQ-11, OQ-18 |
| US3 | P1 | RF3 | AC-3.1, AC-3.2, AC-3.4, AC-3.6 | AC-3.3, AC-5.7, AC-5.14 | RNF3, RNF4, RNF5, RNF9 | OQ-1, OQ-4, OQ-6, OQ-11 |
| US4 | P3 | RF3 | AC-3.3, AC-3.7 | AC-3.1, AC-5.7, AC-5.12, AC-8.2 | RNF1, RNF3, RNF4, RNF5, RNF9 | OQ-1, OQ-3, OQ-11 |
| US5 | P1 | RF4 | AC-4.1 – AC-4.3, AC-4.5 – AC-4.8 | — | RNF7 | OQ-3, OQ-7, OQ-16 |
| US6 | P2 | RF5 | AC-5.1 – AC-5.7, AC-5.9 – AC-5.16 | — | RNF3, RNF5, RNF9 | OQ-8, OQ-11, OQ-13, OQ-17 |
| US7 | P2 | RF1, RF2, RF3, RF4, RF5 | AC-4.4, AC-5.8, AC-7.1 – AC-7.5 | AC-2.1, AC-3.3, AC-8.4 | RNF1, RNF2, RNF9 | OQ-10, OQ-14 |
| US8 | P2 | RF1, RF2, RF3, RF4, RF5 | AC-3.5, AC-8.1 – AC-8.4 | — | RNF1, RNF2, RNF5 | OQ-11 |
| — | — | RF6 | AC-6.1, AC-6.2 | — | RNF9 | OQ-9 |

RF6 não tem história (requisito de licença), mas seus ACs bloqueiam o release. RF2.3 não tem AC até OQ-3 ser respondida.

Cobertura por RNF:

| RNF | Histórias | Evidência | Verificação | OQs pendentes |
| --- | --- | --- | --- | --- |
| RNF1 | US8 (central), US4, US7 | AC-3.5, AC-8.1 – AC-8.4 | Automatizada nos viewports de RNF1 | — |
| RNF2 | US7 (central), US8 | AC-4.4, AC-5.8, AC-7.1 – AC-7.5, AC-8.4 | Automatizada com axe + revisão manual de teclado, foco e leitor de tela | OQ-10, OQ-14 |
| RNF3 | US6 (central), US2, US3, US4 | AC-5.4 – AC-5.7, AC-5.10 – AC-5.16 | Automatizada com respostas simuladas | OQ-13, OQ-17 |
| RNF4 | US1, US2, US3, US4 | Fluxo busca → seleção → leitura dos dados | Teste moderado com 5 participantes | OQ-1 |
| RNF5 | US1, US2, US3, US4, US6, US8 | Metas de RNF5 | Medição p75 em 4G simulada, separada da suíte funcional | OQ-11 |
| RNF6 | Release (todas) | Suíte de fumaça dos fluxos principais | Execução em cada navegador da matriz, incluindo Safari iOS e Chrome Android | OQ-11 |
| RNF7 | US1, US5 | AC-4.5 + inspeção de rede e armazenamento | Inspeção | OQ-7, OQ-12 |
| RNF8 | Release (nenhuma) | Meta de disponibilidade | Monitoramento após o release | OQ-12 |
| RNF9 | US1, US2, US3, US4, US6, US7, RF6 | AC-2.1, AC-2.3, AC-3.3, AC-3.7, AC-5.3, AC-5.4, AC-5.10 + catálogo de códigos (4.1) | Automatizada + revisão dos textos visíveis | OQ-9 (texto do crédito) |

---

## 5. Non-Functional Requirements

| ID | Categoria | Requisito | Critério verificável | Status |
| --- | --- | --- | --- | --- |
| RNF1 | Responsividade | Interface utilizável de 360 px a 1920 px de largura. | Em 360, 768, 1280 e 1920 px: sem overflow horizontal e com controles essenciais alcançáveis; AC-8.1–8.4 verificam os casos detalhados. | Confirmado |
| RNF2 | Acessibilidade | Conformidade com WCAG 2.1 nível AA nos fluxos principais. | AC-7.1 – AC-7.5; axe sem violações críticas ou sérias e revisão manual de teclado, foco, mensagens e nomes acessíveis em cada estado. | Nível AA é **premissa** (OQ-10) |
| RNF3 | Resiliência | Nenhuma falha de rede/provedor deixa a tela sem explicação ou sem ação. | AC-5.4 – AC-5.7, AC-5.10 – AC-5.16. | Confirmado |
| RNF4 | Usabilidade | Fluxo busca → seleção → clima atual e previsão sem instruções externas. | Em teste moderado com 5 participantes distribuídos entre P1–P3, pelo menos 4 concluem busca, seleção e leitura dos dados sem ajuda do moderador. | Protocolo proposto; confirmar em OQ-1 |
| RNF5 | Performance | Feedback e dados aparecem dentro das metas em conexão 4G simulada. | Indicador aparece em até 100 ms após o início da requisição; p75 de 30 execuções válidas: resultados de busca em até 2 s após o envio e previsão em até 3 s após seleção. Medir até a interface renderizar o estado final. | Metas **propostas** (OQ-11) |
| RNF6 | Compatibilidade | Fluxos principais funcionam nas duas versões estáveis mais recentes de Chrome, Firefox, Safari e Edge no momento do release. | Suíte de fumaça executada em cada navegador suportado; Safari em iOS e Chrome em Android incluídos na matriz mobile. | Matriz **proposta** (OQ-11) |
| RNF7 | Privacidade | O cliente não mantém cidade, unidade, localização ou histórico após recarregar e não executa analytics na v1. O termo de busca é enviado à geocodificação e coordenadas à previsão do provedor. | Inspeção de rede e armazenamento: sem analytics, sem armazenamento persistente no navegador e sem destinos de dados além do provedor e da hospedagem necessária para servir a aplicação. | Política de logs de hospedagem pendente (OQ-12) |
| RNF8 | Disponibilidade | Meta mensal de disponibilidade da aplicação hospedada, medida separadamente do provedor. | Valor a definir após escolha de hospedagem. | **Aberto** (OQ-12) |
| RNF9 | Idioma | Toda string visível ao usuário em pt-BR, inclusive descrições de condição vindas de códigos do provedor. | Nenhuma string em inglês visível nos fluxos principais; datas em formato pt-BR. | Confirmado (D5) |

---

## 6. Edge Cases

| ID | Cenário | Comportamento esperado | ACs relacionados |
| --- | --- | --- | --- |
| EC-1 | Termo de busca vazio ou só espaços | Nenhuma requisição; lista fechada; sem erro. | AC-1.4, AC-1.6 |
| EC-2 | Termo abaixo do mínimo de caracteres | Nenhuma requisição; sem erro. | AC-1.4 |
| EC-3 | Termo com acentos, cedilha, maiúsculas/minúsculas, hífen ou apóstrofo | O termo é enviado como texto codificado; correspondências são exibidas sem alterar o nome retornado pelo provedor. | AC-1.7, AC-1.10, AC-1.13 |
| EC-4 | Termo muito longo ou com caracteres especiais | O limite de tamanho e o tratamento de entradas acima dele dependem de OQ-13; caracteres são tratados como texto, nunca como marcação. | OQ-13 |
| EC-5 | Resposta válida de geocodificação sem resultados | Mensagem "nenhuma cidade encontrada"; sem botão de retry e sem consulta de previsão. | AC-5.3 |
| EC-6 | Cidades homônimas | Itens diferenciados por região/estado e país. | AC-1.2 |
| EC-7 | Resultado sem região/estado ou sem país | Item mostra apenas as informações disponíveis, sem placeholder vazio ou "undefined". | AC-1.8 |
| EC-8 | Respostas de busca fora de ordem (digitação rápida) | Exibe só a resposta do último termo. | AC-1.5 |
| EC-9 | Falha de rede (offline) | Estado de falha com retry; não confundir com "sem resultados". | AC-5.4, AC-5.10 |
| EC-10 | Timeout do provedor | Tratado como falha após o limite (AS-7). | AC-5.6 |
| EC-11 | Provedor retorna erro HTTP (4xx/5xx) ou limite de uso excedido | Estado de falha com retry manual; respeita `Retry-After` válido para 429; mensagem não expõe detalhes técnicos. | AC-5.4, AC-5.10 |
| EC-12 | Resposta ilegível, campo ausente, nulo ou inválido | Corpo ilegível ou sem dados utilizáveis é falha; campo isolado ausente/inválido é "indisponível" sem substituir por zero; seção válida permanece visível. | AC-2.3, AC-5.12–5.14, AC-5.16 |
| EC-13 | Previsão com datas ausentes ou fora de ordem | Cada dado permanece associado à data local retornada; lacunas ficam "indisponível", sem deslocar outros dias. | AC-3.2, AC-5.7 |
| EC-14 | Código de condição desconhecido em clima atual ou previsão | "Condição indisponível" e ícone neutro; outros dados válidos permanecem disponíveis. | AC-2.3, AC-3.7 |
| EC-15 | Cidade em fuso horário distante do dispositivo | "Hoje" e horário de referência seguem o fuso da cidade. | AC-2.2, AC-3.4 |
| EC-16 | Consulta próxima da meia-noite na cidade | A lista de dias reflete a data local no momento da resposta; sem dia duplicado. | AC-3.2 |
| EC-17 | Temperaturas negativas, zero e decimais | Conversão e arredondamento corretos nas duas unidades (ex.: −40 °C = −40 °F; 0 °C = 32 °F). | AC-4.6 |
| EC-18 | Troca de unidade durante carregamento | Ao chegar, os dados já aparecem na unidade ativa. | AC-4.8 |
| EC-19 | Troca de cidade durante carregamento da anterior | Resposta da cidade anterior é descartada; exibe só a nova. | AC-1.11 |
| EC-20 | Retry acionado durante uma tentativa em andamento | Controle indisponível; nenhum pedido adicional é enviado ou enfileirado. | AC-5.11 |
| EC-21 | JavaScript desabilitado | Funcionalidade indisponível; suporte sem JavaScript não faz parte da v1. | — |
| EC-22 | Zoom do navegador a 200 % | Conteúdo continua legível e operável sem rolagem horizontal. | AC-8.4 |

---

## 7. Assumptions

Premissas adotadas para tornar os critérios verificáveis. Cada uma pode ser revertida pela resposta à Open Question correspondente.

| ID | Premissa | Origem / OQ |
| --- | --- | --- |
| AS-1 | A aplicação é **web responsiva** (não PWA instalável nem app nativo). | A3 → OQ-2 |
| AS-2 | O usuário consulta **uma cidade por vez**; não há lista ou comparação lado a lado. | A4 → OQ-5 |
| AS-3 | Conteúdo mínimo: clima atual = temperatura + condição + horário; previsão = data + mín + máx + condição. Campos extras dependem de OQ-3. | A5, A6 → OQ-3, OQ-4 |
| AS-4 | "Hoje" e horários de referência seguem o **fuso horário da cidade consultada**. | A7 → OQ-6 |
| AS-5 | Apenas temperaturas alternam entre °C/°F; se outras grandezas forem adicionadas (vento, chuva), usam unidades métricas fixas até decisão. | A8 → OQ-3 |
| AS-6 | A busca dispara a partir de **2 caracteres não brancos**, após **300 ms** sem digitação; espaços nas extremidades são removidos do termo enviado. | A10 → OQ-13 |
| AS-7 | Cada requisição de busca ou previsão expira **10 segundos após o envio**; resposta tardia não substitui estado de tentativa mais recente. | A11 → OQ-13 |
| AS-8 | Nenhum dado é guardado no navegador na v1 (cidade, unidade ou cache). | D4, A9 → OQ-7 |
| AS-9 | Não há modo offline; a aplicação exige conexão para qualquer consulta. | Pergunta 8 → OQ-7 |
| AS-10 | Tema visual escuro ("dark glassmorphism") é a diretriz atual, sujeita a guia de marca. | A18 → OQ-14 |
| AS-11 | O provedor aceita parâmetro de idioma para nomes de cidades; descrições de condição são traduzidas pela aplicação a partir dos códigos do provedor. | A21 |
| AS-12 | Não há telemetria nem analytics na v1. | A22 → OQ-1 |
| AS-13 | Celsius e Fahrenheit são as únicas unidades de temperatura necessárias. | Discovery |
| AS-14 | O público-alvo é brasileiro, mas pode consultar cidades de qualquer país. | D5 |
| AS-15 | Temperaturas são exibidas como inteiros, arredondadas para o inteiro mais próximo; a conversão para °F parte do valor recebido do provedor, não do valor já arredondado; zero negativo é exibido como 0. | AC-4.6 → OQ-16 |

---

## 8. Risks

Riscos prioritários da v1 (RT = técnico, RP = produto); a lista completa do discovery está em [`discovery.md`](./discovery.md#riscos).

| ID | Risco | Prob. | Impacto | Mitigação na spec |
| --- | --- | --- | --- | --- |
| RT1 | Provedor indisponível ou com limite de uso | Média | Alto | RF5.4, AC-5.4–5.6, AC-5.10–5.11, AC-5.15, OQ-17; AS-6 e AC-1.9 reduzem o volume de requisições. |
| RT2 | Licença do provedor incompatível com o uso pretendido | Média | Alto | **OQ-9 bloqueante**; RF6 prevê atribuição. |
| RT4 | Resposta do provedor fora do contrato | Baixa | Alto | RF5.5, AC-5.12–5.16, AC-1.10 [contrato], EC-12, EC-13, EC-14. |
| RT5 | Datas/fuso incorretos | Média | Médio | AS-4, AC-2.2, AC-3.4, EC-15, EC-16. |
| RT6 | Conversão de unidade incorreta | Baixa | Alto | AC-4.2, AC-4.6, AC-4.7, EC-17. |
| RT7 | Corrida entre respostas de busca | Média | Médio | AC-1.5, AC-1.11, EC-8, EC-19. |
| RT8 | Textos do provedor em outro idioma | Média | Baixo | RNF9, AS-11. |
| RT9 | Performance ruim em redes/aparelhos modestos | Média | Médio | RNF5 (metas propostas). |
| RT10 | Incompatibilidade entre navegadores | Baixa | Médio | RNF6. |
| RP1 | Usuário escolhe cidade homônima errada | Alta | Médio | RF1.2, RF1.4, AC-1.2, AC-1.8, EC-6. |
| RP3 | Escopo crescente | Alta | Alto | Seção 9 (Out of Scope) e MoSCoW em RF. |
| RP4 | Sem métrica de sucesso / personas não validadas | Média | Médio | OQ-1; RNF4 propõe teste com usuários. |
| RP6 | Acessibilidade insuficiente no tema escuro | Média | Alto | RNF2, AC-7.4, AC-8.4, EC-22. |
| RP7 | Tela inicial vazia e pouco orientadora | Média | Médio | RF5.1, AC-5.1; OQ-8. |
| RP8 | Não conformidade de privacidade/LGPD | Baixa | Alto | RNF7, AS-8, AS-12. |
| RP9 | Expectativa de offline / tempo real não atendida | Média | Médio | RF2.2 (horário de referência), AS-9. |

---

## 9. Out of Scope

Explicitamente **fora da v1**. Qualquer item abaixo exige nova rodada de spec.

- Autenticação, contas de usuário e qualquer persistência em servidor (D4).
- Geolocalização automática ou cidade inicial baseada em IP (D6).
- Favoritos, histórico ou memorização da última cidade (pendente OQ-7; não implementar até decisão).
- Modo offline, cache de dados ou PWA instalável (AS-1, AS-9).
- Previsão horária, previsão além de cinco dias e dados históricos.
- Comparação simultânea de várias cidades (AS-2).
- Alertas meteorológicos, notificações push, mapas, radar, qualidade do ar, índice UV como destaque.
- Compartilhamento, exportação ou captura de tela da previsão.
- Internacionalização além de pt-BR e unidades além de °C/°F (D5, AS-13).
- Telemetria, analytics ou monitoramento de uso no cliente (AS-12).
- Backend próprio, proxy ou cache de servidor para o provedor.
- Aplicativo nativo (iOS/Android) ou distribuição em lojas.

---

## 10. Open Questions

Itens que **não foram decididos** e não devem ser adivinhados. Premissas usadas nos critérios devem ser aceitas formalmente antes da aprovação; "Bloqueante" indica que a decisão também impede a passagem para plano ou release.

| ID | Pergunta | Origem | Premissa atual | Bloqueante? | Responsável sugerido |
| --- | --- | --- | --- | --- | --- |
| OQ-1 | Qual o objetivo de negócio e a métrica de sucesso da v1? Haverá medição de uso? | A1, A22 | AS-12 (sem telemetria) | Não | Produto |
| OQ-2 | A entrega é web responsiva, PWA ou app nativo? | A3 | AS-1 (web responsiva) | **Sim** | Produto |
| OQ-3 | Há necessidade de campos meteorológicos além do mínimo definido em RF2.1 e RF3.2? Se sim, quais e com quais unidades? | A5, A8, pergunta 9 | AS-3, AS-5 (sem campos extras na v1) | Não, salvo inclusão de novos campos | Produto + UX |
| OQ-4 | Confirmar que a previsão da v1 é diária e que a previsão horária permanece fora de escopo. | A6 | RF3.4, AC-3.6 | **Sim** | Produto |
| OQ-5 | O usuário vê uma cidade por vez ou compara várias? | A4 | AS-2 (uma) | Não | Produto |
| OQ-6 | Confirmar que "Hoje" e o horário da leitura seguem o fuso da cidade, não o fuso do dispositivo. | A7 | AS-4, AC-2.2, AC-3.4 | **Sim** | Produto |
| OQ-7 | Confirmar a regra da v1: não guardar cidade, unidade ou dados recentes no navegador; qualquer persistência futura exige finalidade, aviso e consentimento adequados. | A9, perguntas 7 e 8 | AS-8, AS-9 (nada guardado) | Não | Produto + Jurídico |
| OQ-8 | O que a tela inicial mostra antes da primeira busca (texto, exemplos, cidade sugerida)? | A12 | RF5.1 (orientação textual) | Não | UX |
| OQ-9 | O uso é comercial? Quais termos, limites e atribuição do Open-Meteo se aplicam? Precisa de plano pago ou outro provedor? | A13, A14, RT2 | RF6 (atribuição genérica) | **Sim** | Jurídico + Produto |
| OQ-10 | A meta de acessibilidade é WCAG 2.1 AA? Há exigência legal ou contratual? | A15 | RNF2 (AA) | **Sim** | Produto + Jurídico |
| OQ-11 | Aprovar metas de performance, protocolo de medição e matriz de navegadores proposta em RNF5–RNF6. | A16 | RNF5, RNF6 | **Sim** | Produto + Engenharia |
| OQ-12 | Definir hospedagem, meta de disponibilidade e política de logs operacionais (dados retidos e prazo). | A17, RNF7–RNF8 | RNF8 (sem meta); sem analytics client-side | **Sim para release** | Engenharia + Operações + Jurídico |
| OQ-13 | Aprovar os valores já adotados (2 caracteres, 300 ms, timeout de 10 s) e definir limite de resultados, tamanho máximo do termo, tolerância a erros de grafia e apresentação de homônimas indistinguíveis. | A10, A11, pergunta 4 | AS-6, AS-7 | **Sim** | UX + Engenharia |
| OQ-14 | Existe guia de marca ou protótipo? O tema escuro é requisito? | A18 | AS-10 | Não | Produto + Design |
| OQ-15 | Qual o prazo-alvo e o que é obrigatório vs. desejável se for preciso cortar escopo? | A20 | MoSCoW na seção 2 | Não | Produto |
| OQ-16 | Confirmar que temperaturas serão exibidas como inteiros, arredondadas conforme AS-15. | Critérios de aceite (AC-4.6) | AS-15 | **Sim** | Produto + UX |
| OQ-17 | Confirmar a regra para HTTP 429: respeitar `Retry-After` válido e só então habilitar retry; sem prazo válido, permitir nova tentativa manual imediata. | RT1, EC-11 | AC-5.4, AC-5.10 | **Sim** | Produto + Engenharia |
| OQ-18 | Qual idade máxima de uma leitura ainda pode ser apresentada como clima "atual" e qual aviso deve acompanhar dados mais antigos? | RP9, RF2.2 | Exibir horário de leitura; limite de idade não definido | **Sim** | Produto + Engenharia |

### Critério de saída desta spec

A especificação pode ser aprovada e seguir para o plano técnico quando:

1. OQ-2, OQ-4, OQ-6, OQ-9, OQ-10, OQ-11, OQ-12, OQ-13, OQ-16, OQ-17 e OQ-18 estiverem respondidas;
2. as premissas não bloqueantes relevantes (incluindo OQ-3 e OQ-7) forem formalmente aceitas ou os requisitos afetados forem atualizados;
3. os critérios de aceite afetados pelas decisões forem revisados e a rastreabilidade atualizada;
4. o status da versão passar de "rascunho" para "aprovada".
