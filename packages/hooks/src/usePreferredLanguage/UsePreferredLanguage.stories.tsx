import type { Meta, StoryObj } from '@storybook/react';
import { usePreferredLanguage } from './usePreferredLanguage';

const Component = () => {
  const langs = usePreferredLanguage()

  return <pre>{JSON.stringify(langs, null, 2)}</pre>
}

const meta: Meta<typeof usePreferredLanguage> = {
  title: 'hooks/usePreferredLanguage',
  component: Component,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof usePreferredLanguage>;

export const Demo: Story = {};
