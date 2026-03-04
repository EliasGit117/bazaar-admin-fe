import { createFileRoute } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { CreateStoreSheet } from '@/routes/_protected/stores/-components/create-store-sheet/sheet.tsx';
import {
  CreateStoreSheetProvider,
  CreateStoreSheetTrigger
} from '@/routes/_protected/stores/-components/create-store-sheet';



const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Stores', ro: 'Magaznie', ru: 'Магазины' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/stores/')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  component: RouteComponent
});

function RouteComponent() {

  return (
    <CreateStoreSheetProvider>

      <main className="space-y-4">
        <div className='flex gap-2 items-center'>
          <CreateStoreSheetTrigger size="sm" variant="ghost" className="ml-auto" tooltipSide='bottom'/>
        </div>
      </main>

      <CreateStoreSheet/>
    </CreateStoreSheetProvider>
  );
}
