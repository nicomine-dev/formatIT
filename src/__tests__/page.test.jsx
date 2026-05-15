import { render, screen } from '@testing-library/react';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

describe('test infrastructure smoke test', () => {
  it('renders a React component via Testing Library', () => {
    render(<Greeting name="formatIT" />);
    const heading = screen.getByRole('heading', { name: /hello, formatit!/i });
    expect(heading).not.toBeNull();
    expect(heading.tagName).toBe('H1');
  });
});
