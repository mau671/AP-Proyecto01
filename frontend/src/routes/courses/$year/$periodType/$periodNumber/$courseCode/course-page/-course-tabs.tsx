import { LineTabs } from '@/components/line-tabs'

import { courseTabs } from './-data'

type CourseTabsProps = {
  tabIndex: number
  onTabChange: (tabIndex: number) => void
}

export function CourseTabs({ tabIndex, onTabChange }: CourseTabsProps) {
  return (
    <LineTabs
      tabs={courseTabs.map((tab, index) => ({ label: tab, value: String(index) }))}
      value={String(tabIndex)}
      onValueChange={(value) => {
        const nextTab = Number(value)
        if (!Number.isInteger(nextTab)) return
        onTabChange(nextTab)
      }}
    />
  )
}
