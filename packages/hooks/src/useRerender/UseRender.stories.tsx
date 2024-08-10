import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { useRerender } from "./useRerender";

const Component = () => {
  const [count, setCount] = useState(0);
  const rerender = useRerender();

  useEffect(() => setCount((count) => count + 1), []);

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={rerender}>
        Increment
      </button>
    </div>
  );
};

const meta: Meta<typeof useRerender> = {
  title: "hooks/useRerender",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useRerender>;

export const Demo: Story = {};
