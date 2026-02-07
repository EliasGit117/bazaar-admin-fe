import { createFileRoute } from '@tanstack/react-router'

const title = 'Users';

export const Route = createFileRoute('/_protected/users')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/users"!</div>
}
