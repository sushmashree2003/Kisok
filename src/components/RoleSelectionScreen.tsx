"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Pause,
  Play,
  QrCode,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  X,
  ZoomIn,
} from "lucide-react";
import { RoleType } from "./LoginScreen";
import MarkdownResponse from "./chat/MarkdownResponse";

export interface RoleSelectionScreenProps {
  onSelectRole: (role: RoleType) => void;
  onBackToPortal: () => void;
  isFullscreen: boolean;
  toggleFullscreen: (e?: React.MouseEvent) => void;
  currentTime: Date | null;
  onOpenBot?: () => void;
}

export type RoleDefinition = {
  role: RoleType;
  eyebrow: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  accent: string;
  soft: string;
  icon: React.ReactNode;
  actions: string[];
};

export interface CampusGalleryItem {
  id: string;
  title: string;
  category: "sports" | "academics" | "events" | "campus";
  categoryLabel: string;
  src: string;
  description: string;
}

export interface BackgroundSlide {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: string;
}

// Curated directly from Madhuvan Vatika Public School (https://madhuvanvatika.org/Gallery.html)
export const BACKGROUND_SLIDES: BackgroundSlide[] = [
  {
    id: "slide-campus",
    src: "/mvps/hero/campus_front.jpg",
    title: "Madhuvan Vatika Public School",
    subtitle: "Main Campus & Administrative Gate • Asmanpur, Nurpur Bedi, Ropar",
    category: "Campus Architecture",
  },
  {
    id: "slide-sports",
    src: "/mvps/gallery/sports_cricket_01.jpg",
    title: "Inter-House Championship Cricket Tournament",
    subtitle: "Regulation Playing Fields, Athletics Track & Championship Arena",
    category: "Sports & Athletics",
  },
  {
    id: "slide-cultural",
    src: "/mvps/gallery/event_stage_01.jpg",
    title: "Annual Day Cultural Symphony & Theatrical Gala",
    subtitle: "Auditorium Stage Recitals, Classical Arts & Folk Choreography",
    category: "Co-Curricular Arts",
  },
  {
    id: "slide-stem",
    src: "/mvps/facilities/labs.jpg",
    title: "Advanced STEM, AI & Analytical Science Laboratories",
    subtitle: "Hands-on Physics, Chemistry & Experiential Robotics Practicals",
    category: "Academic Excellence",
  },
  {
    id: "slide-library",
    src: "/mvps/facilities/library_01.jpg",
    title: "Central Knowledge Library & Digital Learning Sanctuary",
    subtitle: "Over 10,000 Reference Volumes, Encyclopedias & Quiet Reading Hubs",
    category: "Scholastic Resources",
  },
  {
    id: "slide-athletics",
    src: "/mvps/gallery/sports_race_01.jpg",
    title: "Annual Sports Meet Track Sprints & Relay Races",
    subtitle: "Speed, Endurance & Sportsmanship on regulation 400m Track",
    category: "Sports & Fitness",
  },
];

export const CAMPUS_GALLERY_COLLECTION: CampusGalleryItem[] = [
  // Campus & Architecture
  {
    id: "campus-front",
    title: "Main Campus Entrance & Administration Block",
    category: "campus",
    categoryLabel: "Campus",
    src: "/mvps/hero/campus_front.jpg",
    description: "Serene academic architecture at Asmanpur, PO Nurpur Bedi, Ropar.",
  },
  {
    id: "campus-building",
    title: "Spacious Multi-Story Academic Wing",
    category: "campus",
    categoryLabel: "Architecture",
    src: "/hero_school_building.jpg",
    description: "Modern CBSE-affiliated classrooms and digital administrative headquarters.",
  },
  {
    id: "facilities-buses",
    title: "GPS-Enabled School Transport Bus Fleet",
    category: "campus",
    categoryLabel: "Transport",
    src: "/mvps/facilities/transport_buses.jpg",
    description: "Dedicated fleet of well-maintained school buses with trained attendants and GPS tracking.",
  },

  // Sports & Athletics
  {
    id: "sports-cricket",
    title: "Inter-House Cricket Championship Final",
    category: "sports",
    categoryLabel: "Sports",
    src: "/mvps/gallery/sports_cricket_01.jpg",
    description: "Competitive school tournament highlighting athletic agility and teamwork.",
  },
  {
    id: "sports-race",
    title: "Annual Track & Field Sprint Relays",
    category: "sports",
    categoryLabel: "Sports",
    src: "/mvps/gallery/sports_race_01.jpg",
    description: "Track athletes competing in 100m, 200m, and inter-house relay sprints.",
  },
  {
    id: "sports-athletics",
    title: "Track Athletics & Endurance Training",
    category: "sports",
    categoryLabel: "Sports",
    src: "/mvps/gallery/sports_athletics_01.jpg",
    description: "High-performance training under qualified physical education faculty.",
  },
  {
    id: "sports-arena",
    title: "Regulation Sports Arena & Outdoor Courts",
    category: "sports",
    categoryLabel: "Sports",
    src: "/mvps/facilities/sports_01.jpg",
    description: "Volleyball, basketball, badminton courts and physical development lawns.",
  },

  // Academics & Labs
  {
    id: "academics-lab",
    title: "Experiential Chemistry & STEM Science Lab",
    category: "academics",
    categoryLabel: "Academics",
    src: "/mvps/facilities/labs.jpg",
    description: "Students performing rigorous laboratory experiments, scientific titrations, and investigations.",
  },
  {
    id: "academics-classroom",
    title: "Interactive Smart Classrooms & Active Pedagogy",
    category: "academics",
    categoryLabel: "Academics",
    src: "/mvps/facilities/classrooms_01.jpg",
    description: "Student-centered interactive learning utilizing modern digital audio-visual smartboards.",
  },
  {
    id: "academics-library",
    title: "Central Knowledge Library & Reading Hub",
    category: "academics",
    categoryLabel: "Academics",
    src: "/mvps/facilities/library_01.jpg",
    description: "Vast collection of curriculum texts, reference encyclopedias, and quiet reading nooks.",
  },
  {
    id: "academics-activity",
    title: "Collaborative Scholastic Workshops",
    category: "academics",
    categoryLabel: "Academics",
    src: "/mvps/gallery/academic_activity_01.jpg",
    description: "Hands-on projects fostering teamwork, presentation skills, and critical thinking.",
  },

  // Cultural & Co-curricular
  {
    id: "cultural-stage-1",
    title: "Grand Annual Function & Cultural Symphony",
    category: "events",
    categoryLabel: "Cultural",
    src: "/mvps/gallery/event_stage_01.jpg",
    description: "Students presenting Indian classical theater, drama, and festive performances in auditorium.",
  },
  {
    id: "cultural-stage-2",
    title: "Musical Drama & Theatrical Ensemble",
    category: "events",
    categoryLabel: "Cultural",
    src: "/mvps/gallery/event_stage_02.jpg",
    description: "Auditorium stage showcase celebrating performing arts, music, and dramatic expressions.",
  },
  {
    id: "cultural-folk",
    title: "Traditional Punjabi & Regional Folk Dance",
    category: "events",
    categoryLabel: "Cultural",
    src: "/mvps/gallery/event_cultural_01.jpg",
    description: "Vibrant traditional folk dance celebration representing Indian heritage and cultural unity.",
  },
  {
    id: "cultural-harmony",
    title: "Heritage Day & Unity Celebrations",
    category: "events",
    categoryLabel: "Cultural",
    src: "/mvps/gallery/event_cultural_02.jpg",
    description: "Honoring national festivities, historical milestones, and community harmony.",
  },
  {
    id: "cultural-dance",
    title: "Classical Choreography & Dance Recitals",
    category: "events",
    categoryLabel: "Cultural",
    src: "/mvps/gallery/event_dance_01.jpg",
    description: "Graceful classical dance presentations by student cultural society.",
  },
];

const roles: RoleDefinition[] = [
  {
    role: "student",
    eyebrow: "LEARN & GROW",
    title: "Student / Parent",
    badge: "Scholastic Hub",
    description: "Your everyday hub for CBSE curriculum, attendance, homework, report cards, and bus tracking.",
    image: "/student_avatar.png",
    accent: "#ea580c",
    soft: "#fff7ed",
    icon: <GraduationCap size={18} />,
    actions: ["Homework & LMS", "Report cards & marks", "Bus live tracking", "Fee payments"],
  },
  {
    role: "staff",
    eyebrow: "LEAD WITH PURPOSE",
    title: "Staff",
    badge: "Faculty Gateway",
    description: "Manage classrooms, marks, lesson plans and the moments that shape every learner.",
    image: "/staff_avatar.png",
    accent: "#0d9488",
    soft: "#f0fdfa",
    icon: <Users size={18} />,
    actions: ["Mark attendance", "Enter grades", "Lesson plans", "Leave applications"],
  },
  {
    role: "visitor",
    eyebrow: "WELCOME IN",
    title: "Visitor",
    badge: "Admissions & Passes",
    description: "Arrive, explore and connect with the campus through a fast, secure visitor experience.",
    image: "/admin_avatar.png",
    accent: "#7c3aed",
    soft: "#f5f3ff",
    icon: <QrCode size={18} />,
    actions: ["Visitor pass", "Campus tour", "Admissions desk", "Meet leadership"],
  },
  {
    role: "alumni",
    eyebrow: "STAY CONNECTED",
    title: "Alumni / Ex-Staff",
    badge: "Heritage Network",
    description: "Keep the spirit of Madhuvan Vatika alive through chapters, mentoring and shared milestones.",
    image: "/alumni_avatar.png",
    accent: "#d97706",
    soft: "#fffbeb",
    icon: <Award size={18} />,
    actions: ["Alumni directory", "Mentorship", "Hall of fame", "Reunions"],
  },
];

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    : "Wed, 21 Oct 2026";

const formatTime = (date: Date | null) =>
  date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "10:30 AM";

export default function RoleSelectionScreen({
  onSelectRole,
  onBackToPortal,
  isFullscreen,
  toggleFullscreen,
  currentTime,
  onOpenBot,
}: RoleSelectionScreenProps) {
  const [activeRole, setActiveRole] = useState<RoleDefinition | null>(null);

  // Background Slideshow State
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);

  // Gallery Modal & Lightbox State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "sports" | "academics" | "events" | "campus">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // MVP AI Assistant State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "👋 Hello! I am **MVP AI**, the smart campus assistant for **Madhuvan Vatika Public School (MVPS)**.\n\nAsk me anything about **2026-27 Admissions**, **Fee Structure**, **Sports & Extracurricular Facilities**, or **Campus Timings**!",
      time: "Just now",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-advance Background Slideshow every 6.5s
  useEffect(() => {
    if (!isSlideshowPlaying || customBgImage) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isSlideshowPlaying, customBgImage]);

  const handleNextSlide = useCallback(() => {
    setCustomBgImage(null);
    setSlideIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setCustomBgImage(null);
    setSlideIndex((prev) => (prev - 1 + BACKGROUND_SLIDES.length) % BACKGROUND_SLIDES.length);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsSlideshowPlaying((prev) => !prev);
  }, []);

  const handleApplyAsBackground = (imageSrc: string) => {
    setCustomBgImage(imageSrc);
    setLightboxIndex(null);
    setIsGalleryOpen(false);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % CAMPUS_GALLERY_COLLECTION.length : 0));
        }
        if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + CAMPUS_GALLERY_COLLECTION.length) % CAMPUS_GALLERY_COLLECTION.length : 0
          );
        }
      } else if (isGalleryOpen && e.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, isGalleryOpen]);

  useEffect(() => {
    if (isAiModalOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, isAiModalOpen]);

  const handleSendAi = async (textToSend?: string) => {
    const query = (textToSend ?? aiInput).trim();
    if (!query || isAiTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAiMessages((prev) => [...prev, { sender: "user", text: query, time: timeStr }]);
    setAiInput("");
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          role: "visitor",
          history: aiMessages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const reply =
        data.answer ||
        "Thank you for reaching out! For direct admissions assistance, please contact the MVPS helpdesk at admissions@mvps.edu.in or visit Counter 104 in Block A.";
      setAiMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ MVP AI assistant is temporarily reconnecting. Please check with the campus reception desk in Block A.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleBotButtonClick = () => {
    if (onOpenBot) {
      onOpenBot();
    } else {
      setIsAiModalOpen(true);
    }
  };

  const currentSlide = BACKGROUND_SLIDES[slideIndex];
  const filteredGallery =
    galleryFilter === "all"
      ? CAMPUS_GALLERY_COLLECTION
      : CAMPUS_GALLERY_COLLECTION.filter((item) => item.category === galleryFilter);

  return (
    <main className="kiosk-command-center kiosk-roles-portal">
      {/* 1. DYNAMIC CAMPUS PHOTO SLIDESHOW (REAL MVPS CAMPUS VIEWS) */}
      <div className="kiosk-bg-slideshow" aria-hidden="true">
        {customBgImage ? (
          <div
            className="kiosk-bg-slide active"
            style={{ backgroundImage: `url('${customBgImage}')` }}
          />
        ) : (
          BACKGROUND_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`kiosk-bg-slide ${idx === slideIndex ? "active" : ""}`}
              style={{ backgroundImage: `url('${slide.src}')` }}
            />
          ))
        )}
      </div>

      {/* Layered Glass Scrim & Subtle Institutional Grid */}
      <div className="kiosk-bg-scrim" aria-hidden="true" />
      <div className="kiosk-bg-grid-overlay" aria-hidden="true" />

      {/* 2. COMMAND CENTER FOREGROUND SHELL */}
      <div className="kiosk-shell">
        {/* TOP COMMAND HEADER */}
        <header className="command-header">
          <div className="command-brand">
            <button
              className="command-back"
              onClick={onBackToPortal}
              aria-label="Back to home dashboard"
              title="Return to Main Campus Dashboard"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="command-mark" aria-hidden="true" suppressHydrationWarning>
              <img
                src="/mvps/brand/logo.png"
                alt="Madhuvan Vatika Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <p className="command-kicker">MADHUVAN VATIKA • SMART CAMPUS</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.03em" }}>
                  Madhuvan Vatika - MVPS
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                    color: "#c2410c",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    padding: "0.22rem 0.75rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(234, 88, 12, 0.35)",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.1)",
                  }}
                >
                  <Sparkles size={11} style={{ color: "#ea580c" }} />
                  Kiosk OS 3.2
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Navigation Tools */}
          <div className="command-tools">
            <button
              className="command-gallery-trigger"
              onClick={() => setIsGalleryOpen(true)}
              title="View Moments of Joy & Learning from madhuvanvatika.org"
            >
              <Camera size={15} style={{ color: "#ea580c" }} />
              <span>School Gallery</span>
              <span className="gallery-count-badge">{CAMPUS_GALLERY_COLLECTION.length}</span>
            </button>

            <div className="command-chip">
              <Calendar size={13} style={{ color: "#ea580c" }} />
              <span>{formatDate(currentTime)}</span>
            </div>

            <div className="command-chip">
              <Clock3 size={13} style={{ color: "#ea580c" }} />
              <span>{formatTime(currentTime)}</span>
            </div>

            <div className="command-chip pulse">
              <span className="status-dot green" />
              <span>CBSE 2026-27 Active</span>
            </div>

            <button
              className="command-btn"
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
            </button>
          </div>
        </header>

        {/* HERO SECTION WITH LIVE SLIDESHOW STATUS CAPSULE */}
        <section className="command-hero-v2">
          <div className="hero-content-block">
            <div className="hero-kicker-v2">
              <Activity size={13} />
              <span>Institutional Gateway • Session 2026-27</span>
            </div>
            <h2>
              Welcome to <span>Madhuvan Vatika</span> Public School
            </h2>
            <p>
              Please touch your designation or purpose below to access your dedicated terminal.
            </p>
          </div>

          {/* Background Slideshow Controller Capsule */}
          <div className="kiosk-slideshow-capsule">
            {/* <div className="slideshow-capsule-meta">
              <div className="capsule-icon-wrap">
                <Camera size={14} style={{ color: "#ea580c" }} />
              </div>
              <div className="capsule-text-wrap">
                <span className="capsule-tag">
                  {customBgImage ? "Custom View" : currentSlide.category}
                </span>
                <span className="capsule-title">
                  {customBgImage ? "Selected Campus Moment" : currentSlide.title}
                </span>
              </div>
            </div> */}

            <div className="slideshow-capsule-controls">
              <button
                className="slideshow-ctrl-btn"
                onClick={handlePrevSlide}
                aria-label="Previous Campus Photo"
                title="Previous Photo"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                className="slideshow-ctrl-btn"
                onClick={handleTogglePlay}
                aria-label={isSlideshowPlaying ? "Pause Background Slideshow" : "Play Background Slideshow"}
                title={isSlideshowPlaying ? "Pause Slideshow" : "Resume Slideshow"}
              >
                {isSlideshowPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                className="slideshow-ctrl-btn"
                onClick={handleNextSlide}
                aria-label="Next Campus Photo"
                title="Next Photo"
              >
                <ChevronRight size={16} />
              </button>

              <button
                className="slideshow-gallery-btn"
                onClick={() => setIsGalleryOpen(true)}
                title="Browse Full Gallery"
              >
                <ImageIcon size={13} />
                <span>Gallery</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 PERSONA ROLE SELECTION GRID (PREVIOUS LAYOUT RESTORED) */}
        <section className="role-grid" style={{ "paddingTop": '50px' }} aria-label="Choose your portal">
          {roles.map((item, index) => (
            <article
              key={item.role}
              className="role-tile"
              style={
                {
                  "--role-accent": item.accent,
                  "--role-soft": item.soft,
                  "--delay": `${index * 90}ms`,
                  "height": '50vh'
                } as React.CSSProperties
              }
              onClick={() => onSelectRole(item.role)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectRole(item.role);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="role-stage">
                <div className="role-stage-header">
                  <div className="role-stage-badge">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="role-arrow" aria-hidden="true">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="role-char-box">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`role-char-img role-char-${item.role}`}
                  />
                </div>
              </div>

              <div className="role-body">
                <p className="role-eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="role-description">{item.description}</p>
                <div className="role-actions">
                  {item.actions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
                <div className="role-cta-bar">
                  <span className="role-cta-text">
                    <Sparkles size={14} style={{ color: item.accent }} />
                    Touch to Enter
                  </span>
                  <button
                    type="button"
                    className="role-details-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveRole(item);
                    }}
                    aria-label={`View ${item.title} portal details`}
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* BOTTOM COMMAND FOOTER */}
        <footer className="command-footer">
          <div>
            <span className="footer-dot" />
            <span>Role Selection Portal • Touch any role card above to proceed</span>
          </div>

          <div className="footer-links">
            <span>CBSE Affiliation 1930281</span>
            <span>NAAC Grade A++</span>
            <span>Campus: 4,200 Students</span>
            <span>Digital Kiosk OS 3.2</span>
          </div>

          <button className="assistant-button" onClick={handleBotButtonClick}>
            <span className="assistant-pulse" />
            <span>Need help? <b>Ask MVP AI</b></span>
          </button>
        </footer>
      </div>

      {/* Role Confirmation Modal */}
      {activeRole && (
        <div className="portal-modal-backdrop" onClick={() => setActiveRole(null)}>
          <section className="portal-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveRole(null)} aria-label="Close">
              ×
            </button>
            <div className="modal-accent" style={{ background: activeRole.accent }} />
            <div className="modal-icon" style={{ background: activeRole.soft, color: activeRole.accent }}>
              {activeRole.icon}
            </div>
            <p className="role-eyebrow">{activeRole.eyebrow}</p>
            <h2>{activeRole.title}</h2>
            <p>{activeRole.description}</p>
            <div className="modal-benefits">
              {activeRole.actions.map((action) => (
                <div key={action}>
                  <CheckCircle2 size={16} />
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <button
              className="modal-primary"
              style={{ background: activeRole.accent }}
              onClick={() => onSelectRole(activeRole.role)}
            >
              Enter portal <ArrowRight size={17} />
            </button>
          </section>
        </div>
      )}

      {/* School Gallery Modal (Curated from madhuvanvatika.org/Gallery.html) */}
      {isGalleryOpen && (
        <div
          className="portal-modal-backdrop"
          onClick={() => setIsGalleryOpen(false)}
          style={{ zIndex: 9000, padding: "1.5rem" }}
        >
          <div
            className="gallery-modal-window"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 1100,
              maxHeight: "90vh",
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              borderRadius: "24px",
              boxShadow: "0 35px 70px rgba(0, 0, 0, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
            }}
          >
            {/* Gallery Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "linear-gradient(135deg, rgba(255, 247, 237, 0.88) 0%, rgba(255, 237, 213, 0.68) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1.5px solid rgba(254, 215, 170, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(8px)",
                    display: "grid",
                    placeItems: "center",
                    border: "1.5px solid rgba(234, 88, 12, 0.3)",
                    boxShadow: "0 4px 10px rgba(234, 88, 12, 0.12)",
                  }}
                >
                  <Camera size={22} style={{ color: "#ea580c" }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <h3 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>
                      School Gallery • Moments of Joy and Learning
                    </h3>
                    <a
                      href="https://madhuvanvatika.org/Gallery.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.72rem",
                        color: "#ea580c",
                        fontWeight: 700,
                        textDecoration: "none",
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(234, 88, 12, 0.25)",
                      }}
                      title="Open official web gallery"
                    >
                      madhuvanvatika.org <ExternalLink size={11} />
                    </a>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                    Madhuvan Vatika Public School • Village Asmanpur, PO Nurpur Bedi, Ropar
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGalleryOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "#64748b",
                  transition: "all 0.2s ease",
                }}
                aria-label="Close Gallery"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Buttons */}
            <div
              style={{
                padding: "0.85rem 1.5rem",
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(226, 232, 240, 0.7)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { key: "all", label: `All Moments (${CAMPUS_GALLERY_COLLECTION.length})` },
                {
                  key: "sports",
                  label: `Sports (${CAMPUS_GALLERY_COLLECTION.filter((i) => i.category === "sports").length})`,
                },
                {
                  key: "academics",
                  label: `Academics & Labs (${CAMPUS_GALLERY_COLLECTION.filter((i) => i.category === "academics").length})`,
                },
                {
                  key: "events",
                  label: `Co-Curricular & Stage (${CAMPUS_GALLERY_COLLECTION.filter((i) => i.category === "events").length})`,
                },
                {
                  key: "campus",
                  label: `Campus & Fleet (${CAMPUS_GALLERY_COLLECTION.filter((i) => i.category === "campus").length})`,
                },
              ].map((tab) => {
                const isActive = galleryFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setGalleryFilter(tab.key as "all" | "sports" | "academics" | "events" | "campus")}
                    style={{
                      background: isActive ? "#ea580c" : "#ffffff",
                      color: isActive ? "#ffffff" : "#475569",
                      border: isActive ? "1.5px solid #ea580c" : "1.5px solid #e2e8f0",
                      padding: "0.4rem 1rem",
                      borderRadius: "9999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: isActive ? "0 4px 12px rgba(234, 88, 12, 0.25)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}

              {customBgImage && (
                <button
                  onClick={() => setCustomBgImage(null)}
                  style={{
                    marginLeft: "auto",
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    color: "#e11d48",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reset to Auto Slideshow
                </button>
              )}
            </div>

            {/* Gallery Grid */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.25rem",
                background: "rgba(248, 250, 252, 0.55)",
              }}
            >
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const globalIdx = CAMPUS_GALLERY_COLLECTION.findIndex((g) => g.id === item.id);
                    setLightboxIndex(globalIdx >= 0 ? globalIdx : 0);
                  }}
                  style={{
                    position: "relative",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1.5px solid rgba(255, 255, 255, 0.85)",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.95)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: 160, overflow: "hidden" }}>
                    <img
                      src={item.src}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.35s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(255, 255, 255, 0.92)",
                        color: "#ea580c",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {item.categoryLabel}
                    </div>
                  </div>

                  <div style={{ padding: "0.85rem", display: "flex", flexDirection: "column", gap: 4 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.72rem",
                        color: "#64748b",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </p>

                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "6px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyAsBackground(item.src);
                        }}
                        style={{
                          flex: 1,
                          background: "#fff7ed",
                          border: "1px solid rgba(254, 215, 170, 0.8)",
                          color: "#c2410c",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                        title="Set this photo as the Kiosk background"
                      >
                        <ImageIcon size={11} /> Use As Background
                      </button>

                      <button
                        onClick={() => {
                          const globalIdx = CAMPUS_GALLERY_COLLECTION.findIndex((g) => g.id === item.id);
                          setLightboxIndex(globalIdx >= 0 ? globalIdx : 0);
                        }}
                        style={{
                          background: "#f1f5f9",
                          border: "none",
                          color: "#475569",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <ZoomIn size={12} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="portal-modal-backdrop"
          onClick={() => setLightboxIndex(null)}
          style={{ zIndex: 10000, background: "rgba(10, 15, 25, 0.92)", backdropFilter: "blur(18px)", padding: "1.5rem" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(1080px, 94vw)",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Top Close & Counter */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#ffffff",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    background: "rgba(234, 88, 12, 0.9)",
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  {CAMPUS_GALLERY_COLLECTION[lightboxIndex].categoryLabel}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                  Photo {lightboxIndex + 1} of {CAMPUS_GALLERY_COLLECTION.length}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button
                  onClick={() => handleApplyAsBackground(CAMPUS_GALLERY_COLLECTION[lightboxIndex].src)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ImageIcon size={13} /> Set as Background
                </button>

                <button
                  onClick={() => setLightboxIndex(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                  aria-label="Close Lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image Stage with Previous / Next Buttons */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "72vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                background: "#0f172a",
              }}
            >
              <img
                src={CAMPUS_GALLERY_COLLECTION[lightboxIndex].src}
                alt={CAMPUS_GALLERY_COLLECTION[lightboxIndex].title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "72vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + CAMPUS_GALLERY_COLLECTION.length) % CAMPUS_GALLERY_COLLECTION.length
                  );
                }}
                style={{
                  position: "absolute",
                  left: "1rem",
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.55)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
                aria-label="Previous Photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % CAMPUS_GALLERY_COLLECTION.length);
                }}
                style={{
                  position: "absolute",
                  right: "1rem",
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.55)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
                aria-label="Next Photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div
              style={{
                width: "100%",
                marginTop: "0.85rem",
                textAlign: "center",
                color: "#f8fafc",
              }}
            >
              <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 800 }}>
                {CAMPUS_GALLERY_COLLECTION[lightboxIndex].title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8" }}>
                {CAMPUS_GALLERY_COLLECTION[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MVP AI Campus Assistant Modal */}
      {isAiModalOpen && (
        <div
          className="portal-modal-backdrop"
          onClick={() => setIsAiModalOpen(false)}
          style={{ zIndex: 9000, padding: "1.5rem" }}
        >
          <div
            className="gallery-modal-window"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "88vh",
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              borderRadius: "24px",
              boxShadow: "0 35px 70px rgba(0, 0, 0, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "linear-gradient(135deg, rgba(255, 247, 237, 0.9) 0%, rgba(255, 237, 213, 0.72) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1.5px solid rgba(254, 215, 170, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src="/mvps/brand/logo.png"
                  alt="Madhuvan Vatika Logo"
                  style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 10, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(6px)", padding: 2, border: "1px solid rgba(234, 88, 12, 0.25)" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>
                      MVP AI Campus Assistant
                    </h3>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                      }}
                    >
                      ● Online
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.74rem", color: "#64748b" }}>
                    Madhuvan Vatika Public School • Instant Admissions, Fees &amp; Campus Guidance
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "#64748b",
                }}
                aria-label="Close AI Assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                minHeight: 320,
                maxHeight: "55vh",
                background: "rgba(248, 250, 252, 0.55)",
              }}
            >
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: msg.sender === "user" ? "80%" : "92%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: msg.sender === "user" ? "#ea580c" : "rgba(255, 255, 255, 0.85)",
                      color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                      padding: "0.75rem 1rem",
                      borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
                      border: msg.sender === "user" ? "none" : "1.5px solid rgba(255, 255, 255, 0.9)",
                      backdropFilter: msg.sender === "user" ? "none" : "blur(10px)",
                      WebkitBackdropFilter: msg.sender === "user" ? "none" : "blur(10px)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <MarkdownResponse content={msg.text} isUser={msg.sender === "user"} />
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "#64748b", marginTop: 4, padding: "0 4px", fontWeight: 600 }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isAiTyping && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ea580c", fontSize: "0.8rem", fontWeight: 600 }}>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>MVP AI is typing an answer...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                borderTop: "1px solid rgba(226, 232, 240, 0.7)",
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {[
                "2026-27 Admission Process",
                "Eligibility & Age Criteria",
                "Fee Structure",
                "Required Documents",
                "School Timings",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendAi(chip)}
                  style={{
                    background: "rgba(255, 247, 237, 0.85)",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    color: "#ea580c",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAi();
              }}
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.82)",
                backdropFilter: "blur(12px)",
                borderTop: "1.5px solid rgba(226, 232, 240, 0.7)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Ask MVP AI about admissions, fee structure, timetable, or school policies..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.65rem 1rem",
                  borderRadius: "12px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || isAiTyping}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.65rem 1.15rem",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: !aiInput.trim() || isAiTyping ? "not-allowed" : "pointer",
                  opacity: !aiInput.trim() || isAiTyping ? 0.6 : 1,
                }}
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
