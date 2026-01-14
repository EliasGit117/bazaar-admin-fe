import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.tsx';
import { CheckIcon, FileWarningIcon, InfoIcon, TrashIcon } from 'lucide-react';

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent
});

const variants = [
  'info',
  'success',
  'error',
  'warning',
  'message'
] as const;
type TToastVariant = typeof variants[number];

function RouteComponent() {

  const sendToast = (type: TToastVariant) => {
    toast[type](`Toast: ${type} type`, {
      description: 'Some message that is in the description'
    });
  };

  return (
    <main className="flex flex-col items-start gap-2">
      <Button onClick={() => sendToast('success')}>
        <CheckIcon/>
        <span>Success</span>
      </Button>


      <Button onClick={() => sendToast('info')} variant="outline">
        <InfoIcon/>
        <span>Info</span>
      </Button>

      <Button onClick={() => sendToast('warning')} variant="secondary">
        <FileWarningIcon/>
        <span>Warning</span>
      </Button>

      <Button onClick={() => sendToast('error')} variant="default">
        <TrashIcon/>
        <span>Destructive</span>
      </Button>
    </main>
  );

}
