import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudioShell } from "@/components/StudioShell";

export const Route = createFileRoute("/studio")({
  component: StudioLayout,
  head: () => ({ meta: [{ title: "Studio — Looply" }] }),
});

function StudioLayout() {
  return (
    <StudioShell>
      <Outlet />
    </StudioShell>
  );
}
