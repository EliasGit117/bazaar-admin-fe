import { createFileRoute } from '@tanstack/react-router'

const title = 'Feedback';

export const Route = createFileRoute('/_protected/feedback')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/feedback"!</div>
}
