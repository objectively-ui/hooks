import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useThrottle } from './useThrottle';

const Component = () => {
  const [count, setCount] = useState(0)
  const increment = useThrottle(() => setCount(count => count + 1), 500)

  return <div>
    <p>Count: {count}</p>
    <button type='button' onClick={increment}>Increment</button>
  </div>
}

const meta: Meta<typeof useThrottle> = {
  title: 'hooks/useThrottle',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof useThrottle>;

export const Demo: Story = {};
