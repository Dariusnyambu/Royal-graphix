import {
  Briefcase, Palette, Code2, PenTool, Megaphone, Camera, Video,
  TrendingUp, Users, Search, BarChart2, Layout, Monitor, Pen,
} from 'lucide-react'

export const JOB_ICON_MAP = {
  Briefcase, Palette, Code2, PenTool, Megaphone, Camera, Video,
  TrendingUp, Users, Search, BarChart2, Layout, Monitor, Pen,
}

export const JOB_ICON_OPTIONS = Object.keys(JOB_ICON_MAP)

export function getJobIcon(name) {
  return JOB_ICON_MAP[name] || Briefcase
}
