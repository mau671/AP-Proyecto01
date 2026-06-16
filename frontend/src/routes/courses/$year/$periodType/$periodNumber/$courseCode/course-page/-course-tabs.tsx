import { LineTabs } from '@/components/line-tabs'
import { useRouter, useLocation, useParams } from '@tanstack/react-router'
import { courseTabs } from './-data'

export function CourseTabs() {
  const router = useRouter()
  const location = useLocation()
  const params = useParams({ strict: false }) as any
  const basePath = `/courses/${params.year}/${params.periodType}/${params.periodNumber}/${params.courseCode}/${params.groupNumber}`
  
  const currentPath = location.pathname.replace(basePath, '')

  let activeIndex = 0
  if (currentPath.startsWith('/attendance')) activeIndex = 1
  else if (currentPath.startsWith('/evaluations')) activeIndex = 2
  else if (currentPath.startsWith('/calendar')) activeIndex = 3
  else if (currentPath.startsWith('/documents')) activeIndex = 4
  else if (currentPath.startsWith('/gaap')) activeIndex = 5
  else if (currentPath.startsWith('/teacher-evaluation')) activeIndex = 6

  const paths = [
    '/home',
    '/attendance',
    '/evaluations',
    '/calendar',
    '/documents',
    '/gaap',
    '/teacher-evaluation'
  ]

  return (
    <LineTabs
      tabs={courseTabs.map((tab, index) => ({ label: tab, value: String(index) }))}
      value={String(activeIndex)}
      onValueChange={(value) => {
        const nextTab = Number(value)
        if (!Number.isInteger(nextTab)) return
        router.navigate({ to: basePath + paths[nextTab] })
      }}
    />
  )
}
