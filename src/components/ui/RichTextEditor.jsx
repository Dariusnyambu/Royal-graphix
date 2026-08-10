import { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import {
  Undo2, Redo2, Heading1, Heading2, Heading3, Pilcrow, Bold, Italic,
  UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Link2, Link2Off, Image as ImageIcon,
  Youtube as YoutubeIcon, Minus, Eraser,
} from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`editor-btn${active ? ' is-active' : ''}`}
      style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
    </button>
  )
}

function Divider() { return <div className="editor-divider" /> }

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your article...', minHeight = 260 }) {
  const { upload } = useImageUpload()
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Youtube.configure({ width: 640, height: 360, nocookie: true, HTMLAttributes: { class: 'rte-video' } }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  }, [])

  const setLink = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    if (editor.state.selection.empty) {
      window.alert('Select the text you want to turn into a link first.')
      return
    }
    const url = window.prompt('Enter a URL')
    if (!url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const insertImage = useCallback(() => { fileInputRef.current?.click() }, [])

  const handleImageFile = useCallback(async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editor) return
    const { url, error } = await upload(file, 'blog', 'blog-images')
    if (error || !url) { window.alert('Image upload failed. Please try again.'); return }
    editor.chain().focus().setImage({ src: url }).run()
    const caption = window.prompt('Add a caption for this image (optional):', '')
    if (caption?.trim()) {
      editor.chain().focus().insertContent(`<p style="text-align:center;font-size:0.85rem;font-style:italic;">${caption.trim()}</p>`).run()
    }
  }, [editor, upload])

  const insertVideo = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Paste a YouTube video URL')
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url })
  }, [editor])

  if (!editor) return null

  return (
    <div>
      <div className="editor-toolbar">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo2 size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo2 size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Paragraph"><Pilcrow size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title={editor.isActive('link') ? 'Remove Link' : 'Insert Link'}>
          {editor.isActive('link') ? <Link2Off size={16} strokeWidth={1.8} /> : <Link2 size={16} strokeWidth={1.8} />}
        </ToolbarButton>
        <ToolbarButton onClick={insertImage} title="Insert Image"><ImageIcon size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={insertVideo} title="Embed YouTube Video"><YoutubeIcon size={16} strokeWidth={1.8} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Divider"><Minus size={16} strokeWidth={1.8} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Remove Formatting"><Eraser size={16} strokeWidth={1.8} /></ToolbarButton>
      </div>
      <div className="tiptap-body" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
    </div>
  )
}
