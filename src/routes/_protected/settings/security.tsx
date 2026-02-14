import { SessionsCard } from '@/components/auth/sessions-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/settings/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <SessionsCard className='md:max-w-md'/>
    </main>
  )
}
