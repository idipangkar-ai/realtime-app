/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders the feed and the four navigation tabs', async () => {
  let renderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  try {
    const headings = renderer.root.findAllByType(Text);
    expect(
      headings.some(node => node.props.children === 'Picked for you'),
    ).toBe(true);
    for (const name of ['Home', 'Profile', 'Orders', 'More']) {
      expect(
        renderer.root.findAll(
          node => node.props.accessibilityLabel === `${name} tab`,
        ).length,
      ).toBeGreaterThan(0);
    }
  } finally {
    await ReactTestRenderer.act(() => {
      renderer.unmount();
    });
  }
});
