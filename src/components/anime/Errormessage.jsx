export function ErrorMessage({ error }) {
  return (
    <div className="bg-brand/10 border border-brand/30 text-brand rounded-card p-4 text-sm">
      API error: {error}
      <br />
      <span className="text-text-muted">
        Check your network connection or if the{" "}
          <a
            href="https://docs.api.jikan.moe/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jikan API
          </a>{" "}
          is reachable.
      </span>
    </div>
  );
}