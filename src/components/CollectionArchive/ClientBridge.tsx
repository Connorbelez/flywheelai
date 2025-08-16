"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core'
import type { CardPostData } from '@/components/Card'
import type { Parameter } from '../../../node_modules/.pnpm/@copilotkit+shared@1.10.2/node_modules/@copilotkit/shared/dist/index'

export const CollectionArchiveClientBridge: React.FC<{ posts: CardPostData[] }> = ({ posts }) => {
  const router = useRouter()

  const simplified = (posts || []).map((p) => ({
    slug: p.slug,
    title: p.title,
    categories: Array.isArray(p.categories)
      ? p.categories.map((c: any) => (typeof c === 'object' ? c?.title : c))
      : [],
  }))

  useCopilotReadable({
    description: 'List of currently visible posts in the archive grid with slug, title, and categories.',
    value: simplified,
  })

  const openPostParams = [
    { name: 'slug', type: 'string', description: 'The slug of the post to open', required: true },
  ] satisfies Parameter[]

  useCopilotAction({
    name: 'openPostBySlug',
    description: 'Navigate to a specific post details page by slug.',
    parameters: openPostParams,
    handler: async ({ slug }) => {
      if (typeof slug === 'string' && slug.trim()) router.push(`/posts/${slug}`)
      return 'ok'
    },
  })

  return null
}