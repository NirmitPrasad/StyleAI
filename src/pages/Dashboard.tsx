import { TopNav } from "@/components/TopNav";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard — Maison";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">Spring / Summer · 26</p>
          <h1 className="mt-4 font-serif text-5xl sm:text-7xl leading-[0.95]">
            The atelier,<br/>
            <span className="italic text-muted-foreground">curated for you.</span>
          </h1>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Pieces", value: "128", note: "in your closet" },
            { label: "Outfits", value: "42", note: "this season" },
            { label: "Edits", value: "07", note: "saved looks" },
          ].map((c) => (
            <article key={c.label} className="border border-border bg-card p-8">
              <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">{c.label}</p>
              <p className="mt-6 font-serif text-6xl">{c.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
