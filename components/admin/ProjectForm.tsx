"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  DEFAULT_PROJECT_META,
  WIDGET_CATALOG,
  createEmptyWidget,
  resolveProjectWidgets,
  type Project,
  type ProjectCaptionedImage,
  type ProjectMeta,
  type ProjectWidget,
  type ProjectWidgetType,
} from "@/lib/projects";
import type { WorkItem } from "@/lib/work";

type Props = {
  initialWork?: WorkItem;
  initialDetail?: Project | null;
  mode: "create" | "edit";
};

function ensureMeta(meta?: ProjectMeta[], work?: WorkItem): ProjectMeta[] {
  const labels = DEFAULT_PROJECT_META.map((item) => item.label);
  const map = new Map((meta ?? []).map((item) => [item.label, item.value]));
  return labels.map((label) => ({
    label,
    value:
      map.get(label) ??
      (label === "Industry"
        ? work?.meta ?? ""
        : label === "Year"
          ? work?.year ?? new Date().getFullYear().toString()
          : label === "Role"
            ? "UX/UI Designer"
            : ""),
  }));
}

export default function ProjectForm({
  initialWork,
  initialDetail,
  mode,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(
    initialDetail?.title ?? initialWork?.name ?? "",
  );
  const [slug, setSlug] = useState(
    initialDetail?.slug ?? initialWork?.id ?? "",
  );
  const [summary, setSummary] = useState(initialDetail?.summary ?? "");
  const [siteUrl, setSiteUrl] = useState(initialDetail?.siteUrl ?? "");
  const [cover, setCover] = useState(
    initialDetail?.cover ?? initialWork?.image ?? "",
  );
  const [coverAlt, setCoverAlt] = useState(initialDetail?.coverAlt ?? "");
  const [meta, setMeta] = useState<ProjectMeta[]>(
    ensureMeta(initialDetail?.meta, initialWork),
  );
  const [widgets, setWidgets] = useState<ProjectWidget[]>(() =>
    initialDetail ? resolveProjectWidgets(initialDetail) : [],
  );
  const [aspect, setAspect] = useState(initialWork?.aspect ?? "346 / 260");
  const [comingSoon, setComingSoon] = useState(
    Boolean(initialWork?.comingSoon),
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  function updateMeta(label: string, value: string) {
    setMeta((prev) =>
      prev.map((item) => (item.label === label ? { ...item, value } : item)),
    );
  }

  function addWidget(type: ProjectWidgetType) {
    setWidgets((prev) => [...prev, createEmptyWidget(type)]);
    setPickerOpen(false);
  }

  function updateWidget(id: string, next: ProjectWidget) {
    setWidgets((prev) => prev.map((widget) => (widget.id === id ? next : widget)));
  }

  function removeWidget(id: string) {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
  }

  function moveWidget(id: string, direction: -1 | 1) {
    setWidgets((prev) => {
      const index = prev.findIndex((widget) => widget.id === id);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item!);
      return copy;
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const industry =
      meta.find((item) => item.label.toLowerCase() === "industry")?.value ||
      "Project";
    const year =
      meta.find((item) => item.label.toLowerCase() === "year")?.value ||
      new Date().getFullYear().toString();

    const cleanedWidgets = widgets
      .map(cleanWidget)
      .filter((widget): widget is ProjectWidget => widget !== null);

    const payload = {
      title,
      slug: mode === "create" ? slug : undefined,
      summary,
      siteUrl,
      cover,
      coverAlt: coverAlt || `${title} cover`,
      meta: meta.filter((item) => item.label.trim() && item.value.trim()),
      widgets: cleanedWidgets,
      name: title,
      image: cover,
      industry,
      year,
      aspect,
      comingSoon,
    };

    try {
      const id = initialWork?.id ?? initialDetail?.slug ?? slug;
      const res = await fetch(
        mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-3xl space-y-10">
      <section className="space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
            Project header
          </p>
          <h3 className="mt-1 text-lg font-medium text-foreground">
            Sidebar + cover
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title">
            <input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (mode === "create" && !slugTouched) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, ""),
                  );
                }
              }}
              className="admin-input"
            />
          </Field>
          <Field label="Slug">
            <input
              required={mode === "create"}
              value={slug}
              disabled={mode === "edit"}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="admin-input disabled:opacity-60"
            />
          </Field>
        </div>

        <Field label="Summary">
          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="admin-input resize-y"
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          {meta.map((item) => (
            <Field key={item.label} label={item.label}>
              <input
                value={item.value}
                onChange={(e) => updateMeta(item.label, e.target.value)}
                className="admin-input"
              />
            </Field>
          ))}
        </div>

        <Field label="Visit site URL">
          <input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="admin-input"
            placeholder="https://..."
          />
        </Field>

        <ImageUploadField value={cover} onChange={setCover} label="Cover image" />
        <Field label="Cover alt">
          <input
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
            className="admin-input"
          />
        </Field>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Content widgets
            </p>
            <h3 className="mt-1 text-lg font-medium text-foreground">
              Page sections
            </h3>
            <p className="mt-1 text-sm text-muted">
              Add any section, reorder, and stack them like the detail layouts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background"
          >
            {pickerOpen ? "Close" : "+ Add widget"}
          </button>
        </div>

        {pickerOpen ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {WIDGET_CATALOG.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addWidget(item.type)}
                className="rounded border border-border bg-[#14110e] px-3 py-3 text-left transition-colors hover:border-muted"
              >
                <span className="block text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-muted">{item.hint}</span>
              </button>
            ))}
          </div>
        ) : null}

        {widgets.length === 0 ? (
          <p className="rounded border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No widgets yet. Add a paragraph, image, slider, points, bullets, or
            metrics.
          </p>
        ) : (
          <div className="space-y-4">
            {widgets.map((widget, index) => (
              <WidgetEditor
                key={widget.id}
                widget={widget}
                index={index}
                total={widgets.length}
                onChange={(next) => updateWidget(widget.id, next)}
                onRemove={() => removeWidget(widget.id)}
                onMoveUp={() => moveWidget(widget.id, -1)}
                onMoveDown={() => moveWidget(widget.id, 1)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h3 className="text-lg font-medium text-foreground">Work listing</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Listing aspect ratio">
            <input
              value={aspect}
              onChange={(e) => setAspect(e.target.value)}
              className="admin-input"
              placeholder="346 / 260"
            />
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={comingSoon}
              onChange={(e) => setComingSoon(e.target.checked)}
            />
            Coming soon
          </label>
        </div>
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Publish project"
              : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded border border-border px-4 py-2 text-sm text-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function cleanWidget(widget: ProjectWidget): ProjectWidget | null {
  switch (widget.type) {
    case "paragraph":
      return widget.body.trim()
        ? { ...widget, body: widget.body.trim() }
        : null;
    case "heading":
      return widget.title.trim()
        ? {
            ...widget,
            title: widget.title.trim(),
            body: widget.body?.trim() || undefined,
          }
        : null;
    case "image":
      return widget.src.trim()
        ? {
            ...widget,
            src: widget.src.trim(),
            alt: widget.alt.trim(),
            caption: widget.caption?.trim() || undefined,
          }
        : null;
    case "slider":
    case "gallery": {
      const images = widget.images
        .filter((image) => image.src.trim())
        .map((image) => ({
          src: image.src.trim(),
          alt: image.alt.trim(),
          caption: image.caption?.trim() || undefined,
        }));
      return images.length ? { ...widget, images } : null;
    }
    case "points": {
      const items = widget.items.filter(
        (item) => item.title.trim() || item.body.trim(),
      );
      return items.length
        ? {
            ...widget,
            title: widget.title?.trim() || undefined,
            items,
          }
        : null;
    }
    case "bullets": {
      const items = widget.items.map((item) => item.trim()).filter(Boolean);
      return items.length
        ? {
            ...widget,
            title: widget.title?.trim() || undefined,
            items,
          }
        : null;
    }
    case "metrics": {
      const items = widget.items.filter(
        (item) => item.value.trim() || item.label.trim(),
      );
      return items.length
        ? {
            ...widget,
            title: widget.title?.trim() || undefined,
            items,
          }
        : null;
    }
  }
}

function WidgetEditor({
  widget,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  widget: ProjectWidget;
  index: number;
  total: number;
  onChange: (next: ProjectWidget) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const label =
    WIDGET_CATALOG.find((item) => item.type === widget.type)?.label ??
    widget.type;

  return (
    <div className="space-y-4 rounded border border-border bg-[#14110e] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
            Widget {index + 1}
          </p>
          <p className="text-sm font-medium text-foreground">{label}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="text-xs text-muted hover:text-foreground disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="text-xs text-muted hover:text-foreground disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-muted hover:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>

      {widget.type === "paragraph" ? (
        <textarea
          rows={4}
          value={widget.body}
          onChange={(e) => onChange({ ...widget, body: e.target.value })}
          className="admin-input resize-y"
          placeholder="Paragraph…"
        />
      ) : null}

      {widget.type === "heading" ? (
        <div className="space-y-3">
          <input
            value={widget.title}
            onChange={(e) => onChange({ ...widget, title: e.target.value })}
            className="admin-input"
            placeholder="Section title"
          />
          <textarea
            rows={3}
            value={widget.body ?? ""}
            onChange={(e) => onChange({ ...widget, body: e.target.value })}
            className="admin-input resize-y"
            placeholder="Optional body"
          />
        </div>
      ) : null}

      {widget.type === "image" ? (
        <CaptionedImageFields
          value={{
            src: widget.src,
            alt: widget.alt,
            caption: widget.caption,
          }}
          onChange={(image) =>
            onChange({
              ...widget,
              src: image.src,
              alt: image.alt,
              caption: image.caption,
            })
          }
        />
      ) : null}

      {widget.type === "slider" || widget.type === "gallery" ? (
        <ImageListEditor
          images={widget.images}
          onChange={(images) => onChange({ ...widget, images })}
        />
      ) : null}

      {widget.type === "points" ? (
        <div className="space-y-3">
          <SectionTitleFields
            title={widget.title ?? ""}
            number={widget.number}
            onTitle={(title) => onChange({ ...widget, title })}
            onNumber={(number) => onChange({ ...widget, number })}
          />
          {widget.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="space-y-2 rounded border border-border/70 p-3"
            >
              <div className="flex justify-between">
                <span className="text-xs text-muted">Point {itemIndex + 1}</span>
                <button
                  type="button"
                  className="text-xs text-muted hover:text-red-400"
                  onClick={() =>
                    onChange({
                      ...widget,
                      items: widget.items.filter((_, i) => i !== itemIndex),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <input
                value={item.title}
                onChange={(e) =>
                  onChange({
                    ...widget,
                    items: widget.items.map((row, i) =>
                      i === itemIndex ? { ...row, title: e.target.value } : row,
                    ),
                  })
                }
                className="admin-input"
                placeholder="Point title"
              />
              <textarea
                rows={2}
                value={item.body}
                onChange={(e) =>
                  onChange({
                    ...widget,
                    items: widget.items.map((row, i) =>
                      i === itemIndex ? { ...row, body: e.target.value } : row,
                    ),
                  })
                }
                className="admin-input resize-y"
                placeholder="Description"
              />
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={() =>
              onChange({
                ...widget,
                items: [...widget.items, { title: "", body: "" }],
              })
            }
          >
            + Add point
          </button>
        </div>
      ) : null}

      {widget.type === "bullets" ? (
        <div className="space-y-3">
          <SectionTitleFields
            title={widget.title ?? ""}
            number={widget.number}
            onTitle={(title) => onChange({ ...widget, title })}
            onNumber={(number) => onChange({ ...widget, number })}
          />
          {widget.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <input
                value={item}
                onChange={(e) =>
                  onChange({
                    ...widget,
                    items: widget.items.map((row, i) =>
                      i === itemIndex ? e.target.value : row,
                    ),
                  })
                }
                className="admin-input flex-1"
                placeholder="Bullet text"
              />
              <button
                type="button"
                className="text-xs text-muted hover:text-red-400"
                onClick={() =>
                  onChange({
                    ...widget,
                    items: widget.items.filter((_, i) => i !== itemIndex),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={() =>
              onChange({ ...widget, items: [...widget.items, ""] })
            }
          >
            + Add bullet
          </button>
        </div>
      ) : null}

      {widget.type === "metrics" ? (
        <div className="space-y-3">
          <SectionTitleFields
            title={widget.title ?? ""}
            number={widget.number}
            onTitle={(title) => onChange({ ...widget, title })}
            onNumber={(number) => onChange({ ...widget, number })}
          />
          {widget.items.map((item, itemIndex) => (
            <div key={itemIndex} className="grid grid-cols-2 gap-2">
              <input
                value={item.value}
                onChange={(e) =>
                  onChange({
                    ...widget,
                    items: widget.items.map((row, i) =>
                      i === itemIndex ? { ...row, value: e.target.value } : row,
                    ),
                  })
                }
                className="admin-input"
                placeholder="5,000+"
              />
              <div className="flex gap-2">
                <input
                  value={item.label}
                  onChange={(e) =>
                    onChange({
                      ...widget,
                      items: widget.items.map((row, i) =>
                        i === itemIndex
                          ? { ...row, label: e.target.value }
                          : row,
                      ),
                    })
                  }
                  className="admin-input flex-1"
                  placeholder="Traders community"
                />
                <button
                  type="button"
                  className="text-xs text-muted hover:text-red-400"
                  onClick={() =>
                    onChange({
                      ...widget,
                      items: widget.items.filter((_, i) => i !== itemIndex),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-muted hover:text-foreground"
            onClick={() =>
              onChange({
                ...widget,
                items: [...widget.items, { value: "", label: "" }],
              })
            }
          >
            + Add metric
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SectionTitleFields({
  title,
  number,
  onTitle,
  onNumber,
}: {
  title: string;
  number?: number;
  onTitle: (value: string) => void;
  onNumber: (value: number | undefined) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[100px_1fr]">
      <Field label="Number">
        <input
          type="number"
          min={1}
          value={number ?? ""}
          onChange={(e) =>
            onNumber(e.target.value ? Number(e.target.value) : undefined)
          }
          className="admin-input"
          placeholder="1"
        />
      </Field>
      <Field label="Section title">
        <input
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className="admin-input"
          placeholder="Problem / Challenge"
        />
      </Field>
    </div>
  );
}

function ImageListEditor({
  images,
  onChange,
}: {
  images: ProjectCaptionedImage[];
  onChange: (images: ProjectCaptionedImage[]) => void;
}) {
  return (
    <div className="space-y-3">
      {images.map((image, index) => (
        <div
          key={index}
          className="space-y-3 rounded border border-border/70 p-3"
        >
          <div className="flex justify-between">
            <span className="text-xs text-muted">Slide {index + 1}</span>
            <button
              type="button"
              className="text-xs text-muted hover:text-red-400"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
          <CaptionedImageFields
            value={image}
            onChange={(next) =>
              onChange(images.map((row, i) => (i === index ? next : row)))
            }
          />
        </div>
      ))}
      <button
        type="button"
        className="text-xs text-muted hover:text-foreground"
        onClick={() =>
          onChange([...images, { src: "", alt: "", caption: "" }])
        }
      >
        + Add slide
      </button>
    </div>
  );
}

function CaptionedImageFields({
  value,
  onChange,
}: {
  value: ProjectCaptionedImage;
  onChange: (next: ProjectCaptionedImage) => void;
}) {
  return (
    <div className="space-y-3">
      <ImageUploadField
        value={value.src}
        onChange={(src) => onChange({ ...value, src })}
        label="Image"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={value.caption ?? ""}
          onChange={(e) => onChange({ ...value, caption: e.target.value })}
          className="admin-input"
          placeholder="[ 1.1 Caption ]"
        />
        <input
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className="admin-input"
          placeholder="Alt text"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
