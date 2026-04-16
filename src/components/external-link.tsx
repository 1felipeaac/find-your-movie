import React from "react";

interface ExternalLinkProps {
  link: string;
  children: React.ReactNode;
  title?: string;
  className?: string; // Permitimos customizar o visual dependendo de onde for usado
}

export function ExternalLink({ link, children, title, className }: ExternalLinkProps) {
 
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={className}
    >
      {children}
    </a>
  );
}