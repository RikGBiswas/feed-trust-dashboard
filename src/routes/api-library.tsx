import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api-library')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api-library"!</div>
}
