import React from 'react';
import { Link } from 'react-router-dom';

export default function ActivityCard({
  to,
  href,
  title,
  subtitle,
  badge,
  actionLabel = 'Go',
  accentClass = 'bg-blue-600',
}) {
  const sharedClassName = `group relative flex min-h-[6.75rem] flex-col justify-between overflow-hidden rounded-2xl p-3 text-white shadow-md transition-transform duration-200 active:scale-[0.98] ${accentClass}`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] opacity-80">
            {badge}
          </p>
          <h3 className="mt-1 text-[15px] font-extrabold leading-tight sm:text-[17px]">
            {title}
          </h3>
        </div>
        <div className="rounded-lg bg-white/15 px-2 py-1 text-[9px] font-black uppercase tracking-wide">
          {actionLabel}
        </div>
      </div>

      <p className="max-w-[15rem] text-[11px] font-medium leading-snug opacity-90">
        {subtitle}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={sharedClassName}
    >
      {content}
    </Link>
  );
}
