import React, { useEffect, useRef } from "react";

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export default function RichTextEditor({ id, value, onChange, height = 200, placeholder = "" }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const valueRef = useRef<string>(value);

  // Synchronize incoming value updates without causing cursor jumps or feedback loops
  useEffect(() => {
    valueRef.current = value;
    if (editorRef.current && editorRef.current.getContent() !== value) {
      editorRef.current.setContent(value);
    }
  }, [value]);

  useEffect(() => {
    let active = true;

    const initEditor = () => {
      const win = window as any;
      if (!win.tinymce) {
        // Retry shortly if TinyMCE script is still loading in the background
        setTimeout(() => {
          if (active) initEditor();
        }, 150);
        return;
      }

      win.tinymce.init({
        target: textareaRef.current,
        height: height,
        menubar: false,
        placeholder: placeholder,
        plugins: "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
        toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code",
        skin: "oxide-dark",
        content_css: "dark",
        setup: (editor: any) => {
          editorRef.current = editor;
          
          editor.on("init", () => {
            if (active) {
              editor.setContent(valueRef.current);
            }
          });

          // Capture various change triggers and propagate back to Parent Form State
          editor.on("change keyup undo redo", () => {
            const content = editor.getContent();
            valueRef.current = content;
            onChange(content);
          });
        }
      });
    };

    initEditor();

    return () => {
      active = false;
      const win = window as any;
      if (win.tinymce && textareaRef.current) {
        win.tinymce.remove(textareaRef.current);
      }
    };
  }, [height, placeholder]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden" id={id}>
      <textarea ref={textareaRef} className="opacity-0 w-full" style={{ height }} />
    </div>
  );
}
