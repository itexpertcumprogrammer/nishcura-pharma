import React, { useEffect, useRef, useCallback } from "react";

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
  const uniqueId = useRef<string>(`tinymce_${id}_${Math.random().toString(36).substr(2, 9)}`);
  const initializedRef = useRef<boolean>(false);

  // Update internal value ref without re-render
  useEffect(() => {
    valueRef.current = value;
    if (editorRef.current && initializedRef.current) {
      try {
        const currentContent = editorRef.current.getContent();
        if (currentContent !== value) {
          editorRef.current.setContent(value || "");
        }
      } catch (e) {
        // editor may have been destroyed
      }
    }
  }, [value]);

  useEffect(() => {
    let active = true;

    const tryInit = () => {
      const win = window as any;
      if (!win.tinymce) {
        setTimeout(() => { if (active) tryInit(); }, 200);
        return;
      }

      // Prevent double init
      if (initializedRef.current) return;

      try {
        win.tinymce.init({
          selector: `#${uniqueId.current}`,
          height: height,
          menubar: true,
          placeholder: placeholder,
          plugins: [
            "advlist", "autolink", "lists", "link", "charmap",
            "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "table", "help", "wordcount"
          ].join(" "),
          toolbar: [
            "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor |",
            "alignleft aligncenter alignright alignjustify |",
            "bullist numlist outdent indent | link | removeformat | code fullscreen | help"
          ].join(" "),
          skin: "oxide-dark",
          content_css: "dark",
          branding: false,
          promotion: false,
          setup: (editor: any) => {
            editorRef.current = editor;

            editor.on("init", () => {
              if (active) {
                initializedRef.current = true;
                editor.setContent(valueRef.current || "");
              }
            });

            editor.on("change keyup undo redo input", () => {
              try {
                const content = editor.getContent();
                valueRef.current = content;
                onChange(content);
              } catch (e) {}
            });
          }
        });
      } catch (e) {
        console.warn("TinyMCE init failed:", e);
      }
    };

    tryInit();

    return () => {
      active = false;
      initializedRef.current = false;
      const win = window as any;
      try {
        if (win.tinymce) {
          const ed = win.tinymce.get(uniqueId.current);
          if (ed) ed.remove();
        }
      } catch (e) {}
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <textarea
        id={uniqueId.current}
        ref={textareaRef}
        defaultValue={value}
        style={{ visibility: "hidden", height: 0, width: 0, position: "absolute" }}
      />
    </div>
  );
}
