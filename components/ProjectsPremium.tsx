"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const COPY = {
  section: "Projelerim",
  eyebrow: "02 / Projelerim",
  title: "M\u00fchendisli\u011fin iz b\u0131rakt\u0131\u011f\u0131 projeler.",
  selection: "Proje se\u00e7kisi",
  works: "se\u00e7ili \u00e7al\u0131\u015fma",
  scope: "Kapsam",
  discipline: "Disiplin",
};

const projects = [
  {
    img: "/projects/celik-hal.jpeg",
    tag: "\u00c7EL\u0130K KONSTR\u00dcKS\u0130YON",
    title: "End\u00fcstriyel Hal Yap\u0131s\u0131",
    desc: "Geni\u015f a\u00e7\u0131kl\u0131kl\u0131 \u00e7elik hal yap\u0131s\u0131n\u0131n tam yap\u0131sal modeli; \u00e7apraz stabilite elemanlar\u0131, a\u015f\u0131k sistemi ve temel ba\u011flant\u0131 detaylar\u0131yla birlikte tasarland\u0131.",
    scope: "Ta\u015f\u0131y\u0131c\u0131 sistem",
    discipline: "Tasar\u0131m / Detay",
  },
  {
    img: "/projects/sap2000-analiz.jpeg",
    tag: "SAP2000",
    title: "\u00c7elik Yap\u0131 Sonlu Eleman Analizi",
    desc: "Deprem ve r\u00fczg\u00e2r y\u00fckleri alt\u0131nda eleman bazl\u0131 kapasite kontrol\u00fc.",
    scope: "Global analiz",
    discipline: "\u00c7elik / Deprem",
  },
  {
    img: "/projects/etabs-betonarme.jpeg",
    tag: "ETABS",
    title: "Betonarme Bina Modellemesi",
    desc: "\u00c7ok katl\u0131 betonarme ta\u015f\u0131y\u0131c\u0131 sistemin kat bazl\u0131 analiz ve donat\u0131 tasar\u0131m\u0131.",
    scope: "Bina sistemi",
    discipline: "Betonarme",
  },
  {
    img: "/projects/tekla-celik.jpeg",
    tag: "TEKLA STRUCTURES",
    title: "\u00c7elik Platform Detayland\u0131rma",
    desc: "Ba\u011flant\u0131 ve montaj detaylar\u0131na kadar \u00fcretime haz\u0131r BIM modeli.",
    scope: "Uygulama modeli",
    discipline: "BIM / \u0130malat",
  },
  {
    img: "/projects/temel-tasarim.jpeg",
    tag: "GEOTEKN\u0130K",
    title: "Kaz\u0131kl\u0131 Temel Tasar\u0131m\u0131",
    desc: "Zemin ko\u015fullar\u0131na g\u00f6re kaz\u0131kl\u0131 radye temel sistemi modellemesi.",
    scope: "Temel sistemi",
    discipline: "Zemin / Yap\u0131",
  },
];

const featured = projects[0];
const others = projects.slice(1);

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectsPremium() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="projeler"
      aria-label={COPY.section}
      className="relative isolate overflow-hidden bg-[#0B1726] px-5 py-24 text-white md:px-14 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: "linear-gradient(rgba(143,163,184,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(143,163,184,0.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 92%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-16 -z-10 h-[620px] w-[620px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(92,132,168,0.3), transparent 68%)" }}
      />

      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-white/12 pb-14 md:pb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mb-7 flex items-center gap-4"
            >
              <span className="h-px w-12 bg-[#B9C2CD]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B9C2CD]">{COPY.eyebrow}</span>
            </motion.div>
            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="max-w-4xl text-4xl font-extrabold tracking-[-0.045em] text-white md:text-6xl lg:text-[5.4rem]"
              style={{ lineHeight: 0.98 }}
            >
              {COPY.title}
            </motion.h2>
          </div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="flex items-end lg:col-span-4 lg:justify-end"
          >
            <div className="flex min-w-[240px] items-end gap-5 border-t border-white/12 pt-6 lg:min-w-[270px]">
              <span className="text-5xl font-light tracking-[-0.05em] text-white">05</span>
              <div className="pb-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8FA3B8]">{COPY.works}</div>
                <div className="mt-2 text-xs text-white/42">SARDUN / PORTFOLIO</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.article
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-90px" }}
          className="group relative mt-12 grid overflow-hidden border border-white/14 bg-[#101F31] lg:mt-16 lg:grid-cols-12"
          whileHover={reducedMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative min-h-[360px] overflow-hidden md:min-h-[520px] lg:col-span-8 lg:min-h-[640px]">
            <Image
              src={featured.img}
              alt={featured.title}
              fill
              priority
              sizes="(min-width: 1024px) 67vw, 100vw"
              className="object-cover opacity-90 saturate-[0.85] transition duration-[1100ms] ease-out group-hover:scale-[1.025] group-hover:opacity-100"
              unoptimized
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(5,13,23,0.06), rgba(5,13,23,0.2)), linear-gradient(90deg, transparent 55%, rgba(11,23,38,0.38))" }}
            />
            <div className="absolute left-5 top-5 flex items-center gap-3 border border-white/20 bg-[#0B1726]/72 px-4 py-3 backdrop-blur-md md:left-8 md:top-8">
              <span className="text-xs font-semibold tracking-[0.2em] text-white">01</span>
              <span className="h-px w-7 bg-white/30" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55">05</span>
            </div>
          </div>

          <div className="relative flex flex-col justify-between p-7 md:p-12 lg:col-span-4 lg:p-14">
            <span aria-hidden className="absolute right-0 top-0 h-20 w-px bg-[#B9C2CD]/35" />
            <div>
              <div className="mb-7 text-[10px] font-bold uppercase tracking-[0.28em] text-[#9FB4C8]">{featured.tag}</div>
              <h3 className="text-3xl font-extrabold tracking-[-0.035em] text-white md:text-5xl" style={{ lineHeight: 1.04 }}>
                {featured.title}
              </h3>
              <p className="mt-7 text-sm leading-7 text-white/58 md:text-base md:leading-8">{featured.desc}</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-5 border-t border-white/12 pt-7">
              <ProjectMeta label={COPY.scope} value={featured.scope} />
              <ProjectMeta label={COPY.discipline} value={featured.discipline} />
            </div>
          </div>
        </motion.article>

        <div className="mb-8 mt-20 flex items-end justify-between border-b border-white/12 pb-6 md:mt-28">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8FA3B8]">ARCHIVE / 02-05</div>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white md:text-3xl">{COPY.selection}</h3>
          </div>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35 sm:block">04 / {COPY.works}</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {others.map((project, index) => {
            const wide = index === 0 || index === 3;
            return (
              <motion.article
                key={project.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={reducedMotion ? undefined : { y: -6 }}
                className={
                  "group relative min-h-[430px] overflow-hidden border border-white/14 bg-[#101F31] md:min-h-[520px] " +
                  (wide ? "lg:col-span-7" : "lg:col-span-5")
                }
              >
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                  className="object-cover opacity-78 saturate-[0.8] transition duration-[1000ms] ease-out group-hover:scale-[1.045] group-hover:opacity-95"
                  unoptimized
                />
                <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,13,23,0.08) 15%, rgba(5,13,23,0.3) 48%, rgba(5,13,23,0.98) 100%)" }} />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-7">
                  <span className="border border-white/18 bg-[#0B1726]/65 px-3 py-2 text-[10px] font-semibold tracking-[0.22em] text-white/75 backdrop-blur-md">
                    {String(index + 2).padStart(2, "0")} / 05
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/48">{project.tag}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                  <div className="mb-4 h-px w-10 bg-[#B9C2CD] transition-all duration-500 group-hover:w-20" />
                  <h3 className="max-w-xl text-2xl font-extrabold tracking-[-0.03em] text-white md:text-3xl">{project.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/58 md:text-[15px]">{project.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/12 pt-5">
                    <ProjectMeta label={COPY.scope} value={project.scope} compact />
                    <ProjectMeta label={COPY.discipline} value={project.discipline} compact />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectMeta({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={compact ? "min-w-[120px]" : ""}>
      <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8FA3B8]">{label}</div>
      <div className="mt-2 text-xs font-medium text-white/76 md:text-sm">{value}</div>
    </div>
  );
}

