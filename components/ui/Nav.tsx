"use client";

import {
  User, FolderKanban, Cpu, Briefcase, Award, Trophy, Mail,
} from "lucide-react";
import { RadialNav } from "@/components/animate-ui/components/community/radial-nav";

const items = [
  { id: 1, icon: User,          label: "About",   href: "#about" },
  { id: 2, icon: FolderKanban,  label: "Projects", href: "#projects" },
  { id: 3, icon: Cpu,           label: "Skills",   href: "#skills" },
  { id: 4, icon: Briefcase,     label: "Exp",      href: "#experience" },
  { id: 5, icon: Award,         label: "Certs",    href: "#certifications" },
  { id: 6, icon: Trophy,        label: "Wins",     href: "#achievements" },
  { id: 7, icon: Mail,          label: "Contact",  href: "#contact" },
];

export default function Nav() {
  return <RadialNav items={items} defaultActiveId={1} />;
}