function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M11.96 16.747c-5.625 0-9.252-3.781-9.402-10.078H5.32c.103 4.687 2.279 6.687 4.094 7.125V6.669h2.567v3.875c1.749-.187 3.582-2.187 4.198-3.875h2.55c-.471 2.062-2.41 4.062-3.799 4.875 1.39.687 3.609 2.437 4.45 5.203h-2.811c-.66-2.062-2.342-3.687-4.588-3.906v3.906H11.96z" />
    </svg>
  );
}

export function SocialLinks() {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <a
        href="https://t.me/+NxIFCQBuxsA3Mzdi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram-канал"
        className="w-9 h-9 grid place-items-center rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[#0ea5e9] hover:border-[#0ea5e9] transition-colors"
      >
        <TelegramIcon />
      </a>
      <a
        href="https://vk.com/bp24"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ВКонтакте"
        className="w-9 h-9 grid place-items-center rounded-full border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[#0077ff] hover:border-[#0077ff] transition-colors"
      >
        <VkIcon />
      </a>
    </div>
  );
}
