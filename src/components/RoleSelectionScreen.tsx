"use client";

import React from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Calendar,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Leaf,
  Maximize,
  Minimize,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { RoleType } from "./LoginScreen";

export interface RoleSelectionScreenProps {
  onSelectRole: (role: RoleType) => void;
  onBackToPortal: () => void;
  isFullscreen: boolean;
  toggleFullscreen: (e?: React.MouseEvent) => void;
  currentTime: Date | null;
  onOpenBot?: () => void;
}

type RoleDefinition = {
  role: RoleType;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  soft: string;
  icon: React.ReactNode;
  actions: string[];
};

const roles: RoleDefinition[] = [
  {
    role: "student",
    eyebrow: "LEARN & GROW",
    title: "Student / Parent",
    description: "Your everyday hub for learning, attendance, assignments and school updates.",
    image: "/student_avatar.png",
    accent: "#ea580c",
    soft: "#fff7ed",
    icon: <GraduationCap size={18} />,
    actions: ["Homework & LMS", "Report cards", "Bus tracking"],
  },
  {
    role: "staff",
    eyebrow: "LEAD WITH PURPOSE",
    title: "Staff",
    description: "Manage classrooms, marks, lesson plans and the moments that shape every learner.",
    image: "/staff_avatar.png",
    accent: "#0d9488",
    soft: "#f0fdfa",
    icon: <Users size={18} />,
    actions: ["Mark attendance", "Enter grades", "Lesson plans"],
  },
  {
    role: "visitor",
    eyebrow: "WELCOME IN",
    title: "Visitor",
    description: "Arrive, explore and connect with the campus through a fast, secure visitor experience.",
    image: "/admin_avatar.png",
    accent: "#7c3aed",
    soft: "#f5f3ff",
    icon: <QrCode size={18} />,
    actions: ["Visitor pass", "Campus tour", "Admissions desk"],
  },
  {
    role: "alumni",
    eyebrow: "STAY CONNECTED",
    title: "Alumni / Ex-Staff",
    description: "Keep the spirit of Green Valley alive through chapters, mentoring and shared milestones.",
    image: "/alumni_avatar.png",
    accent: "#d97706",
    soft: "#fffbeb",
    icon: <Award size={18} />,
    actions: ["Alumni directory", "Mentorship", "Hall of fame"],
  },
];

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    : "Tue, 13 Oct 2026";

const formatTime = (date: Date | null) =>
  date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "11:44 AM";

export default function RoleSelectionScreen({
  onSelectRole,
  onBackToPortal,
  isFullscreen,
  toggleFullscreen,
  currentTime,
  onOpenBot,
}: RoleSelectionScreenProps) {
  const [activeRole, setActiveRole] = React.useState<RoleDefinition | null>(null);

  return (
    <main className="kiosk-command-center">
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      <div className="kiosk-shell">
        <header className="command-header">
          <div className="command-brand">
            <button className="command-back" onClick={onBackToPortal} aria-label="Back to home">
              <ArrowLeft size={19} />
            </button>
            <div className="command-mark" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
                <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#f97316" />
                <path d="M24 24V11" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#c2410c" />
                <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="command-kicker">GREEN VALLEY • SMART CAMPUS</p>
              <h1>Green Valley Public School</h1>
            </div>
          </div>

          <div className="command-actions">
            <div className="command-live-status"><span /> Campus online</div>
            <div className="command-time"><Calendar size={16} /><span>{formatDate(currentTime)}</span><b>{formatTime(currentTime)}</b></div>
            <button className="command-fullscreen" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              <span>{isFullscreen ? "Exit" : "Full screen"}</span>
            </button>
          </div>
        </header>

        <section className="command-hero">
          <div className="command-hero-copy">
            <div className="hero-chip"><Sparkles size={15} /> ONE CAMPUS. MANY JOURNEYS.</div>
            <h2>Where should we<br /><span>take you today?</span></h2>
            <p>Choose your space to get started. Everything you need is one tap away.</p>
            <div className="hero-trust"><ShieldCheck size={16} /><span>Secure kiosk access</span><i /> <Activity size={16} /><span>Live campus services</span></div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-ring ring-one" />
            <div className="hero-visual-ring ring-two" />
            <div className="hero-visual-card"><Leaf size={30} /><strong>Learn</strong><span>Grow • Excel</span></div>
            <div className="hero-floating-note note-one"><CheckCircle2 size={15} /> 6,200+ learners</div>
            <div className="hero-floating-note note-two"><Award size={15} /> 25 years of excellence</div>
          </div>
        </section>

        <section className="role-grid" aria-label="Choose your portal">
          {roles.map((item, index) => (
            <article
              key={item.role}
              className="role-tile"
              style={{ "--role-accent": item.accent, "--role-soft": item.soft, "--delay": `${index * 90}ms` } as React.CSSProperties}
              onClick={() => onSelectRole(item.role)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectRole(item.role); }}
              role="button"
              tabIndex={0}
            >
              <div className="role-stage">
                <div className="role-stage-header">
                  <div className="role-stage-badge">
                    {item.icon}
                    <span>{item.role === "student" ? "Student / Parent" : item.role === "staff" ? "Staff" : item.role === "visitor" ? "Visitor" : "Alumni / Ex-Staff"}</span>
                  </div>
                  <div className="role-arrow" aria-hidden="true"><ArrowRight size={16} /></div>
                </div>
                <div className="role-char-box">
                  <img src={item.image} alt={item.title} className={`role-char-img role-char-${item.role}`} />
                </div>
              </div>

              <div className="role-body">
                <p className="role-eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="role-description">{item.description}</p>
                <div className="role-actions">
                  {item.actions.map((action) => <span key={action}>{action}</span>)}
                </div>
                <div className="role-cta-bar">
                  <span className="role-cta-text">Touch to Login</span>
                  <button
                    type="button"
                    className="role-details-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveRole(item);
                    }}
                    aria-label="View portal details"
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="command-footer">
          <div><span className="footer-dot" /> Touch a portal to continue</div>
          <div className="footer-links"><span>CBSE Affiliation 1930281</span><span>NAAC Grade A++</span><span>Campus: 6,200 Students</span><span>Digital Campus Kiosk</span></div>
          <button className="assistant-button" onClick={onOpenBot}><span className="assistant-pulse" /> Need help? <b>Ask GreenBot</b></button>
        </footer>
      </div>

      {activeRole && (
        <div className="portal-modal-backdrop" onClick={() => setActiveRole(null)}>
          <section className="portal-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveRole(null)} aria-label="Close">×</button>
            <div className="modal-accent" style={{ background: activeRole.accent }} />
            <div className="modal-icon" style={{ background: activeRole.soft, color: activeRole.accent }}>{activeRole.icon}</div>
            <p className="role-eyebrow">{activeRole.eyebrow}</p>
            <h2>{activeRole.title}</h2>
            <p>{activeRole.description}</p>
            <div className="modal-benefits">{activeRole.actions.map((action) => <div key={action}><CheckCircle2 size={16} /> {action}</div>)}</div>
            <button className="modal-primary" style={{ background: activeRole.accent }} onClick={() => onSelectRole(activeRole.role)}>Enter portal <ArrowRight size={17} /></button>
          </section>
        </div>
      )}
    </main>
  );
}
