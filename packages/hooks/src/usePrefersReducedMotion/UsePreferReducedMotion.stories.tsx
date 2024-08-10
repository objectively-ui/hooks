import type { Meta, StoryObj } from "@storybook/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const Component = () => {
  const reduced = usePrefersReducedMotion();

  return <p>Prefers reduced motion? {reduced.toString()}</p>;
};

const meta: Meta<typeof usePrefersReducedMotion> = {
  title: "hooks/usePrefersReducedMotion",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof usePrefersReducedMotion>;

export const Demo: Story = {};
