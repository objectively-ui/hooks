import { safeStringify } from "@objectively/utils";
import type { Meta, StoryObj } from "@storybook/react";
import { usePermission } from "./usePermission";

const Component = ({ permission }: { permission: PermissionName }) => {
  const detail = usePermission(permission);

  return <pre>{safeStringify(detail, 2)}</pre>;
};

const meta: Meta<typeof usePermission> = {
  title: "hooks/usePermission",
  component: Component,
  tags: ["autodocs"],
  args: {
    permission: "notifications",
  },
  argTypes: {
    permission: {
      type: "select",
      options: [
        "geolocation",
        "notifications",
        "persistent-storage",
        "push",
        "screen-wake-lock",
        "xr-spatial-tracking",
      ] satisfies PermissionName[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof usePermission>;

export const Demo: Story = {};
