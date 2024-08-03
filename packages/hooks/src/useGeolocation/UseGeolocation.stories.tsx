import type { Meta, StoryObj } from "@storybook/react";
import type { UseGeolocationOptions } from './types';
import { useGeolocation } from "./useGeolocation";

const Component = (opts: UseGeolocationOptions) => {
  const { refresh, ...geo } = useGeolocation(opts);

  return (
    <div>
      <button type="button" onClick={refresh}>
        refresh
      </button>
      <pre>{JSON.stringify(geo, null, 2)}</pre>
    </div>
  );
};

const meta: Meta<typeof Component> = {
  title: "hooks/useGeolocation",
  component: Component,
  tags: ["autodocs"],
  args: {
    highAccuracy: true,
    maxCacheAge: 1000,
    timeout: 5000,
    watch: false,
    immediateRequest: true,
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Demo: Story = {};
