import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCode2Icon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
} from 'lucide-react'

import type { FileTreeItem } from './-data'

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

export function formatDate(dateIso: string) {
  const d = new Date(dateIso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatTime(dateIso: string) {
  const d = new Date(dateIso)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function roundToNearestFive(value: number) {
  return Math.round(value / 5) * 5
}

export function formatScore(value: number, decimals: number) {
  return value.toFixed(decimals)
}
