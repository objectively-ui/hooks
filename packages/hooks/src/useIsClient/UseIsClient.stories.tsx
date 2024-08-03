import type { Meta, StoryObj } from '@storybook/react';
import { useIsClient } from './useIsClient';

const Component = () => {
  const isClient = useIsClient()

  return <p>Is client? {isClient.toString()}</p>
}

const meta: Meta<typeof useIsClient> = {
  title: 'hooks/useIsClient',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof useIsClient>;

export const Demo: Story = {};
