import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../../src/App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('integra fixture, unidade derivada, vazio e nova busca sem rede', async () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch');
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeInTheDocument();
  const input = screen.getByRole('searchbox');
  await user.type(input, '  sao paulo  {Enter}');
  expect(screen.getByRole('main')).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Dados de exemplo de São Paulo exibidos.');
  expect(
    within(screen.getByRole('region', { name: 'Clima atual em São Paulo' })).getByText('25 °C'),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(5);
  await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
  expect(
    within(screen.getByRole('region', { name: 'Clima atual em São Paulo' })).getByText('77 °F'),
  ).toBeInTheDocument();
  await user.clear(input);
  await user.type(input, 'Recife{Enter}');
  expect(screen.getByRole('main')).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
  expect(
    screen.getByRole('heading', { name: 'Nenhuma cidade encontrada na demonstração' }),
  ).toBeInTheDocument();
  await user.clear(input);
  await user.type(input, 'São Paulo{Enter}');
  expect(
    within(screen.getByRole('region', { name: 'Clima atual em São Paulo' })).getByText('77 °F'),
  ).toBeInTheDocument();
  expect(fetchSpy).not.toHaveBeenCalled();
});

it('demonstra todos os estados e retry simulado sem timers ou API', async () => {
  const user = userEvent.setup();
  render(<App />);
  const selector = screen.getByRole('combobox', { name: 'Estado de demonstração' });
  await user.selectOptions(selector, 'loading');
  expect(within(screen.getByRole('main')).getByRole('status')).toHaveTextContent(
    'Demonstração de carregamento',
  );
  expect(screen.getByRole('searchbox')).toBeDisabled();
  await user.selectOptions(selector, 'error');
  expect(screen.getByRole('alert')).toHaveTextContent('Erro simulado');
  await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  expect(screen.getByRole('main')).toHaveFocus();
  expect(
    within(screen.getByRole('region', { name: 'Clima atual em São Paulo' })).getByText('25 °C'),
  ).toBeInTheDocument();
  await user.selectOptions(selector, 'empty');
  expect(
    screen.getByRole('heading', { name: 'Nenhuma cidade encontrada na demonstração' }),
  ).toBeInTheDocument();
  await user.selectOptions(selector, 'idle');
  expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeInTheDocument();
});
