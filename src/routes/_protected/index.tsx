import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

export const Route = createFileRoute('/_protected/')({
  component: App,
})

function App() {
  return (
    <main className='container mx-auto p-4 space-y-4'>
      <h1>Welcome to the App</h1>
      <div className='flex gap-2 items-center'>
        <Button>
          <CheckIcon/>
          <span>Submit</span>
        </Button>
      </div>
    </main>
  )
}
