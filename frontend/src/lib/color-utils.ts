interface ColorClasses {
  bg: string
  hover: string
  border: string
  text: string
}

export interface EventColorStyle {
  "--schedule-event-bg": string
  "--schedule-event-hover": string
  "--schedule-event-border": string
  "--schedule-event-text": string
  backgroundColor: string
  borderColor: string
  color: string
}

const EVENT_COLOR_CLASSES: Record<string, ColorClasses> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-900",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-950 dark:text-blue-100",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    hover: "hover:bg-emerald-200 dark:hover:bg-emerald-900",
    border: "border-emerald-300 dark:border-emerald-700",
    text: "text-emerald-950 dark:text-emerald-100",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    hover: "hover:bg-yellow-200 dark:hover:bg-yellow-900",
    border: "border-yellow-300 dark:border-yellow-700",
    text: "text-yellow-950 dark:text-yellow-100",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-950",
    hover: "hover:bg-red-200 dark:hover:bg-red-900",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-950 dark:text-red-100",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950",
    hover: "hover:bg-orange-200 dark:hover:bg-orange-900",
    border: "border-orange-300 dark:border-orange-700",
    text: "text-orange-950 dark:text-orange-100",
  },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-950",
    hover: "hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900",
    border: "border-fuchsia-300 dark:border-fuchsia-700",
    text: "text-fuchsia-950 dark:text-fuchsia-100",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-950",
    hover: "hover:bg-violet-200 dark:hover:bg-violet-900",
    border: "border-violet-300 dark:border-violet-700",
    text: "text-violet-950 dark:text-violet-100",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-950",
    hover: "hover:bg-slate-200 dark:hover:bg-slate-900",
    border: "border-slate-300 dark:border-slate-700",
    text: "text-slate-950 dark:text-slate-100",
  },
}

const EVENT_COLOR_VALUES = {
  light: {
    blue: ["rgb(219 234 254)", "rgb(191 219 254)", "rgb(147 197 253)", "rgb(30 58 138)"],
    emerald: ["rgb(209 250 229)", "rgb(167 243 208)", "rgb(110 231 183)", "rgb(6 95 70)"],
    yellow: ["rgb(254 249 195)", "rgb(254 240 138)", "rgb(253 224 71)", "rgb(113 63 18)"],
    red: ["rgb(254 226 226)", "rgb(254 202 202)", "rgb(252 165 165)", "rgb(127 29 29)"],
    orange: ["rgb(255 237 213)", "rgb(254 215 170)", "rgb(253 186 116)", "rgb(124 45 18)"],
    fuchsia: ["rgb(250 232 255)", "rgb(245 208 254)", "rgb(240 171 252)", "rgb(112 26 117)"],
    violet: ["rgb(237 233 254)", "rgb(221 214 254)", "rgb(196 181 253)", "rgb(76 29 149)"],
    slate: ["rgb(241 245 249)", "rgb(226 232 240)", "rgb(203 213 225)", "rgb(15 23 42)"],
  },
  dark: {
    blue: ["rgb(23 37 84)", "rgb(30 58 138)", "rgb(29 78 216)", "rgb(219 234 254)"],
    emerald: ["rgb(2 44 34)", "rgb(6 78 59)", "rgb(4 120 87)", "rgb(209 250 229)"],
    yellow: ["rgb(66 32 6)", "rgb(113 63 18)", "rgb(161 98 7)", "rgb(254 249 195)"],
    red: ["rgb(69 10 10)", "rgb(127 29 29)", "rgb(185 28 28)", "rgb(254 226 226)"],
    orange: ["rgb(67 20 7)", "rgb(124 45 18)", "rgb(194 65 12)", "rgb(255 237 213)"],
    fuchsia: ["rgb(74 4 78)", "rgb(112 26 117)", "rgb(162 28 175)", "rgb(250 232 255)"],
    violet: ["rgb(46 16 101)", "rgb(76 29 149)", "rgb(109 40 217)", "rgb(237 233 254)"],
    slate: ["rgb(15 23 42)", "rgb(30 41 59)", "rgb(51 65 85)", "rgb(241 245 249)"],
  },
} as const

export function getColorClasses(color: string): ColorClasses {
  return EVENT_COLOR_CLASSES[color] ?? EVENT_COLOR_CLASSES.blue
}

export function getEventColorStyle(color: string, theme: "light" | "dark"): EventColorStyle {
  const values =
    EVENT_COLOR_VALUES[theme][color as keyof typeof EVENT_COLOR_VALUES.light] ??
    EVENT_COLOR_VALUES[theme].blue
  const [bg, hover, border, text] = values

  return {
    "--schedule-event-bg": bg,
    "--schedule-event-hover": hover,
    "--schedule-event-border": border,
    "--schedule-event-text": text,
    backgroundColor: bg,
    borderColor: border,
    color: text,
  }
}
