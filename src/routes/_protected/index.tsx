import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_protected/')({
  component: App
});

function App() {

  return (
    <main className="space-y-4">
    </main>
  );
}
