import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useInterval } from '.';

const Component = () => {
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState<number | null>(1000)
  useInterval(() => setCount(count => count + 1), delay)

  return <div>
    <p>Count: {count}</p>
    <button type='button' onClick={() => setDelay(current => current ? null : 1000)}>{delay === null ? "start" : "pause"}</button>
  </div>
}

const meta: Meta<typeof useInterval> = {
  title: 'hooks/useInterval',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof useInterval>;

export const Demo: Story = {};
