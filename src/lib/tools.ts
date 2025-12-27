import {
  Calculator,
  Sigma,
  Languages,
  Image,
  Scan,
  Feather,
  BrainCircuit,
  PenTool,
  LayoutGrid,
  Wand2,
  AppWindow,
  Gamepad2,
  CircleDollarSign,
  type LucideIcon,
  Crown,
  QrCode,
  Palette,
  Clock,
  Scale,
  BookOpen,
  Barcode,
  HelpCircle,
  Lightbulb,
  FileText,
  Music,
} from "lucide-react";

export type Tool = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  wip?: boolean;
};

export const tools: Tool[] = [
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
    name: "Barcode Scanner",
    description: "Scan barcodes with your camera.",
    icon: Barcode,
    href: "/barcode-scanner",
  },
  {
    name: "Color Picker",
    description: "Select and convert colors.",
    icon: Palette,
    href: "/color-picker",
  },
  {
    name: "Unit Converter",
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
    name: "File Viewer",
    description: "Open and view local files.",
    icon: FileText,
    href: "/file-viewer",
  },
  {
    name: "Audio Player",
    description: "Play local audio files.",
    icon: Music,
    href: "/audio-player",
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
    name: "Story Writer",
    description: "Write compelling stories with AI.",
    icon: BookOpen,
    href: "/story-writer",
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
    name: "Math Solver",
    description: "Solve math problems.",
    icon: BrainCircuit,
    href: "/math-solver",
  },
  {
    name: "Q&A Tool",
    description: "Ask the AI any question.",
    icon: HelpCircle,
    href: "/qa-tool",
  },
  {
    name: "Question Maker",
    description: "Generate questions from text.",
    icon: Lightbulb,
    href: "/question-maker",
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
    name: "Chess",
    description: "The classic game of strategy.",
    icon: Crown,
    href: "/games/chess",
  },
];
