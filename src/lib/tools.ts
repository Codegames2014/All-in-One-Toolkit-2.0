import {
  Calculator,
  Sigma,
  Languages,
  Image,
  Scan,
  Feather,
  BrainCircuit,
  Youtube,
  Instagram,
  Facebook,
  PenTool,
  LayoutGrid,
  Wand2,
  AppWindow,
  Gamepad2,
  CircleDollarSign,
  type LucideIcon,
  Crown,
  FileCode,
  Palette,
  QrCode,
  Puzzle,
  Car,
  Brain,
  Dice5,
  Combine,
  Hash,
  Search,
  Bot,
  Grape,
  RectangleHorizontal,
  CircleDot,
  Clock,
  Scale,
  BookOpen,
} from "lucide-react";

export type Tool = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  wip?: boolean;
};

const individualTools: Tool[] = [
  {
    name: "Dashboard",
    description: "Overview of all tools.",
    icon: LayoutGrid,
    href: "/",
  },
  {
    name: "Money Converter",
    description: "Convert between currencies.",
    icon: CircleDollarSign,
    href: "/money-converter",
  },
   {
    name: "QR Code Scanner",
    description: "Scan QR codes with your camera.",
    icon: QrCode,
    href: "/qr-code-scanner",
  },
  {
    name: "Measurement Unit Converter",
    description: "Convert various units of measurement.",
    icon: Scale,
    href: "/unit-converter",
  },
  {
    name: "Time Zone Checker",
    description: "Compare times across the world.",
    icon: Clock,
    href: "/time-zone-checker",
  },
  {
    name: "Basic Calculator",
    description: "For simple arithmetic.",
    icon: Calculator,
    href: "/calculator",
  },
  {
    name: "Advanced Calculator",
    description: "Scientific calculations.",
    icon: Sigma,
    href: "/advanced-calculator",
  },
  {
    name: "Text Translator",
    description: "Translate between languages.",
    icon: Languages,
    href: "/translator",
  },
  {
    name: "Photo Editor",
    description: "Basic image adjustments.",
    icon: Image,
    href: "/photo-editor",
  },
  {
    name: "Advanced Photo Editor",
    description: "Edit photos with text prompts.",
    icon: Wand2,
    href: "/advanced-photo-editor",
  },
  {
    name: "BG Remover",
    description: "Remove photo backgrounds.",
    icon: Scan,
    href: "/background-remover",
  },
  {
    name: "Text Generator",
    description: "Generate creative text.",
    icon: Feather,
    href: "/text-generator",
  },
  {
    name: "Story Writer",
    description: "Write stories with AI.",
    icon: BookOpen,
    href: "/story-writer",
  },
  {
    name: "Math Solver",
    description: "Solve math problems.",
    icon: BrainCircuit,
    href: "/math-solver",
  },
  {
    name: "App Builder",
    description: "Build apps with text prompts.",
    icon: AppWindow,
    href: "/app-builder",
  },
  {
    name: "Games",
    description: "Play fun offline games.",
    icon: Gamepad2,
    href: "/games",
  },
  {
    name: "Logo Generator",
    description: "Create unique logos.",
    icon: PenTool,
    href: "/logo-generator",
  },
  {
    name: "YouTube Downloader",
    description: "Download YouTube videos.",
    icon: Youtube,
    href: "/youtube-downloader",
  },
  {
    name: "Instagram Downloader",
    description: "Download Instagram videos.",
    icon: Instagram,
    href: "/instagram-downloader",
  },
  {
    name: "Facebook Downloader",
    description: "Download Facebook videos.",
    icon: Facebook,
    href: "/facebook-downloader",
  },
];

const games: Tool[] = [
  {
    name: "Tic-Tac-Toe",
    description: "The classic game of X's and O's.",
    icon: Hash,
    href: "/games/tic-tac-toe",
  },
  {
    name: "Chess",
    description: "Classic strategy board game.",
    icon: Crown,
    href: "/games/chess",
  },
  {
    name: "Word Search",
    description: "Find the hidden words.",
    icon: Search,
    href: "/games/word-search",
  },
  {
    name: "Hangman",
    description: "Guess the word before it's too late.",
    icon: Bot,
    href: "/games/hangman",
  },
  {
    name: "Mahjong Solitaire",
    description: "A classic tile-matching puzzle.",
    icon: Puzzle,
    href: "/games/mahjong-solitaire",
  },
  {
    name: "Snake",
    description: "Eat the fruit and grow longer.",
    icon: Grape,
    href: "/games/snake",
  },
  {
    name: "2048",
    description: "Slide tiles to get to 2048.",
    icon: RectangleHorizontal,
    href: "/games/2048",
  },
  {
    name: "Asteroids",
    description: "Shoot asteroids and survive.",
    icon: Sigma,
    href: "/games/asteroids",
  },
  {
    name: "Bubble Shooter",
    description: "Pop bubbles to clear the board.",
    icon: CircleDot,
    href: "/games/bubble-shooter",
  },
  {
    name: "Car Racing",
    description: "High-speed racing action.",
    icon: Car,
    href: "/games/car-racing",
  },
  {
    name: "Mind Games",
    description: "Puzzles to test your logic.",
    icon: Brain,
    href: "/games/mind-games",
  },
  {
    name: "Ludo",
    description: "A classic family dice game.",
    icon: Dice5,
    href: "/games/ludo",
  },
  {
    name: "Snakes & Ladders",
    description: "Climb ladders and avoid snakes.",
    icon: Combine,
    href: "/games/snakes-and-ladders",
  },
];


export const tools: Tool[] = [...individualTools, ...games];
