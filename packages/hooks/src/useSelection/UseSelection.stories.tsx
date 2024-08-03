import { safeStringify } from "@objectively/utils/json";
import type { Meta, StoryObj } from "@storybook/react";
import { useSelection } from "./useSelection";

const Component = () => {
  const { selection, selectedText } = useSelection();

  const displaySelection = selection
    ? {
        type: selection.type,
        collapsed: selection.isCollapsed,
        anchorNode: selection.anchorNode?.nodeName,
        anchorOffset: selection.anchorOffset,
        focusNode: selection.focusNode?.nodeName,
        focusOffset: selection.focusOffset,
        ranges: selection.rangeCount,
      }
    : null;

  return (
    <div>
      <textarea defaultValue={selectedText} readOnly={true} style={{ width: "100%" }} rows={6} />
      <pre>{safeStringify(displaySelection, 2)}</pre>
      <hr />
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac suscipit purus.
          Praesent at ullamcorper diam. Aenean et nulla blandit, lobortis leo lacinia, egestas
          felis. Sed est leo, mollis eu diam sed, interdum laoreet elit. Phasellus convallis dapibus
          felis vitae gravida. Curabitur mollis dui et libero aliquet sollicitudin sit amet sed
          justo. Etiam vitae augue quis massa iaculis porta vitae et est. Nullam viverra, elit nec
          dignissim sodales, ligula mi faucibus lacus, placerat fermentum quam tellus sed nisi.
          Maecenas luctus accumsan leo, in consectetur nisl dictum a. Suspendisse consectetur lorem
          nec est lacinia convallis. Aliquam ornare a metus a luctus. Aenean rhoncus dictum
          facilisis. Curabitur posuere tristique mattis. Curabitur iaculis arcu et varius commodo.
          Proin erat lacus, mattis pellentesque est in, suscipit pellentesque odio. Ut posuere nisi
          in dui semper, sagittis sagittis nunc venenatis.
        </p>
        <p>
          Integer vitae faucibus orci, nec mattis leo. Vestibulum semper sem non libero consequat
          placerat. Praesent consectetur placerat ante, ut porta ipsum accumsan vitae. Integer est
          libero, ultricies nec commodo a, tempor ut nunc. Phasellus vitae libero vestibulum,
          commodo est et, gravida tortor. Nullam non tortor lacus. Aliquam rutrum lorem non magna
          semper, vel fringilla arcu tincidunt. Sed efficitur viverra est, blandit blandit ipsum
          malesuada congue.
        </p>
        <p>
          Praesent nibh massa, convallis at rutrum nec, scelerisque eu metus. Nunc feugiat massa ac
          ullamcorper scelerisque. Vestibulum faucibus mollis lacus id vehicula. Mauris feugiat mi
          elit, vitae interdum diam condimentum vel. Suspendisse potenti. Curabitur sed porta lacus.
          Donec tincidunt, leo eget hendrerit mattis, magna diam aliquam quam, ut efficitur ipsum
          sapien tincidunt lectus. Orci varius natoque penatibus et magnis dis parturient montes,
          nascetur ridiculus mus. Maecenas aliquam interdum magna nec imperdiet. Cras dapibus eu
          justo id tincidunt. In vitae viverra urna. Phasellus vitae feugiat dui. Fusce odio sapien,
          accumsan non erat in, pharetra convallis neque. Sed tempus mi non lacus dictum convallis.
          Duis quis arcu dolor.
        </p>
      </div>
    </div>
  );
};

const meta: Meta<typeof useSelection> = {
  title: "hooks/useSelection",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useSelection>;

export const Demo: Story = {};
