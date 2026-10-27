import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

afterEach(cleanup);

describe('Estados de apresentação', () => {
  it('anuncia carregamento padrão ou contextual', () => {
    const { rerender } = render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados meteorológicos');
    rerender(<LoadingState message="Buscando cidades…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Buscando cidades');
  });

  it('não rouba foco quando o carregamento é montado', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<button type="button">Controle existente</button>);
    await user.tab();
    const control = screen.getByRole('button', { name: 'Controle existente' });
    expect(control).toHaveFocus();
    rerender(
      <>
        <button type="button">Controle existente</button>
        <LoadingState />
      </>,
    );
    expect(control).toHaveFocus();
  });

  it('exibe mensagem de erro e permite retry por teclado sem submeter formulário', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={onSubmit}>
        <ErrorState message="Não foi possível carregar." onRetry={onRetry} />
      </form>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar.');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();
    await user.keyboard('{Enter} ');
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(<ErrorState message="Aguarde antes de tentar." onRetry={onRetry} disabled />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();
    await user.tab();
    await user.keyboard('{Enter} ');
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['Busque uma cidade', 'Digite o nome para começar.'],
    ['Nenhuma cidade encontrada', 'Confira a grafia e tente outro nome.'],
  ])('exibe orientação sem semântica de erro: %s', (title, hint) => {
    render(<EmptyState title={title} hint={hint} />);
    expect(screen.getByRole('region', { name: title })).toHaveTextContent(hint);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
