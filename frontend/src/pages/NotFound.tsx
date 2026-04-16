import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <span className="text-[120px] font-bold text-border leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 text-accent opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="40" cy="40" r="25" />
              <line x1="58" y1="58" x2="80" y2="80" strokeLinecap="round" strokeWidth="4" />
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
