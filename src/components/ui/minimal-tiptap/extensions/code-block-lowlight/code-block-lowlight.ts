import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export const CodeBlockLowlight = TiptapCodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: null,
  HTMLAttributes: {
    class: 'block-node',
  },
});

export default CodeBlockLowlight;
