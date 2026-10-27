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
