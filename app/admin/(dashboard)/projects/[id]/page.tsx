import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectBySlug, getWorkItems } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [workItems, detail] = await Promise.all([
    getWorkItems(),
    getProjectBySlug(id),
  ]);
  const item = workItems.find((entry) => entry.id === id) ?? undefined;

  if (!item && !detail) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground">Edit project</h2>
        <p className="mt-1 text-sm text-muted">
          {detail?.title ?? item?.name}
        </p>
      </div>
      <ProjectForm
        mode="edit"
        initialWork={item}
        initialDetail={detail}
      />
    </div>
  );
}
