import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useDebounceValue } from "./useDebounceValue";

const Component = () => {
  const [count, setCount] = useState(0);
  const debounced = useDebounceValue(count, 500);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Debounced count: {debounced}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  );
};

const meta: Meta<typeof useDebounceValue> = {
  title: "hooks/useDebounceValue",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useDebounceValue>;

export const Demo: Story = {};
