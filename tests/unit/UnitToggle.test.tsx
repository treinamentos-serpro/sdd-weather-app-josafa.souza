import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

afterEach(cleanup);

describe('UnitToggle', () => {
  it('identifica o grupo e reflete a unidade recebida sem alterar estado sozinho', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    const celsius = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit' });
    expect(celsius).toHaveTextContent('°C');
    expect(fahrenheit).toHaveTextContent('°F');
    expect(celsius).toHaveAttribute('aria-pressed', 'true');
    expect(fahrenheit).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(fahrenheit);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');
    expect(celsius).toHaveAttribute('aria-pressed', 'true');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    expect(celsius).toHaveAttribute('aria-pressed', 'false');
    expect(fahrenheit).toHaveAttribute('aria-pressed', 'true');
    await user.click(celsius);
    expect(onChange).toHaveBeenLastCalledWith('celsius');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('permite navegação por Tab e ativação com Enter e Espaço', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('celsius');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
    expect(onChange).toHaveBeenCalledTimes(2);
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveFocus();
  });

  it('não submete um formulário ao ativar os botões', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <UnitToggle unit="celsius" onChange={vi.fn()} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    await user.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
