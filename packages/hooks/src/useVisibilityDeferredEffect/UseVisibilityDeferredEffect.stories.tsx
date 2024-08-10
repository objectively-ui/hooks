import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { useVisibilityDeferredEffect } from "./useVisibilityDeferredEffect";

const Component = () => {
  const [a, setA] = useState<Date>();
  const [b, setB] = useState<Date>();

  useEffect(() => setA(new Date()), []);

  useVisibilityDeferredEffect(() => setB(new Date()), []);

  return (
    <div>
      <p>Regular effect: rendered at {a?.toLocaleString()}</p>
      <p>Deferred effect: rendered at {b?.toLocaleString()}</p>
    </div>
  );
};

const meta: Meta<typeof useVisibilityDeferredEffect> = {
  title: "hooks/useVisibilityDeferredEffect",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useVisibilityDeferredEffect>;

export const Demo: Story = {};
