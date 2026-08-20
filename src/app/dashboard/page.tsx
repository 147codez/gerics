import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { readStore, sortedImages } from "@/lib/store";
import { selectWeekly, weekIndex } from "@/lib/rotation";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isAuthed()) redirect("/login");

  const store = await readStore();
  const images = sortedImages(store);
  const wk = weekIndex();
  const thisWeek = selectWeekly(images, store.settings.mode, 4, wk).map((i) => i.id);
  const nextWeek = selectWeekly(images, store.settings.mode, 4, wk + 1).map((i) => i.id);

  return (
    <Dashboard
      initialImages={images}
      initialMode={store.settings.mode}
      initialWeeklyEnabled={store.settings.weeklyEnabled}
      thisWeekIds={thisWeek}
      nextWeekIds={nextWeek}
    />
  );
}
