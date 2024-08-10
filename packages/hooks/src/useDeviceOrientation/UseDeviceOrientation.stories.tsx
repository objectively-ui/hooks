import { safeStringify } from "@objectively/utils";
import type { Meta, StoryObj } from "@storybook/react";
import { useDeviceOrientation } from "./useDeviceOrientation";

const Component = () => {
  const orientation = useDeviceOrientation();

  return <pre>{safeStringify(orientation, 2)}</pre>;
};

const meta: Meta<typeof useDeviceOrientation> = {
  title: "hooks/useDeviceOrientation",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useDeviceOrientation>;

export const Demo: Story = {};
