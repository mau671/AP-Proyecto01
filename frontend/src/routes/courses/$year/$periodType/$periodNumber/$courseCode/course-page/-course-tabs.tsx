import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { courseTabs } from './-data'

function measureIndicator(
  tabsListEl: HTMLElement,
  wrapperEl: HTMLElement,
): { left: number; width: number } | null {
  const trigger = tabsListEl.querySelector<HTMLElement>('[data-slot="tabs-trigger"][aria-selected="true"]')
  if (!trigger) return null

  const wrapperRect = wrapperEl.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()

  return {
    left: triggerRect.left - wrapperRect.left,
    width: triggerRect.width,
  }
}

type CourseTabsProps = {
  tabIndex: number
  onTabChange: (tabIndex: number) => void
}

export function CourseTabs({ tabIndex, onTabChange }: CourseTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const separatorWrapperRef = useRef<HTMLDivElement>(null)

  const tryMeasure = useCallback(() => {
    const tabsEl = tabsListRef.current
    const wrapperEl = separatorWrapperRef.current
    if (!tabsEl || !wrapperEl) return
    const pos = measureIndicator(tabsEl, wrapperEl)
    if (pos) setIndicatorStyle(pos)
  }, [])

  const tabsListCallbackRef = useCallback((node: HTMLDivElement | null) => {
    tabsListRef.current = node
  }, [])

  const separatorCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      separatorWrapperRef.current = node
      if (!node || !tabsListRef.current) return
      const pos = measureIndicator(tabsListRef.current, node)
      if (pos) setIndicatorStyle(pos)
    },
    [],
  )

  useLayoutEffect(() => {
    tryMeasure()
  }, [tabIndex, tryMeasure])

  useLayoutEffect(() => {
    const wrapper = separatorWrapperRef.current
    if (!wrapper) return

    const ro = new ResizeObserver(() => tryMeasure())
    ro.observe(wrapper)

    return () => ro.disconnect()
  }, [tryMeasure])

  return (
    <div className="px-3 py-0 sm:px-6">
      <Tabs
        value={String(tabIndex)}
        onValueChange={(value) => {
          const nextTab = Number(value)
          if (!Number.isInteger(nextTab)) return
          onTabChange(nextTab)
        }}
      >
        <div
          ref={tabsListCallbackRef}
          className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={separatorCallbackRef} className="relative min-w-max">
            <TabsList variant="line" className="min-w-max justify-start pr-3 sm:pr-6">
              {courseTabs.map((tab, index) => (
                <TabsTrigger key={tab} value={String(index)}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            {indicatorStyle && (
              <div
                className="absolute bottom-0 h-0.5 bg-foreground transition-[left,width] duration-300 ease"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
