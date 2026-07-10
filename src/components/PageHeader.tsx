interface PageHeaderProps {
  title: string;
  lede?: string;
}

/** Navy band that opens every inner page. */
export default function PageHeader({ title, lede }: PageHeaderProps) {
  return (
    <section className="bg-band">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        {lede && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{lede}</p>}
        <div className="mt-6 h-1 w-16 rounded-full bg-gold-500" aria-hidden="true" />
      </div>
    </section>
  );
}
