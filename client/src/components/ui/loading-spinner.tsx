import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", sizeClasses[size], className)}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PulsingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <PulsingDots />
      <span className="text-sm">AI is thinking...</span>
    </div>
  );
}