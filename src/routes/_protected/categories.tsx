import { createFileRoute } from '@tanstack/react-router'

const title = 'Categories';

export const Route = createFileRoute('/_protected/categories')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/categories"!</div>
}
