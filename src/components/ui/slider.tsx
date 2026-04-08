import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-(--surface-elevated-strong)">
        <SliderPrimitive.Range className="absolute h-full bg-(--tone-strong)" />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-5 rounded-full border border-white/70 bg-(--tone-strong) shadow-(--shadow-soft) transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--tone-soft)"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
