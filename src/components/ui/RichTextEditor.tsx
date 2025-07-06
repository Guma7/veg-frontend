'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styled from 'styled-components'

const EditorContainer = styled.div`
  .ProseMirror {
    min-height: 150px;
    padding: 1rem;
    border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
    font-family: ${props => props.theme.fonts.primary};
    font-size: 1rem;
    line-height: 1.5;
    outline: none;
    cursor: text !important;
    caret-color: auto !important;
    
    &:focus {
      cursor: text !important;
      caret-color: auto !important;
    }
    
    * {
      cursor: text !important;
      caret-color: auto !important;
    }
    > * + * {
      margin-top: 0.75em;
    }
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${props => props.theme.colors.text.disabled};
      pointer-events: none;
      height: 0;
      font-style: italic;
    }
    ul, ol {
      padding: 0 1rem;
    }
  }
  .tiptap-toolbar {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
    background-color: ${props => props.theme.colors.background.secondary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  .tiptap-button {
    background: transparent;
    border: none;
    border-radius: ${props => props.theme.borderRadius.sm};
    padding: 0.25rem 0.5rem;
    margin-right: 0.25rem;
    cursor: pointer;
    &:hover {
      background-color: ${props => props.theme.colors.background.hover};
    }
    &.is-active {
      background-color: ${props => props.theme.colors.primary};
      color: white;
    }
  }
  .tiptap-editor {
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    background-color: ${props => props.theme.colors.background.paper};
    
    .ProseMirror-focused {
      cursor: text !important;
      caret-color: auto !important;
    }
  }
  
  /* Força cursor de texto em todos os elementos do editor */
  .tiptap-editor,
  .tiptap-editor *,
  .ProseMirror,
  .ProseMirror *,
  [data-tiptap-editor],
  [data-tiptap-editor] * {
    cursor: text !important;
    caret-color: auto !important;
  }
  
  /* Exceção para botões da toolbar */
  .tiptap-toolbar,
  .tiptap-toolbar *,
  .tiptap-button,
  .tiptap-button * {
    cursor: pointer !important;
    caret-color: transparent !important;
  }
`

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  simple?: boolean
}

const MenuButton = ({ editor, icon, command, isActive }: { 
  editor: Editor | null, 
  icon: string, 
  command: () => void, 
  isActive?: () => boolean 
}) => {
  if (!editor) return null
  return (
    <button
      type="button"
      onClick={command}
      className={`tiptap-button ${isActive && isActive() ? 'is-active' : ''}`}
    >
      {icon}
    </button>
  )
}

export const RichTextEditor = forwardRef(({ value, onChange, placeholder = 'Escreva aqui...', simple = false }: RichTextEditorProps, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content',
        'data-placeholder': placeholder,
      },
    },
    immediatelyRender: false
  })
  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    getEditorElement: () => document.querySelector('.ProseMirror')
  }))
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])
  return (
    <EditorContainer>
      <div className="tiptap-editor">
        <div className="tiptap-toolbar">
          <MenuButton 
            editor={editor} 
            icon="B" 
            command={() => editor?.chain().focus().toggleBold().run()}
            isActive={() => editor?.isActive('bold') || false}
          />
          <MenuButton 
            editor={editor} 
            icon="I" 
            command={() => editor?.chain().focus().toggleItalic().run()}
            isActive={() => editor?.isActive('italic') || false}
          />
          {!simple && (
            <MenuButton 
              editor={editor} 
              icon="S" 
              command={() => editor?.chain().focus().toggleStrike().run()}
              isActive={() => editor?.isActive('strike') || false}
            />
          )}
          <MenuButton 
            editor={editor} 
            icon="1." 
            command={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={() => editor?.isActive('orderedList') || false}
          />
          <MenuButton 
            editor={editor} 
            icon="•" 
            command={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={() => editor?.isActive('bulletList') || false}
          />
          {!simple && (
            <>
              <MenuButton 
                editor={editor} 
                icon="H1" 
                command={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={() => editor?.isActive('heading', { level: 1 }) || false}
              />
              <MenuButton 
                editor={editor} 
                icon="H2" 
                command={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={() => editor?.isActive('heading', { level: 2 }) || false}
              />
              <MenuButton 
                editor={editor} 
                icon="H3" 
                command={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={() => editor?.isActive('heading', { level: 3 }) || false}
              />
              <MenuButton 
                editor={editor} 
                icon="↩" 
                command={() => editor?.chain().focus().undo().run()}
              />
              <MenuButton 
                editor={editor} 
                icon="↪" 
                command={() => editor?.chain().focus().redo().run()}
              />
            </>
          )}
        </div>
        <EditorContent editor={editor} />
      </div>
    </EditorContainer>
  )
})