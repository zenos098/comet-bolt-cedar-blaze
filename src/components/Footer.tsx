import { Link } from "@tanstack/react-router";
import { LoopMark } from "./LoopMark";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 text-sm text-cream/55">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cream">
            <LoopMark className="size-5 text-mint" />
            <span className="font-serif text-lg">looply</span>
          </div>
          <p className="mt-3 max-w-sm leading-relaxed">
            Run marketing 24/7. Looply is an independent product and is not
            affiliated with Scalio.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
          <Link to="/pricing" className="hover:text-cream">
            Pricing
          </Link>
          <Link to="/examples" className="hover:text-cream">
            Examples
          </Link>
          <Link to="/contact" className="hover:text-cream">
            Contact
          </Link>
          <Link to="/login" className="hover:text-cream">
            Studio
          </Link>
          <a href="mailto:support@looply.app" className="hover:text-cream">
            support@looply.app
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-cream/35">
        © {new Date().getFullYear()} Looply. Reels are storyboards. Inbox drafts
        replies. Ads export creatives. The owner approves.
      </p>
    </footer>
  );
}
