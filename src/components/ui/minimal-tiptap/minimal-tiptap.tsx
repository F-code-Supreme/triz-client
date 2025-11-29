import './styles/index.css';

import { EditorContent } from '@tiptap/react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu';
import { MeasuredContainer } from './components/measured-container';
import { SectionFour } from './components/section/four';
import { SectionOne } from './components/section/one';
import { SectionThree } from './components/section/three';
import { SectionTwo } from './components/section/two';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';

import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';
import type { Content, Editor } from '@tiptap/react';

export interface MinimalTiptapProps extends Omit<
  UseMinimalTiptapEditorProps,
  'onUpdate'
> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionTwo
        editor={editor}
        activeActions={[
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'clearFormatting',
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2" />
    </div>
  </div>
);

export const MinimalTiptapEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return (
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn(
          'border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'bg-muted/50',
          className,
        )}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </MeasuredContainer>
    );
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        'border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn('minimal-tiptap-editor', editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
};

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
