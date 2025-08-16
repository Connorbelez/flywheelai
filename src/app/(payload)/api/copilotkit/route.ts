import { NextRequest } from 'next/server'
import { copilotRuntimeNextJSAppRouterEndpoint, CopilotRuntime, EmptyAdapter } from '@copilotkit/runtime'
import { MastraAgent } from '@ag-ui/mastra'
import { mastra } from '@/mastra'

const runtime = new CopilotRuntime({
  agents: MastraAgent.getLocalAgents({ mastra }),
})

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter: new EmptyAdapter(),
  endpoint: '/api/copilotkit',
})

export const POST = (req: NextRequest) => endpoint.POST(req)
export const GET = (req: NextRequest) => endpoint.GET(req)