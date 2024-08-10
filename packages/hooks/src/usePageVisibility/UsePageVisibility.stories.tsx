import type { Meta, StoryObj } from "@storybook/react";
import { usePageVisibility } from "./usePageVisibility";

const Component = () => {
  const { visible } = usePageVisibility();

  return <p>Visible? {visible}</p>;
};

const meta: Meta<typeof usePageVisibility> = {
  title: "hooks/usePageVisibility",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof usePageVisibility>;

export const Demo: Story = {};
