'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  useCopilotReadable({
    description: 'Current search query string typed by the user in the search input.',
    value,
  })

  useCopilotAction({
    name: 'setSearchQuery',
    description: 'Set the search input value and navigate to the corresponding results page.',
    parameters: [
      { name: 'newQuery', type: 'string', description: 'The new search query string to set.', required: true },
    ],
    handler: async ({ newQuery }) => {
      setValue(newQuery ?? '')
      return 'ok'
    },
  })

  useCopilotAction({
    name: 'clearSearch',
    description: 'Clear the search input value and navigate back to the search page without a query.',
    parameters: [],
    handler: async () => {
      setValue('')
      return 'ok'
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
          value={value}
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
