import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

afterEach(cleanup);

it('tem busca nomeada, ignora vazio e envia texto com trim via Enter', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<SearchBar onSearch={onSearch} />);
  expect(screen.getByRole('search', { name: 'Busca de cidade' })).toBeInTheDocument();
  const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });
  await user.type(input, '   {Enter}');
  expect(onSearch).not.toHaveBeenCalled();
  await user.type(input, 'São Paulo  {Enter}');
  expect(onSearch).toHaveBeenCalledExactlyOnceWith('São Paulo');
});

it('envia por botão e respeita disabled', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  const { rerender } = render(<SearchBar onSearch={onSearch} />);
  await user.type(screen.getByRole('searchbox'), 'Recife');
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
  expect(onSearch).toHaveBeenCalledExactlyOnceWith('Recife');
  rerender(<SearchBar onSearch={onSearch} disabled />);
  expect(screen.getByRole('searchbox')).toBeDisabled();
  expect(screen.getByRole('button')).toBeDisabled();
  await user.click(screen.getByRole('button'));
  expect(onSearch).toHaveBeenCalledTimes(1);
});
