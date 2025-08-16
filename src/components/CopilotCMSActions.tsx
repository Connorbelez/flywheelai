"use client"
import React, { useMemo } from 'react'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'

function textToLexicalRichText(text: string) {
  const clean = (text || '').trim()
  return {
    root: {
      type: 'root',
      direction: null as any,
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null as any,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: clean,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

export const CopilotCMSActions: React.FC = () => {
  const endpoint = '/api/posts'

  useCopilotReadable({
    description: 'CMS endpoint for creating and updating posts.',
    value: { endpoint },
  })

  useCopilotAction({
    name: 'createCMSPost',
    description:
      'Create a new CMS post (e.g., from a LinkedIn draft). Requires admin session cookies to be present.',
    parameters: [
      { name: 'title', type: 'string', description: 'Post title', required: true },
      { name: 'linkedinText', type: 'string', description: 'Body text to publish', required: true },
      { name: 'publish', type: 'boolean', description: 'Whether to set status to published' },
    ],
    handler: async ({ title, linkedinText, publish }) => {
      const content = textToLexicalRichText(String(linkedinText ?? ''))
      const body = {
        title: String(title ?? '').trim(),
        content,
        _status: publish ? 'published' : 'draft',
        meta: {
          title: String(title ?? '').trim(),
          description: String(linkedinText ?? '').trim().slice(0, 160),
        },
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(`Failed to create post: ${res.status} ${errText}`)
      }
      const json = await res.json()
      return json?.doc?.id || json?.id || 'created'
    },
  })

  useCopilotAction({
    name: 'updateCMSPost',
    description: 'Update an existing CMS post by ID.',
    parameters: [
      { name: 'id', type: 'string', description: 'Post ID', required: true },
      { name: 'title', type: 'string', description: 'New title' },
      { name: 'linkedinText', type: 'string', description: 'New body text' },
      { name: 'publish', type: 'boolean', description: 'Publish now' },
    ],
    handler: async ({ id, title, linkedinText, publish }) => {
      const patch: any = {}
      if (title) patch.title = String(title).trim()
      if (typeof linkedinText === 'string') patch.content = textToLexicalRichText(linkedinText)
      if (typeof publish === 'boolean') patch._status = publish ? 'published' : 'draft'

      const res = await fetch(`${endpoint}/${encodeURIComponent(String(id))}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(patch),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(`Failed to update post: ${res.status} ${errText}`)
      }
      const json = await res.json()
      return json?.doc?.id || json?.id || 'updated'
    },
  })

  return null
}