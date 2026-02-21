import { createFileRoute } from '@tanstack/react-router';
import { UserSelectDropdown } from '@/components/user-select-dropdown';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { AdminUserStatus } from '@/api/generated';


export const Route = createFileRoute('/_protected/users/select')({
  component: RouteComponent
});

function RouteComponent() {
  const [userId, setUserId] = useState<number | undefined>(3);

  return (
    <main className="space-y-4">
      <UserSelectDropdown
        prefetch
        value={userId}
        onValueChange={(v) => setUserId(v)}
        isItemDisabled={user => user.status !== AdminUserStatus.ACTIVE}
        className="w-full max-w-sm"
      />

      <div className="flex gap-2 items-center">
        <Button variant="destructive" onClick={() => setUserId(undefined)}>
          Clear
        </Button>

        <Button onClick={() => setUserId(1)}>
          Set test user 1
        </Button>

        <Button onClick={() => setUserId(3)}>
          Set test user 3
        </Button>

        <Button onClick={() => setUserId(4)}>
          Set test user 4
        </Button>
      </div>
    </main>
  );
}
