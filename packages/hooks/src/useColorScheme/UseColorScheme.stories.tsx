import type { Meta, StoryObj } from "@storybook/react";
import { Suspense } from "react";
import { useColorScheme } from "./useColorScheme";

const Component = () => {
  const [_, setScheme] = useColorScheme();
  const [scheme] = useColorScheme();

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
  decorators: [
    (Component) => {
      return (
        <Suspense fallback="Loading">
          <Component />
        </Suspense>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof useColorScheme>;

export const Demo: Story = {};
