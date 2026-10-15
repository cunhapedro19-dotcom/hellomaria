interface IconProps {
  className?: string;
}

const base = (className?: string) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const BagIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" />
    <path d="M8.5 10.5V6.8a3.5 3.5 0 0 1 7 0v3.7" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.3-4.3" />
  </svg>
);

export const SlidersIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h13M20 17h0" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18.5" cy="17" r="2" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4.5 6.5h15M9 6.5V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7M7 6.5 7.8 20h8.4L17 6.5M10 10.5V16M14 10.5V16" />
  </svg>
);

export const PencilIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m14.5 5.5 4 4L8 20l-4.5.5L4 16 14.5 5.5ZM12.5 7.5l4 4" />
  </svg>
);

export const ChevronDown = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const ArrowRight = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const HeartChatIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20.5 11.3c0 4.4-4 7.7-8.5 7.7-1 0-2-.2-2.9-.5L4 20l1.2-3.5A6.8 6.8 0 0 1 3.5 11.3c0-3.8 3.3-6.8 7.3-6.8 5.2 0 9.7 3 9.7 6.8Z" />
    <path d="M9.2 11.2c.5-1.1 1.6-1.5 2.4-.9.7-.7 2-.4 2.3.7.3 1.2-1.6 2.6-2.4 3.1-.8-.5-2.7-1.7-2.3-2.9Z" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 21s-6.5-5.4-6.5-10.3a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
    <path d="M9.5 13.5 12 9l2.5 4.5h-5Z" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
);

export const InstagramIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14.8 4.5h-2c-1.9 0-3.2 1.3-3.2 3.3v2h-2v3h2v6.7h3.1V12.8h2.3l.4-3h-2.7v-1.6c0-.7.3-1.1.9-1.1h1.5v-2.6Z" />
  </svg>
);

export const WhatsAppIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21l4.5-1.1A9.2 9.2 0 1 0 12 2.8Z" />
    <path
      d="M8.9 7.4c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.2.2 1.9 2.9 4.5 4 2.2.8 2.6.7 3.1.6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.5-.3-1.8-.9c-.2-.1-.4-.1-.6.1l-.7.9c-.2.2-.3.2-.5.1a7 7 0 0 1-2.1-1.3 7.5 7.5 0 0 1-1.4-1.8c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5v-.4l-1.2-1.9Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const SparkIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" strokeWidth="1.2" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7M12 14.5v2.5" />
  </svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 4 2.8 20h18.4L12 4ZM12 10v4.5M12 17.4v.2" />
  </svg>
);

export const InfoIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.8v.2" />
  </svg>
);

export const ResetIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12V7M4.5 12H9" />
  </svg>
);

export const StoreIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 9.5 5.3 4.5h13.4L20 9.5M4.8 9.5a2.3 2.3 0 0 0 4.5.4 2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.5-.4M5.5 12v8h13v-8M10 20v-5h4v5" />
  </svg>
);

export const LogoutIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14 4.5H6.5v15H14M10.5 12H21M18 8.5l3.5 3.5L18 15.5" />
  </svg>
);

export const ImageIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="4" y="5" width="16" height="14" rx="1.5" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m5 17 4.5-4 3.5 3 3-2.5 3.5 3.5" />
  </svg>
);
