import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MealCard } from '@/components/meal-card'
import type { Entry, MealSummary } from '@/types'

describe('MealCard component', () => {
  const emptySummary: MealSummary = {
    key: 'breakfast',
    label: 'Breakfast',
    description: 'Start with steady energy.',
    entries: [],
    totalCalories: 0,
  }

  const sampleEntry: Entry = {
    id: 'entry-1',
    meal: 'breakfast',
    quantity: 1,
    food: {
      name: 'Greek yogurt with berries',
      servingLabel: '1 bowl',
      calories: 220,
      macros: { protein: 19, carbs: 24, fat: 5 },
    },
    totalCalories: 220,
    createdAt: new Date().toISOString(),
  }

  it('renders empty state when no entries are logged', () => {
    render(
      <MealCard
        summary={emptySummary}
        onDuplicate={vi.fn()}
        onDelete={vi.fn()}
        isHighlightedEntry={() => false}
      />,
    )

    expect(screen.getByText('Breakfast')).toBeInTheDocument()
    expect(screen.getByText('Nothing logged yet')).toBeInTheDocument()
  })

  it('renders logged entries and triggers duplicate and delete callbacks', () => {
    const handleDuplicate = vi.fn()
    const handleDelete = vi.fn()

    const filledSummary: MealSummary = {
      ...emptySummary,
      entries: [sampleEntry],
      totalCalories: 220,
    }

    render(
      <MealCard
        summary={filledSummary}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        isHighlightedEntry={() => false}
      />,
    )

    expect(screen.getByText('Greek yogurt with berries')).toBeInTheDocument()
    expect(screen.getByText('220 kcal')).toBeInTheDocument()

    const duplicateButton = screen.getByRole('button', {
      name: /Duplicate Greek yogurt with berries/i,
    })
    fireEvent.click(duplicateButton)
    expect(handleDuplicate).toHaveBeenCalledWith(sampleEntry)

    const deleteButton = screen.getByRole('button', {
      name: /Delete Greek yogurt with berries/i,
    })
    fireEvent.click(deleteButton)
    expect(handleDelete).toHaveBeenCalledWith(sampleEntry)
  })
})
