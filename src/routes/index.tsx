import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className='min-h-svh container mx-auto p-4'>
      <h1>Welcome to the App</h1>
    </main>
  )
}
