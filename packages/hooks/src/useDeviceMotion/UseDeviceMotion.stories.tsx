import { safeStringify } from "@objectively/utils";
import type { Meta, StoryObj } from "@storybook/react";
import { useDeviceMotion } from "./useDeviceMotion";

const Component = () => {
  const motion = useDeviceMotion();

  return <pre>{safeStringify(motion, 2)}</pre>;
};

const meta: Meta<typeof useDeviceMotion> = {
  title: "hooks/useDeviceMotion",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useDeviceMotion>;

export const Demo: Story = {};
