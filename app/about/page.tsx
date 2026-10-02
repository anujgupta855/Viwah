import Image from "next/image";
import { Instagram, Youtube, ArrowUpRight } from "lucide-react";

const team = [

  {
  name: "Abhishek Verma",
  role: "Venue Operations & Vendor Management",
  image: "/team/abhishek-verma.png",
  position: "center 25%",
  bio: "Abhishek Verma brings 10+ years of frontline hospitality expertise, specializing in high-impact venue operations and vendor management. A master of partner relations and on-ground coordination, he excels at aligning venues and top-tier vendors to deliver flawless events and exceptional guest satisfaction.",
},

  {
    name: "Charu Dutt",
    role: "Marketing Strategy & Lead Management",
    image: "/team/charu-dutt.png",
    bio: "Charu Dutt brings 6+ years of specialized hospitality experience with a sharp focus on marketing strategy and lead management. An expert at building high-converting sales pipelines, he excels at driving targeted inquiries, nurturing client relationships, and turning prospects into loyal bookings.",
  },
    {
    name: "Harsh Gupta",
    role: "Sales, Design & Customer Relations",
    image: "/team/harsh-gupta.png",
    bio: "Harsh Gupta brings 4+ years of dynamic hospitality experience, uniquely combining expertise in sales, graphic design, and customer relationship management. From designing standout visual promotions to closing bookings and nurturing long-term client satisfaction, he delivers a seamless, engaging brand experience from first impression to final execution.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Hero / Our Story */}
        <section className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Our story
          </p>

          <h1 className="mt-3 max-w-5xl font-display text-5xl leading-[1.08] text-charcoal sm:text-6xl lg:text-7xl">
            Events Needs Perfection
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-charcoal/65 sm:text-xl">
            Viwah is being built as a premium marketplace for couples and
            wedding professionals.
          </p>
        </section>

        
        {/* Team */}
        <section className="mt-28 border-t border-charcoal/10 pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Our team
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
              The people behind Viwah.
            </h2>

            <p className="mt-5 text-lg leading-8 text-charcoal/65">
              A team bringing together hospitality experience, creativity,
              marketing and technology to build a better wedding planning
              experience.
            </p>
          </div>

          {/* Team Grid */}
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-7 lg:gap-10">
            {team.map((member) => (
              <article key={member.name} className="group">
                <div className="relative aspect-[2/3] overflow-hidden bg-charcoal/5">
                  <Image
                    src={member.image}
                    alt={`${member.name} - Viwah team`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {member.role}
                  </p>

                  <h3 className="mt-2 font-display text-3xl text-charcoal">
                    {member.name}
                  </h3>

                  <p className="mt-4 text-[15px] leading-7 text-charcoal/65">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* Story */}
        <section className="mt-24 max-w-4xl border-t border-charcoal/10 pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            What we believe
          </p>

          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-charcoal sm:text-5xl">
            Bringing the right people, places and possibilities together.
          </h2>

          <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-charcoal/65 sm:text-lg">
            <p>
              Planning a wedding involves countless decisions — finding the
              right venue, discovering reliable professionals, comparing
              options and bringing every detail together.
            </p>

            <p>
              Viwah is being created to make that journey simpler and more
              connected. Our goal is to help couples discover venues and
              wedding professionals while giving businesses a meaningful
              platform to showcase their work.
            </p>

            <p>
              We believe wedding planning should feel exciting, personal and
              beautifully organized — not overwhelming.
            </p>
          </div>
        </section>


        {/* Social */}
        <section className="mt-28 border-t border-charcoal/10 pt-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Stay connected
            </p>

            <h2 className="mt-4 font-display text-4xl text-charcoal sm:text-5xl">
              Follow Viwah.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-charcoal/65">
              Follow us for wedding inspiration, real celebrations, planning
              ideas and the latest from Viwah.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/viwah.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 items-center justify-between border border-charcoal/15 bg-white/30 px-6 py-5 transition-all duration-300 hover:border-gold hover:bg-white/60"
            >
              <div className="flex items-center gap-4">
                <Instagram className="h-5 w-5 text-charcoal" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                    Instagram
                  </p>

                  <p className="mt-1 text-base font-medium text-charcoal">
                    @viwah.in
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-5 w-5 text-charcoal/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
            </a>

            {/* YouTube */}
            <a
              href="#"
              className="group flex flex-1 items-center justify-between border border-charcoal/15 bg-white/30 px-6 py-5 transition-all duration-300 hover:border-gold hover:bg-white/60"
            >
              <div className="flex items-center gap-4">
                <Youtube className="h-5 w-5 text-charcoal" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                    YouTube
                  </p>

                  <p className="mt-1 text-base font-medium text-charcoal">
                    VIWAH
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-5 w-5 text-charcoal/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}