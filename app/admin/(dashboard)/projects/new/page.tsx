import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground">Add project</h2>
        <p className="mt-1 text-sm text-muted">
          Build the detail page with reusable widgets — paragraphs, images,
          sliders, points, bullets, metrics, and galleries.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
