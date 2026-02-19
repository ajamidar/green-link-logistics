import Link from "next/link";
import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import { Route, ShieldCheck, Zap, Leaf, Clock, LineChart } from "lucide-react";
import CountUp from "@/components/CountUp";

const headingFont = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const bodyFont = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const features = [
  {
    title: "Instant route optimization",
    description: "Generate efficient multi-stop routes in seconds, tuned for fleet capacity and service time windows.",
    icon: Route,
  },
  {
    title: "Dispatcher command center",
    description: "Monitor active routes, assign drivers, and rebalance workloads with a single view.",
    icon: Zap,
  },
  {
    title: "Carbon-aware operations",
    description: "Reduce deadhead miles and fuel usage with greener, smarter routing decisions.",
    icon: Leaf,
  },
  {
    title: "Secure by default",
    description: "Role-based access keeps dispatch, drivers, and operations aligned and protected.",
    icon: ShieldCheck,
  },
  {
    title: "On-time performance",
    description: "Smarter sequencing keeps deliveries on schedule and customers in the loop.",
    icon: Clock,
  },
  {
    title: "Operational analytics",
    description: "Track utilization, route efficiency, and savings in a single dashboard.",
    icon: LineChart,
  },
];

const steps = [
  {
    title: "Connect your orders",
    description: "Import orders and vehicles to create a live operational snapshot.",
  },
  {
    title: "Optimize routes",
    description: "Let Green Link find the best routes based on real-world constraints.",
  },
  {
    title: "Dispatch and track",
    description: "Push routes to drivers and track progress with clear status updates.",
  },
];

export default function Home() {
  return (
    <div className={`${bodyFont.className} bg-slate-50 text-slate-900 bg-landing-sunrise`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-landing-grid opacity-30" />
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-300/40 blur-[120px]" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-amber-200/60 blur-[120px]" />

        <header className="relative z-10">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-wide text-slate-900">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">GL</span>
              Green Link Logistics
            </div>
            <div className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
              <a href="#features" className="hover:text-slate-900">Features</a>
              <a href="#workflow" className="hover:text-slate-900">Workflow</a>
              <a href="#impact" className="hover:text-slate-900">Impact</a>
              <Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 hover:border-slate-400">Login</Link>
              <Link href="/signup" className="rounded-full bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500">Sign Up</Link>
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:pb-32">
            <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="reveal">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Smarter dispatching</p>
                <h1 className={`${headingFont.className} mt-4 text-4xl leading-tight md:text-6xl`}>
                  Deliver more with greener, faster route intelligence.
                </h1>
                <p className="mt-6 text-lg text-slate-600 md:text-xl">
                  Green Link Logistics optimizes your fleet in real time, reducing miles, fuel, and missed
                  windows. Dispatchers get a live control center, drivers get clarity, and operations get data
                  that compounds.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/signup"
                    className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Start free
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
                  >
                    Book a demo
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
                  <div>
                    <p className="text-2xl font-semibold text-slate-900"><CountUp target={25} suffix="%" duration={2000} /></p>
                    Route cost reduction
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900"><CountUp target={25} suffix="x" duration={2000} isDecimal /></p>
                    Faster dispatch planning
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">24/7</p>
                    Operations visibility
                  </div>
                </div>
              </div>

              <div className="reveal delay-1">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">Live Dispatch Board</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">Realtime</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    {["SP67 TMX", "BU09 K78", "PL74 S53"].map((route, index) => (
                      <div key={route} className="rounded-2xl border border-slate-200 bg-white p-4 hover:scale-[1.01] transition-transform">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{route}</p>
                          <span className="text-xs text-slate-500">ETA {index + 1}h</span>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
                            style={{ width: `${70 + index * 10}%` }}
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>{8 + index} stops</span>
                          <span>{12 + index * 3} miles saved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-700">Optimization ready</p>
                    <p className="mt-1 text-xs text-emerald-700/80">Suggesting new assignments to balance driver load.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section id="features" className="bg-slate-50 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Why Green Link</p>
              <h2 className={`${headingFont.className} mt-3 text-3xl md:text-4xl`}>
                Everything dispatch needs, nothing they do not.
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-600">
              Built for modern logistics teams who want fast decisions, fewer miles, and a dashboard that
              works as hard as the fleet.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <feature.icon className="h-8 w-8 text-emerald-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Workflow</p>
              <h2 className={`${headingFont.className} mt-3 text-3xl md:text-4xl`}>
                A workflow that feels effortless.
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                From intake to delivery, Green Link keeps the operation aligned. Automate the complex
                parts of routing and focus on what matters: delivering on time.
              </p>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-inner">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Operations Snapshot</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">Live</span>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  { label: "Active routes", value: "24", isAnimated: true },
                  { label: "Vehicles online", value: "58", isAnimated: true },
                  { label: "Orders in motion", value: "312", isAnimated: true },
                  { label: "Avg. ETA variance", value: "-9 min", isAnimated: false },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {stat.isAnimated ? <CountUp target={parseInt(stat.value)} duration={2000} /> : stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-semibold">Optimization summary</p>
                <p className="mt-2 text-xs text-slate-300">
                  Your last run saved 184 miles and reduced fuel spend by 11%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="impact" className="bg-slate-100 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Impact</p>
              <h2 className={`${headingFont.className} mt-3 text-3xl md:text-4xl`}>
                Logistics that scale without the waste.
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Green Link delivers measurable cost savings and greener operations. Run smarter routes and
                unlock real-time visibility across your network.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl text-slate-900"><CountUp target={94} suffix="%" duration={2000} /></span>
                <p className="text-sm text-slate-600">of teams improve on-time performance within 30 days.</p>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">Average savings per week</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">£<CountUp target={8420} duration={2500} /></p>
                <p className="mt-1 text-xs text-slate-500">Based on 40-vehicle fleets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-300 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`${headingFont.className} text-3xl md:text-4xl`}>Ready to optimize today?</h2>
              <p className="mt-2 text-sm text-amber-900/80">
                Launch a smarter dispatch workflow in minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Start free
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-200"
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white text-slate-700">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">GL</span>
                Green Link Logistics
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Bright, fast, and accountable dispatching for modern delivery teams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Start free
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                >
                  Book a demo
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Product</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="hover:text-slate-900">Features</a></li>
                <li><a href="#workflow" className="hover:text-slate-900">Workflow</a></li>
                <li><a href="#impact" className="hover:text-slate-900">Impact</a></li>
                <li><Link href="/login" className="hover:text-slate-900">Login</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Contact</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>jamidararnav@gmail.com</li>
                <li>+44 7443735548</li>
                <li>York, England</li>
                <li className="text-xs text-slate-500">Mon-Fri, 8am-6pm GMT</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500">
            <span>© 2026 Green Link Logistics. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/pdfs/PRIVACY POLICY FOR GREENLINK LOGISTICS.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 cursor-pointer">Privacy</a>
            <a href="/pdfs/TERMS AND CONDITIONS FOR GREENLINK LOGISTICS.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 cursor-pointer">Terms</a>
              <a href="/pdfs/SECURITY POLICY FOR GREENLINK LOGISTICS.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 cursor-pointer">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}