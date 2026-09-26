"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Footer from "@/components/Footer";
import { wellmeAsset } from "@/lib/staticCaseStudies";
import type { WorkItem } from "@/lib/work";

const ease = [0.22, 1, 0.36, 1] as const;
const accent = "#87817a";

const meta = [
  { label: "Industry", value: "Wellness" },
  { label: "Year", value: "2025" },
  { label: "Role", value: "Product Designer" },
] as const;

const personaRows = [
  {
    label: "Context",
    value:
      "Married, two young kids. Sits in the driveway for fifteen minutes after a hard shift before going inside.",
  },
  {
    label: "Goal",
    value:
      "Stop bringing the job home. Wants something he can use without calling it therapy.",
  },
  {
    label: "Barrier",
    value:
      "Won't sign up with a work email. Won't nominate a single trauma — for him it's cumulative, not one incident.",
  },
  {
    label: "Trigger",
    value: "Late night, alone in a parked car. Tired eyes, one hand free.",
  },
  {
    label: "Quote",
    value: "“It's never the one call. It's the four hundredth.”",
  },
] as const;

const competitiveRows = [
  {
    product: "Calm / Headspace",
    values: ["Yes", "Yes", "No", "No", "User"],
  },
  {
    product: "Woebot",
    values: ["Yes", "Yes", "No", "No", "User"],
  },
  {
    product: "Wysa",
    values: ["Depends", "Yes", "No", "Yes", "Use or Emp"],
  },
  {
    product: "Responder-specific tools",
    values: ["No", "Yes", "Partly", "Yes", "Department"],
  },
  {
    product: "Employer EAP",
    values: ["No", "No", "No", "Yes", "Department"],
  },
  {
    product: "Wellme",
    values: ["Yes", "Yes", "Yes", "Yes", "User"],
  },
] as const;

const competitiveHeaders = [
  "Product",
  "Invisible to Employers",
  "Available 3AM",
  "Shift-aware",
  "Human Escalation",
  "Bought by",
] as const;

const howMightWe = [
  "make it clear that no employer can identify a user — before they've paid anything?",
  "be usable by someone in a dark parked car, one-handed, out of patience?",
  "reveal consistency without punishing the person whose shift pattern broke it?",
] as const;

const madeTheCut = [
  {
    feature: "Anonymous third-party personal purchase",
    why: "No work email, no department license. The transaction itself is what keeps it invisible.",
  },
  {
    feature: "Voice-first journaling",
    why: "Matches the real context — parked car, tired, one hand. Under twenty seconds to a completed entry.",
  },
  {
    feature: "Shift-aware tracking",
    why: "Counts streaks per shift, not per day. A daily streak is incoherent inside a 24-hour cycle.",
  },
  {
    feature: "SOS — talk to a person",
    why: "A permanent route to a human, outside the payroll, owned by the user rather than by the state.",
  },
] as const;

const didNotMakeIt = [
  "Badges and leaderboards. Competitive framing, aimed at a culture already competitive about not needing help.",
  "Default push notifications. A wellbeing prompt lighting up a phone on a station table is an outing risk. Off at install.",
  "Employer-facing dashboard. In small team sizes, aggregate data is identifying. The thing you'd sell to the chief is the thing that guarantees his crew won't install it.",
] as const;

const decisions = [
  {
    title: "The paywall is what keeps it private",
    rows: [
      {
        label: "Problem",
        body: "Wellme requires an active plan. My first instinct was that a paywall in front of a mental health product is pure friction — a barrier between a struggling person and help.",
      },
      {
        label: "Rationale",
        body: "For this user, it's the opposite. A department-purchased licence means the department has a list. A personal app subscription leaves no record with the employer at all. Paying for it yourself is the strongest privacy guarantee the product can offer, and it's structural rather than a promise.",
      },
      {
        label: "Design",
        body: "The paywall had to earn the payment before asking. Plan selection is preceded by a plain-language screen showing exactly what is stored on-device, what reaches the server, and what any employer receives — nothing.",
      },
    ],
  },
  {
    title: "Streaks punish the person who needs it most",
    rows: [
      {
        label: "Problem",
        body: "A daily streak is the strongest habit mechanism available — and it's wrong here. It breaks by design on a 24-hour routine that first responders don't have.",
      },
      {
        label: "Chosen",
        body: "Count streaks per shift, not per day. And the counter never resets to zero — it decays slowly and is fully recoverable. Coming back after a dozen days shows you at 71, not at 0. There's no rock bottom, so there's nothing to be ashamed of returning from.",
      },
      {
        label: "Cost",
        body: "Weaker dopamine loop, no shareable milestones, plus extra onboarding screens to explain the shift pattern.",
      },
    ],
    chart: "Frame 2085668819.png",
    chartCaption:
      "The mechanic that builds a habit and the mechanic that survives a bad fortnight are not the same mechanic.",
  },
  {
    title: "The coach suggests a person — it never forces one",
    rows: [
      {
        label: "Problem",
        body: "There's no constant help button. The coach monitors conversations and suggests speaking to a real person when it detects genuinely dark sentiment. That intervention causes a problem: when the suggestion appears, users realise they've been observed — triggering the very fear that keeps them from seeking help.",
      },
      {
        label: "Option",
        body: "A clinical alert (“we've detected signs of crisis”) is abrasive and feels like a diagnosis. A silent hand-off that drops a human into the chat removes the user's control at the moment they most need to feel they have some. Both were rejected.",
      },
      {
        label: "Chosen",
        body: "The suggestion is written as something the coach says, not something the system displays. “This sounds like more than I can help with — do you want to talk to someone?” is a step in the conversation. It names an offer, not a crisis.",
      },
      {
        label: "Cost",
        body: "Because it's a UI moment that appears when the system detects something suitable — it can't be found by browsing — a user won't go looking for it before they need it.",
      },
    ],
  },
] as const;

const nextSteps = [
  {
    label: "Validate the persona",
    body: "Eight to twelve interviews, recruited through a union rather than a department — department-brokered recruitment selects for people comfortable being seen in a mental health study, which is the wrong sample.",
  },
  {
    label: "Test the other side of SOS",
    body: "I designed the user's experience of reaching a human. The responder's side — what context they receive, what happens when several requests land at once — is unvalidated, and it's the half where failure costs most.",
  },
  {
    label: "Pressure-test the paywall",
    body: "The argument that personal purchase protects privacy is sound, but it's still a barrier at the worst possible moment. I'd want to know the drop-off before defending it as anything more than a necessary trade-off.",
  },
  {
    label: "The principle I'll carry forward",
    body: "Every meaningful decision here came from the observation that the user's refusal is rational. Once you accept that, privacy stops being a settings screen and starts being the first thing you design.",
  },
] as const;

const screenGalleries = [
  "Frame 2085668826.png",
  "Frame 2085668827.png",
  "Frame 2085668828.png",
  "Frame 2085668829.png",
  "Frame 2085668830.png",
] as const;

const brandColors = [
  { name: "Night", hex: "#0C1417", swatch: "#0C1417" },
  { name: "Petrol", hex: "#0F3D46", swatch: "#0F3D46" },
  { name: "Sea", hex: "#2C7A72", swatch: "#2C7A72" },
  { name: "Signal", hex: "#D99A2B", swatch: "#D99A2B" },
  { name: "Paper", hex: "#EFEFE9", swatch: "#EFEFE9" },
] as const;

export default function WellMeCaseStudy({
  workItems = [],
}: {
  workItems?: WorkItem[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex flex-1 flex-col">
      <article className="w-full px-4 pb-4 pt-20 md:pt-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          {/* Sidebar — matches Figma sticky left column */}
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(485px,34%)]">
            <motion.div
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

              <h1 className="mt-12 text-[clamp(1.75rem,3vw,2rem)] font-medium leading-tight text-foreground">
                Wellme
              </h1>

              <p className="mt-6 max-w-[344px] text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed tracking-[-0.02em] text-foreground">
                An AI wellbeing coach for people who can&apos;t be seen asking
                for help.
              </p>

              <dl className="mt-12 flex flex-col gap-5">
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-medium text-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </aside>

          {/* Content column — 915px Figma width, 20px gaps */}
          <div className="mx-auto flex w-full min-w-0 max-w-[915px] flex-1 flex-col gap-5 lg:mx-0">
            <FadeImage
              src={wellmeAsset("Frame 2085668825.png")}
              alt="Wellme home screen on a phone"
              aspect="915 / 640"
              priority
              reduceMotion={reduceMotion}
            />

            {/* 01 — The brief */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>00 — The brief</SectionLabel>
              <SectionTitle>
                What Wellme is, and what I was asked to solve
              </SectionTitle>
              <p>
                Wellme is an AI wellbeing app built around an AI coach and
                journaling habit. The version live today is aimed at a general
                consumer audience. This case study is a concept built on top of
                it: could the same core mechanic — talk to an AI coach, keep a
                journal, reach a human when it&apos;s not enough — be re-pointed
                at a much narrower, much higher-need audience, and would that
                change the product at all?
              </p>
              <p>
                I picked first responders as the test case. Not because the
                market is obviously larger, but because it&apos;s the steepest
                version of the underlying question: what does a wellbeing
                product look like for someone who has real, structural reasons
                not to trust it?
              </p>
              <NoteBox label="Next">
                The scenario raises an immediate question: if the audience
                already has support available to them, why build another product
                at all?
              </NoteBox>
            </TextBlock>

            <div className="grid gap-3 md:grid-cols-2">
              <FadeImage
                src={wellmeAsset("Rectangle 34624378.png")}
                alt="Exhausted clinician in a hospital hallway"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
              <FadeImage
                src={wellmeAsset("Frame 1618873217.png")}
                alt="Illustration of emotional overwhelm"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
            </div>

            {/* 01 — The problem */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>01 — The problem</SectionLabel>
              <SectionTitle>Support exists. Almost nobody uses it.</SectionTitle>
              <p className="italic text-[#ffffff] text-[20px]">
                Most employers offer mental health support. In high-stress
                professions, annual uptake sits in the low single digits — and
                the reason isn&apos;t a lack of need.
              </p>
              <p>
                For first responders, paramedics and dispatchers, asking for
                help carries an occupational cost. A disclosed mental health
                condition can trigger a fitness-for-duty review. The barrier
                isn&apos;t stigma in the soft sense — it&apos;s an accurate risk
                calculation about your career.
              </p>
              <p>
                That insight set the direction for everything: privacy isn&apos;t
                a compliance checkbox here, it&apos;s the product proposition.
              </p>
              <QuoteCallout label="The design question:">
                How do you build something people will talk to honestly, when
                their whole professional instinct is to leave no traces?
              </QuoteCallout>
              <NoteBox label="Task">
                I needed one concrete person to design against, so the fear had
                somewhere to land.
              </NoteBox>
            </TextBlock>

            <FadeImage
              src={wellmeAsset("Frame 1618869415.png")}
              alt="Firefighter in full gear"
              aspect="915 / 443"
              reduceMotion={reduceMotion}
            />

            {/* 03 — Who's it for */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>02 — Who&apos;s it for</SectionLabel>
              <SectionTitle>Proto-persona</SectionTitle>
              <p className="italic text-[#ffffff] text-[20px]">
                Built from desk research and stated assumptions rather than
                primary interviews. A hypothesis to design against, not a
                finding.
              </p>

              <div className="mt-8 overflow-hidden rounded bg-[#241F1A]">
                <div className="border-b border-border px-5 py-5 md:px-6">
                  <p className="text-2xl font-medium uppercase tracking-wide text-foreground">
                    Marcus
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Paramedic * 11 years * 24 / 48 rotation
                  </p>
                </div>
                <dl>
                  {personaRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-2 border-b border-border/70 px-5 py-4 last:border-b-0 md:grid-cols-[120px_1fr] md:gap-6 md:px-6"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#7A8687]">
                        {row.label}
                      </dt>
                      <dd className="text-[16px] leading-relaxed text-[#d9d9d9]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <QuoteCallout label="Point of clarity">
                This is a proto-persona. It encodes assumptions to test with 8–12
                interviews before building for real. Naming it so confidently is
                deliberate — it tells you which parts of the design are grounded
                and which are hypotheses.
              </QuoteCallout>
              <NoteBox label="Risk">
                That question isn&apos;t new — other products have tried to
                answer it. Worth checking where they fall short before designing
                anything.
              </NoteBox>
            </TextBlock>

            <div className="grid gap-3 md:grid-cols-2">
              <FadeImage
                src={wellmeAsset("Frame 1618873216.png")}
                alt="Wellme assessment screen"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
              <FadeImage
                src={wellmeAsset("Frame 1618869415 (1).png")}
                alt="Stressed paramedic in a car"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
            </div>

            {/* 02 — Competitive analysis */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>03 — Competitive analysis</SectionLabel>
              <SectionTitle>Everyone solves half of it</SectionTitle>
              <p className="italic text-[#ffffff] text-[20px]">
                I audited alternatives across meditation content, AI chat, and
                employer-provided human support — against the five things this
                user actually needs.
              </p>

              <div className="mt-8 overflow-x-auto rounded bg-[#241F1A]">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b-[2px] bg-[#241F1A] text-xs tracking-wider text-muted">
                    <tr>
                      {competitiveHeaders.map((header) => (
                        <th key={header} className="px-3 py-3 font-medium tracking-[0.16em]">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {competitiveRows.map((row) => (
                      <tr
                        key={row.product}
                        className={`border-b border-border/70 ${
                          row.highlight ? "bg-[#1a1714]" : ""
                        }`}
                      >
                        <td className="px-3 py-6 font-medium text-[#87817A]">
                          {row.product}
                        </td>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.product}-${index}`}
                            className={`px-3 py-6 ${
                              value === "No"
                                ? "text-red-400"
                                : value === "Yes" || value === "User"
                                  ? "text-emerald-400/90"
                                  : "text-muted"
                            }`}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-10 text-lg font-medium text-foreground">
                What the matrix showed
              </h3>
              <p>
                The consumer apps are excellent products built for people with predictable days and nothing occupational at stake. They're private, but they have no route to a human and no idea what a 24-hour tour is.
              </p>
              <p>
              The responder-specific tools understand the population — and then fail the one thing that matters most. They're procured, deployed and branded by the department, which puts the employer's logo on the login screen of a mental health app. Every department-purchased tool in the audit failed the privacy column outright.
              </p>
              <NoteBox label="The open position">
                Marcus&apos;s barrier and the competitive gap point at the same thing from two directions. Time to turn that overlap into design questions.
              </NoteBox>
            </TextBlock>

            <FadeImage
              src={wellmeAsset("Frame 1618873265.png")}
              alt="Wellme product context visual"
              aspect="915 / 480"
              reduceMotion={reduceMotion}
            />

            {/* 04 — Research */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>04 — Brainstorm</SectionLabel>
              <SectionTitle>
                Three questions the product had to answer
              </SectionTitle>
              <p className="italic text-[#ffffff] text-[20px]">
                I ran the persona and the competitive gap through a “How Might
                We” pass, then scored the output on impact against effort.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {howMightWe.map((item) => (
                  <div
                    key={item}
                    className="rounded bg-[#241F1A] p-5"
                  >
                    <p className="text-[20px] text-[#D9D9D9]">
                      How might we
                    </p>
                    <p className="mt-3 text-[16px] leading-relaxed text-[#D9D9D9]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="mt-10 text-lg italic font-medium text-foreground">
                What made the cut
              </h3>
              <div className="mt-4 overflow-hidden rounded">
                <div className="grid grid-cols-[1.1fr_1.4fr] border-b-[2px] border-[#87817a] text-xs tracking-wider text-[#ffffff]">
                  <p className="py-3">Feature</p>
                  <p className="py-3">Why</p>
                </div>
                {madeTheCut.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-1 border-b border-[#87817a] last:border-b-0 md:grid-cols-[1.1fr_1.4fr]"
                  >
                    <p className="py-4 text-[14px] font-medium text-[#87817A]">
                      {row.feature}
                    </p>
                    <p className="py-4 text-[16px] leading-relaxed text-[#D9D9D9]">
                      {row.why}
                    </p>
                  </div>
                ))}
              </div>

              <QuoteCallout label="What did not make it">
                <ul className="mt-3 flex flex-col gap-3">
                  {didNotMakeIt.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-[1px]"
                        style={{ backgroundColor: accent }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </QuoteCallout>

              <NoteBox label="Next">
              Three features made the cut. Each one still had more than one way it could have been built — this is where those choices actually got made.
              </NoteBox>
            </TextBlock>

            <div className="grid gap-3 md:grid-cols-2">
              <FadeImage
                src={wellmeAsset("Frame 1618869415 (2).png")}
                alt="Person using a phone at night"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
              <FadeImage
                src={wellmeAsset("Frame 1618873217 (1).png")}
                alt="Wellme commitment screen"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
            </div>

            {/* 05 — Key decisions */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>05 — Key decisions</SectionLabel>
              <SectionTitle>Three calls worth explaining</SectionTitle>
              <p>
                Three features made the cut. Each one could have been built more
                than one way — this is where those choices actually got made.
              </p>

              <div className="mt-10 flex flex-col gap-10">
                {decisions.map((decision) => (
                  <div key={decision.title}>
                    <div className="rounded bg-[#241F1A] px-4 py-3 text-[20px] text-foreground">
                      · {decision.title}
                    </div>
                    <div className="flex flex-col border border-[#241F1A] p-4 gap-5">
                      {decision.rows.map((row) => (
                        <div
                          key={`${decision.title}-${row.label}`}
                          className="grid gap-2 md:grid-cols-[100px_1fr] md:gap-6 border-b border-b-[#241F1A] last:border-b-0 pb-4"
                        >
                          <p className="text-[14px] font-medium tracking-wider text-[#87817A]">
                            {row.label}
                          </p>
                          <p className="text-[16px] leading-relaxed text-[#D9D9D9]">
                            {row.body}
                          </p>
                        </div>
                      ))}
                    </div>
                    {"chart" in decision && decision.chart ? (
                      <div className="mt-6">
                        <FadeImage
                          src={wellmeAsset(decision.chart)}
                          alt="Shift counter versus daily streak chart"
                          aspect="713 / 252"
                          reduceMotion={reduceMotion}
                        />
                        {decision.chartCaption ? (
                          <p className="mt-3 text-center text-xs text-muted">
                            {decision.chartCaption}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))}

                <NoteBox label="Next">
                Feature on the list, now time to decide where the coach's judgment enters the flow, and where a person can back out of it cleanly.
                </NoteBox>
              </div>
            </TextBlock>

            {/* Mid-page composition — Figma Frame 2085668826 (915×580 + caption) */}
            <figure className="flex flex-col gap-3">
              <FadeImage
                src={wellmeAsset("Frame 1618869415 (3).png")}
                alt="Treatment detail page composition"
                aspect="915 / 580"
                reduceMotion={reduceMotion}
              />
              <figcaption className="text-center text-xs text-muted">
                [ 1.1 Treatment detail page]
              </figcaption>
            </figure>

            {/* 06 — User flow */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>06 — User flow</SectionLabel>
              <SectionTitle>Two flows carry the product</SectionTitle>
              <p className="italic text-[20px] text-[#ffffff]">
                Onboarding, where trust is either earned or lost before payment.
                And SOS, where a failure costs most.
              </p>

              <h3 className="mt-8 italic text-[20px] text-[#ffffff]">
                Flow 1 — Install to first conversation
              </h3>
              <div className="mt-2">
                <FadeImage
                  src={wellmeAsset("Frame 2085668806.png")}
                  alt="Onboarding journey from install to home, chat, journal, and SOS"
                  aspect="715 / 416"
                  reduceMotion={reduceMotion}
                />
              </div>
              <p className="mt-4 text-sm text-muted">
                The honesty screen sits before plan selection. The user knows
                what the product can and won&apos;t see before being asked for
                money — which is the only sequence that makes the payment feel
                like protection rather than a gate.
              </p>

              <h3 className="mt-10 italic text-[20px] text-[#ffffff]">
                Flow 2 — The coach&apos;s suggestion as a conversation
              </h3>
              <div className="mt-2">
                <FadeImage
                  src={wellmeAsset("Frame 2085668807.png")}
                  alt="Coach suggestion flow from user message to connecting"
                  aspect="715 / 337"
                  reduceMotion={reduceMotion}
                />
              </div>
              <p className="mt-4 text-sm text-muted">
                There is no direct SOS entry point — the coach&apos;s reading of
                the conversation is the sole trigger. Declining is one tap and
                doesn&apos;t alter the subsequent conversation.
              </p>
              <NoteBox label="Note">
                That position has a name and a feel before it has any screens.
                Brand had to carry the “not-department-owned” idea on its own,
                at a glance.
              </NoteBox>
            </TextBlock>

            <div className="grid gap-3 md:grid-cols-2">
              <FadeImage
                src={wellmeAsset("Frame 1618873215.png")}
                alt="Wellme app icon on a device"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
              <FadeImage
                src={wellmeAsset("Splash Screen.png")}
                alt="Wellme logo and wordmark"
                aspect="451 / 460"
                reduceMotion={reduceMotion}
              />
            </div>

            {/* 07 — Brand */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>07 — Brand</SectionLabel>
              <SectionTitle>
                Warm enough to open. Serious enough to trust.
              </SectionTitle>
              <p className="italic text-[20px] text-[#ffffff]">
                The identity had to sit between two failure modes: clinical
                enough to read as HR, or soft enough to read as a toy.
              </p>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-2">
                {brandColors.map((color) => (
                  <div
                    key={color.name}
                    className="flex min-w-0 flex-1 flex-col gap-5 overflow-hidden rounded bg-[#241f1a] p-3"
                  >
                    <div
                      className="h-1.5 w-full rounded-full"
                      style={{ backgroundColor: color.swatch }}
                      aria-hidden
                    />
                    <div className="flex flex-col gap-1.5">
                      <p className="text-base text-[#d9d9d9]">{color.name}</p>
                      <p className="text-xs text-[#87817a]">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="italic mb-5">
                Calm rather than cheerful. The palette avoids the pastel-wellness
                register that signals &quot;self-care app&quot; and leans into a
                dusk-toned range that reads as steady. Nothing in the mark
                suggests illness, therapy or institution.
              </p>

              <NoteBox label="Next">
                Every box in those two diagrams is a real screen. Here&apos;s
                what they became.
              </NoteBox>
            </TextBlock>

            {/* Screen galleries — Figma Frame 2085668846, 12px gaps */}
            <div className="flex flex-col gap-3">
              {screenGalleries.map((file) => (
                <FadeImage
                  key={file}
                  src={wellmeAsset(file)}
                  alt="Wellme app screen gallery"
                  aspect="915 / 481"
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>

            {/* Close */}
            <TextBlock reduceMotion={reduceMotion}>
              <SectionLabel>08 — Reflection</SectionLabel>
              <SectionTitle>Where I&apos;d take it next</SectionTitle>
              <div className="mt-4 flex flex-col gap-6 border border-[#241F1A] p-5">
                {nextSteps.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-6 border-b border-b-[#241F1A] last:border-b-0 pb-4"
                  >
                    <p className="text-[14px] font-medium text-[#87817A]">
                      {item.label}
                    </p>
                    <p className="text-[16px] leading-relaxed text-[#d9d9d9]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </TextBlock>

            <div className="mt-[100px] flex justify-end border-t border-border py-2">
              <Link
                href="/work"
                className="text-base text-muted transition-colors hover:text-foreground"
              >
                Next Project →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer workItems={workItems} />
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-medium tracking-[-0.01em] text-[#87817A]"
      style={{ color: accent }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="-mt-1 text-[clamp(1.35rem,2.5vw,1.75rem)] font-medium uppercase leading-tight tracking-[-0.02em] text-foreground">
      {children}
    </h2>
  );
}

function TextBlock({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.section
      className="px-0 py-10 md:px-[100px]"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease }}
    >
      <div className="flex flex-col gap-4 text-base leading-relaxed text-[#87817A]">
        {children}
      </div>
    </motion.section>
  );
}

function NoteBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded bg-[#241F1A] px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-[16px] leading-relaxed text-[#D9D9D9]">{children}</p>
    </div>
  );
}

function QuoteCallout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border-l pl-5 border-[#FF9548] mt-4 mb-7"
    >
      <p className="text-xs font-medium" style={{ color: accent }}>
        {label}
      </p>
      <div className="mt-2 text-base leading-relaxed text-foreground">
        {children}
      </div>
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
