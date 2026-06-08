import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type LineTab = {
  label: string
  value: string
}

type LineTabsProps = {
  tabs: LineTab[]
  value: string
  onValueChange: (value: string) => void
  withSeparator?: boolean
}

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

export function LineTabs({ tabs, value, onValueChange, withSeparator = true }: LineTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const tryMeasure = useCallback(() => {
    const tabsEl = tabsListRef.current
    const wrapperEl = wrapperRef.current
    if (!tabsEl || !wrapperEl) return

    const pos = measureIndicator(tabsEl, wrapperEl)
    if (pos) setIndicatorStyle(pos)
  }, [])

  const tabsListCallbackRef = useCallback((node: HTMLDivElement | null) => {
    tabsListRef.current = node
  }, [])

  const wrapperCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapperRef.current = node
      if (!node || !tabsListRef.current) return

      const pos = measureIndicator(tabsListRef.current, node)
      if (pos) setIndicatorStyle(pos)
    },
    [],
  )

  useLayoutEffect(() => {
    tryMeasure()
  }, [value, tryMeasure])

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const ro = new ResizeObserver(() => tryMeasure())
    ro.observe(wrapper)

    return () => ro.disconnect()
  }, [tryMeasure])

  return (
    <>
      <div className="px-[3px] py-0 sm:px-[7px] md:px-[15px]">
        <Tabs value={value} onValueChange={onValueChange}>
          <div
            ref={tabsListCallbackRef}
            className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div ref={wrapperCallbackRef} className="relative min-w-max">
              <TabsList variant="line" className="min-w-max justify-start pr-3 sm:pr-6">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
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
      {withSeparator ? <Separator /> : null}
    </>
  )
}
