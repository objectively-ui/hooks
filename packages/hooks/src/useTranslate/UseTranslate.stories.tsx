import type { Meta, StoryObj } from "@storybook/react";
import {} from "react";
import { useTranslate } from "./useTranslate";

const Component = () => {
  const { T } = useTranslate({
    actions: {
      create: {
        "en-US": "Create",
        "es-ES": "Crear",
      },
      delete: {
        "en-US": "Delete {{ count }}",
        "es-ES": "Borrar {{ count }}",
      },
    },
  });

  return (
    <div>
      <button type="button">{T("actions.create")}</button>
      <button type="button">{T("actions.delete", { data: { count: 1 } })}</button>
    </div>
  );
};

const meta: Meta<typeof useTranslate> = {
  title: "hooks/useTranslate",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useTranslate>;

export const Demo: Story = {};
