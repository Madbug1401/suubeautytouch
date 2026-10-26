export function PageTitle({ children, intro }: { children: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <div className="mb-10 text-center">
      <h1>{children}</h1>
      {intro && <p className="mx-auto max-w-2xl italic text-muted">{intro}</p>}
    </div>
  );
}
