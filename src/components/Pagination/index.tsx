'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  useCopilotReadable({
    description: 'Pagination state for the posts listing page.',
    value: { page, totalPages, hasNextPage, hasPrevPage },
  })

  useCopilotAction({
    name: 'goToPage',
    description: 'Navigate to a specific page number in the posts listing.',
    parameters: [
      { name: 'page', type: 'number', description: 'The page number to navigate to.', required: true },
    ],
    handler: async ({ page: target }) => {
      const safe = Math.min(Math.max(1, Math.floor(target || 1)), totalPages)
      router.push(`/posts/page/${safe}`)
      return 'ok'
    },
  })

  useCopilotAction({
    name: 'nextPage',
    description: 'Navigate to the next page if available.',
    parameters: [],
    handler: async () => {
      if (hasNextPage) router.push(`/posts/page/${page + 1}`)
      return 'ok'
    },
  })

  useCopilotAction({
    name: 'prevPage',
    description: 'Navigate to the previous page if available.',
    parameters: [],
    handler: async () => {
      if (hasPrevPage) router.push(`/posts/page/${page - 1}`)
      return 'ok'
    },
  })

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                router.push(`/posts/page/${page - 1}`)
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/posts/page/${page - 1}`)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                router.push(`/posts/page/${page}`)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(`/posts/page/${page + 1}`)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => {
                router.push(`/posts/page/${page + 1}`)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
