import React from 'react';
import App from 'components/App';
import { render } from '../utils/test-utils';

test('renders without crashing', () => {
  render(<App />);
});
