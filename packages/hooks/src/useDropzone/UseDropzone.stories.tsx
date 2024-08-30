import type { Meta, StoryObj } from "@storybook/react";
import { useDropzone } from "./useDropzone";

const Component = () => {
  const { dropzoneRef, dragging, files, openFilePicker, removeFile } = useDropzone({
    limit: 10,
    onDrop(files, event) {
      console.log(files, event);
      return true;
    },
  });

  return (
    <div>
      <button
        type="button"
        ref={dropzoneRef}
        onClick={openFilePicker}
        style={{
          border: "1px dashed black",
          width: 200,
          height: 100,
          background: dragging ? "pink" : undefined,
        }}
      >
        {dragging ? "Drop here!" : "Choose files"}
      </button>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <button onClick={() => removeFile(file.id)} type="button">
              remove
            </button>
            <span>{file.name}</span>
            <span>({file.size} bytes)</span>
            {file.type?.startsWith("image/") ? (
              <img
                src={file.url}
                alt={file.type}
                style={{ height: 80, width: 80, objectFit: "cover" }}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

const meta: Meta<typeof useDropzone> = {
  title: "hooks/useDropzone",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof useDropzone>;

export const Demo: Story = {};
