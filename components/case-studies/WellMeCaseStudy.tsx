"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Footer from "@/components/Footer";
import { wellmeAsset } from "@/lib/staticCaseStudies";
import type { WorkItem } from "@/lib/work";

const ease = [0.22, 1, 0.36, 1] as const;

const heroMeta = [
  { label: "Client", value: "Personal" },
  { label: "Year", value: "2024" },
  { label: "Role", value: "UI/UX Designer" },
] as const;

const persona = {
  name: "Mark",
  role: "Firefighter / Incident Commander",
  rows: [
    {
      label: "Goals",
      value:
        "Stay mentally steady after high-stress calls, and keep work from swallowing family life.",
    },
    {
      label: "Needs",
      value:
        "Support he can open between calls, clear limits from any AI coach, and a path to a real person when things escalate.",
    },
    {
      label: "Frustrations",
      value:
        "Stigma in the service, apps built for calm daily habits, and tools that punish missed weeks.",
    },
    {
      label: "Context",
      value:
        "Ten years on the job. Irregular shifts. The hard fortnights are when generic wellness products fail him.",
    },
  ],
} as const;

const researchQuestions = [
  "Why do people put off asking for help — and what actually gets in the way?",
  "Why do high-stress roles keep using tools that were never built for their schedule?",
  "What would make someone trust an AI coach enough to talk honestly?",
] as const;

const fromTo = [
  {
    from: "Generic wellness apps",
    to: "A coach experience shaped around shift work and recovery, not daily streaks alone.",
  },
  {
    from: "Silent chat threads",
    to: "A visible suggestion when something deeper shows up — without forcing an incident log.",
  },
  {
    from: "Streaks that reset to zero",
    to: "A shift counter that decays and recovers through a bad fortnight.",
  },
  {
    from: "No clear escalation",
    to: "SOS that connects to a person — not a ticket number.",
  },
] as const;

const pathways = [
  {
    title: "Chat",
    body: "Ordinary conversation first. When the coach senses something heavier, a dedicated suggestion appears — continue quietly, or connect.",
  },
  {
    title: "Journal",
    body: "Short mindful journals that fit between calls — capture mood and context without a long ritual.",
  },
  {
    title: "SOS",
    body: "A clear path to a human when needed. Connecting, not escalating by default.",
  },
] as const;

const screenRows = [
  "Frame 2085668826.png",
  "Frame 2085668827.png",
  "Frame 2085668828.png",
  "Frame 2085668829.png",
  "Frame 2085668830.png",
] as const;

export default function WellMeCaseStudy({
  workItems = [],
}: {
  workItems?: WorkItem[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex flex-1 flex-col">
      <article className="w-full pb-4 pt-20 md:pt-24">
        {/* Hero — split like Figma */}
        <section className="grid gap-10 px-4 lg:grid-cols-[minmax(0,485px)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <motion.div
            className="lg:sticky lg:top-24"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Link
              href="/work"
              className="inline-flex text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              ← Back
            </Link>
            <p className="mt-12 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Case Study
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none text-foreground">
              Wellme
            </h1>
            <p className="mt-6 max-w-[360px] text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed tracking-[-0.02em] text-foreground">
              An AI well-being coach for people who don&apos;t have anyone to
              talk to.
            </p>
            <dl className="mt-12 flex flex-col gap-5">
              {heroMeta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm text-muted">{item.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <FadeImage
            src={wellmeAsset("Frame 2085668825.png")}
            alt="Wellme home screen on a phone held in hand"
            aspect="915 / 640"
            priority
            reduceMotion={reduceMotion}
          />
        </section>

        <div className="mt-16 flex flex-col gap-16 px-4 md:mt-24 md:gap-24">
          {/* 01 Background */}
          <CaseSection
            index="01"
            label="Background"
            title="Poor health support — and how the usual tools fail"
            reduceMotion={reduceMotion}
          >
            <p>
              People under sustained pressure — clinicians, first responders,
              shift workers — are told to “take care of themselves,” then handed
              products built for calm, consistent weeks.
            </p>
            <p>
              The result is a quiet gap: support exists in theory, but it
              disappears the moment life stops looking like a daily streak.
            </p>
            <Callout>
              But… the reality is that people don&apos;t find it easy to talk
              about their problems. They don&apos;t know who to trust — or
              whether an app will still be there after a bad fortnight.
            </Callout>
          </CaseSection>

          <div className="mx-auto grid w-full max-w-[915px] gap-2 md:grid-cols-2">
            <FadeImage
              src={wellmeAsset("Rectangle 34624378.png")}
              alt="Exhausted clinician sitting in a hospital hallway"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
            <FadeImage
              src={wellmeAsset("Frame 1618873217.png")}
              alt="Illustration of emotional overwhelm"
              aspect="451 / 460"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* 02 Problem */}
          <CaseSection
            index="02"
            label="The problem"
            title="Support exists — but not robust enough"
            reduceMotion={reduceMotion}
          >
            <p>
              Looking at the mental health landscape, plenty of general wellness
              apps exist. Very few are built for roles where the week is shaped
              by calls, overtime, and recovery — not by habit rings.
            </p>
            <p>
              Firefighters and other high-stakes workers carry stressors that a
              one-size product cannot meet. A platform for them has to respect
              irregular time, stigma, and the need for both private coaching and
              a human path when things escalate.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <NoteCard title="Core observation">
                Most mental health apps optimise for low-acuity, daily use —
                leaving high-risk occupations behind.
              </NoteCard>
              <NoteCard title="Need">
                A tailored resource designed for people whose “normal week”
                includes chaos — starting with the fire and rescue community.
              </NoteCard>
            </div>
          </CaseSection>

          <div className="mx-auto w-full max-w-[915px]">
            <FadeImage
              src={wellmeAsset("Frame 1618869415.png")}
              alt="Firefighter in full gear beside smoke and a shipping container"
              aspect="915 / 443"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* 03 User */}
          <CaseSection
            index="03"
            label="The user"
            title="User persona"
            reduceMotion={reduceMotion}
          >
            <p>
              To keep decisions concrete, I centred the product on a primary
              persona: a professional firefighter balancing the job with family
              life.
            </p>
            <div className="mt-8 overflow-hidden rounded border border-border bg-[#14110e]">
              <div className="border-b border-border px-5 py-5 md:px-6">
                <p className="text-2xl font-medium uppercase tracking-wide text-foreground">
                  {persona.name}
                </p>
                <p className="mt-1 text-sm text-muted">{persona.role}</p>
              </div>
              <dl>
                {persona.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 border-b border-border/70 px-5 py-4 last:border-b-0 md:grid-cols-[140px_1fr] md:gap-6 md:px-6"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                      {row.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-[#d9d9d9]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </CaseSection>

          <div className="mx-auto grid w-full max-w-[915px] gap-2 md:grid-cols-2">
            <FadeImage
              src={wellmeAsset("Frame 1618869415 (1).png")}
              alt="Stressed worker in a high-visibility vest"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
            <FadeImage
              src={wellmeAsset("Frame 1618869415 (2).png")}
              alt="Person quietly using a phone in low light"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* 04 Research */}
          <CaseSection
            index="04"
            label="Research"
            title="Three questions the product has to answer"
            reduceMotion={reduceMotion}
          >
            <p>
              Interviews, journey mapping, and competitive reviews kept coming
              back to the same three questions.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {researchQuestions.map((question, index) => (
                <div
                  key={question}
                  className="rounded border border-border bg-[#14110e] p-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                    Question 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection
            index="05"
            label="From → to"
            title="What the user wants"
            reduceMotion={reduceMotion}
          >
            <div className="overflow-hidden rounded border border-border">
              <div className="grid grid-cols-2 border-b border-border bg-[#14110e] text-xs uppercase tracking-wider text-muted">
                <p className="px-4 py-3">From</p>
                <p className="px-4 py-3">To</p>
              </div>
              {fromTo.map((row) => (
                <div
                  key={row.from}
                  className="grid grid-cols-1 border-b border-border/70 last:border-b-0 md:grid-cols-2"
                >
                  <p className="border-b border-border/50 px-4 py-4 text-sm text-muted md:border-b-0 md:border-r md:border-border/70">
                    {row.from}
                  </p>
                  <p className="px-4 py-4 text-sm text-foreground">{row.to}</p>
                </div>
              ))}
            </div>
          </CaseSection>

          <div className="mx-auto grid w-full max-w-[915px] gap-2 md:grid-cols-2">
            <FadeImage
              src={wellmeAsset("Frame 1618873216.png")}
              alt="Wellme assessment screen asking about mental health symptoms"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
            <FadeImage
              src={wellmeAsset("Frame 1618873215.png")}
              alt="Wellme app icon on a device home screen"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* Journey */}
          <CaseSection
            index="06"
            label="The journey"
            title="From install to home — three pathways"
            reduceMotion={reduceMotion}
          >
            <p>
              Onboarding stays honest: what the coach can and cannot do is
              stated before purchase. From home, three pathways stay visible —
              chat, journal, and SOS.
            </p>
          </CaseSection>

          <div className="mx-auto w-full max-w-[915px]">
            <FadeImage
              src={wellmeAsset("Frame 2085668806.png")}
              alt="Wellme user journey map from install through home, chat, journal, and SOS"
              aspect="715 / 416"
              reduceMotion={reduceMotion}
            />
          </div>

          <CaseSection
            index="07"
            label="AI & trust"
            title="Integrating AI with emotional intelligence"
            reduceMotion={reduceMotion}
          >
            <p>
              The coach reads ordinary conversation with a model plus a
              deterministic floor. When a suggestion is warranted, it appears as
              a dedicated banner — not buried in the thread — and can either
              continue chat quietly or connect the member to a person.
            </p>
          </CaseSection>

          <div className="mx-auto w-full max-w-[915px]">
            <FadeImage
              src={wellmeAsset("Frame 2085668807.png")}
              alt="Flow diagram from user message to coach suggestion, chat continues, or connecting"
              aspect="715 / 337"
              reduceMotion={reduceMotion}
            />
          </div>

          <CaseSection
            index="08"
            label="Product pathways"
            title="The three core user pathways"
            reduceMotion={reduceMotion}
          >
            <div className="flex flex-col gap-8">
              {pathways.map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="size-1.5 shrink-0 rounded-[1px] bg-[#8c8177]" />
                    <h3 className="text-lg font-medium text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="max-w-[715px] text-base leading-relaxed text-[#d9d9d9]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </CaseSection>

          <div className="mx-auto w-full max-w-[915px]">
            <FadeImage
              src={wellmeAsset("Frame 2085668819.png")}
              alt="Chart comparing daily streak resets versus a shift counter that recovers after a bad fortnight"
              aspect="713 / 252"
              reduceMotion={reduceMotion}
            />
            <p className="mt-3 text-center text-xs text-muted">
              The mechanic that builds a habit and the mechanic that survives a
              bad fortnight are not the same mechanic.
            </p>
          </div>

          {/* Brand */}
          <CaseSection
            index="09"
            label="Brand"
            title="Identity that stays soft under pressure"
            reduceMotion={reduceMotion}
          >
            <p>
              The mark is a two-tone brain with a quiet smile — approachable
              without becoming childish. Forest and mint accents keep screens
              calm even when the content is heavy.
            </p>
          </CaseSection>

          <div className="mx-auto grid w-full max-w-[915px] gap-2 md:grid-cols-2">
            <FadeImage
              src={wellmeAsset("Splash Screen.png")}
              alt="Wellme logo and wordmark"
              aspect="1 / 1"
              reduceMotion={reduceMotion}
            />
            <FadeImage
              src={wellmeAsset("Frame 1618873217 (1).png")}
              alt="Wellme brand and UI study"
              aspect="452 / 460"
              reduceMotion={reduceMotion}
            />
          </div>

          <div className="mx-auto w-full max-w-[915px]">
            <FadeImage
              src={wellmeAsset("Frame 1618869415 (3).png")}
              alt="Wellme product composition"
              aspect="915 / 580"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* Screens */}
          <CaseSection
            index="10"
            label="UI"
            title="Key screens"
            reduceMotion={reduceMotion}
          >
            <p>
              Assessment, commitment, home, chat, journals, and profile — built
              as one system so the coach experience stays coherent across
              pathways.
            </p>
          </CaseSection>

          <div className="mx-auto flex w-full max-w-[915px] flex-col gap-2">
            {screenRows.map((filename) => (
              <FadeImage
                key={filename}
                src={wellmeAsset(filename)}
                alt="Wellme app screen gallery"
                aspect="915 / 481"
                reduceMotion={reduceMotion}
              />
            ))}
            <FadeImage
              src={wellmeAsset("Frame 1618873265.png")}
              alt="Additional Wellme product screens"
              aspect="915 / 480"
              reduceMotion={reduceMotion}
            />
          </div>

          {/* Learnings */}
          <CaseSection
            index="11"
            label="Close"
            title="Learnings and next steps"
            reduceMotion={reduceMotion}
          >
            <ul className="flex flex-col gap-4">
              {[
                "Design for recovery, not just acquisition — habit mechanics must survive interruption.",
                "Keep AI suggestions visible but optional; never force escalation from ordinary chat.",
                "State limits early so trust is earned before the first hard conversation.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-[1px] bg-[#8c8177]" />
                  <span className="text-base leading-relaxed text-[#d9d9d9]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </CaseSection>

          <div className="mx-auto flex w-full max-w-[915px] justify-end border-t border-border py-2">
            <Link
              href="/work"
              className="text-base text-muted transition-colors hover:text-foreground"
            >
              Back to work →
            </Link>
          </div>
        </div>
      </article>

      <Footer workItems={workItems} />
    </main>
  );
}

function CaseSection({
  index,
  label,
  title,
  children,
  reduceMotion,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.section
      className="mx-auto w-full max-w-[715px]"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {index} / {label}
      </p>
      <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-medium uppercase leading-tight tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-[#d9d9d9]">
        {children}
      </div>
    </motion.section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-border bg-[#14110e] px-5 py-4 text-base font-medium leading-relaxed text-foreground">
      {children}
    </p>
  );
}

function NoteCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-border bg-[#14110e] p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
        {title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function FadeImage({
  src,
  alt,
  aspect,
  priority,
  reduceMotion,
}: {
  src: string;
  alt: string;
  aspect: string;
  priority?: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-[5px] bg-border"
      style={{ aspectRatio: aspect }}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 915px"
        className="object-cover"
      />
    </motion.div>
  );
}
