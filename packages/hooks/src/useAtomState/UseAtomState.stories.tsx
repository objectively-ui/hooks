import { atom } from "@objectively/utils";
import type { Atom } from "@objectively/utils/atom";
import type { Meta, StoryObj } from "@storybook/react";
import { Suspense } from "react";
import { useAtomState } from "./useAtomState";

const wait = () => new Promise<number>((resolve) => setTimeout(() => resolve(1), 5000));

const countAtom = atom("count", {
  defaultValue: 0,
});

const asyncAtom = atom("async", {
  defaultValue: wait(),
});

const storageAtom = atom("storage", {
  defaultValue: 0,
  persist: {
    get(name) {
      return Number.parseInt(sessionStorage.getItem(name) || "0");
    },
    set(name, value) {
      sessionStorage.setItem(name, value.toString());
    },
  },
});

const Component = ({ atom }: { atom: Atom<number, string> }) => {
  const [_, setCount] = useAtomState(atom);
  const [count] = useAtomState(atom);

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
};

const meta: Meta<typeof useAtomState> = {
  title: "hooks/useAtomState",
  component: Component,
  tags: ["autodocs"],
  args: {
    atom: countAtom,
  },
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
type Story = StoryObj<typeof useAtomState>;

export const Demo: Story = {};

export const WithSuspense: Story = {
  args: {
    atom: asyncAtom,
  },
};

export const WithPersistence: Story = {
  args: {
    atom: storageAtom,
  },
};
