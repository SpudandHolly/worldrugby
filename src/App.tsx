// World Rugby Referee Welfare v1.0
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Camera,
  HeartPulse,
  Plane,
  BedDouble,
  Droplets,
  Dumbbell,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Play,
  Mic,
  Menu,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "./index.css";

interface DayData {
  d: number;
  state: "green" | "amber" | "red" | "neutral";
  score: number;
  load: number;
  label: string;
  drivers?: string[];
  actions?: string[];
}

const monthDays: DayData[] = [
  { d: 1, state: "neutral", score: 61, load: 44, label: "Recovery" },
  { d: 2, state: "neutral", score: 59, load: 48, label: "Training" },
  { d: 3, state: "amber", score: 54, load: 62, label: "Media" },
  { d: 4, state: "green", score: 72, load: 35, label: "Home" },
  { d: 5, state: "amber", score: 51, load: 67, label: "Travel prep" },
  { d: 6, state: "green", score: 74, load: 31, label: "Rest" },
  { d: 7, state: "amber", score: 48, load: 70, label: "Coach call" },
  {
    d: 8,
    state: "red",
    score: 31,
    load: 89,
    label: "Travel + fixture",
    drivers: [
      "Long-haul travel",
      "Hotel change",
      "Low sleep",
      "Coach interview",
      "Press commitments",
    ],
    actions: [
      "Move media slot to tomorrow",
      "Hydrate before flight",
      "20-minute outdoor walk",
      "Confirm hotel early check-in",
      "10-minute breathing routine before interview",
    ],
  },
  { d: 9, state: "amber", score: 46, load: 72, label: "Arrival" },
  { d: 10, state: "green", score: 68, load: 42, label: "Captains" },
  { d: 11, state: "amber", score: 53, load: 65, label: "Match day" },
  { d: 12, state: "green", score: 71, load: 39, label: "Recovery" },
  { d: 13, state: "green", score: 76, load: 33, label: "Home" },
  { d: 14, state: "amber", score: 55, load: 61, label: "Training" },
  {
    d: 15,
    state: "red",
    score: 28,
    load: 91,
    label: "Press + review",
    drivers: [
      "Critical press coverage",
      "Fixture review",
      "Low HRV",
      "Poor sleep",
      "Fan social media spike",
    ],
    actions: [
      "Disable social alerts for 12 hours",
      "Book welfare call",
      "Move review to late afternoon",
      "45-minute sleep window",
      "Light run, no intensity",
    ],
  },
  { d: 16, state: "amber", score: 49, load: 68, label: "Debrief" },
  { d: 17, state: "green", score: 70, load: 38, label: "Rest" },
  { d: 18, state: "green", score: 73, load: 36, label: "Family" },
  { d: 19, state: "amber", score: 57, load: 58, label: "Travel prep" },
  { d: 20, state: "green", score: 79, load: 30, label: "Recovery" },
  { d: 21, state: "amber", score: 50, load: 73, label: "Training" },
  {
    d: 22,
    state: "red",
    score: 34,
    load: 86,
    label: "Fixture + travel",
    drivers: [
      "International fixture",
      "Late hotel arrival",
      "Domestic transfer",
      "Assistant referee change",
      "High crowd expectation",
    ],
    actions: [
      "Request car transfer not connection",
      "Confirm hotel meal timing",
      "15-minute team alignment call",
      "Go for a low-intensity run",
      "Sleep protection: no calls after 21:30",
    ],
  },
  { d: 23, state: "amber", score: 45, load: 75, label: "Post-match" },
  { d: 24, state: "green", score: 69, load: 43, label: "Recovery" },
  { d: 25, state: "green", score: 77, load: 32, label: "Home" },
  { d: 26, state: "amber", score: 52, load: 66, label: "Review" },
  { d: 27, state: "neutral", score: 63, load: 45, label: "Admin" },
  { d: 28, state: "green", score: 75, load: 34, label: "Rest" },
  { d: 29, state: "amber", score: 56, load: 60, label: "Prep" },
  { d: 30, state: "green", score: 73, load: 36, label: "Home" },
];

const trendData = monthDays.map((x) => ({
  day: `Apr ${x.d}`,
  wellbeing: x.score,
  load: x.load,
  readiness: Math.round(x.score * 0.7 + (100 - x.load) * 0.3),
}));

const stateColour: Record<string, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-400",
  red: "bg-red-500",
  neutral: "bg-slate-300",
};

const stateBg: Record<string, string> = {
  green: "bg-emerald-50 border-emerald-200 text-emerald-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  red: "bg-red-50 border-red-200 text-red-900",
  neutral: "bg-slate-50 border-slate-200 text-slate-700",
};

type Screen = "Dashboard" | "Calendar" | "Check-in" | "Recommendations";

function Header({
  screen,
  setScreen,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tabs: Screen[] = ["Dashboard", "Calendar", "Check-in", "Recommendations"];

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl bg-[#003B5C] text-white font-black text-sm sm:text-base">
            WR
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900">
              World Rugby Referee Welfare
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500">
              Powered by Cavefish EchoDepth
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden gap-2 md:flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setScreen(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                screen === t
                  ? "bg-[#003B5C] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setScreen("Check-in")}
            className="hidden sm:inline-flex rounded-full bg-[#00A9E0] hover:bg-[#008fc0] text-sm"
          >
            Start check-in
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setScreen(t);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    screen === t
                      ? "bg-[#003B5C] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
              <Button
                onClick={() => {
                  setScreen("Check-in");
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 rounded-full bg-[#00A9E0] hover:bg-[#008fc0]"
              >
                Start check-in
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dashboard({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-4">
        <Card className="rounded-2xl sm:rounded-3xl lg:col-span-2">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Current welfare state
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                  Stable, with two risk spikes
                </h1>
              </div>
              <HeartPulse className="hidden sm:block text-emerald-500 h-6 w-6" />
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={6} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={30} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="wellbeing"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Wellbeing"
                  />
                  <Line
                    type="monotone"
                    dataKey="load"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Pressure load"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-slate-500">Today</p>
            <h2 className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-emerald-600">
              73
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Good recovery profile. Sleep and hydration are above baseline.
            </p>
            <Button
              onClick={() => setScreen("Calendar")}
              variant="outline"
              className="mt-4 sm:mt-5 w-full rounded-full text-sm"
            >
              View calendar
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl sm:rounded-3xl">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-slate-500">Next risk window</p>
            <h2 className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-red-500">
              May 3
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Travel, fixture intensity and media commitments overlap.
            </p>
            <Button
              onClick={() => setScreen("Recommendations")}
              className="mt-4 sm:mt-5 w-full rounded-full bg-[#003B5C] text-sm"
            >
              Plan support
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {["Travel pressure", "Sleep debt", "Media exposure"].map((t, i) => (
          <Card key={t} className="rounded-2xl sm:rounded-3xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t}</h3>
                <span
                  className={`rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold ${
                    i === 1 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {i === 1 ? "High" : "Medium"}
                </span>
              </div>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600">
                Detected from calendar load, fixture proximity, travel pattern and
                check-in signal.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CalendarView({
  selected,
  setSelected,
}: {
  selected: DayData | null;
  setSelected: (d: DayData) => void;
}) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-500">April 2026</p>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black">
                Emotional welfare calendar
              </h2>
            </div>
            <CalendarDays className="text-[#003B5C] h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-slate-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
            <div />
            <div />
            <div />
            {monthDays.map((day) => (
              <button
                key={day.d}
                onClick={() => setSelected(day)}
                className={`min-h-16 sm:min-h-20 lg:min-h-24 rounded-lg sm:rounded-xl lg:rounded-2xl border p-1 sm:p-2 text-left transition hover:scale-[1.02] ${
                  stateBg[day.state]
                } ${selected?.d === day.d ? "ring-2 ring-[#003B5C]" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-black text-xs sm:text-sm">{day.d}</span>
                  <span
                    className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${stateColour[day.state]}`}
                  />
                </div>
                <div className="mt-1 sm:mt-3 text-sm sm:text-lg lg:text-xl font-black">
                  {day.score}
                </div>
                <div className="text-[8px] sm:text-[10px] lg:text-[11px] font-medium opacity-70 truncate">
                  {day.label}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <DayPanel day={selected} />
    </div>
  );
}

function DayPanel({ day }: { day: DayData | null }) {
  if (!day) {
    return (
      <Card className="rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-black">Select a day</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Click a red or amber day to see the cause of pressure and suggested welfare
            actions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl sm:rounded-3xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black">April {day.d}</h3>
          <span
            className={`rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold ${
              day.state === "red"
                ? "bg-red-100 text-red-700"
                : day.state === "amber"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {day.state.toUpperCase()}
          </span>
        </div>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600">
          Wellbeing score {day.score}. Pressure load {day.load}.
        </p>

        <div className="mt-4 sm:mt-5 space-y-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold">What is causing it</h4>
            <div className="mt-2 space-y-2">
              {(day.drivers || [day.label, "Normal fixture preparation", "Routine admin"]).map(
                (x) => (
                  <div
                    key={x}
                    className="flex items-center gap-2 rounded-lg sm:rounded-xl bg-slate-50 p-2 sm:p-3 text-xs sm:text-sm"
                  >
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 flex-shrink-0" />
                    <span>{x}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold">Recommended actions</h4>
            <div className="mt-2 space-y-2">
              {(day.actions || ["Hydrate", "Protect sleep window", "Short outdoor walk"]).map(
                (x) => (
                  <div
                    key={x}
                    className="flex items-center gap-2 rounded-lg sm:rounded-xl bg-emerald-50 p-2 sm:p-3 text-xs sm:text-sm text-emerald-900"
                  >
                    <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{x}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckIn() {
  const [done, setDone] = useState(false);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_420px]">
      <Card className="overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 text-white">
        <CardContent className="p-0">
          <div className="relative grid h-80 sm:h-[420px] lg:h-[520px] place-items-center bg-[radial-gradient(circle_at_center,#1e3a5f,#020617)]">
            <div className="absolute left-3 sm:left-5 top-3 sm:top-5 rounded-full bg-red-500 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold">
              LIVE DEMO
            </div>
            <div className="grid h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 place-items-center rounded-full border border-white/20 bg-white/5">
              <Camera className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white/50" />
            </div>
            <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 grid gap-2 sm:gap-3 grid-cols-3">
              <Metric label="Composure" value={done ? 67 : 0} />
              <Metric label="Stress load" value={done ? 72 : 0} />
              <Metric label="Confidence" value={done ? 58 : 0} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black">
            Two-minute welfare check-in
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            The referee records a short video or voice check-in. The demo mirrors the
            TfW Pitch Coach pattern: live analysis, emotion mesh style feedback and AI
            coaching notes.
          </p>

          <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
            <Prompt icon={Mic} text="How are you feeling about the next fixture?" />
            <Prompt
              icon={Plane}
              text="What travel or accommodation is creating pressure?"
            />
            <Prompt icon={BedDouble} text="How did you sleep last night?" />
          </div>

          <Button
            onClick={() => setDone(true)}
            className="mt-4 sm:mt-6 w-full rounded-full bg-[#003B5C] text-sm"
          >
            <Play className="mr-2 h-4 w-4" />
            Run check-in analysis
          </Button>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl bg-blue-50 p-3 sm:p-4 text-xs sm:text-sm text-blue-950"
            >
              <strong>AI welfare note:</strong> elevated arousal and reduced confidence
              coincide with travel pressure. Recommend welfare call, sleep protection
              and reducing non-essential media commitments.
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/10 p-2 sm:p-4">
      <div className="text-[10px] sm:text-xs text-white/60">{label}</div>
      <div className="text-lg sm:text-2xl lg:text-3xl font-black">{value}</div>
    </div>
  );
}

function Prompt({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-slate-50 p-2 sm:p-3 text-xs sm:text-sm">
      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-[#003B5C] flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function Recommendations() {
  const items = [
    {
      icon: BedDouble,
      title: "Protect sleep",
      body: "No welfare, media or review calls after 21:30 before travel days.",
      impact: "+11 projected wellbeing",
    },
    {
      icon: Droplets,
      title: "Hydrate",
      body: "Hydration reminder before flight and on arrival. Add electrolyte prompt after weigh-in or training.",
      impact: "+4 projected wellbeing",
    },
    {
      icon: Dumbbell,
      title: "Low-intensity run",
      body: "20 to 30 minute run where arousal is high but fatigue is not yet acute.",
      impact: "+6 projected wellbeing",
    },
    {
      icon: MessageCircle,
      title: "Welfare call",
      body: "Prompt referee manager check-in when two red indicators appear within seven days.",
      impact: "+9 projected wellbeing",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black">
            Recommended welfare interventions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Suggestions combine calendar load, travel, fixtures, media exposure, sleep
            and the referee check-in signal.
          </p>

          <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, body, impact }) => (
              <div
                key={title}
                className="rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5"
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#00A9E0]" />
                <h3 className="mt-3 sm:mt-4 font-black text-sm sm:text-base">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">{body}</p>
                <div className="mt-3 sm:mt-4 rounded-full bg-emerald-50 px-2 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-xs font-bold text-emerald-700 inline-block">
                  {impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl sm:rounded-3xl">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-black text-sm sm:text-base">
            Projected improvement after actions
          </h3>
          <div className="mt-4 h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData.map((x, i) => ({
                  ...x,
                  improved: i > 20 ? Math.min(90, x.wellbeing + 12) : x.wellbeing,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={6} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Area
                  dataKey="wellbeing"
                  name="Current trend"
                  fill="#94a3b8"
                  fillOpacity={0.15}
                  stroke="#94a3b8"
                />
                <Area
                  dataKey="improved"
                  name="With interventions"
                  fill="#10b981"
                  fillOpacity={0.25}
                  stroke="#10b981"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("Dashboard");
  const [selected, setSelected] = useState<DayData | null>(monthDays[7]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header screen={screen} setScreen={setScreen} />
      <main className="mx-auto max-w-7xl px-3 sm:px-5 py-4 sm:py-6 lg:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {screen === "Dashboard" && <Dashboard setScreen={setScreen} />}
            {screen === "Calendar" && (
              <CalendarView selected={selected} setSelected={setSelected} />
            )}
            {screen === "Check-in" && <CheckIn />}
            {screen === "Recommendations" && <Recommendations />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
