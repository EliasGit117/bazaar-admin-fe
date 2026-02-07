import { createFileRoute } from '@tanstack/react-router'

const title = 'Support';

export const Route = createFileRoute('/_protected/support')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/support"!</div>
}
