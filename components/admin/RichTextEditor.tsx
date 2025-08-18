import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Quote,
  Code,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
  className = ''
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none focus:outline-none min-h-[300px] p-4'
      }
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="animate-pulse bg-neutral-800 rounded-lg h-[300px]"></div>;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-amber-500 text-black' 
          : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-neutral-700 rounded-lg bg-neutral-900 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-700 bg-neutral-800 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setShowImageInput(!showImageInput)}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* History */}
        <div className="flex items-center gap-1 ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 border-b border-neutral-700 bg-neutral-800">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && addLink()}
            />
            <button
              onClick={addLink}
              className="px-3 py-1 bg-amber-500 text-black rounded hover:bg-amber-600 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-3 py-1 bg-neutral-600 text-neutral-300 rounded hover:bg-neutral-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-2 border-b border-neutral-700 bg-neutral-800">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
            />
            <button
              onClick={addImage}
              className="px-3 py-1 bg-amber-500 text-black rounded hover:bg-amber-600 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
              }}
              className="px-3 py-1 bg-neutral-600 text-neutral-300 rounded hover:bg-neutral-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-neutral-900">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] max-h-[600px] overflow-y-auto"
        />
        {!editor.getText().trim() && (
          <div className="absolute top-0 left-0 p-4 text-neutral-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor; 