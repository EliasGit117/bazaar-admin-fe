import { createFileRoute } from '@tanstack/react-router'

const title = 'Vendors';

export const Route = createFileRoute('/_protected/vendors')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/vendors"!</div>
}
