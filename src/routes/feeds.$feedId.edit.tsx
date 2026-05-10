import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FeedForm } from "@/components/FeedForm";
import { getFeedById, type Feed } from "@/api/feedApi";

export const Route = createFileRoute("/feeds/$feedId/edit")({
  head: () => ({
    meta: [
      { title: "Edit Feed — CoAction" },
      {
        name: "description",
        content: "Edit an existing data feed in the CoAction inventory.",
      },
    ],
  }),
  component: EditFeedPage,
});

function EditFeedPage() {
  const { feedId } = Route.useParams();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedById(feedId);
      setFeed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [feedId]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Loading feed…</span>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error || "Feed not found"}</p>
        <button
          onClick={loadFeed}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-95 flex items-center gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto space-y-5">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Third Party Feeds
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Edit Feed</span>
      </nav>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Edit Feed</h1>
        <p className="text-sm text-muted-foreground">
          Update feed details for <span className="font-medium text-foreground">{feed.feedName}</span>.
        </p>
      </div>
      <FeedForm feed={feed} />
    </div>
  );
}
