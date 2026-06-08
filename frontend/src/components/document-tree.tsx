import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import {
  ChevronRightIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileCode2Icon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

export type FileLeaf = { name: string; sizeBytes: number; modifiedAt: string }
export type FileTreeItem = FileLeaf | { name: string; items: FileTreeItem[]; modifiedAt: string }

type DocumentTreeProps = {
  items: FileTreeItem[]
  className?: string
}

export function DocumentTree({ items, className = 'mx-auto w-full max-w-6xl' }: DocumentTreeProps) {
  const [menuState, setMenuState] = useState<{ x: number; y: number; target: string } | null>(null)

  useEffect(() => {
    const close = () => setMenuState(null)
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('click', close)
    window.addEventListener('keydown', onEscape)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  const openContextMenu = (event: ReactMouseEvent, target: string) => {
    event.preventDefault()
    event.stopPropagation()
    setMenuState({ x: event.clientX, y: event.clientY, target })
  }

  const renderItem = (item: FileTreeItem) => {
    if ('items' in item) {
      const totalSize = getTreeSize(item)

      return (
        <Collapsible key={item.name}>
          <CollapsibleTrigger
            className="group grid w-full cursor-pointer grid-cols-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent md:grid-cols-[minmax(0,1fr)_96px_160px]"
            onContextMenu={(event) => openContextMenu(event, item.name)}
          >
            <span className="flex min-w-0 items-start gap-2 md:items-center">
              <ChevronRightIcon className="size-4 shrink-0 transition-transform group-data-[panel-open]:rotate-90" />
              <FolderIcon className="size-4 shrink-0 text-muted-foreground group-data-[panel-open]:hidden" />
              <FolderOpenIcon className="hidden size-4 shrink-0 text-muted-foreground group-data-[panel-open]:block" />
              <span className="min-w-0">
                <span className="block truncate">{item.name}</span>
                <span className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground md:hidden">
                  <span className="font-mono">{formatBytes(totalSize)}</span>
                  <span className="font-mono">{formatModified(item.modifiedAt)}</span>
                </span>
              </span>
            </span>
            <span className="hidden text-right font-mono text-muted-foreground md:block">{formatBytes(totalSize)}</span>
            <span className="hidden text-right font-mono text-muted-foreground md:block">{formatModified(item.modifiedAt)}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 mt-1 space-y-1">{item.items.map((child) => renderItem(child))}</CollapsibleContent>
        </Collapsible>
      )
    }

    const Icon = getFileIcon(item.name)

    return (
      <button
        key={item.name}
        type="button"
        className="grid w-full cursor-pointer grid-cols-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent md:grid-cols-[minmax(0,1fr)_96px_160px]"
        onContextMenu={(event) => openContextMenu(event, item.name)}
      >
        <span className="flex min-w-0 items-start gap-2 md:items-center">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0">
            <span className="block truncate">{item.name}</span>
            <span className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground md:hidden">
              <span className="font-mono">{formatBytes(item.sizeBytes)}</span>
              <span className="font-mono">{formatModified(item.modifiedAt)}</span>
            </span>
          </span>
        </span>
        <span className="hidden text-right font-mono text-muted-foreground md:block">{formatBytes(item.sizeBytes)}</span>
        <span className="hidden text-right font-mono text-muted-foreground md:block">{formatModified(item.modifiedAt)}</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <div className={`${className} space-y-1`}>
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
          <span>Nombre</span>
        </div>
        <div className="hidden grid-cols-[minmax(0,1fr)_96px_160px] gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span>Nombre</span>
          <span className="text-right">Tamaño</span>
          <span className="text-right">Modificado</span>
        </div>
        <Separator />
        <div className="space-y-1 pt-1">{items.map((item) => renderItem(item))}</div>
      </div>

      {menuState ? (
        <div
          className="fixed z-50 min-w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
          style={{ left: menuState.x, top: menuState.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-2 py-1.5 text-xs text-muted-foreground">{menuState.target}</div>
          <Separator />
          <button type="button" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">Subir archivo</button>
          <button type="button" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">Descargar</button>
          <button type="button" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">Crear carpeta</button>
          <button type="button" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">Renombrar</button>
          <button type="button" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10">Eliminar</button>
        </div>
      ) : null}
    </div>
  )
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}

export function formatModified(dateIso: string) {
  const d = new Date(dateIso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function getTreeSize(item: FileTreeItem): number {
  if ('items' in item) return item.items.reduce((acc, child) => acc + getTreeSize(child), 0)
  return item.sizeBytes
}

export function getFileIcon(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''

  if (['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'go', 'rs'].includes(extension)) return FileCode2Icon
  if (extension === 'json') return FileJsonIcon
  if (['xls', 'xlsx', 'csv'].includes(extension)) return FileSpreadsheetIcon
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return FileImageIcon
  if (['mp4', 'mov', 'mkv', 'avi'].includes(extension)) return FileVideoIcon
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) return FileAudioIcon
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return FileArchiveIcon
  if (['txt', 'pdf', 'doc', 'docx', 'md'].includes(extension)) return FileTextIcon
  return FileIcon
}
