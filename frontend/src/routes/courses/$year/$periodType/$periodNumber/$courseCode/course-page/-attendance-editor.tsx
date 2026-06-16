import { useState, useEffect } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { es } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "@/components/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import "@blocknote/mantine/style.css";

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  courseCode?: string;
  weekNumber?: number;
  sessionDate?: Date;
}

export function AttendanceEditor({ initialContent, onChange, editable = true, courseCode, weekNumber, sessionDate }: EditorProps) {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [isExporting, setIsExporting] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!initialContent);

  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setResolvedTheme(media.matches ? "dark" : "light");
      
      const onMediaChange = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? "dark" : "light");
      media.addEventListener("change", onMediaChange);
      return () => media.removeEventListener("change", onMediaChange);
    } else {
      setResolvedTheme(theme as "light" | "dark");
    }
  }, [theme]);

  const editor = useCreateBlockNote({
    dictionary: es,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  }) as BlockNoteEditor;

  const handleExport = async (fmt: "pdf" | "docx" | "odt") => {
    setIsExporting(true);
    try {
      let blob: Blob;
      const weekStr = weekNumber !== undefined ? String(weekNumber).padStart(2, '0') : '00';
      const dateStr = sessionDate ? format(sessionDate, 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy');
      const baseName = `${courseCode || 'Apuntes'} - Semana ${weekStr} ${dateStr}`;
      let filename: string;
      
      if (fmt === "pdf") {
        const { PDFExporter, pdfDefaultSchemaMappings } = await import("@blocknote/xl-pdf-exporter");
        const { pdf } = await import("@react-pdf/renderer");
        const exporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);
        const pdfDocument = await exporter.toReactPDFDocument(editor.document);
        blob = await pdf(pdfDocument).toBlob();
        filename = `${baseName}.pdf`;
      } else if (fmt === "docx") {
        const { DOCXExporter, docxDefaultSchemaMappings } = await import("@blocknote/xl-docx-exporter");
        const { Packer } = await import("docx");
        const exporter = new DOCXExporter(editor.schema, docxDefaultSchemaMappings);
        const docxDocument = await exporter.toDocxJsDocument(editor.document);
        blob = await Packer.toBlob(docxDocument);
        filename = `${baseName}.docx`;
      } else {
        const { ODTExporter, odtDefaultSchemaMappings } = await import("@blocknote/xl-odt-exporter");
        const exporter = new ODTExporter(editor.schema, odtDefaultSchemaMappings);
        blob = await exporter.toODTDocument(editor.document);
        filename = `${baseName}.odt`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Error al exportar el documento");
    } finally {
      setIsExporting(false);
    }
  };

  const checkEmpty = (doc: any[]) => {
    return doc.length === 0 || (doc.length === 1 && doc[0].type === 'paragraph' && (!doc[0].content || doc[0].content.length === 0));
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-1 min-h-[400px]">
        <div className="absolute right-0 z-10" style={{ bottom: "calc(100% + 2px)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isExporting || isEmpty}
              className={`text-[13px] leading-none font-medium focus-visible:outline-none flex items-center gap-1.5 ${isEmpty ? 'text-muted-foreground/40 cursor-not-allowed' : 'text-muted-foreground hover:underline'}`}
            >
              {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Exportar
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("docx")}>
                Word (.docx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("odt")}>
                OpenDocument (.odt)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <BlockNoteView 
          editor={editor} 
          editable={editable}
          theme={resolvedTheme} 
          onChange={() => {
            const doc = editor.document;
            setIsEmpty(checkEmpty(doc));
            if (onChange) {
              onChange(JSON.stringify(doc));
            }
          }} 
        />
      </div>
    </div>
  );
}
