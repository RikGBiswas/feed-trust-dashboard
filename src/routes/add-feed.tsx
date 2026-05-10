import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { FeedForm } from "@/components/FeedForm";

export const Route = createFileRoute("/add-feed")({
  head: () => ({
    meta: [
      { title: "Add Feed — CoAction" },
      {
        name: "description",
        content:
          "Register a new data feed in the CoAction inventory with ownership, security, and provisioning details.",
      },
    ],
  }),
  component: AddFeedPage,
});

function AddFeedPage() {
  return (
    <div className="px-6 py-6 max-w-5xl mx-auto space-y-5">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Third Party Feeds
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Add Feed</span>
      </nav>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Add / Upload Feed</h1>
        <p className="text-sm text-muted-foreground">
          Register a new data feed and capture ownership, source, security, and provisioning details.
        </p>
      </div>
      <FeedForm />
    </div>
  );
}
