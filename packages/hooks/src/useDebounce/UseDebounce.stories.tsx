import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useDebounce } from "./useDebounce";

const Component = () => {
  const [count, setCount] = useState(0);
  const increment = useDebounce(() => setCount((count) => count + 1), 500);

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
};

const meta: Meta<typeof useDebounce> = {
  title: "hooks/useDebounce",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useDebounce>;

export const Demo: Story = {};
