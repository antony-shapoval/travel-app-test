import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

jest.mock('@floating-ui/react', () => ({
  useFloating: () => ({ refs: { setFloating: jest.fn() }, floatingStyles: {} }),
  autoUpdate: jest.fn(),
  offset: jest.fn(),
  flip: jest.fn(),
  size: jest.fn(),
  FloatingPortal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const options = [
  { id: '1', label: 'Туреччина', icon: '🌍', meta: 'Країна' },
  { id: '2', label: 'Єгипет', icon: '🌍', meta: 'Країна' },
];

function renderCombobox(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  const defaults = {
    inputValue: '',
    options,
    open: false,
    onInputChange: jest.fn(),
    onSelect: jest.fn(),
    onOpen: jest.fn(),
    onClose: jest.fn(),
  };
  return render(<Combobox {...defaults} {...props} />);
}

describe('Combobox', () => {
  it('renders the input field', () => {
    renderCombobox();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows options when open', () => {
    renderCombobox({ open: true });

    expect(screen.getByText('Туреччина')).toBeInTheDocument();
    expect(screen.getByText('Єгипет')).toBeInTheDocument();
  });

  it('hides options when closed', () => {
    renderCombobox({ open: false });

    expect(screen.queryByText('Туреччина')).not.toBeInTheDocument();
  });

  it('calls onOpen when input is clicked', async () => {
    const onOpen = jest.fn();
    renderCombobox({ onOpen });

    await userEvent.click(screen.getByRole('textbox'));

    expect(onOpen).toHaveBeenCalled();
  });

  it('calls onInputChange when user types', async () => {
    const onInputChange = jest.fn();
    renderCombobox({ onInputChange });

    await userEvent.type(screen.getByRole('textbox'), 'Тур');

    expect(onInputChange).toHaveBeenCalledWith('Т');
  });

  it('calls onSelect with the chosen option', async () => {
    const onSelect = jest.fn();
    renderCombobox({ open: true, onSelect });

    await userEvent.click(screen.getByText('Туреччина'));

    expect(onSelect).toHaveBeenCalledWith(options[0]);
  });

  it('calls onClose on Escape key', async () => {
    const onClose = jest.fn();
    renderCombobox({ open: true, onClose });

    screen.getByRole('textbox').focus();
    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('shows empty state when open with no options', () => {
    renderCombobox({ open: true, options: [] });

    expect(screen.getByText('Нічого не знайдено')).toBeInTheDocument();
  });
});
