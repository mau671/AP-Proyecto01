import { DocumentTree } from '@/components/document-tree'

import { documentsTree } from './-data'

export function DocumentsTab() {
  return (
    <div className="p-6">
      <DocumentTree items={documentsTree} />
    </div>
  )
}
