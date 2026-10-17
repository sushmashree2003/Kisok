"use client";

import React, { useState, useEffect, useRef } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import {
  Calendar,
  CalendarDays,
  Bell,
  Search,
  ArrowRight,
  ArrowLeft,
  Home,
  Activity,
  Sparkles,
  Send,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Share2,
  Heart,
  Bot,
  Newspaper,
  Image as ImageIcon,
  UserCheck,
  Clock,
  MapPin,
  Mic,
  Users,
  Award,
  GraduationCap,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  X,
  RefreshCw,
  FileText,
  Check,
  Building2,
  Maximize,
  Minimize,
  QrCode,
  MessageSquare,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export type AlumniScreen =
  | "dashboard"
  | "reconnect"
  | "events"
  | "profile"
  | "heritage"
  | "requests"
  | "visit"
  | "jobs"
  | "giveback"
  | "aispace"
  | "gallery";

// Preset AI Questions & Responses
const AI_PRESET_QA: Record<string, string> = {
  "When is the next Alumni Meet?":
    "The Annual Alumni Meet 2025 is scheduled for Saturday, 25 Sep 2025 from 10:00 AM to 01:00 PM at the Main School Auditorium and Central Lawns. Over 248 alumni have confirmed their attendance. You can RSVP in the Alumni Events tab!",
  "How do I request my transcripts?":
    "You can submit an official transcript or degree verification request directly from the 'Request Desk' tab. Digital PDF copies are processed within 48 hours, or you can opt for physical sealed courier delivery with live tracking.",
  "How can I schedule a campus visit?":
    "Use the 'Plan a Visit' tab to select your preferred date and slot (Monday to Saturday, 09:00 AM – 04:30 PM). An instant Alumni Security Entry Pass with QR code will be generated for hassle-free North Gate entry.",
  "How can I mentor current students?":
    "We welcome your mentorship! You can register for our Mentorship Clinic or submit a Guest Lecture proposal through the Request Desk. The school academic cell coordinates both virtual and in-person sessions for senior students.",
  "What is the alumni scholarship fund?":
    "The Madhuvan Vatika Merit & Need-based Scholarship Endowment provides tuition waivers and exam fee support for deserving high schoolers. Check the 'Give Back' tab to view active campaigns, goals, and donation tiers with 80G tax exemptions.",
  "Tell me about my batch (Class of 2015)":
    "The Class of 2015 (Batch XI) has 112 verified alumni registered in the portal across 9 countries. Notable members include Priya Nair (FinTech leader), Dr. Kavita Menon (AIIMS surgeon), and Vikram Seth (EdTech founder)!",
};

// Initial Sample Alumni Profile Details
const INITIAL_ALUMNI_PROFILE = {
  name: "Rohan Sharma",
  batch: "2015",
  batchTitle: "Class of 2015 (Batch XI)",
  admNo: "GV-2015-8821",
  classSection: "XII-A (Science & Computer Science)",
  degree: "B.Tech Computer Science, BITS Pilani",
  currentRole: "Senior Lead Software Engineer",
  company: "Infosys Technologies & Alum Founder",
  industry: "Technology & Software",
  location: "Bengaluru, Karnataka, India",
  email: "rohan.sharma.15@alumni.greenvalley.edu.in",
  phone: "+91 98450 12345",
  linkedin: "linkedin.com/in/rohan-sharma-gv15",
  bio: "Class of 2015 valedictorian and robotics club lead. Passionate about AI in education and mentoring Madhuvan Vatika high schoolers in competitive programming and higher education admissions.",
  achievements: "CBSE National Science Exhibition Winner 2014 • Best Outgoing Student 2015",
  mentorshipInterest: true,
  jobReferralInterest: true,
};

// Sample Upcoming Events
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Annual Alumni Meet 2025",
    subtitle: "Decennial Homecoming & Gala Dinner",
    day: "25",
    month: "Sep",
    date: "25 Sep 2025",
    time: "10:00 AM - 01:00 PM",
    venue: "Main School Auditorium & Central Lawns",
    type: "Reunion",
    attendees: 248,
    isRsvp: true,
    description:
      "Join over 250+ alumni from batches 1995 to 2024 for an afternoon of nostalgia, honoring distinguished retired teachers, cultural performances by current high schoolers, and our grand networking lunch.",
    speaker: "Hosted by GV Alumni Executive Council",
  },
  {
    id: 2,
    title: "Guest Lecture Series: Frontiers of AI",
    subtitle: "Industry Insights for Classes 11 & 12",
    day: "10",
    month: "Oct",
    date: "10 Oct 2025",
    time: "04:00 PM - 05:30 PM",
    venue: "APJ Abdul Kalam Smart Studio & Hybrid Live Stream",
    type: "Webinar",
    attendees: 184,
    isRsvp: false,
    description:
      "Alum Ankit Verma ('12, Staff AI Researcher at Google) delves into generative artificial intelligence, machine learning ethics, and career pathways in modern computer science.",
    speaker: "Ankit Verma ('12, Google)",
  },
  {
    id: 3,
    title: "Career Guidance & Mentorship Clinic",
    subtitle: "One-on-One Consultations for Graduating Seniors",
    day: "18",
    month: "Oct",
    date: "18 Oct 2025",
    time: "11:00 AM - 01:30 PM",
    venue: "Senior Wing Library & Conference Rooms",
    type: "Mentorship",
    attendees: 96,
    isRsvp: true,
    description:
      "A dedicated mentorship clinic covering engineering, civil services, medicine, corporate law, design, and venture entrepreneurship led by our alumni panel.",
    speaker: "Multi-Industry Alumni Panel",
  },
  {
    id: 4,
    title: "Alumni Reunion 2025 & Sports Derby",
    subtitle: "Traditional Cricket & Football Friendly Matches",
    day: "05",
    month: "Nov",
    date: "05 Nov 2025",
    time: "06:00 PM - 09:00 PM",
    venue: "School Sports Complex & Floodlit Turf",
    type: "Sports",
    attendees: 312,
    isRsvp: false,
    description:
      "Relive high school sporting rivalries! The annual Alumni vs Faculty Cricket match followed by a twilight bonfire dinner, nostalgic photo booth, and awards ceremony.",
    speaker: "Sports Council & Physical Education Dept",
  },
];

// Sample Latest Updates
const INITIAL_UPDATES = [
  {
    id: 1,
    title: "Alumni Spotlight: Priya Nair ('15)",
    tag: "Leadership",
    tagColor: "#0284c7",
    tagBg: "#e0f2fe",
    date: "15 Sep 2025",
    desc: "VP at Global FinTech, named in 40-Under-40 Leadership Leaders for digital payment innovations across Asia.",
    fullContent:
      "Madhuvan Vatika - MVPS congratulates Priya Nair (Class of 2015, Batch XI) for being recognized in the prestigious Global 40-Under-40 FinTech Leaders list. Priya was our school cabinet head and topped the CBSE Commerce stream in 2015. She currently manages digital payment infrastructures processing over $10B annually.",
  },
  {
    id: 2,
    title: "Global Hiring: 14 Open Positions for GVians",
    tag: "Careers",
    tagColor: "#15803d",
    tagBg: "#dcfce7",
    date: "12 Sep 2025",
    desc: "Google, Microsoft, TCS, and FinTech ventures offer priority referral slots and paid internships for Madhuvan Vatika alumni.",
    fullContent:
      "Alumni-founded and alumni-led technology enterprises in Bengaluru, Hyderabad, and Pune have posted 14 verified openings across full-stack engineering, cloud architecture, product design, and quantitative research. Submit applications directly via our Job Opportunities portal.",
  },
  {
    id: 3,
    title: "Decennial Homecoming Gala 2025 Announced",
    tag: "Reunion",
    tagColor: "#c2410c",
    tagBg: "#ffedd5",
    date: "08 Sep 2025",
    desc: "Grand homecoming celebration scheduled at Campus Auditorium with commemorative souvenir release and faculty felicitation.",
    fullContent:
      "The Madhuvan Vatika Alumni Association cordially invites all batches to the Decennial Homecoming Gala. Highlights include the launch of our digital archives portal, unveiling of the new STEM Robotics block, and felicitation of 15 veteran educators who have served for over 20 years.",
  },
  {
    id: 4,
    title: "Class of 2010 Pledges ₹15 Lakh for Robotics Lab",
    tag: "Philanthropy",
    tagColor: "#7c3aed",
    tagBg: "#ede9fe",
    date: "02 Sep 2025",
    desc: "Alumni endowment fund crosses ₹1.2 Crore milestone to establish modern maker-spaces and AI workstations for school students.",
    fullContent:
      "In an inspiring show of gratitude, the Class of 2010 has collectively contributed ₹15 Lakh towards the modern Madhuvan Vatika Robotics & Prototyping Laboratory. The lab will feature 3D printers, IoT micro-controllers, and drone simulation rigs.",
  },
];

// Sample Current Affairs
const INITIAL_CURRENT_AFFAIRS = [
  {
    id: 1,
    title: "Education Reforms: NEP 2025 Rollout",
    date: "23 Sep 2025 • Policy",
    category: "Policy",
    icon: GraduationCap,
    summary:
      "CBSE and Ministry of Education expand vocational training and multidisciplinary subject combinations across secondary schools nationwide.",
  },
  {
    id: 2,
    title: "4 GV Alum Startups Receive Pre-Seed Funding",
    date: "21 Sep 2025 • Innovation",
    category: "Innovation",
    icon: TrendingUp,
    summary:
      "CleanTech, EduTech, and HealthTech ventures founded by alumni from batches 2014-2018 secure cumulative $3.2M in pre-seed venture capital.",
  },
  {
    id: 3,
    title: "India Wins 5 Medals at International Olympiad",
    date: "18 Sep 2025 • Academics",
    category: "Academics",
    icon: Award,
    summary:
      "Indian national delegation bags 3 Golds and 2 Silvers at the Tokyo Olympiad, with Madhuvan Vatika high schoolers cheering the national milestone.",
  },
];

// Sample Mentorship & Masterclasses
const INITIAL_MASTERCLASSES = [
  {
    id: 1,
    title: "AI & Data Science AMA",
    mentor: "Ankit Verma (Staff AI, Google)",
    batch: "Class of 2012",
    date: "28 Sep 2025 • 05:00 PM",
    mode: "Virtual Webinar",
    registered: false,
    badge: "AI & ML",
  },
  {
    id: 2,
    title: "Civil Services Prep 101",
    mentor: "Meera Sen, IAS (Additional Secretary)",
    batch: "Class of 2010",
    date: "02 Oct 2025 • 11:00 AM",
    mode: "Hybrid Studio",
    registered: true,
    badge: "UPSC / Governance",
  },
  {
    id: 3,
    title: "FinTech & Venture Capital Roadmap",
    mentor: "Rajesh Patel (Partner, VC Fund)",
    batch: "Class of 2008",
    date: "14 Oct 2025 • 06:00 PM",
    mode: "Virtual Webinar",
    registered: false,
    badge: "Finance & Startups",
  },
];

// Sample Alumni Network Members
const INITIAL_ALUMNI_NETWORK = [
  {
    id: "alum-1",
    name: "Rohan Sharma",
    batch: "2015",
    role: "Senior Lead Software Engineer",
    company: "Infosys Technologies",
    location: "Bengaluru, India",
    domain: "Technology",
    avatar: "/alumni_avatar.png",
    verified: true,
  },
  {
    id: "alum-2",
    name: "Priya Nair",
    batch: "2015",
    role: "VP Product Strategy",
    company: "FinTech Global Solutions",
    location: "Mumbai, India",
    domain: "Finance",
    avatar: "/staff_avatar.png",
    verified: true,
  },
  {
    id: "alum-3",
    name: "Ankit Verma",
    batch: "2012",
    role: "Staff AI Researcher",
    company: "Google Research",
    location: "Mountain View, USA",
    domain: "Technology",
    avatar: "/student_avatar.png",
    verified: true,
  },
  {
    id: "alum-4",
    name: "Meera Sen",
    batch: "2010",
    role: "Additional Secretary (IAS)",
    company: "Government of India",
    location: "New Delhi, India",
    domain: "Civil Services",
    avatar: "/staff_avatar.png",
    verified: true,
  },
  {
    id: "alum-5",
    name: "Dr. Rajesh Rao",
    batch: "2008",
    role: "Principal Scientist",
    company: "ISRO Satellite Center",
    location: "Bengaluru, India",
    domain: "Science",
    avatar: "/student_avatar.png",
    verified: true,
  },
  {
    id: "alum-6",
    name: "Dr. Kavita Menon",
    batch: "2014",
    role: "Senior Cardiothoracic Surgeon",
    company: "AIIMS",
    location: "New Delhi, India",
    domain: "Healthcare",
    avatar: "/staff_avatar.png",
    verified: true,
  },
  {
    id: "alum-7",
    name: "Vikram Seth",
    batch: "2016",
    role: "Founder & CEO",
    company: "EdTech Labs",
    location: "Hyderabad, India",
    domain: "Entrepreneurship",
    avatar: "/student_avatar.png",
    verified: true,
  },
  {
    id: "alum-8",
    name: "Divya Krishnan",
    batch: "2018",
    role: "Senior Urban Architect",
    company: "Foster & Partners",
    location: "London, UK",
    domain: "Design",
    avatar: "/staff_avatar.png",
    verified: true,
  },
];

// Sample Former Teachers
const FORMER_TEACHERS = [
  {
    id: "teach-1",
    name: "Mr. K. Sundaram",
    subject: "Physics Department (HOD)",
    years: "1994 - 2022 (28 Years of Service)",
    status: "Retired Faculty Mentor",
    location: "Bengaluru",
    memory: "Mentored 18 Science Olympiad national champions.",
  },
  {
    id: "teach-2",
    name: "Mrs. Radhika Sen",
    subject: "Senior Mathematics Faculty",
    years: "1998 - 2024 (26 Years of Service)",
    status: "Academic Consultant",
    location: "Bengaluru",
    memory: "Pioneered Vedic Math & Calculus workshops.",
  },
  {
    id: "teach-3",
    name: "Mr. John David",
    subject: "Physical Education Director",
    years: "2001 - 2023 (22 Years of Service)",
    status: "Head Sports Coach",
    location: "Bengaluru",
    memory: "Coached 14 CBSE Inter-School championship squads.",
  },
  {
    id: "teach-4",
    name: "Dr. Nalini Sharma",
    subject: "Chemistry & Laboratory Head",
    years: "1996 - 2021 (25 Years of Service)",
    status: "Research Fellow",
    location: "Mysuru",
    memory: "Inspired over 120 students to pursue chemical sciences.",
  },
];

// Sample Job Opportunities
const INITIAL_JOBS = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    company: "FinTech Innovations",
    postedBy: "Priya Nair ('15)",
    location: "Bengaluru • Hybrid",
    salary: "₹24,00,000 - ₹34,00,000 PA",
    type: "Full-Time",
    experience: "4-7 Years",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    desc: "Lead core payment gateways and checkout experiences. Priority interviews and referral bonus for Madhuvan Vatika alumni.",
  },
  {
    id: 2,
    title: "Cloud Infrastructure Architect",
    company: "TechMatrix Systems",
    postedBy: "Ankit Verma ('12)",
    location: "Hyderabad • Remote",
    salary: "₹28,00,000 - ₹42,00,000 PA",
    type: "Full-Time",
    experience: "5+ Years",
    skills: ["Kubernetes", "GCP", "Terraform", "CI/CD"],
    desc: "Design resilient distributed infrastructure across multi-region deployments. Dedicated referral pipeline for GVians.",
  },
  {
    id: 3,
    title: "AI Research Fellow / Graduate Intern",
    company: "Madhuvan Vatika Innovation Hub",
    postedBy: "Alumni Academic Council",
    location: "Campus / Hybrid",
    salary: "₹8,00,000 - ₹12,00,000 PA",
    type: "Internship / Fellowship",
    experience: "0-2 Years",
    skills: ["Python", "PyTorch", "NLP", "Robotics"],
    desc: "Collaborate with high school researchers on computer vision and robotics projects in our new STEM lab.",
  },
  {
    id: 4,
    title: "Healthcare Data Analyst",
    company: "MediCare Global",
    postedBy: "Dr. Kavita Menon ('14)",
    location: "Mumbai • On-site",
    salary: "₹16,00,000 - ₹22,00,000 PA",
    type: "Full-Time",
    experience: "2-4 Years",
    skills: ["SQL", "PowerBI", "Python", "Clinical Datasets"],
    desc: "Analyze clinical trial analytics and patient outcome modeling. Mentorship support provided by senior alumni doctors.",
  },
  {
    id: 5,
    title: "Lead Product Designer (UI/UX)",
    company: "EdTech NextGen",
    postedBy: "Vikram Seth ('16)",
    location: "Bengaluru • Hybrid",
    salary: "₹18,00,000 - ₹26,00,000 PA",
    type: "Full-Time",
    experience: "3-6 Years",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    desc: "Shape K-12 learning apps used by 500,000+ students. Join an alumni-founded startup backed by leading institutional VCs.",
  },
];

// Sample Philanthropy / Give Back Campaigns
const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    title: "Merit & Need-based Scholarship Endowment Fund",
    category: "Student Scholarships",
    goal: 2500000,
    raised: 1845000,
    donors: 142,
    beneficiaries: "35 High School Students",
    desc: "Covers complete tuition and board examination coaching for economically disadvantaged learners with outstanding academic aptitude.",
  },
  {
    id: 2,
    title: "Smart STEM Robotics & AI Innovation Lab",
    category: "Campus Infrastructure",
    goal: 1500000,
    raised: 1210000,
    donors: 88,
    beneficiaries: "800+ Middle & High Schoolers",
    desc: "Equipping our school's physics and computer laboratories with 3D printers, humanoid robotics kits, and IoT sensor arrays.",
  },
  {
    id: 3,
    title: "Campus Sports Complex & Synthetic Track Fund",
    category: "Sports Excellence",
    goal: 2000000,
    raised: 980000,
    donors: 65,
    beneficiaries: "Entire Student Body & Teams",
    desc: "Refurbishing the 400m athletics synthetic running track, basketball floodlights, and indoor badminton courts.",
  },
];

// Sample Requests in Request Desk
const INITIAL_REQUESTS = [
  {
    id: "GV-REQ-8821",
    title: "Official CBSE Class 12 Transcripts & Migration",
    category: "Transcripts",
    requestDate: "12 Oct 2026",
    status: "Dispatched",
    deliveryMode: "SpeedPost Courier",
    trackingId: "IN-SPD-994821",
    remarks: "Signed & stamped by Academic Registrar. Expected delivery in 2 days.",
  },
  {
    id: "GV-REQ-8790",
    title: "Principal Recommendation Letter for Masters Study",
    category: "Recommendation",
    requestDate: "04 Oct 2026",
    status: "Approved",
    deliveryMode: "Digital PDF & Sealed Envelope",
    trackingId: "GV-LOR-2026-04",
    remarks: "Endorsed by Principal Dr. S. Rao. Ready for campus desk collection.",
  },
  {
    id: "GV-REQ-8712",
    title: "Guest Lecture Proposal: Modern Web Architectures",
    category: "Guest Lecture",
    requestDate: "28 Sep 2026",
    status: "Under Review",
    deliveryMode: "Campus In-Person",
    trackingId: "GV-GLP-2026-11",
    remarks: "Under review with Computer Science Faculty Head for Term 2 schedule.",
  },
];

// Photo Gallery Items
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Decennial Alumni Homecoming Dinner",
    album: "Reunions",
    year: "2024",
    image: "/campus_banner.jpg",
    caption: "Over 200 alumni gathered on the central lawns for the milestone decennial reunion gala.",
  },
  {
    id: 2,
    title: "Madhuvan Vatika Academic Quad & Clock Tower",
    album: "Campus Life",
    year: "2025",
    image: "/hero_school_building.jpg",
    caption: "The iconic main school building overlooking the assembly quadrangle.",
  },
  {
    id: 3,
    title: "Annual Sports Day Athletics Derby",
    album: "Sports Meets",
    year: "2023",
    image: "/achievement_cricket.jpg",
    caption: "Inter-house cricket championship trophy presentation at the sports ground.",
  },
  {
    id: 4,
    title: "Robotics & Innovation Science Fair",
    album: "Campus Life",
    year: "2024",
    image: "/achievement_science.jpg",
    caption: "High school robotics squad demonstrating their state award-winning autonomous rover.",
  },
  {
    id: 5,
    title: "Mathematical Olympiad Laureates",
    album: "Achievements",
    year: "2024",
    image: "/achievement_math.jpg",
    caption: "Madhuvan Vatika students celebrating 1st place in the Regional Math Olympiad.",
  },
  {
    id: 6,
    title: "Silver Jubilee Memorial Amphitheatre",
    album: "Heritage",
    year: "2022",
    image: "/campus_360.jpg",
    caption: "The open-air amphitheatre where graduating batches receive their valedictory scrolls.",
  },
];

export default function AlumniDashboard({ onBackToKiosk }: DashboardProps) {
  // Navigation & General UI State
  const [currentScreen, setCurrentScreen] = useState<AlumniScreen>("dashboard");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState(INITIAL_ALUMNI_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(INITIAL_ALUMNI_PROFILE);

  // Events State
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEventModal, setSelectedEventModal] = useState<(typeof INITIAL_EVENTS)[0] | null>(null);
  const [eventFilter, setEventFilter] = useState<string>("All");

  // Updates & News State
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [selectedUpdateModal, setSelectedUpdateModal] = useState<(typeof INITIAL_UPDATES)[0] | null>(null);

  // Masterclasses State
  const [masterclasses, setMasterclasses] = useState(INITIAL_MASTERCLASSES);

  // Reconnect & Directory State
  const [alumniSearch, setAlumniSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  const [messageRecipient, setMessageRecipient] = useState<any | null>(null);
  const [messageText, setMessageText] = useState("");

  // Jobs State
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [jobSearch, setJobSearch] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  // Requests State
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequestType, setNewRequestType] = useState("Official Transcripts");
  const [newRequestDelivery, setNewRequestDelivery] = useState("Digital PDF Copy (Email)");
  const [newRequestNotes, setNewRequestNotes] = useState("");
  const [newRequestUrgency, setNewRequestUrgency] = useState("Normal (3-5 days)");

  // Visit Planning State
  const [visitDate, setVisitDate] = useState("2026-10-24");
  const [visitSlot, setVisitSlot] = useState("Morning (10:00 AM - 12:30 PM)");
  const [visitPurpose, setVisitPurpose] = useState("Alumni Nostalgia Tour & Teacher Interaction");
  const [visitGuests, setVisitGuests] = useState("1");
  const [visitVehicle, setVisitVehicle] = useState("KA-01-MJ-4021");
  const [visitPassModal, setVisitPassModal] = useState<any | null>(null);

  // Give Back State
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState(1);
  const [donationAmount, setDonationAmount] = useState("5000");
  const [donorName, setDonorName] = useState(INITIAL_ALUMNI_PROFILE.name);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [donationReceiptModal, setDonationReceiptModal] = useState<any | null>(null);

  // Gallery State
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: "bot" | "user"; text: string; time: string }[]
  >([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "👋 Welcome back, Rohan! I am VatikaBot, your Madhuvan Vatika Alumni Assistant. Ask me anything about alumni meets, reunions, ordering transcripts, scheduling campus visits, or career mentorship opportunities.",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Session Init
  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
      if (activeSession.username) {
        setProfile((prev) => ({
          ...prev,
          name: activeSession.username || prev.name,
          batch: activeSession.ASMAY_Year || prev.batch,
        }));
      }
    }
  }, []);

  // Fullscreen sync
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (currentScreen === "aispace") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiTyping, currentScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  const handleNavigateTo = (screen: AlumniScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // AI Chat Handler
  const handleSendAiMessage = (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!queryText) setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let replyText =
        "Thank you for reaching out! You can explore the dedicated sections of the Alumni Portal for reunions, transcripts, campus visits, or mentorship opportunities.";

      const lower = textToSend.toLowerCase();
      if (lower.includes("meet") || lower.includes("reunion") || lower.includes("when is")) {
        replyText = AI_PRESET_QA["When is the next Alumni Meet?"];
      } else if (lower.includes("transcript") || lower.includes("degree") || lower.includes("certificate")) {
        replyText = AI_PRESET_QA["How do I request my transcripts?"];
      } else if (lower.includes("visit") || lower.includes("tour") || lower.includes("campus pass")) {
        replyText = AI_PRESET_QA["How can I schedule a campus visit?"];
      } else if (lower.includes("mentor") || lower.includes("lecture") || lower.includes("teach")) {
        replyText = AI_PRESET_QA["How can I mentor current students?"];
      } else if (lower.includes("donation") || lower.includes("give back") || lower.includes("scholarship")) {
        replyText = AI_PRESET_QA["What is the alumni scholarship fund?"];
      } else if (lower.includes("2015") || lower.includes("batch") || lower.includes("classmates")) {
        replyText = AI_PRESET_QA["Tell me about my batch (Class of 2015)"];
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot" as const,
          text: replyText,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
        },
      ]);
      setIsAiTyping(false);
    }, 600);
  };

  // RSVP Event Handler
  const handleToggleRsvp = (eventId: number) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextRsvp = !ev.isRsvp;
          showToast(
            nextRsvp
              ? `RSVP Confirmed for ${ev.title}! Your pass has been generated.`
              : `RSVP Cancelled for ${ev.title}.`
          );
          return {
            ...ev,
            isRsvp: nextRsvp,
            attendees: nextRsvp ? ev.attendees + 1 : Math.max(0, ev.attendees - 1),
          };
        }
        return ev;
      })
    );
  };

  // Register Masterclass Handler
  const handleToggleMasterclass = (id: number) => {
    setMasterclasses((prev) =>
      prev.map((mc) => {
        if (mc.id === id) {
          const nextState = !mc.registered;
          showToast(
            nextState
              ? `Registered for "${mc.title}"! Calendar invite sent to ${profile.email}.`
              : `Cancelled registration for "${mc.title}".`
          );
          return { ...mc, registered: nextState };
        }
        return mc;
      })
    );
  };

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileForm);
    setIsEditingProfile(false);
    showToast("Profile details updated successfully in local session!");
  };

  // Request Submission Handler
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const reqCode = `GV-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: reqCode,
      title: `${newRequestType} Request`,
      category: newRequestType.includes("Transcript") ? "Transcripts" : "Office Desk",
      requestDate: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Under Review",
      deliveryMode: newRequestDelivery,
      trackingId: `${reqCode}-TRACK`,
      remarks: newRequestNotes || "Submitted via Alumni Kiosk Portal. Awaiting desk verification.",
    };

    setRequests([newReq, ...requests]);
    setIsRequestModalOpen(false);
    setNewRequestNotes("");
    showToast(`Request ${reqCode} submitted successfully to Madhuvan Vatika Alumni Office!`);
  };

  // Visit Pass Generation
  const handleGenerateVisitPass = (e: React.FormEvent) => {
    e.preventDefault();
    const passCode = `GV-VISIT-${Math.floor(10000 + Math.random() * 90000)}`;
    const passData = {
      passCode,
      name: profile.name,
      batch: profile.batchTitle,
      date: visitDate,
      slot: visitSlot,
      purpose: visitPurpose,
      guests: visitGuests,
      vehicle: visitVehicle || "N/A (Pedestrian Entry)",
      entryGate: "North Gate Security Bay",
      generatedAt: new Date().toLocaleString(),
    };
    setVisitPassModal(passData);
    showToast(`Alumni Visitor Gate Pass #${passCode} issued!`);
  };

  // Mock Donation Submission
  const handleMockDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
    const amountNum = parseInt(donationAmount, 10) || 5000;

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === selectedCampaignId) {
          return {
            ...c,
            raised: c.raised + amountNum,
            donors: c.donors + 1,
          };
        }
        return c;
      })
    );

    const receipt = {
      receiptNo: `GV-80G-${Math.floor(100000 + Math.random() * 900000)}`,
      donor: isAnonymous ? "Anonymous Alum Donor" : donorName,
      pan: panNumber.toUpperCase(),
      amount: amountNum,
      campaign: targetCampaign.title,
      date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
      taxExemption: "Eligible for 50% Tax Exemption under Sec 80G of Income Tax Act",
    };

    setDonationReceiptModal(receipt);
    showToast(`Thank you! ₹${amountNum.toLocaleString()} mock donation pledged to ${targetCampaign.title}`);
  };

  // Mock Job Apply
  const handleApplyJob = (job: (typeof INITIAL_JOBS)[0]) => {
    setAppliedJobIds((prev) => [...prev, job.id]);
    showToast(`Alumni referral application submitted for ${job.title} at ${job.company}!`);
  };

  // Send Message / Greeting Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageRecipient) return;
    showToast(`Message successfully dispatched to ${messageRecipient.name}!`);
    setMessageRecipient(null);
    setMessageText("");
  };

  return (
    <div className="dashboard-page">
      {/* FLOATING AMBIENT ORBS (MATCHING EXACT STUDENT & STAFF THEME) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (EXACT REPLICA OF STUDENT & STAFF DASHBOARDS) */}
      <header className="dash-navbar">
        <div className="command-brand" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <div className="command-mark" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#ea580c" />
              <path d="M24 24V11" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z"
                fill="#9a3412"
              />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="command-kicker">MADHUVAN VATIKA • SMART CAMPUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "nowrap" }}>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  whiteSpace: "nowrap",
                }}
              >
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
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.08)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Award size={12} style={{ color: "#ea580c" }} />
                PAGE 7 • ALUMNI HUB
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Action Controls */}
        <div className="dash-nav-actions" style={{ flexWrap: "nowrap" }}>
          {/* Alumni Profile Pill */}
          <div
            className="dash-profile-pill cursor-pointer"
            onClick={() => handleNavigateTo("profile")}
            title="Click to view & edit Alumni Profile"
          >
            <img src="/alumni_avatar.png" alt={profile.name} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{profile.name}</span>
              <span className="dash-user-role">
                Alumni • Batch : {profile.batch} • {profile.admNo}
              </span>
            </div>
          </div>

          {/* Campus Online Pill */}
          <div className="command-live-status">
            <span style={{ background: "#16a34a" }} />
            <span>Campus online</span>
          </div>

          {/* Command Time Pill */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Fullscreen Button */}
          <button className="command-fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={handleLogout} title="Return to Kiosk Role Selection">
            <Home size={14} /> Back to Kiosk
          </button>
        </div>
      </header>

      {/* HORIZONTAL MODULES NAVIGATION TABS */}
      <nav
        style={{
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1.5px solid rgba(254, 215, 170, 0.6)",
          padding: "7px clamp(0.75rem, 1.5vw, 1.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflowX: "auto",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={() => handleNavigateTo("dashboard")}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "0.82rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              border: currentScreen === "dashboard" ? "1.5px solid #ea580c" : "1.5px solid rgba(254, 215, 170, 0.5)",
              background: currentScreen === "dashboard" ? "#ea580c" : "rgba(255, 255, 255, 0.9)",
              color: currentScreen === "dashboard" ? "#ffffff" : "#475569",
              boxShadow: currentScreen === "dashboard" ? "0 2px 8px rgba(234, 88, 12, 0.25)" : "none",
            }}
          >
            <Home size={14} />
            <span>Overview</span>
          </button>

          {[
            { id: "reconnect" as AlumniScreen, name: "Reconnect", icon: Users },
            { id: "events" as AlumniScreen, name: "Alumni Events", icon: CalendarDays },
            { id: "profile" as AlumniScreen, name: "My Details", icon: GraduationCap },
            { id: "heritage" as AlumniScreen, name: "Heritage", icon: Building2 },
            { id: "requests" as AlumniScreen, name: "Request Desk", icon: FileText },
            { id: "visit" as AlumniScreen, name: "Plan a Visit", icon: MapPin },
            { id: "jobs" as AlumniScreen, name: "Job Board", icon: Briefcase },
            { id: "giveback" as AlumniScreen, name: "Give Back", icon: Heart },
            { id: "aispace" as AlumniScreen, name: "VatikaBot AI", icon: Sparkles },
            { id: "gallery" as AlumniScreen, name: "Photo Gallery", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigateTo(tab.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  border: isActive ? "1.5px solid #ea580c" : "1.5px solid rgba(254, 215, 170, 0.5)",
                  background: isActive ? "#ea580c" : "rgba(255, 255, 255, 0.9)",
                  color: isActive ? "#ffffff" : "#475569",
                  boxShadow: isActive ? "0 2px 8px rgba(234, 88, 12, 0.25)" : "none",
                }}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {currentScreen !== "dashboard" && (
          <button
            onClick={() => handleNavigateTo("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "#fff7ed",
              border: "1.5px solid #fed7aa",
              color: "#c2410c",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Hub</span>
          </button>
        )}
      </nav>

      {/* STATIC DEMONSTRATION NOTICE BANNER */}
      <div
        style={{
          background: "linear-gradient(90deg, #fff7ed 0%, #ffedd5 50%, #fff7ed 100%)",
          borderBottom: "1px solid rgba(251, 146, 60, 0.25)",
          padding: "4px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "0.74rem",
          fontWeight: 700,
          color: "#9a3412",
          flexShrink: 0,
        }}
      >
        <Sparkles size={12} style={{ color: "#ea580c" }} />
        <span>
          <strong>Static Demonstration Mode:</strong> All alumni records, forms, mock requests, simulated donations,
          and registrations operate locally in frontend state for Madhuvan Vatika - MVPS.
        </span>
      </div>

      {/* TOAST NOTIFICATION IF ACTIVE */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            background: "#182430",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.82rem",
            fontWeight: 700,
            border: "1.5px solid #ea580c",
            animation: "fadeInScreen 0.2s ease-out",
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              marginLeft: "6px",
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ========================================================
          VIEW 0: MAIN ALUMNI HUB OVERVIEW (NATURAL SCROLLING & RESPONSIVE)
          ======================================================== */}
      {currentScreen === "dashboard" && (
        <main className="alumni-dashboard-main">
          {/* HERO BANNER (MATCHING STUDENT & STAFF EXACTLY) */}
          <section className="student-hub-hero">
            <div className="student-hero-title-group">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
                <span
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    letterSpacing: "0.04em",
                  }}
                >
                  PAGE 7
                </span>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    color: "#ea580c",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Sparkles size={13} /> ALUMNI NETWORK & LEGACY PORTAL
                </span>
              </div>
              <h2>
                Welcome Back, <span>{profile.name}</span>
              </h2>
              <p>Madhuvan Vatika Global Alumni Legacy Network • 18 International Chapters • Mentorship & Giving</p>
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <GraduationCap size={12} /> {profile.batchTitle}
                </span>
                <span className="student-hero-chip">
                  <Award size={12} /> Adm: {profile.admNo}
                </span>
                <span className="student-hero-chip">
                  <Users size={12} /> 12,400+ Global Alumni
                </span>
                <span className="student-hero-chip highlight">
                  <ShieldCheck size={12} /> Verified Alum ★ Gold
                </span>
              </div>
            </div>

            {/* UNIFIED 3D STAGE CAPSULE */}
            <div className="student-hero-capsule">
              <div className="hero-avatar-podium">
                <div className="hero-avatar-halo" />
                <img src="/alumni_avatar.png" alt={profile.name} className="hero-avatar-3d-img" />
                <span className="hero-avatar-tag">GV Alum</span>
              </div>

              <div className="hero-capsule-divider" />

              <div className="hero-honor-stage">
                <div className="hero-honor-icon-bubble">
                  <Award size={18} />
                </div>
                <div className="hero-honor-text">
                  <span className="hero-honor-title">Excellence</span>
                  <span className="hero-honor-badge">Class of 2015</span>
                </div>
              </div>

              <div className="hero-capsule-divider" />

              {/* AI Space Launch Button */}
              <button
                type="button"
                onClick={() => setCurrentScreen("aispace")}
                className="hero-ai-capsule-btn"
                title="Launch Alumni VatikaBot AI Space"
              >
                <div className="hero-ai-robo-wrap">
                  <img src="/ai_robot.png" alt="VatikaBot" className="hero-ai-robo-img" />
                  <span className="hero-ai-pulse-dot" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="hero-ai-kicker">
                    <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} /> AI SPACE
                  </div>
                  <span className="hero-ai-action">Ask VatikaBot →</span>
                </div>
              </button>
            </div>
          </section>

          {/* SECTION 1: SIX MAIN FEATURE CARDS (3-COLUMN RESPONSIVE GRID) */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.65rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                <Award size={16} style={{ color: "#ea580c" }} /> Alumni Core Services
              </h3>
              <span style={{ fontSize: "0.74rem", color: "#64748b" }}>6 Key Institutional Portals</span>
            </div>

            <div className="alumni-feature-grid">
              {/* CARD 1: RECONNECT */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("reconnect")}
                title="Click to explore Alumni Network & Classmates"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <Users size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>Reconnect</h3>
                      <span>Classmates & Former Faculty</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                    12,400+ Active
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">Batch of 2015</span>
                    <span className="student-metric-label">112 Members</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    <div className="student-period-item">
                      <span className="period-time-badge">2015</span>
                      <span className="period-subject-name">Priya Nair • VP FinTech</span>
                      <span className="period-room-tag">Mumbai</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">2012</span>
                      <span className="period-subject-name">Ankit Verma • Staff AI Google</span>
                      <span className="period-room-tag">Bay Area</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Faculty</span>
                      <span className="period-subject-name">Mr. K. Sundaram • Physics HOD</span>
                      <span className="period-room-tag">Emeritus</span>
                    </div>
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("reconnect");
                    }}
                  >
                    <Users size={13} /> Connect with Classmates & Teachers <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* CARD 2: ALUMNI EVENTS */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("events")}
                title="Click to view all Alumni Events"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <CalendarDays size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>Alumni Events</h3>
                      <span>Reunions & Homecoming</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                    }}
                  >
                    4 Scheduled
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">Alumni Meet 2025</span>
                    <span className="student-metric-label">25 Sep • Main Auditorium</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    <div className="student-period-item">
                      <span className="period-time-badge">25 Sep</span>
                      <span className="period-subject-name">Annual Alumni Meet 2025</span>
                      <span className="period-room-tag">248 RSVP</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">10 Oct</span>
                      <span className="period-subject-name">Guest Lecture Series: AI</span>
                      <span className="period-room-tag">Webinar</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">18 Oct</span>
                      <span className="period-subject-name">Career Guidance Session</span>
                      <span className="period-room-tag">Campus</span>
                    </div>
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn btn-warm-tint"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("events");
                    }}
                  >
                    <CalendarDays size={13} /> View All Alumni Events & RSVPs <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* CARD 3: MY DETAILS */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("profile")}
                title="Click to view & edit Alumni Profile"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <GraduationCap size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>My Details</h3>
                      <span>Alumni Profile & Records</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                    92% Complete
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">{profile.name}</span>
                    <span className="student-metric-label">{profile.currentRole}</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    <div className="student-period-item">
                      <span className="period-time-badge">Class</span>
                      <span className="period-subject-name">{profile.classSection}</span>
                      <span className="period-room-tag">{profile.batch}</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Org</span>
                      <span className="period-subject-name">{profile.company}</span>
                      <span className="period-room-tag">Lead</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">City</span>
                      <span className="period-subject-name">{profile.location}</span>
                      <span className="period-room-tag">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("profile");
                    }}
                  >
                    <GraduationCap size={13} /> View & Update Profile Details <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* CARD 4: HERITAGE */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("heritage")}
                title="Click to explore School Heritage & History"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <Building2 size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>Heritage</h3>
                      <span>History, Milestones & Archives</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                    }}
                  >
                    Est. 1988
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">38 Years</span>
                    <span className="student-metric-label">Of Academic Excellence</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    <div className="student-period-item">
                      <span className="period-time-badge">NAAC</span>
                      <span className="period-subject-name">Grade A++ Institutional Excellence</span>
                      <span className="period-room-tag">Apex</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Board</span>
                      <span className="period-subject-name">CBSE Affiliation #1930281</span>
                      <span className="period-room-tag">Senior</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Legacy</span>
                      <span className="period-subject-name">120+ Distinguished Hall of Fame</span>
                      <span className="period-room-tag">1988-26</span>
                    </div>
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn btn-warm-tint"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("heritage");
                    }}
                  >
                    <Building2 size={13} /> Explore School Heritage & Archives <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* CARD 5: REQUEST DESK */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("requests")}
                title="Click to open Alumni Request Desk"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <FileText size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>Request Desk</h3>
                      <span>Transcripts & Office Inquiries</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {requests.length} Requests
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">Alumni Services</span>
                    <span className="student-metric-label">Fast Desk Turnaround</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    {requests.slice(0, 3).map((req) => (
                      <div key={req.id} className="student-period-item">
                        <span className="period-time-badge">{req.id.split("-")[2] || "REQ"}</span>
                        <span className="period-subject-name">{req.title}</span>
                        <span
                          className="period-room-tag"
                          style={{
                            background:
                              req.status === "Approved" ? "#dcfce7" : req.status === "Dispatched" ? "#e0f2fe" : "#ffedd5",
                            color:
                              req.status === "Approved" ? "#15803d" : req.status === "Dispatched" ? "#0369a1" : "#c2410c",
                          }}
                        >
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("requests");
                    }}
                  >
                    <FileText size={13} /> Open Request Desk & Inquiries <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* CARD 6: PLAN A VISIT */}
              <div
                className="alumni-feature-card"
                onClick={() => handleNavigateTo("visit")}
                title="Click to schedule a Campus Visit"
              >
                <div className="alumni-feature-card-header">
                  <div className="student-card-title-group">
                    <div className="student-card-icon-box">
                      <MapPin size={18} />
                    </div>
                    <div className="student-card-headings">
                      <h3>Plan a Visit</h3>
                      <span>Campus Visits & Security Passes</span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid rgba(254, 215, 170, 0.8)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                    Gate Pass Ready
                  </span>
                </div>

                <div className="alumni-feature-card-body">
                  <div className="student-metric-hero">
                    <span className="student-metric-val">Welcome Back</span>
                    <span className="student-metric-label">Mon – Sat • 9 AM – 4:30 PM</span>
                  </div>

                  <div className="student-timetable-preview-list">
                    <div className="student-period-item">
                      <span className="period-time-badge">Pass</span>
                      <span className="period-subject-name">Instant QR Visitor Security Pass</span>
                      <span className="period-room-tag">North Gate</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Escort</span>
                      <span className="period-subject-name">Student Council Campus Tour</span>
                      <span className="period-room-tag">Included</span>
                    </div>
                    <div className="student-period-item">
                      <span className="period-time-badge">Access</span>
                      <span className="period-subject-name">Labs, Library & Central Quad</span>
                      <span className="period-room-tag">Alumni</span>
                    </div>
                  </div>
                </div>

                <div className="alumni-feature-card-footer">
                  <button
                    className="student-open-screen-btn btn-warm-tint"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateTo("visit");
                    }}
                  >
                    <MapPin size={13} /> Schedule a Campus Visit <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: QUICK-ACTION SHORTCUTS (SEPARATE NON-OVERLAPPING ROW) */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.65rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                <Sparkles size={16} style={{ color: "#ea580c" }} /> Quick Portals & Shortcuts
              </h3>
              <span style={{ fontSize: "0.74rem", color: "#64748b" }}>8 Instant Services</span>
            </div>

            <div className="alumni-action-grid">
              {/* 1. Update Profile */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("profile")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <UserCheck size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Update Your Profile</div>
                  <div className="alumni-tile-sub">Maintain records</div>
                </div>
              </div>

              {/* 2. Job Opportunities */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("jobs")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
                    <Briefcase size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#dcfce7", color: "#16a34a" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Job Opportunities</div>
                  <div className="alumni-tile-sub">Alumni referrals</div>
                </div>
              </div>

              {/* 3. Alumni Network */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("reconnect")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                    <Share2 size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Alumni Network</div>
                  <div className="alumni-tile-sub">12,400+ directory</div>
                </div>
              </div>

              {/* 4. Events */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("events")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#ffedd5", color: "#ea580c" }}>
                    <Calendar size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#ffedd5", color: "#ea580c" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Events</div>
                  <div className="alumni-tile-sub">Reunions & fests</div>
                </div>
              </div>

              {/* 5. Give Back */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("giveback")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#ffe4e6", color: "#e11d48" }}>
                    <Heart size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#ffe4e6", color: "#e11d48" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Give Back</div>
                  <div className="alumni-tile-sub">Scholarship funds</div>
                </div>
              </div>

              {/* 6. AI Assistant */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("aispace")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <Bot size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">VatikaBot AI</div>
                  <div className="alumni-tile-sub">Instant guidance</div>
                </div>
              </div>

              {/* 7. Current Affairs */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("heritage")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#e0e7ff", color: "#4338ca" }}>
                    <Newspaper size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#e0e7ff", color: "#4338ca" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Current Affairs</div>
                  <div className="alumni-tile-sub">School & policy</div>
                </div>
              </div>

              {/* 8. Photo Gallery */}
              <div className="alumni-action-card" onClick={() => handleNavigateTo("gallery")}>
                <div className="alumni-action-top">
                  <div className="alumni-tile-icon-box" style={{ background: "#fce7f3", color: "#db2777" }}>
                    <ImageIcon size={18} />
                  </div>
                  <div className="alumni-tile-arrow-circle" style={{ background: "#fce7f3", color: "#db2777" }}>
                    <ChevronRight size={12} />
                  </div>
                </div>
                <div>
                  <div className="alumni-tile-title">Photo Gallery</div>
                  <div className="alumni-tile-sub">Relive memories</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: STABLE LOWER CONTENT GRID (EVENTS & UPDATES ON LEFT, SIDEBAR ON RIGHT) */}
          <section className="alumni-body-grid">
            {/* LEFT MAIN COLUMN: UPCOMING EVENTS & LATEST UPDATES */}
            <div className="alumni-left-grid">
              {/* UPCOMING EVENTS CARD */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                      <CalendarDays size={16} />
                    </div>
                    <span>Upcoming Events & Reunions</span>
                  </div>
                  <span
                    className="dash-view-all cursor-pointer"
                    onClick={() => handleNavigateTo("events")}
                    title="Open full events screen"
                  >
                    View All →
                  </span>
                </div>

                <div className="dash-card-body" style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="alumni-event-item"
                      onClick={() => setSelectedEventModal(ev)}
                      title="Click to view event details and RSVP"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="alumni-event-date-box">
                        <span className="alumni-event-day">{ev.day}</span>
                        <span className="alumni-event-month">{ev.month}</span>
                      </div>
                      <div className="alumni-event-details">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span className="alumni-event-title">{ev.title}</span>
                          {ev.isRsvp && (
                            <span
                              style={{
                                background: "#dcfce7",
                                color: "#15803d",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                padding: "1px 6px",
                                borderRadius: "9999px",
                              }}
                            >
                              RSVP Confirmed ✓
                            </span>
                          )}
                        </div>
                        <div className="alumni-event-meta">
                          <span>🕒 {ev.time}</span>
                          <span>•</span>
                          <span>📍 {ev.venue.split("&")[0]}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRsvp(ev.id);
                        }}
                        style={{
                          border: ev.isRsvp ? "1px solid #16a34a" : "1px solid #ea580c",
                          background: ev.isRsvp ? "#dcfce7" : "#fff7ed",
                          color: ev.isRsvp ? "#15803d" : "#ea580c",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.isRsvp ? "RSVP ✓" : "RSVP Now"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* LATEST UPDATES CARD */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                      <Sparkles size={16} />
                    </div>
                    <span>Latest Updates & Announcements</span>
                  </div>
                  <span
                    className="dash-view-all cursor-pointer"
                    onClick={() => handleNavigateTo("heritage")}
                    title="Open full updates & archives"
                  >
                    View All →
                  </span>
                </div>

                <div className="dash-card-body" style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {updates.map((item) => (
                    <div
                      key={item.id}
                      className="alumni-update-card cursor-pointer"
                      onClick={() => setSelectedUpdateModal(item)}
                      title="Click to read full update"
                    >
                      <div className="alumni-update-icon-tile" style={{ background: item.tagBg, color: item.tagColor }}>
                        {item.tag === "Leadership" ? (
                          <Award size={18} />
                        ) : item.tag === "Careers" ? (
                          <Briefcase size={18} />
                        ) : item.tag === "Philanthropy" ? (
                          <Heart size={18} />
                        ) : (
                          <CalendarDays size={18} />
                        )}
                      </div>
                      <div className="alumni-update-info">
                        <div className="alumni-update-title">{item.title}</div>
                        <div className="alumni-update-desc">{item.desc}</div>
                        <div className="alumni-update-meta-row">
                          <span className="alumni-update-date">📅 {item.date}</span>
                          <span className="alumni-update-tag" style={{ background: item.tagBg, color: item.tagColor }}>
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} style={{ color: "#94a3b8", alignSelf: "center" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR COLUMN: GREENBOT AI + CURRENT AFFAIRS + MENTORSHIP */}
            <div className="alumni-right-col">
              {/* GREENBOT AI ASSISTANT CARD */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
                  borderRadius: "16px",
                  padding: "1rem",
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.15)",
                  color: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      boxShadow: "0 2px 8px rgba(234, 88, 12, 0.4)",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        fontFamily: "Outfit, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      VatikaBot AI Assistant <Sparkles size={13} style={{ color: "#facc15" }} />
                    </h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#cbd5e1" }}>
                      Instant guidance on events, transcripts, visits & mentors.
                    </p>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div style={{ display: "flex", gap: "5px", overflowX: "auto", marginBottom: "0.65rem", paddingBottom: "2px" }}>
                  {["When is next meet?", "Request transcripts", "Schedule visit"].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === 0) handleSendAiMessage("When is the next Alumni Meet?");
                        if (idx === 1) handleSendAiMessage("How do I request my transcripts?");
                        if (idx === 2) handleSendAiMessage("How can I schedule a campus visit?");
                      }}
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#f8fafc",
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Response snippet if present */}
                {chatMessages.length > 1 && (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      padding: "8px 10px",
                      fontSize: "0.74rem",
                      lineHeight: 1.4,
                      color: "#f1f5f9",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <strong>VatikaBot:</strong> {chatMessages[chatMessages.length - 1].text}
                  </div>
                )}

                {/* Input Wrap */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "4px 8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Mic size={14} style={{ color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Ask VatikaBot anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "0.78rem",
                      outline: "none",
                      flex: 1,
                    }}
                  />
                  <button
                    onClick={() => handleSendAiMessage()}
                    style={{
                      background: "#ea580c",
                      border: "none",
                      color: "#ffffff",
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

              {/* CURRENT AFFAIRS CARD */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                      <Newspaper size={16} />
                    </div>
                    <span>Current Affairs & Policy</span>
                  </div>
                  <span
                    className="dash-view-all cursor-pointer"
                    onClick={() => handleNavigateTo("heritage")}
                    title="View more education news"
                  >
                    All News →
                  </span>
                </div>
                <div className="dash-card-body" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {INITIAL_CURRENT_AFFAIRS.map((ca) => {
                    const Icon = ca.icon;
                    return (
                      <div
                        key={ca.id}
                        className="alumni-news-row"
                        onClick={() => showToast(`Current Affairs: ${ca.title} — ${ca.summary}`)}
                        title="Click to read news summary"
                      >
                        <div className="alumni-news-icon-tile" style={{ background: "#fff7ed", color: "#ea580c" }}>
                          <Icon size={16} />
                        </div>
                        <div className="alumni-news-info">
                          <div className="alumni-news-title">{ca.title}</div>
                          <div className="alumni-news-date">{ca.date}</div>
                        </div>
                        <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MENTORSHIP & MASTERCLASSES CARD */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#fdf4ff", color: "#c026d3" }}>
                      <Users size={16} />
                    </div>
                    <span>Mentorship & Masterclasses</span>
                  </div>
                  <span
                    className="dash-view-all cursor-pointer"
                    onClick={() => handleNavigateTo("reconnect")}
                    title="View mentor directory"
                  >
                    All Mentors →
                  </span>
                </div>
                <div className="dash-card-body" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {masterclasses.map((mc) => (
                    <div key={mc.id} className="dash-telemetry-item" style={{ padding: "0.6rem 0.75rem" }}>
                      <div className="dash-telemetry-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                        <BookOpen size={14} />
                      </div>
                      <div className="dash-telemetry-info">
                        <span className="dash-telemetry-name" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                          {mc.title}
                        </span>
                        <span className="dash-telemetry-meta" style={{ fontSize: "0.68rem" }}>
                          {mc.mentor} • {mc.date.split("•")[0]}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleMasterclass(mc.id)}
                        style={{
                          border: mc.registered ? "1px solid #16a34a" : "1px solid #ea580c",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          background: mc.registered ? "#dcfce7" : "#fff7ed",
                          color: mc.registered ? "#15803d" : "#ea580c",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {mc.registered ? "Registered ✓" : "Register →"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 1: RECONNECT (CLASSMATES & FORMER TEACHERS)
          ======================================================== */}
      {currentScreen === "reconnect" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Users size={20} />
              </div>
              <div>
                <h2>Alumni Directory & Classmate Reconnect</h2>
                <p>Search over 12,400+ verified Madhuvan Vatika alumni and reach out to former teachers.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ShieldCheck size={14} /> Verified Directory
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem clamp(1rem, 2vw, 2rem)" }}>
            {/* KPI STATS */}
            <div className="student-kpi-strip" style={{ marginBottom: "1rem" }}>
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Registered Alumni</span>
                  <h4>12,400+ Global</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Your Batch (2015)</span>
                  <h4>112 Members</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#0284c7" }}>
                  <GraduationCap size={20} />
                </div>
              </div>
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Active Mentors</span>
                  <h4>45 Faculty & Alums</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  <Award size={20} />
                </div>
              </div>
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Global Chapters</span>
                  <h4>18 Cities Worldwide</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fdf4ff", color: "#c026d3" }}>
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div
              style={{
                background: "#ffffff",
                padding: "0.85rem 1.25rem",
                borderRadius: "14px",
                border: "1.2px solid rgba(251, 146, 60, 0.28)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#f8fafc",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  flex: "1 1 240px",
                }}
              >
                <Search size={16} style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Search by name, organization, or role..."
                  value={alumniSearch}
                  onChange={(e) => setAlumniSearch(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.82rem", width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>Batch:</span>
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                >
                  <option value="All">All Batches</option>
                  <option value="2015">Class of 2015</option>
                  <option value="2012">Class of 2012</option>
                  <option value="2010">Class of 2010</option>
                  <option value="2008">Class of 2008</option>
                  <option value="2016">Class of 2016</option>
                  <option value="2018">Class of 2018</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>Domain:</span>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                >
                  <option value="All">All Domains</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Civil Services">Civil Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Science">Science & Research</option>
                  <option value="Design">Design & Architecture</option>
                </select>
              </div>
            </div>

            {/* CLASSMATES CARDS GRID */}
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#1e293b",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Users size={18} style={{ color: "#ea580c" }} /> Alumni Directory Members
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {INITIAL_ALUMNI_NETWORK.filter((a) => {
                const matchSearch =
                  a.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
                  a.company.toLowerCase().includes(alumniSearch.toLowerCase()) ||
                  a.role.toLowerCase().includes(alumniSearch.toLowerCase());
                const matchBatch = batchFilter === "All" || a.batch === batchFilter;
                const matchDomain = domainFilter === "All" || a.domain === domainFilter;
                return matchSearch && matchBatch && matchDomain;
              }).map((alum) => (
                <div
                  key={alum.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1.2px solid rgba(251, 146, 60, 0.28)",
                    padding: "1rem",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <img
                      src={alum.avatar}
                      alt={alum.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        border: "2px solid #fed7aa",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                          {alum.name}
                        </h4>
                        {alum.verified && <CheckCircle2 size={13} style={{ color: "#16a34a" }} />}
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#ea580c",
                          fontWeight: 700,
                          display: "inline-block",
                          marginTop: 1,
                        }}
                      >
                        Class of {alum.batch}
                      </span>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.74rem", color: "#475569", fontWeight: 600 }}>
                        {alum.role}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>{alum.company}</p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #f1f5f9",
                      fontSize: "0.7rem",
                      color: "#64748b",
                    }}
                  >
                    <span>📍 {alum.location}</span>
                    <button
                      onClick={() => setMessageRecipient(alum)}
                      style={{
                        background: "#fff7ed",
                        color: "#ea580c",
                        border: "1px solid rgba(251, 146, 60, 0.4)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <MessageSquare size={12} /> Message
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FORMER TEACHERS RECONNECT SECTION */}
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#1e293b",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Heart size={18} style={{ color: "#e11d48" }} /> Reconnect with Former Teachers
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {FORMER_TEACHERS.map((teacher) => (
                <div
                  key={teacher.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1.2px solid rgba(251, 146, 60, 0.28)",
                    padding: "1rem",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.65rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        {teacher.name}
                      </h4>
                      <span
                        style={{
                          background: "#fff7ed",
                          color: "#c2410c",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "9999px",
                        }}
                      >
                        {teacher.status}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#ea580c" }}>{teacher.subject}</span>
                    <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#64748b" }}>⏱ {teacher.years}</p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "0.74rem",
                        color: "#475569",
                        fontStyle: "italic",
                        lineHeight: 1.3,
                      }}
                    >
                      &ldquo;{teacher.memory}&rdquo;
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>📍 {teacher.location}</span>
                    <button
                      onClick={() =>
                        setMessageRecipient({
                          name: teacher.name,
                          role: teacher.subject,
                          isTeacher: true,
                        })
                      }
                      style={{
                        background: "#fff7ed",
                        color: "#ea580c",
                        border: "1px solid rgba(251, 146, 60, 0.4)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Heart size={12} style={{ color: "#ea580c" }} /> Send Greeting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 2: ALUMNI EVENTS & HOMECOMING SCREEN
          ======================================================== */}
      {currentScreen === "events" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h2>Alumni Events & Homecoming Calendar</h2>
                <p>Register for official reunions, masterclasses, and networking sessions at Madhuvan Vatika.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                {events.filter((e) => e.isRsvp).length} RSVPs Confirmed
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem clamp(1rem, 2vw, 2rem)" }}>
            {/* FILTER TABS */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", overflowX: "auto" }}>
              {["All", "Reunion", "Webinar", "Mentorship", "Sports"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventFilter(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: eventFilter === cat ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                    background: eventFilter === cat ? "#ea580c" : "#ffffff",
                    color: eventFilter === cat ? "#ffffff" : "#475569",
                  }}
                >
                  {cat === "All" ? "All Events" : `${cat}s`}
                </button>
              ))}
            </div>

            {/* EVENTS LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {events
                .filter((e) => eventFilter === "All" || e.type === eventFilter)
                .map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.2px solid rgba(251, 146, 60, 0.28)",
                      padding: "1.25rem",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: "1 1 450px" }}>
                      <div
                        style={{
                          width: 58,
                          height: 64,
                          borderRadius: "12px",
                          background: "#fff7ed",
                          border: "1.5px solid #fed7aa",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ea580c", lineHeight: 1 }}>
                          {ev.day}
                        </span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9a3412", textTransform: "uppercase" }}>
                          {ev.month}
                        </span>
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              background: "#ffedd5",
                              color: "#c2410c",
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: "9999px",
                            }}
                          >
                            {ev.type}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>👥 {ev.attendees} Registered</span>
                          {ev.isRsvp && (
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
                              RSVP Confirmed ✓
                            </span>
                          )}
                        </div>

                        <h3
                          style={{
                            margin: "4px 0 2px",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            color: "#0f172a",
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {ev.title}
                        </h3>
                        <p style={{ margin: "0 0 6px", fontSize: "0.78rem", fontWeight: 600, color: "#ea580c" }}>
                          {ev.subtitle}
                        </p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "#475569", lineHeight: 1.4 }}>
                          {ev.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            fontSize: "0.74rem",
                            color: "#64748b",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>🕒 {ev.time}</span>
                          <span>📍 {ev.venue}</span>
                          <span>🎤 {ev.speaker}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => handleToggleRsvp(ev.id)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: "10px",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          border: ev.isRsvp ? "1.5px solid #16a34a" : "1.5px solid #ea580c",
                          background: ev.isRsvp ? "#dcfce7" : "#ea580c",
                          color: ev.isRsvp ? "#15803d" : "#ffffff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {ev.isRsvp ? (
                          <>
                            <Check size={14} /> RSVP Confirmed
                          </>
                        ) : (
                          <>
                            <Calendar size={14} /> RSVP Now
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedEventModal(ev)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "10px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid rgba(251, 146, 60, 0.4)",
                          background: "#fff7ed",
                          color: "#c2410c",
                        }}
                      >
                        Event Details & Agenda
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: MY DETAILS (ALUMNI PROFILE & RECORDS)
          ======================================================== */}
      {currentScreen === "profile" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2>Alumni Profile & Academic Records</h2>
                <p>View and update your personal, academic, and professional details in the school portal.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => {
                  setProfileForm(profile);
                  setIsEditingProfile(!isEditingProfile);
                }}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                {isEditingProfile ? "Cancel Editing" : "✏️ Edit Profile Details"}
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              {/* PROFILE HERO CARD */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1.2px solid rgba(251, 146, 60, 0.3)",
                  padding: "1.5rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src="/alumni_avatar.png"
                  alt={profile.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "20px",
                    border: "3px solid #fed7aa",
                    boxShadow: "0 4px 12px rgba(234, 88, 12, 0.15)",
                  }}
                />
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.35rem",
                        fontWeight: 800,
                        color: "#0f172a",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {profile.name}
                    </h2>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <CheckCircle2 size={12} /> Verified Alum
                    </span>
                  </div>
                  <p style={{ margin: "2px 0 4px", fontSize: "0.86rem", fontWeight: 700, color: "#ea580c" }}>
                    {profile.currentRole} • {profile.company}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                    {profile.batchTitle} • Admission No: {profile.admNo} • {profile.location}
                  </p>
                </div>
              </div>

              {/* EDIT FORM OR DETAIL VIEW */}
              {isEditingProfile ? (
                <form
                  onSubmit={handleSaveProfile}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1.2px solid rgba(251, 146, 60, 0.3)",
                    padding: "1.5rem",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#1e293b",
                      marginTop: 0,
                      marginBottom: "1rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    Edit Alumni Profile Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Graduation Batch (Passing Year)
                      </label>
                      <input
                        type="text"
                        value={profileForm.batch}
                        onChange={(e) => setProfileForm({ ...profileForm, batch: e.target.value })}
                        required
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        School Class & Stream
                      </label>
                      <input
                        type="text"
                        value={profileForm.classSection}
                        onChange={(e) => setProfileForm({ ...profileForm, classSection: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Current Job Designation
                      </label>
                      <input
                        type="text"
                        value={profileForm.currentRole}
                        onChange={(e) => setProfileForm({ ...profileForm, currentRole: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Current Company / Organization
                      </label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        City & Country
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Short Alumni Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#ea580c", color: "#ffffff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1.2px solid rgba(251, 146, 60, 0.3)",
                    padding: "1.5rem",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Higher Education
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                        {profile.degree}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Industry Domain
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                        {profile.industry}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Email (Registered)
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                        {profile.email}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Phone Contact
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                        {profile.phone}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        LinkedIn Network
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0284c7" }}>
                        {profile.linkedin}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Campus Achievements
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                        {profile.achievements}
                      </p>
                    </div>

                    <div style={{ gridColumn: "1 / -1", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Alumni Bio & Note
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "#334155", lineHeight: 1.5 }}>
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: HERITAGE (SCHOOL HISTORY, MILESTONES & CREED)
          ======================================================== */}
      {currentScreen === "heritage" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Building2 size={20} />
              </div>
              <div>
                <h2>Madhuvan Vatika - MVPS Heritage & Archives</h2>
                <p>38 years of academic excellence, national honors, traditions, and institutional legacy.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                Founded in 1988
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 950, margin: "0 auto" }}>
              {/* HISTORICAL TIMELINE */}
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={18} style={{ color: "#ea580c" }} /> Key Milestones & Journey
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  {
                    year: "1988",
                    title: "Foundation of Madhuvan Vatika - MVPS",
                    desc: "Established with 120 students and 8 teachers with a vision to nurture holistic, value-based education.",
                  },
                  {
                    year: "1996",
                    title: "CBSE Senior Secondary Affiliation",
                    desc: "Inauguration of the senior academic block, laboratory wings, and first batch of Grade 10 board toppers.",
                  },
                  {
                    year: "2005",
                    title: "Campus Expansion & Central Auditorium",
                    desc: "Construction of the 1,200-seat multi-purpose auditorium, Olympic-size swimming pool, and computerized library.",
                  },
                  {
                    year: "2015",
                    title: "Silver Jubilee & International Exchange",
                    desc: "Celebrated 25 years of educational service; launched bilateral student exchange programs with UK & Japan.",
                  },
                  {
                    year: "2022",
                    title: "NAAC Grade A++ Accreditation & AI Hub",
                    desc: "Honored with the highest national quality grade; established student innovation maker-spaces and robotics labs.",
                  },
                  {
                    year: "2026",
                    title: "38th Foundation Year & Digital Kiosk Network",
                    desc: "Smart campus kiosks and global alumni endowment network connecting over 12,400+ graduates worldwide.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      border: "1.2px solid rgba(251, 146, 60, 0.28)",
                      padding: "1rem 1.25rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        background: "#fff7ed",
                        border: "1.5px solid #fed7aa",
                        color: "#ea580c",
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {item.year}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                        {item.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SCHOOL CREED & MOTTO */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  borderRadius: "16px",
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                  <Award size={20} style={{ color: "#ea580c" }} />
                  <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#9a3412" }}>
                    School Motto: &ldquo;Excellence with Compassion&rdquo;
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#7c2d12", lineHeight: 1.5 }}>
                  The emblem of Madhuvan Vatika depicts the flame of knowledge rising between twin laurel branches of
                  integrity and service. As alumni, each graduate carries this noble flame into industry, science, public
                  governance, and arts around the world.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: REQUEST DESK (TRANSCRIPTS & INQUIRIES)
          ======================================================== */}
      {currentScreen === "requests" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <FileText size={20} />
              </div>
              <div>
                <h2>Alumni Office Request Desk</h2>
                <p>Submit mock requests for transcripts, recommendation letters, guest lecture proposals, and certificate verification.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => setIsRequestModalOpen(true)}
                style={{ background: "#ea580c", color: "#ffffff", borderColor: "#ea580c" }}
              >
                + New Request
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 950, margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Your Active & Past Office Requests ({requests.length})
                </h3>
                <span style={{ fontSize: "0.74rem", color: "#64748b" }}>Live Status Tracking</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {requests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.2px solid rgba(251, 146, 60, 0.28)",
                      padding: "1.25rem",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: "#fff7ed",
                            color: "#ea580c",
                            border: "1px solid #fed7aa",
                          }}
                        >
                          {req.id}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Submitted on {req.requestDate}</span>
                      </div>

                      <h4 style={{ margin: "2px 0 4px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                        {req.title}
                      </h4>
                      <p style={{ margin: "0 0 6px", fontSize: "0.78rem", color: "#475569" }}>
                        <strong>Delivery:</strong> {req.deliveryMode} • <strong>Tracking:</strong> {req.trackingId}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.76rem",
                          color: "#64748b",
                          background: "#f8fafc",
                          padding: "6px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        💬 {req.remarks}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "9999px",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          background:
                            req.status === "Approved" ? "#dcfce7" : req.status === "Dispatched" ? "#e0f2fe" : "#ffedd5",
                          color:
                            req.status === "Approved" ? "#15803d" : req.status === "Dispatched" ? "#0369a1" : "#c2410c",
                        }}
                      >
                        {req.status}
                      </span>
                      <button
                        onClick={() => showToast(`Inquiry #${req.id} is officially tracked. Desk officer notified.`)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ea580c",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Check Live Status →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: PLAN A VISIT (CAMPUS ENTRY PASS GENERATOR)
          ======================================================== */}
      {currentScreen === "visit" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <MapPin size={20} />
              </div>
              <div>
                <h2>Plan a Campus Visit & Security Pass</h2>
                <p>Schedule a sample nostalgia visit, tour classrooms and labs, and generate an instant alumni gate pass.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                Visiting Hours: 9 AM - 4:30 PM
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 840, margin: "0 auto" }}>
              <form
                onSubmit={handleGenerateVisitPass}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1.2px solid rgba(251, 146, 60, 0.3)",
                  padding: "1.5rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1e293b",
                    marginTop: 0,
                    marginBottom: "1rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  Schedule Your Visit to Madhuvan Vatika - MVPS
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Alumni Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      readOnly
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Batch & Admission Number
                    </label>
                    <input
                      type="text"
                      value={`${profile.batchTitle} • ${profile.admNo}`}
                      readOnly
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Preferred Date of Visit
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Preferred Time Slot
                    </label>
                    <select
                      value={visitSlot}
                      onChange={(e) => setVisitSlot(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    >
                      <option value="Morning (10:00 AM - 12:30 PM)">Morning (10:00 AM - 12:30 PM)</option>
                      <option value="Afternoon (01:30 PM - 03:00 PM)">Afternoon (01:30 PM - 03:00 PM)</option>
                      <option value="Evening (03:30 PM - 04:30 PM)">Evening (03:30 PM - 04:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Primary Purpose of Visit
                    </label>
                    <select
                      value={visitPurpose}
                      onChange={(e) => setVisitPurpose(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    >
                      <option value="Alumni Nostalgia Tour & Teacher Interaction">Alumni Nostalgia Tour & Teacher Interaction</option>
                      <option value="Guest Lecture & Student Interaction">Guest Lecture & Student Interaction</option>
                      <option value="School Library & Lab Tour">School Library & Lab Tour</option>
                      <option value="Administrative / Transcript Desk Inquiry">Administrative / Transcript Desk Inquiry</option>
                      <option value="Alumni Association Executive Meeting">Alumni Association Executive Meeting</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Number of Accompanying Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={visitGuests}
                      onChange={(e) => setVisitGuests(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Vehicle Registration Number (For North Gate Parking Pass)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KA-01-MJ-4021 (Leave blank if pedestrian)"
                      value={visitVehicle}
                      onChange={(e) => setVisitVehicle(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ea580c",
                      color: "#ffffff",
                      fontSize: "0.86rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(234, 88, 12, 0.25)",
                    }}
                  >
                    <QrCode size={16} /> Generate Alumni Gate Pass
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 7: JOB OPPORTUNITIES BOARD
          ======================================================== */}
      {currentScreen === "jobs" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <Briefcase size={20} />
              </div>
              <div>
                <h2>Alumni Career & Job Referral Board</h2>
                <p>Verified openings and direct referrals posted by Madhuvan Vatika alumni across leading global organizations.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                {jobs.length} Active Referral Slots
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              {/* SEARCH */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "12px",
                  border: "1.2px solid rgba(251, 146, 60, 0.28)",
                  marginBottom: "1.25rem",
                }}
              >
                <Search size={16} style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Filter jobs by title, company, skills, or location..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.82rem", width: "100%" }}
                />
              </div>

              {/* JOBS LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {jobs
                  .filter(
                    (j) =>
                      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
                      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
                      j.location.toLowerCase().includes(jobSearch.toLowerCase())
                  )
                  .map((job) => {
                    const isApplied = appliedJobIds.includes(job.id);
                    return (
                      <div
                        key={job.id}
                        style={{
                          background: "#ffffff",
                          borderRadius: "16px",
                          border: "1.2px solid rgba(251, 146, 60, 0.28)",
                          padding: "1.25rem",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: "1 1 450px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
                              {job.type}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700 }}>
                              Referred by {job.postedBy}
                            </span>
                          </div>

                          <h3 style={{ margin: "4px 0 2px", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                            {job.title}
                          </h3>
                          <p style={{ margin: "0 0 6px", fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                            {job.company} • 📍 {job.location} • 💼 {job.experience}
                          </p>
                          <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "#334155", lineHeight: 1.4 }}>
                            {job.desc}
                          </p>

                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {job.skills.map((sk, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  padding: "2px 8px",
                                  borderRadius: 6,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 900, color: "#0f172a" }}>{job.salary}</span>
                          <button
                            onClick={() => handleApplyJob(job)}
                            disabled={isApplied}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 10,
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              cursor: isApplied ? "default" : "pointer",
                              border: isApplied ? "1px solid #16a34a" : "none",
                              background: isApplied ? "#dcfce7" : "#ea580c",
                              color: isApplied ? "#15803d" : "#ffffff",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {isApplied ? (
                              <>
                                <Check size={14} /> Applied via Referral
                              </>
                            ) : (
                              <>
                                <Briefcase size={14} /> Apply with Profile
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 8: GIVE BACK (ALMA MATER PHILANTHROPY)
          ======================================================== */}
      {currentScreen === "giveback" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#ffe4e6", color: "#e11d48" }}>
                <Heart size={20} />
              </div>
              <div>
                <h2>Give Back & Alma Mater Philanthropy</h2>
                <p>Support Madhuvan Vatika scholarship funds, robotics lab endowments, and sports infrastructure.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                Sec 80G Tax Exemption Eligible
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              {/* CAMPAIGN CARDS */}
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  marginBottom: "1rem",
                }}
              >
                Active School Initiatives & Endowment Goals
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {campaigns.map((camp) => {
                  const pct = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
                  const isSelected = selectedCampaignId === camp.id;
                  return (
                    <div
                      key={camp.id}
                      onClick={() => setSelectedCampaignId(camp.id)}
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: isSelected ? "2px solid #ea580c" : "1.2px solid rgba(251, 146, 60, 0.28)",
                        padding: "1.25rem",
                        boxShadow: isSelected ? "0 8px 24px rgba(234, 88, 12, 0.12)" : "0 4px 14px rgba(0,0,0,0.03)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            background: "#fff7ed",
                            color: "#ea580c",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                          }}
                        >
                          {camp.category}
                        </span>
                        <h4 style={{ margin: "6px 0 4px", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                          {camp.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.76rem", color: "#64748b", lineHeight: 1.35 }}>
                          {camp.desc}
                        </p>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", fontWeight: 800, marginBottom: 4 }}>
                          <span style={{ color: "#ea580c" }}>₹{camp.raised.toLocaleString()} raised</span>
                          <span style={{ color: "#64748b" }}>Goal: ₹{camp.goal.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 6, background: "#ffedd5", borderRadius: 9999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "#ea580c", borderRadius: 9999 }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#94a3b8", marginTop: 4 }}>
                          <span>{pct}% Funded</span>
                          <span>{camp.donors} Alum Donors</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOCK DONATION PLEDGE FORM */}
              <form
                onSubmit={handleMockDonation}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1.2px solid rgba(251, 146, 60, 0.3)",
                  padding: "1.5rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#1e293b",
                    marginTop: 0,
                    marginBottom: "1rem",
                  }}
                >
                  Make a Mock Alumni Contribution (Sec 80G Sample Receipt)
                </h3>

                {/* Amount Tiers */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Select Contribution Amount (₹)
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["1000", "2500", "5000", "10000", "25000"].map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => setDonationAmount(tier)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 8,
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          border: donationAmount === tier ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                          background: donationAmount === tier ? "#ea580c" : "#f8fafc",
                          color: donationAmount === tier ? "#ffffff" : "#334155",
                        }}
                      >
                        ₹{parseInt(tier, 10).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      Donor Name (As per PAN)
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                      PAN Card Number (For 80G Certificate)
                    </label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      required
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "1.2rem" }}>
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#ea580c" }}
                    />
                    <label htmlFor="anonCheck" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                      Keep my name anonymous in public donor list
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ea580c",
                      color: "#ffffff",
                      fontSize: "0.86rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Heart size={16} /> Submit Mock Contribution & Issue 80G Receipt
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 9: AI ASSISTANT SPACE (GREENBOT)
          ======================================================== */}
      {currentScreen === "aispace" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Bot size={20} />
              </div>
              <div>
                <h2>VatikaBot AI Assistant (Alumni & Legacy Space)</h2>
                <p>Instant guidance on reunions, transcript verification, campus passes, and mentorship opportunities.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Sparkles size={12} /> AI Active
              </span>
            </div>
          </div>

          <div
            className="student-screen-scroll-body"
            style={{
              padding: "1rem clamp(1rem, 2vw, 2.5rem)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                maxWidth: 900,
                width: "100%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* CHAT MESSAGES LOG */}
              <div
                style={{
                  flex: 1,
                  minHeight: 320,
                  overflowY: "auto",
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1.2px solid rgba(251, 146, 60, 0.28)",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                }}
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    {msg.sender === "bot" && (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "#fff7ed",
                          border: "1.5px solid #fed7aa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ea580c",
                          flexShrink: 0,
                        }}
                      >
                        <Bot size={18} />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "10px 14px",
                        borderRadius: "14px",
                        fontSize: "0.82rem",
                        lineHeight: 1.45,
                        background: msg.sender === "user" ? "#ea580c" : "#fff7ed",
                        color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                        border: msg.sender === "user" ? "none" : "1px solid rgba(251, 146, 60, 0.3)",
                      }}
                    >
                      <p style={{ margin: 0 }}>{msg.text}</p>
                      <span
                        style={{
                          display: "block",
                          marginTop: 4,
                          fontSize: "0.64rem",
                          color: msg.sender === "user" ? "rgba(255,255,255,0.8)" : "#94a3b8",
                          textAlign: msg.sender === "user" ? "right" : "left",
                        }}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ea580c", fontSize: "0.78rem" }}>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>VatikaBot is typing an answer...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* QUICK SUGGESTIONS */}
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "10px 0" }}>
                {Object.keys(AI_PRESET_QA).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(q)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "9999px",
                      background: "#ffffff",
                      border: "1px solid rgba(251, 146, 60, 0.4)",
                      color: "#9a3412",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* CHAT INPUT FORM */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                }}
              >
                <input
                  type="text"
                  placeholder="Type a question for VatikaBot AI..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                  style={{ border: "none", outline: "none", fontSize: "0.85rem", flex: 1, padding: "4px" }}
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 10: PHOTO GALLERY & MEMORIES
          ======================================================== */}
      {currentScreen === "gallery" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fce7f3", color: "#db2777" }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h2>Madhuvan Vatika Alumni Photo Gallery & Archives</h2>
                <p>Relive golden school memories, reunion moments, athletic meets, and annual cultural celebrations.</p>
              </div>
            </div>
            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                }}
              >
                {GALLERY_ITEMS.length} Memory Albums
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.25rem clamp(1rem, 2vw, 2.5rem)" }}>
            <div style={{ maxWidth: 1080, margin: "0 auto" }}>
              {/* ALBUM FILTER */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", overflowX: "auto" }}>
                {["All", "Reunions", "Campus Life", "Sports Meets", "Achievements", "Heritage"].map((alb) => (
                  <button
                    key={alb}
                    onClick={() => setGalleryFilter(alb)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: galleryFilter === alb ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                      background: galleryFilter === alb ? "#ea580c" : "#ffffff",
                      color: galleryFilter === alb ? "#ffffff" : "#475569",
                    }}
                  >
                    {alb}
                  </button>
                ))}
              </div>

              {/* GALLERY GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {GALLERY_ITEMS.filter((g) => galleryFilter === "All" || g.album === galleryFilter).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxImage(photo)}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.2px solid rgba(251, 146, 60, 0.28)",
                      overflow: "hidden",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                      <img
                        src={photo.image}
                        alt={photo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          background: "rgba(0, 0, 0, 0.7)",
                          color: "#ffffff",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {photo.album} • {photo.year}
                      </span>
                    </div>
                    <div style={{ padding: "0.85rem" }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        {photo.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.74rem", color: "#64748b", lineHeight: 1.35 }}>
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          MODALS & INTERACTIVE OVERLAYS
          ======================================================== */}

      {/* 1. EVENT DETAILS & RSVP MODAL */}
      {selectedEventModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedEventModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 540,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CalendarDays size={18} style={{ color: "#ea580c" }} />
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                  {selectedEventModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "12px",
                    background: "#fff7ed",
                    border: "1.5px solid #fed7aa",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ea580c" }}>
                    {selectedEventModal.day}
                  </span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#9a3412" }}>
                    {selectedEventModal.month}
                  </span>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                    {selectedEventModal.subtitle}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: "#64748b" }}>
                    🕒 {selectedEventModal.time} • 📍 {selectedEventModal.venue}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                {selectedEventModal.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.76rem", color: "#64748b" }}>
                  👥 {selectedEventModal.attendees} Alumni Registered
                </span>
                <button
                  onClick={() => {
                    handleToggleRsvp(selectedEventModal.id);
                    setSelectedEventModal(null);
                  }}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    border: "none",
                    background: selectedEventModal.isRsvp ? "#dc2626" : "#ea580c",
                    color: "#ffffff",
                  }}
                >
                  {selectedEventModal.isRsvp ? "Cancel My RSVP" : "Confirm My RSVP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. UPDATE / NEWS ARTICLE MODAL */}
      {selectedUpdateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedUpdateModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 540,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
              }}
            >
              <span
                style={{
                  background: selectedUpdateModal.tagBg,
                  color: selectedUpdateModal.tagColor,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                }}
              >
                {selectedUpdateModal.tag}
              </span>
              <button
                onClick={() => setSelectedUpdateModal(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                {selectedUpdateModal.title}
              </h3>
              <p style={{ margin: "0 0 1rem", fontSize: "0.74rem", color: "#94a3b8" }}>
                Published: {selectedUpdateModal.date} • Madhuvan Vatika Alumni Newsroom
              </p>
              <p style={{ fontSize: "0.84rem", color: "#334155", lineHeight: 1.55 }}>
                {selectedUpdateModal.fullContent}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                <button
                  onClick={() => setSelectedUpdateModal(null)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: "#ea580c",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SEND MESSAGE / GREETING MODAL */}
      {messageRecipient && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setMessageRecipient(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 480,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                {messageRecipient.isTeacher ? "Send Teacher Greeting" : `Message ${messageRecipient.name}`}
              </h3>
              <button
                onClick={() => setMessageRecipient(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: "1.25rem" }}>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "#64748b" }}>
                Sending from: <strong>{profile.name} ({profile.batchTitle})</strong>
              </p>
              <textarea
                rows={4}
                required
                placeholder={
                  messageRecipient.isTeacher
                    ? "Dear Teacher, remembering your inspiring classes at Madhuvan Vatika..."
                    : "Hi! Reconnecting from our Madhuvan Vatika school days..."
                }
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setMessageRecipient(null)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#ea580c",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Send Dispatched Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEW REQUEST MODAL */}
      {isRequestModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsRequestModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 520,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                Submit New Request to Alumni Office
              </h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} style={{ padding: "1.25rem" }}>
              <div style={{ marginBottom: "0.85rem" }}>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Request Category
                </label>
                <select
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                >
                  <option value="Official Transcripts">Official CBSE Transcripts & Marksheets</option>
                  <option value="Letter of Recommendation">Letter of Recommendation (Principal / HOD)</option>
                  <option value="Certificate Verification">Degree / Passing Certificate Verification</option>
                  <option value="Guest Lecture Proposal">Guest Lecture / Workshop Proposal</option>
                  <option value="School Archive Search">School Archive / Nostalgia Photo Request</option>
                </select>
              </div>

              <div style={{ marginBottom: "0.85rem" }}>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Preferred Delivery Mode
                </label>
                <select
                  value={newRequestDelivery}
                  onChange={(e) => setNewRequestDelivery(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                >
                  <option value="Digital PDF Copy (Email)">Digital PDF Copy (Email)</option>
                  <option value="SpeedPost Sealed Envelope (Courier)">SpeedPost Sealed Envelope (Courier)</option>
                  <option value="Campus Front Desk Collection">Campus Front Desk Collection</option>
                </select>
              </div>

              <div style={{ marginBottom: "0.85rem" }}>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Urgency / Processing Window
                </label>
                <select
                  value={newRequestUrgency}
                  onChange={(e) => setNewRequestUrgency(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                >
                  <option value="Normal (3-5 days)">Normal Processing (3-5 business days)</option>
                  <option value="Priority (24-48 hrs)">Priority Express (24-48 hours)</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Specific Details / Purpose
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify university name, destination address, or context..."
                  value={newRequestNotes}
                  onChange={(e) => setNewRequestNotes(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#ea580c", color: "#ffffff", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VISITOR GATE PASS MODAL */}
      {visitPassModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setVisitPassModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 480,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "2px solid #ea580c",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, fontFamily: "Outfit, sans-serif" }}>
                MADHUVAN VATIKA - MVPS
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.72rem", opacity: 0.9 }}>
                Official Alumni Campus Security Entry Pass
              </p>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                PASS #{visitPassModal.passCode}
              </div>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px dashed #cbd5e1",
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                    {visitPassModal.name}
                  </h4>
                  <span style={{ fontSize: "0.74rem", color: "#ea580c", fontWeight: 700 }}>
                    {visitPassModal.batch}
                  </span>
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    border: "2px solid #ea580c",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff7ed",
                  }}
                >
                  <QrCode size={36} style={{ color: "#ea580c" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.76rem" }}>
                <div>
                  <span style={{ color: "#64748b" }}>Date of Visit:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{visitPassModal.date}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Time Slot:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{visitPassModal.slot}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Vehicle Number:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{visitPassModal.vehicle}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Security Gate:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{visitPassModal.entryGate}</p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ color: "#64748b" }}>Visit Purpose:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{visitPassModal.purpose}</p>
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "8px",
                  borderRadius: 8,
                  fontSize: "0.68rem",
                  color: "#64748b",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                Scan QR at North Gate security terminal for automatic visitor gate pass validation.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    showToast("Visitor Gate Pass downloaded to local storage (simulated).");
                    setVisitPassModal(null);
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#ea580c",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Download / Save Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DONATION 80G RECEIPT MODAL */}
      {donationReceiptModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setDonationReceiptModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 500,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #16a34a",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                color: "#ffffff",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, fontFamily: "Outfit, sans-serif" }}>
                MADHUVAN VATIKA EDUCATIONAL TRUST
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.72rem", opacity: 0.9 }}>
                Official Section 80G Tax Exemption Receipt (Sample)
              </p>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                }}
              >
                RECEIPT #{donationReceiptModal.receiptNo}
              </div>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.74rem", color: "#64748b" }}>Amount Contributed</span>
                <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 900, color: "#16a34a" }}>
                  ₹{donationReceiptModal.amount.toLocaleString()}
                </h2>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0f172a" }}>
                  Towards: {donationReceiptModal.campaign}
                </span>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  fontSize: "0.76rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <span style={{ color: "#64748b" }}>Donor Name:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{donationReceiptModal.donor}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>PAN:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{donationReceiptModal.pan}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Date of Pledge:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{donationReceiptModal.date}</p>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Tax Exemption:</span>
                  <p style={{ margin: 0, fontWeight: 700, color: "#15803d" }}>Sec 80G Verified</p>
                </div>
              </div>

              <p style={{ fontSize: "0.7rem", color: "#64748b", textAlign: "center", margin: 0 }}>
                {donationReceiptModal.taxExemption}. This is a demonstration sample receipt.
              </p>

              <div style={{ display: "flex", justifyContent: "center", marginTop: "1.25rem" }}>
                <button
                  onClick={() => setDonationReceiptModal(null)}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. PHOTO GALLERY LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: 720,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }}>
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                style={{ width: "100%", maxHeight: "420px", objectFit: "cover" }}
              />
              <button
                onClick={() => setLightboxImage(null)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  color: "#ffffff",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <span
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                }}
              >
                {lightboxImage.album} • {lightboxImage.year}
              </span>
              <h3 style={{ margin: "6px 0 4px", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                {lightboxImage.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.45 }}>
                {lightboxImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT COMMAND FOOTER */}
      <footer
        className="command-footer"
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(254, 215, 170, 0.5)",
          background: "rgba(255, 255, 255, 0.92)",
        }}
      >
        <div>
          <span className="footer-dot" style={{ background: "#ea580c" }} /> Official Madhuvan Vatika - MVPS Alumni Command Portal
        </div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930281</span>
          <span>NAAC Grade A++</span>
          <span>12,400+ Alumni Worldwide</span>
          <span>18 Global Chapters Active</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#ea580c" }}>
          <ShieldCheck size={14} /> Safe & Encrypted Kiosk
        </div>
      </footer>
    </div>
  );
}
