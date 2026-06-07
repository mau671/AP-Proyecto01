import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

import { documentsTree, type FileTreeItem } from './-data'
import { formatBytes, formatModified, getFileIcon, getTreeSize } from './-utils'

export function DocumentsTab() {
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

    return (
      <button
        key={item.name}
        type="button"
        className="grid w-full cursor-pointer grid-cols-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent md:grid-cols-[minmax(0,1fr)_96px_160px]"
        onContextMenu={(event) => openContextMenu(event, item.name)}
      >
        <span className="flex min-w-0 items-start gap-2 md:items-center">
          {(() => {
            const Icon = getFileIcon(item.name)
            return <Icon className="size-4 shrink-0 text-muted-foreground" />
          })()}
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
    <div className="relative p-6">
      <div className="mx-auto w-full max-w-6xl space-y-1">
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
          <span>Nombre</span>
        </div>
        <div className="hidden grid-cols-[minmax(0,1fr)_96px_160px] gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span>Nombre</span>
          <span className="text-right">Tamaño</span>
          <span className="text-right">Modificado</span>
        </div>
        <Separator />
        <div className="space-y-1 pt-1">{documentsTree.map((item) => renderItem(item))}</div>
      </div>

      {menuState && (
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
      )}
    </div>
  )
}
