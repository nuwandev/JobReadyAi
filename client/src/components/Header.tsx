import { Link, useLocation } from "wouter";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/cv-builder", label: "CV Builder" },
    { href: "/interview-trainer", label: "Interview Trainer" },
    { href: "/career-guide", label: "Career Guide" },
  ];

  return (
    <header className="border-b border-slate-800 bg-dark/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Brain className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JobReady AI</h1>
              <p className="text-xs text-muted">Career Assistant</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  location === item.href
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-dark border-slate-800">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-colors ${
                      location === item.href
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
