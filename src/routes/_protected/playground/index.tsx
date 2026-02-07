import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/playground/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/playground/"!</div>
}
