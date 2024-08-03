import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useThrottleValue } from './useThrottleValue';

const Component = () => {
  const [count, setCount] = useState(0)
  const throttled = useThrottleValue(count, 500)

  return <div>
    <p>Count: {count}</p>
    <p>Throttled count: {throttled}</p>
    <button type='button' onClick={() => setCount(c => c+ 1)}>Increment</button>
  </div>
}

const meta: Meta<typeof useThrottleValue> = {
  title: 'hooks/useThrottleValue',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof useThrottleValue>;

export const Demo: Story = {};
