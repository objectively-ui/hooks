import type { Meta, StoryObj } from "@storybook/react";
import { useViewport } from "./useViewport";

const Component = () => {
  const viewport = useViewport();

  return <pre>{JSON.stringify(viewport, null, 2)}</pre>;
};

const meta: Meta<typeof useViewport> = {
  title: "hooks/useViewport",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useViewport>;

export const Demo: Story = {};
