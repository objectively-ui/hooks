import type { Meta, StoryObj } from "@storybook/react";
import { type UseGeolocationOptions, useGeolocation } from ".";

const Component = (opts: UseGeolocationOptions) => {
  const { refresh, ...geo } = useGeolocation(opts);
  console.log(geo)
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
