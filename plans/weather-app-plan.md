# Weather App — Plano Técnico

| Campo | Valor |
| --- | --- |
| Versão | 0.1 (rascunho) |
| Fonte da verdade | [`../specs/weather-app-spec.md`](../specs/weather-app-spec.md), versão 0.2 |
| Status | Plano provisório; resolver os bloqueios da spec antes de aprovar tarefas ou liberar a aplicação |

Este plano define arquitetura, decisões e contratos de dados, não a implementação final. Requisitos e critérios da spec prevalecem; qualquer mudança aprovada deve atualizar a spec e este plano antes da implementação.

## Architecture

Aplicação web client-side, sem backend próprio. A UI React consome uma camada de serviços que encapsula Open-Meteo e converte as respostas externas para o modelo interno. Componentes não conhecem URLs, parâmetros nem o formato bruto do provedor.

```text
React UI
  App + componentes de apresentação
           │ ações e estados observáveis
           ▼
       useWeather
  busca, seleção, unidade,
  loading, retry e cancelamento
           │ contratos de domínio
           ▼
      weatherService
  fetch + validação + normalização
      ┌────┴────┐
      ▼         ▼
 Geocoding   Forecast API
  Open-Meteo  Open-Meteo
```

- **Apresentação:** componentes focados em formulário, resultados, clima atual, previsão, unidade e estados de consulta.
- **Orquestração:** um hook mantém estado local da tela e coordena as operações independentes de geocodificação e previsão.
- **Dados:** serviços sem dependência de React fazem requisições, validam respostas e traduzem DTOs externos para tipos de domínio.
- **Funções puras:** conversão de temperatura, formatação pt-BR e catálogo de condições WMO ficam fora do componente.
- **Sem persistência:** não usar backend, banco, `localStorage`, `sessionStorage`, cache de aplicação ou analytics na v1 (D4, RNF7, RNF8, AS-8, AS-12).

## Tech Stack

| Decisão | Escolha | Justificativa / rastreabilidade |
| --- | --- | --- |
| Linguagem | TypeScript strict | Tipos para contratos internos e respostas parciais; stack do projeto. |
| UI | React 19 | Componentes funcionais e hooks, conforme stack e convenções do repositório. |
| Build e desenvolvimento | Vite | Ferramenta existente no projeto; aplicação web responsiva (AS-1). |
| Estilo | Tailwind CSS | Stack e instruções existentes; tema escuro é premissa sujeita a OQ-14. |
| Dados | `fetch` nativo | Suficiente para dois endpoints; suporta `AbortSignal` sem adicionar cliente HTTP. |
| Estado remoto | Hook React local; sem biblioteca de cache | Uma cidade por vez (AS-2), sem cache nem persistência (RNF7, AS-8); evita estado e dependências desnecessários. |
| Testes unitários | Vitest + Testing Library | Ferramentas configuradas no repositório; testar comportamento e funções puras. |
| Testes E2E | Playwright | Ferramenta configurada; interceptar rede para previsibilidade e cobrir viewport mobile. |
| Lint e formatação | Biome | Ferramenta e scripts já configurados. |
| Gerenciador | pnpm | Gerenciador suportado pelo repositório. |

Não introduzir Redux, TanStack Query, roteador, backend, cliente HTTP ou biblioteca de datas sem necessidade aprovada. Para acessibilidade automatizada, a spec exige axe; a dependência ainda não consta no manifesto atual. Confirmar no planejamento de tarefas a inclusão de uma integração compatível com Playwright, sem substituir a revisão manual.

## Project Structure

Estrutura proposta, alinhada ao README e às convenções existentes:

```text
src/
├── components/
│   ├── states/                 # Estados visuais de loading, vazio e erro
│   ├── SearchBar.tsx           # Campo, lista e seleção de cidades
│   ├── CurrentWeather.tsx      # Clima atual
│   ├── ForecastList.tsx        # Previsão de cinco dias
│   ├── ForecastCard.tsx        # Um dia da previsão
│   └── UnitToggle.tsx          # Controle °C/°F
├── hooks/
│   └── useWeather.ts           # Estado da tela e coordenação das consultas
├── services/
│   └── weatherService.ts       # Endpoints, parsing e normalização Open-Meteo
├── lib/
│   ├── temperature.ts          # Conversão e arredondamento
│   ├── format.ts               # Datas, horários e números em pt-BR
│   └── weatherCodes.ts         # Catálogo WMO pt-BR e fallback
├── types/
│   └── weather.ts              # Tipos compartilhados de domínio e serviço
└── App.tsx                     # Composição da tela

tests/
├── unit/                       # Componentes, hook, serviço e funções puras
└── e2e/                        # Fluxos de usuário com rede interceptada
```

Separar arquivos adicionais apenas quando houver uma responsabilidade real; não criar camada genérica de repositórios ou abstração de cliente HTTP para dois endpoints.

## Data Model

Tipos de domínio propostos. São contratos, não código final. Usar `null` quando o provedor não fornecer valor utilizável; não substituir ausência por zero ou texto localizado no modelo.

```ts
type Unit = "celsius" | "fahrenheit";
type LocalDate = string; // ISO local YYYY-MM-DD, sem conversão pelo fuso do dispositivo
type LocalDateTime = string; // Hora de leitura retornada no fuso pedido à API
type WeatherIconKey =
  | "clear"
  | "partly-cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "rain-showers"
  | "snow-showers"
  | "thunderstorm"
  | "thunderstorm-hail"
  | "unknown";

interface City {
  id: number;
  name: string;
  admin1: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  observedAt: LocalDateTime | null;
}

interface ForecastDay {
  date: LocalDate;
  minC: number | null;
  maxC: number | null;
  weatherCode: number | null;
}

interface WeatherData {
  city: City;
  current: CurrentWeather | null;
  days: ForecastDay[]; // Exatamente cinco datas locais, em ordem.
}

interface WeatherCondition {
  description: string;
  icon: WeatherIconKey; // Chave interna; nunca texto recebido do provedor.
}

type SearchState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "results"; query: string; cities: City[] }
  | { status: "empty"; query: string }
  | { status: "error"; query: string; error: RequestError };

type WeatherState =
  | { status: "idle" }
  | { status: "loading"; city: City }
  | { status: "success"; city: City; data: WeatherData }
  | { status: "partial"; city: City; data: WeatherData }
  | { status: "error"; city: City; error: RequestError };

type RequestErrorKind =
  | "network"
  | "timeout"
  | "http"
  | "invalid-response"
  | "no-usable-data";

interface RequestError {
  kind: RequestErrorKind;
  retryAt: number | null; // Epoch ms quando Retry-After válido; null se retry for imediato.
}

interface WeatherService {
  searchCities(query: string, signal: AbortSignal): Promise<City[]>;
  getWeather(city: City, signal: AbortSignal): Promise<WeatherData>;
}
```

- `SearchState.empty` representa resposta bem-sucedida sem resultados; nunca é erro.
- `WeatherState.partial` representa ao menos um dado meteorológico utilizável, com valores/seções ausentes marcados como indisponíveis na apresentação. Se não houver dado utilizável em nenhuma seção, o serviço rejeita com `no-usable-data`.
- `WeatherData` agrega a cidade selecionada e o forecast; não é um DTO do provedor. `current: null` representa a seção atual inteira indisponível. O fuso de `observedAt` é `WeatherData.city.timezone`. `Unit` e `WeatherData` incorporam os nomes da proposta de interfaces, substituindo `TemperatureUnit` e `WeatherSnapshot` da primeira versão do plano.
- O modelo normalizado mantém medidas em Celsius (`temperatureC`, `minC`, `maxC`). A unidade escolhida é estado de apresentação; a conversão parte do valor original e ocorre sem nova requisição (RF4, AC-4.2, AC-4.6–4.8).
- A cidade retém `timezone` IANA da geocodificação. Tratar fuso ausente ou inválido exige decisão explícita antes da implementação, pois a spec não define fallback.
- O dia e o código de condição podem estar ausentes; `days` ainda representa cinco datas locais, com campos numéricos ou código nulos nos dias incompletos (RF3.5, RF5.5).
- O catálogo de códigos cobre códigos WMO documentados pelo provedor, com descrição pt-BR e ícone. Código desconhecido usa descrição "Condição indisponível" e ícone neutro (AC-2.3, AC-3.7).
- Os nomes de tipos externos devem deixar claro que são DTOs e permanecer privados ao serviço. Componentes consomem apenas os tipos normalizados acima.

## Data Flow

1. A tela inicia sem requisição e mostra orientação inicial (RF5.1, AC-5.1). Unidade começa em Celsius; nenhum estado é restaurado de armazenamento.
2. O campo de busca mantém o texto digitado. O hook só agenda geocodificação quando houver ao menos dois caracteres não brancos e 300 ms sem digitação; remove espaços das extremidades antes de enviar (RF1.5, AS-6).
3. O serviço recebe o termo e um `AbortSignal`, constrói a URL com `URLSearchParams`, trata a resposta HTTP e normaliza resultados. A UI exibe apenas campos disponíveis; usuário seleciona explicitamente uma cidade.
4. Ao editar ou limpar o termo, resultados antigos deixam de ser selecionáveis. Uma resposta antiga ou de requisição cancelada não pode mudar a lista atual (RF1.6, AC-1.5, AC-1.12).
5. Ao selecionar uma cidade, o hook torna-a o contexto atual e chama `getWeather`. Uma seleção mais recente invalida a requisição meteorológica anterior; nenhuma resposta obsoleta pode substituir os novos dados (AC-1.11).
6. O serviço solicita clima atual e previsão diária; valida e normaliza campos. Na resposta bruta, cada índice de `daily.time` identifica a data dos valores no mesmo índice dos arrays diários. Após construir esses registros, associa-os à grade de cinco datas pela data local, nunca pela posição esperada na UI, e preenche lacunas sem deslocar dados (RF3.5, AC-5.7).
7. Dados válidos são renderizados; campos ou dias inválidos são apresentados como indisponíveis. O conjunto sem nenhum dado utilizável é erro com retry, não sucesso vazio (RF5.5, AC-5.12–5.16).
8. A alternância °C/°F apenas atualiza apresentação a partir dos valores normalizados em Celsius. Não refaz buscas ou previsão e continua aplicável se ocorrer durante loading (RF4).
9. Ações explícitas de retry repetem o mesmo termo ou a mesma cidade. Erros e estados são anunciados sem mover o foco (RF5.4–5.8, RNF2).

## External APIs

Referências: [Geocoding API](https://open-meteo.com/en/docs/geocoding-api) e [Weather Forecast API](https://open-meteo.com/en/docs). Exemplos abaixo são **ilustrativos e resumidos**, com datas e valores das fixtures da spec; não são capturas de consultas reais nem previsão meteorológica verificada.

### Geocoding — Open-Meteo

**URL:** `GET https://geocoding-api.open-meteo.com/v1/search` — atende RF1 e fornece a localização para RF2/RF3.

| Parâmetro | Valor / uso |
| --- | --- |
| `name` | Nome digitado, com trim e codificação por `URLSearchParams`; preservar acentos, hífens e apóstrofos. |
| `language` | `pt`; pede nomes traduzidos quando disponíveis. O provedor pode retornar nomes em inglês ou no idioma local quando não houver tradução. |
| `count` | Limite de resultados, entre 1 e 100 no provedor (padrão 10). Valor da aplicação pendente em OQ-13. |
| `format` | `json`, explicitamente para fixar o formato esperado. |
| `countryCode` | Filtro opcional de país; não enviar na v1 para permitir cidades de qualquer país (AS-14). |

`current`, `daily` e `timezone` não são parâmetros desta busca. O fuso é um campo de cada resultado.

Exemplo de URL (o uso de `count=5` é apenas ilustrativo, não decisão de produto):

```text
https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&language=pt&count=5&format=json
```

Exemplo resumido de resposta:

```json
{
  "results": [
    {
      "id": 3448439,
      "name": "São Paulo",
      "latitude": -23.5475,
      "longitude": -46.6361,
      "timezone": "America/Sao_Paulo",
      "country_code": "BR",
      "country": "Brasil",
      "admin1": "São Paulo"
    }
  ]
}
```

Mapeamento de cada item de `results` para `City`:

| Campo da resposta | Campo do modelo | Regra |
| --- | --- | --- |
| `id`, `name` | `id`, `name` | Identidade e nome; não sintetizar valores ausentes. |
| `latitude`, `longitude` | `latitude`, `longitude` | Coordenadas usadas na requisição de forecast. |
| `timezone` | `timezone` | Identificador IANA para a consulta e interpretação de datas/horários. |
| `admin1`, `country` | `admin1`, `country` | Campos opcionais do provedor; normalizar ausência para `null`. |
| `country_code` | `countryCode` | Renomear; ausência vira `null`. |

Não exibir separadores vazios para estado/país ausentes (AC-1.8). Resposta válida sem `results` ou com `results: []` significa nenhum resultado; um campo `results` presente em formato inválido não deve ser convertido em lista vazia. Erros HTTP ou corpo ilegível são falha com retry, não empty (AC-5.3, AC-5.4).

O mínimo de dois caracteres e debounce de 300 ms são regras da aplicação (AS-6). Não implementar correção de grafia local: OQ-13 ainda define limite do termo, quantidade/ordenação de resultados e homônimas indistinguíveis. Tratamento de resultados com identidade, coordenadas ou fuso inválidos também precisa de regra explícita; não descartá-los silenciosamente nem fabricar dados.

### Forecast — Open-Meteo

**URL:** `GET https://api.open-meteo.com/v1/forecast` — uma requisição atende clima atual e previsão diária (RF2/RF3).

| Parâmetro | Valor / uso |
| --- | --- |
| `latitude`, `longitude` | Coordenadas da `City` selecionada. |
| `current` | `temperature_2m,weather_code`: temperatura a 2 m e condição atual. |
| `daily` | `temperature_2m_min,temperature_2m_max,weather_code`: mínima, máxima e condição diária. |
| `timezone` | `city.timezone`, por exemplo `America/Sao_Paulo`; não usar o fuso do dispositivo. |
| `temperature_unit` | `celsius`; a troca para Fahrenheit acontece na apresentação sem nova requisição (RF4). |
| `forecast_days` | `5`: hoje e os quatro dias seguintes. |
| `timeformat` | `iso8601`: datas e horários locais; não adicionar `Z` aos horários retornados. |

Não solicitar `hourly`, sensação térmica, vento ou umidade: não são necessários ao conteúdo mínimo; campos adicionais dependem de OQ-3.

Exemplo de URL:

```text
https://api.open-meteo.com/v1/forecast?latitude=-23.5475&longitude=-46.6361&current=temperature_2m,weather_code&daily=temperature_2m_min,temperature_2m_max,weather_code&timezone=America%2FSao_Paulo&temperature_unit=celsius&forecast_days=5&timeformat=iso8601
```

Exemplo resumido de resposta:

```json
{
  "timezone": "America/Sao_Paulo",
  "utc_offset_seconds": -10800,
  "current_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-10-29T09:45",
    "temperature_2m": 25,
    "weather_code": 2
  },
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_min": "°C",
    "temperature_2m_max": "°C",
    "weather_code": "wmo code"
  },
  "daily": {
    "time": ["2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"],
    "temperature_2m_min": [18, 17, 16, 15, 17],
    "temperature_2m_max": [27, 26, 24, 22, 25],
    "weather_code": [2, 61, 3, 0, 80]
  }
}
```

Mapeamento para `CurrentWeather`, `ForecastDay` e `WeatherData`:

| Origem | Destino | Regra |
| --- | --- | --- |
| Cidade selecionada no geocoding | `WeatherData.city` | Preservar a identidade da cidade; coordenadas do forecast podem representar a célula do modelo, não uma nova cidade. |
| `current.temperature_2m` | `current.temperatureC` | Número finito em Celsius, sem arredondar no domínio; ausência/inválido vira `null`. |
| `current.weather_code` | `current.weatherCode` | Código WMO; ausência/inválido vira `null`; código numérico desconhecido permanece para fallback. |
| `current.time` | `current.observedAt` | Horário local da leitura, interpretado com `city.timezone`; não usar hora da requisição ou do dispositivo. |
| Seção `current` ausente/sem dados utilizáveis | `WeatherData.current = null` | Manter previsão válida disponível (AC-5.14). Campo isolado ausente não elimina os demais campos atuais (AC-5.12). |
| `daily.time[i]` | `days[].date` | Data local que identifica o registro diário. |
| `daily.temperature_2m_min[i]` | `days[].minC` | Valor do mesmo índice bruto; ausência/inválido vira `null`. |
| `daily.temperature_2m_max[i]` | `days[].maxC` | Valor do mesmo índice bruto; ausência/inválido vira `null`. |
| `daily.weather_code[i]` | `days[].weatherCode` | Código do mesmo índice bruto; descrição e ícone são derivados no cliente. |
| `current_units`, `daily_units` | Validação do contrato | Conferir Celsius antes de atribuir medidas aos campos `*C`; não apresentar medidas de outra unidade como Celsius. |
| `timezone`, `utc_offset_seconds` | Metadados externos | Conferir o fuso da resposta; não substituir o identificador IANA por um offset fixo, que não descreve transições de horário. |

**Arrays paralelos e associação por data:** a API associa `daily.time[i]` aos valores dos outros arrays no índice `i`. Primeiro construir registros com essa associação; depois indexá-los por data e preencher a grade de hoje local + quatro dias. Isso atende RF3.5: o índice bruto não define o dia na UI. Se faltar 30/10, o registro de 31/10 continua em 31/10; 30/10 recebe campos `null`. Não remover valores nulos antes de combinar os arrays, pois isso deslocaria os dados. Array truncado produz campos ausentes, nunca realinhamento por suposição.

`WeatherData.days` deve ter cinco datas consecutivas em ordem; hoje é calculado no fuso da cidade no momento da resposta (EC-16). `daily.time` é data civil, não instante UTC: não usar parsing que a converta implicitamente pelo fuso do dispositivo. A política para datas duplicadas/inválidas, mínima maior que máxima e a definição completa de dados utilizáveis permanecem pendentes na spec; não inventar correções.

`Unit` não é campo da resposta: é a preferência de apresentação em memória, inicializada como `"celsius"`. Descrições como "Parcialmente nublado" e ícones vêm do catálogo local de códigos WMO, não do JSON.

### Falhas e restrições comuns

- Ambos os endpoints usam HTTPS e não exigem API key conforme D1; não introduzir proxy/backend na v1. Licença, limites e eventual uso comercial dependem de OQ-9.
- Verificar HTTP antes de normalizar. O provedor pode devolver erro como `{"error": true, "reason": "..."}`; `reason` é detalhe técnico e não deve aparecer diretamente na UI (RF5.4, RNF9).
- Rede, timeout de 10 s, HTTP não-2xx ou corpo ilegível geram erro explícito e retry manual. Para 429, respeitar `Retry-After` válido quando disponível; sem prazo válido, permitir nova tentativa manual imediata (OQ-17).
- Na resposta meteorológica, preservar campos/seções válidos. Se nenhuma seção contiver dados utilizáveis, gerar `no-usable-data`, não sucesso vazio nem temperaturas zero (AC-5.16).
- Crédito ao provedor permanece visível em todos os estados (AC-6.1–6.2), sujeito ao texto e obrigações definidos em OQ-9.

## State Management

Estado local em `useWeather`, sem store global:

| Estado | Responsabilidade |
| --- | --- |
| `query` | Texto controlado do campo; não confundir com o termo da requisição ativa. |
| `searchState` | Ciclo de vida da busca: idle, loading, results, empty ou error. |
| `selectedCity` | Cidade explicitamente selecionada e exibida junto aos dados. |
| `weatherState` | Ciclo de vida da previsão para a cidade selecionada: idle, loading, success, partial ou error. |
| `unit` | Celsius ou Fahrenheit, inicializado em Celsius e mantido só na memória da página. |

- Busca e previsão têm estados independentes: digitar uma nova busca não bloqueia o campo nem transforma resultados vazios em falha.
- Usar `AbortController` para cancelar requisições substituídas/desnecessárias e um identificador monotônico por fluxo para impedir efeitos de respostas tardias, inclusive quando o provedor responder após abort/timeout.
- Cada fluxo mantém no máximo uma requisição ativa. Desabilitar retry enquanto estiver em andamento; não enfileirar cliques (RF5.8, AC-5.11).
- Manter a cidade selecionada explícita enquanto a previsão carrega ou falha. Não apresentar dados da cidade anterior como se fossem da nova cidade (AC-5.9, AC-5.10).
- Não usar cache, persistência ou tentativa automática. Não adicionar contexto React: não existe compartilhamento de estado entre rotas/componentes que justifique essa camada.

## Error Handling

- **Loading:** iniciar assim que a requisição é enviada; permitir continuar digitando; terminar ao receber resposta, erro ou timeout de 10 s (AS-7, AC-5.2, AC-5.6, AC-5.9).
- **Busca vazia:** resposta válida com lista vazia gera estado `empty`, sugestão para revisar a grafia e nenhuma chamada de previsão. Campo vazio ou abaixo do mínimo gera nenhuma requisição e nenhum erro.
- **Falha:** distinguir erro de rede, timeout, HTTP não-2xx, corpo ilegível e JSON válido sem dados utilizáveis. A UI mostra mensagem em pt-BR e ação manual de retry, nunca detalhes técnicos, código HTTP ou texto de erro do provedor.
- **HTTP 429:** ler `Retry-After` válido como prazo de retry; manter ação indisponível até o prazo. Se ausente ou inválido, permitir retry manual imediato. Nenhum retry automático (RF5.4, RF5.7, OQ-17).
- **Retry:** preservar exatamente o termo ou a cidade que falhou; permitir somente uma tentativa ativa; limpar mensagem de erro ao começar a tentativa e mostrar loading. Cancelar/inutilizar respostas de tentativas expiradas ou substituídas.
- **Resposta parcial:** manter os dados utilizáveis; marcar campos ausentes como indisponíveis e associar cada dia à sua data local. Se nenhuma seção contiver dados utilizáveis, mapear para erro e oferecer retry (RF5.5).
- **Condição desconhecida:** fallback localizado e ícone neutro, sem converter uma condição desconhecida em falha de dados (AC-2.3, AC-3.7).
- **Acessibilidade:** anunciar transições de estado por região de status sem mover o foco nem repetir anúncios sem mudança (AC-5.8).
- A regra de idade máxima da leitura atual é OQ-18. Até decisão e ajuste da spec, não inventar um limite nem aviso de stale data.

## Testing Strategy

### Unitários — Vitest + Testing Library

- Funções puras: conversão e arredondamento C↔F, zero negativo, datas/horas em pt-BR e fuso IANA, descrição e ícone para todos os códigos WMO mapeados, fallback para código desconhecido.
- Serviço: mockar `fetch`; validar URLs/parâmetros, mapeamento de cidade, normalização de DTOs, arrays parciais, associação por data, timeout, HTTP 429 com e sem `Retry-After`, JSON ilegível, ausência de dados utilizáveis e descarte/cancelamento de resposta obsoleta.
- Componentes/hook: testar estados inicial, loading, vazio, sucesso, parcial e erro; seleção explícita; substituição de cidade; retry manual sem fila; unidade durante loading; teclado, nomes acessíveis e anúncio de estado.
- Usar consultas acessíveis (`getByRole`, `getByLabelText`) e não chamar APIs reais (convenções do projeto).
- Cada AC deve ser rastreado a um caso de teste automatizado, contrato separado ou protocolo manual, evitando duplicar casos através das histórias (spec 4.10).

### E2E — Playwright

- Interceptar geocoding e forecast com `page.route`, fixtures controladas e dados fixos; nenhum E2E depende de conectividade ou resposta real do provedor.
- Cobrir o fluxo busca → seleção → clima atual e cinco dias → alternância de unidade; estados sem resultado, erro, retry, resposta parcial, teclado e unidade enquanto carrega.
- Executar dimensões definidas em RNF1 (360, 768, 1280 e 1920 px), zoom de 200% e viewport mobile; verificar ausência de rolagem horizontal, alcance de controles e integridade do conteúdo.
- Executar axe nos fluxos principais e complementar com revisão manual de teclado, foco, leitor de tela e mensagens, conforme RNF2. A integração axe requer dependência adicional ainda ausente do manifesto.

### Verificações fora da suíte automatizada

- **Contrato real do geocoding:** AC-1.10 como teste separado e explícito, nunca como requisito da suíte funcional determinística.
- **Performance (RNF5):** 30 execuções válidas em 4G simulada; p75 da busca até 2 s após envio, previsão até 3 s após seleção, feedback de loading até 100 ms. Metas aguardam aprovação OQ-11.
- **Compatibilidade (RNF6):** smoke tests nas duas versões estáveis mais recentes de Chrome, Firefox, Safari e Edge e nas plataformas mobile da matriz; aprovar matriz em OQ-11.
- **Usabilidade (RNF4):** teste moderado com 5 participantes distribuídos entre P1–P3; pelo menos 4 completam busca, seleção e leitura sem ajuda; confirmar protocolo em OQ-1.
- **Privacidade (RNF7):** inspecionar rede e armazenamento do navegador para comprovar ausência de analytics, persistência e destinos além do provedor/hospedagem. Definir retenção de logs em OQ-12.
- **Disponibilidade (RNF8):** meta e monitoramento da hospedagem ainda não definidos; resolver OQ-12 antes do release.

Scripts já disponíveis: `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm build`. Não executar como validação do documento; serão necessários quando houver mudanças de código em `src/` ou `tests/`.

## Risks & Trade-offs

| Risco / trade-off | Decisão ou mitigação | Impacto / pendência |
| --- | --- | --- |
| Geocoding indisponível, timeout ou limite de uso | Debounce de 300 ms, mínimo de 2 caracteres, timeout de 10 s, cancelamento e retry manual; respeitar `Retry-After` em 429. | Limites e política de retry aguardam OQ-13 e OQ-17. |
| Licença ou limites do Open-Meteo incompatíveis com o uso | Sem proxy, chave ou backend; implementar atribuição de forma isolada na UI. | OQ-9 é bloqueante para liberação e pode exigir revisão de fornecedor/arquitetura. |
| Resposta externa parcial ou alterada | Validação na borda do serviço; domínio interno tipado; dados ausentes como `null`; fixtures para todos os estados. | Evita espalhar lógica de parsing pela UI; critérios ainda não definem completamente todo JSON utilizável. |
| Fuso ou data local inválidos/ausentes | Usar timezone IANA da cidade e datas locais Open-Meteo; nunca o timezone do dispositivo. | Spec não define fallback se o geocoding não retornar timezone válido; resolver antes da implementação. |
| Respostas fora de ordem e corrida entre cidades | Cancelamento mais verificação de identificador da requisição antes de atualizar estado. | Pequeno controle adicional necessário para cumprir AC-1.5, AC-1.11 e AC-5.6; não introduzir cache. |
| Erro de arredondamento °C/°F | Preservar valores originais em Celsius e converter a partir deles; arredondar somente na apresentação. | Decimais, valores-limite e zero negativo são cobertos por AC-4.6; confirmar regra em OQ-16. |
| Carregar catálogo WMO completo e localizado | Catálogo estático no cliente com teste que percorre todos os códigos documentados e fallback desconhecido. | A manutenção do catálogo é preferida a depender de texto localizado do provedor; verificar cobertura na tarefa de dados. |
| Sem cache e sem persistência | Cada busca/seleção nova depende da rede; unidade reinicia em Celsius. | Simplifica privacidade e coerência com RNF7/AS-8, mas sacrifica uso offline e atualização instantânea; ambos fora de escopo. |
| Acessibilidade visual e funcional incompleta | Nomes, estados anunciados, foco e teclado testados; automatizar axe e fazer revisão manual. | Tema escuro depende de OQ-14; nível AA depende de OQ-10. |
| Métricas de performance, navegadores, disponibilidade e logs sem aprovação | Preservar protocolos e decisões como pendentes, sem codificar metas alternativas. | OQ-11 e OQ-12 bloqueiam aprovação/release; manter testes de performance/compatibilidade fora da suíte unitária. |

### Portões antes de decompor/implementar

A spec está explicitamente em rascunho. Antes de aprovar tarefas, resolver ou formalmente aceitar premissas relevantes de OQ-2, OQ-4, OQ-6, OQ-9, OQ-10, OQ-11, OQ-12, OQ-13, OQ-16, OQ-17 e OQ-18; tratar também OQ-3 e OQ-7 conforme o critério de saída da seção 10 da spec. Rever os contratos deste plano e critérios afetados após cada decisão. A ausência de timezone válido e a definição operacional de "dados utilizáveis" também precisam de regra explícita antes de fechar os contratos do serviço.
