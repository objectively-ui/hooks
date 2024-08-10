import type { Meta, StoryObj } from "@storybook/react";
import { useBrowserStorageState } from "./useBrowserStorageState";

const Component = () => {
  const [count, setCount] = useBrowserStorageState<number | undefined>("count", {
    defaultValue: 0,
    storage: "session",
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((c) => (c || 0) + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setCount(undefined)}>
        Reset
      </button>
    </div>
  );
};

const meta: Meta<typeof useBrowserStorageState> = {
  title: "hooks/useBrowserStorageState",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useBrowserStorageState>;

export const Demo: Story = {};
