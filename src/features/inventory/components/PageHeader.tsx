interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode[];
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions = [],
}: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-5 mb-5">
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">
          {eyebrow}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      </div>
      {actions.length > 0 && (
        <div className="flex gap-2">{actions}</div>
      )}
    </div>
  );
}
