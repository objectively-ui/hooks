import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { useRerender } from "./useRerender";

const Component = () => {
  const count = useRef(0);
  count.current++;
  const rerender = useRerender();

  return (
    <div>
      <p>Count: {count.current}</p>
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
