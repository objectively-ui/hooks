import type { Meta, StoryObj } from "@storybook/react";
import { useColorScheme } from "./useColorScheme";

const Component = () => {
  const [scheme, setScheme] = useColorScheme();

  return (
    <div>
      <p>Color scheme: {scheme}</p>
      <button type="button" onClick={() => setScheme(scheme === "light" ? "dark" : "light")}>
        Toggle
      </button>
    </div>
  );
};

const meta: Meta<typeof useColorScheme> = {
  title: "hooks/useColorScheme",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useColorScheme>;

export const Demo: Story = {};
