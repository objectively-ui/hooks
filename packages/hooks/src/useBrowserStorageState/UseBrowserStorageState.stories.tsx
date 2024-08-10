import type { Meta, StoryObj } from "@storybook/react";
import { useBrowserStorageState } from "./useBrowserStorageState";

const Component = () => {
  const [count, setCount] = useBrowserStorageState<number>("count", { defaultValue: 0 });

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
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
