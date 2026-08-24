"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const chapters = ["Enter", "My5", "NightShelf", "Weekline", "Casa do Cruzeiro", "Petricor", "Férias BV", "Downloads Organizer", "Studio", "Contact"];

function Kicker({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <div className="kicker" style={tone ? { color: tone } : undefined}>{children}</div>;
}

function Chips({ items }: { items: string[] }) {
  return <div className="chips">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

function Phone({ src, alt, className = "", small = false, contain = false }: { src: string; alt: string; className?: string; small?: boolean; contain?: boolean }) {
  return (
    <div className={`phone ${small ? "phone--small" : ""} ${className}`}>
      <div className="phone__screen">
        <Image src={src} alt={alt} fill sizes={small ? "262px" : "292px"} className={contain ? "phone__image phone__image--contain" : "phone__image"} />
      </div>
      <span className="phone__notch" />
      <span className="phone__glass" />
    </div>
  );
}

function Desktop({ src, alt, className = "", violet = false, label }: { src: string; alt: string; className?: string; violet?: boolean; label?: string }) {
  return (
    <div className={`desktop ${violet ? "desktop--violet" : ""} ${className}`}>
      <div className="desktop__bar">
        <span /><span /><span />
        {label ? <b>{label}</b> : <i />}
      </div>
      <div className="desktop__screen"><Image src={src} alt={alt} fill sizes="(max-width: 820px) 85vw, 900px" /></div>
    </div>
  );
}

function ProjectCopy({ number, title, category, description, chips, align = "left", color, href, linkText = "Visit project" }: { number: string; title: string; category: string; description: string; chips: string[]; align?: "left" | "right"; color: string; href?: string; linkText?: string }) {
  return (
    <div className={`project-copy project-copy--${align}`}>
      <Kicker tone={color}>Project {number}</Kicker>
      <h2>{title}</h2>
      <div className="project-copy__category">{category}</div>
      <p>{description}</p>
      <Chips items={chips} />
      {href ? <a className="project-copy__link" href={href} target="_blank" rel="noreferrer" data-magnetic>{linkText} <span>↗</span></a> : null}
    </div>
  );
}

function Atmosphere() {
  return <><div className="grain" /><div className="vignette" /><div className="bottom-falloff" /></>;
}

export function CinematicPortfolio() {
  const rootRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setLoaded(true), reduced ? 30 : 2850);
    const forceDismiss = () => document.visibilityState === "visible" && window.setTimeout(() => setLoaded(true), 300);
    document.addEventListener("visibilitychange", forceDismiss);
    return () => { window.clearTimeout(timer); document.removeEventListener("visibilitychange", forceDismiss); };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const motion = reduced ? 0.3 : 1.4;
    let lenis: Lenis | null = null;
    let raf = 0;

    if (!reduced && !coarse) {
      lenis = new Lenis({ duration: 1.15, wheelMultiplier: 0.9, smoothWheel: true });
      const tick = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      const sceneTimeline = (selector: string) => gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: selector, start: "top top", end: "bottom bottom", scrub: reduced ? 0.15 : 0.8 },
      });

      const hero = sceneTimeline("#hero");
      hero.to(".hero__corridor", { z: 2280 * motion, duration: 1 }, 0)
        .to(".hero__word--1", { z: 520 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .44)
        .to(".hero__word--2", { z: 312 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .49)
        .to(".hero__word--3", { z: 624 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .54)
        .to(".hero__sub", { opacity: 0, y: -150, duration: .32 }, .2)
        .to(".hero__copy > .kicker", { opacity: 0, y: -70, duration: .22 }, .08)
        .to(".hero__cue", { opacity: 0, y: 60, duration: .16 }, .02)
        .to(".hero__floor", { opacity: 0, duration: .32 }, .3);

      gsap.set(".my5__hero", { z: -1450, rotateY: 46, rotateX: 4, opacity: 0, filter: "blur(14px)" });
      gsap.set(".my5__side--a", { x: -120, z: -1450, rotateY: 34, opacity: 0, filter: "blur(11px)" });
      gsap.set(".my5__side--b", { x: 120, z: -1500, rotateY: -34, opacity: 0, filter: "blur(11px)" });
      const my5 = sceneTimeline("#my5");
      my5.to(".my5__hero", { z: -120, rotateY: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", duration: .24, ease: "power2.out" }, .04)
        .to(".my5__hero", { z: 330 * motion, duration: .2 }, .3)
        .to(".my5__hero", { z: -430, rotateY: -12, duration: .22 }, .5)
        .to(".my5__hero", { z: -950, opacity: 0, filter: "blur(10px)", duration: .18 }, .82)
        .to(".my5__side--a", { x: -450 * motion, z: -680, rotateY: 22, opacity: .9, filter: "blur(0px)", duration: .24 }, .38)
        .to(".my5__side--b", { x: 490 * motion, z: -870, rotateY: -22, opacity: .78, filter: "blur(0px)", duration: .24 }, .38)
        .fromTo(".my5__depth", { opacity: 0, x: -60 }, { opacity: 1, x: 0, stagger: .05, duration: .16 }, .44)
        .to(".my5__depth", { opacity: 0, y: -100, stagger: .04, duration: .16 }, .76)
        .to(".my5 .project-copy", { opacity: 0, y: -80, duration: .14 }, .74)
        .to(".my5__line", { scaleX: 1, opacity: 1, duration: .14 }, .86);

      gsap.set(".ns__phone", { z: -950, rotateY: 26, opacity: 0, filter: "blur(12px)" });
      gsap.set(".ns__panel", { z: -1500, opacity: 0 });
      gsap.set(".ns__card", { opacity: 0, z: -220 });
      const ns = sceneTimeline("#nightshelf");
      ns.to(".ns__incoming", { scaleY: 240, opacity: 0, duration: .13 }, .03)
        .to(".ns__panel", { z: -650, opacity: .72, stagger: .035, duration: .28 }, .06)
        .to(".ns__phone", { z: 180 * motion, rotateY: 0, opacity: 1, filter: "blur(0px)", duration: .32 }, .18)
        .to(".ns__card--1", { opacity: 1, x: -340 * motion, y: -220 * motion, z: 120, rotateY: -16, rotateZ: -5, duration: .24 }, .42)
        .to(".ns__card--2", { opacity: 1, x: 390 * motion, y: -25, z: 60, rotateY: 16, rotateZ: 5, duration: .24 }, .42)
        .to(".ns__card--3", { opacity: 1, x: -135, y: 250 * motion, z: -20, rotateY: -8, duration: .24 }, .42)
        .fromTo(".ns__category", { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: .045, duration: .17 }, .5)
        .to(".ns__panel, .ns__card", { z: 1500 * motion, opacity: 0, stagger: .02, duration: .3 }, .6)
        .to(".ns__phone", { z: -700, opacity: 0, filter: "blur(12px)", duration: .2 }, .72)
        .fromTo(".ns__identity", { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .1 }, .8)
        .to(".ns__identity", { opacity: 0, duration: .08 }, .92)
        .to(".ns__line", { scaleX: 1, opacity: 1, duration: .08 }, .92);

      gsap.set(".weekline__phone", { y: 420, z: -420, rotateY: 18, opacity: 0, filter: "blur(10px)" });
      gsap.set(".weekline__desktop", { x: 300, z: -700, rotateY: -20, opacity: 0, filter: "blur(12px)" });
      const week = sceneTimeline("#weekline");
      week.to(".weekline__rail", { scaleX: 1, duration: .25 }, .05)
        .fromTo(".weekline__tick", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: .035, duration: .16 }, .1)
        .fromTo(".weekline__block", { scaleX: 0 }, { scaleX: 1, stagger: .028, duration: .12 }, .2)
        .to(".weekline__phone", { y: 0, z: -20, rotateY: 0, opacity: 1, filter: "blur(0px)", duration: .26 }, .18)
        .to(".weekline__desktop", { x: 0, z: -100, rotateY: 0, opacity: 1, filter: "blur(0px)", duration: .26 }, .26)
        .fromTo(".weekline__float", { opacity: 0, y: 80 }, { opacity: 1, y: 0, stagger: .06, duration: .18 }, .22)
        .to(".weekline__set", { x: `${-26 * motion}vw`, duration: .34 }, .5)
        .to(".weekline__float", { x: -180, y: -100, z: -200, opacity: 0, stagger: .025, duration: .17 }, .78)
        .to(".weekline__phone", { y: -500, opacity: 0, duration: .16 }, .82)
        .to(".weekline__desktop", { z: 160, opacity: 0, duration: .16 }, .8)
        .fromTo(".weekline__close", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .09 }, .84)
        .to(".weekline__close", { opacity: 0, duration: .06 }, .94);

      gsap.set(".casa__screen", { z: -1200, opacity: 0, filter: "blur(14px)" });
      const casa = sceneTimeline("#casa");
      casa.to(".casa__screen--main", { z: -50, rotateY: -4, opacity: 1, filter: "blur(0px)", duration: .3, ease: "power2.out" }, .05)
        .to(".casa__screen--history", { x: -470 * motion, z: -480, rotateY: 18, opacity: .78, filter: "blur(1px)", duration: .26 }, .22)
        .to(".casa__screen--projects", { x: 490 * motion, z: -620, rotateY: -18, opacity: .68, filter: "blur(2px)", duration: .26 }, .28)
        .fromTo(".casa__year", { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: .14 }, .46)
        .to(".casa__screen--main", { z: 330 * motion, scale: 1.06, duration: .2 }, .48)
        .to(".casa__screen", { z: 1250 * motion, opacity: 0, filter: "blur(10px)", stagger: .035, duration: .28 }, .7)
        .to(".casa .project-copy, .casa__year", { opacity: 0, y: -55, duration: .16 }, .79);

      gsap.set(".petricor__screen", { z: -1100, opacity: 0, filter: "blur(13px)" });
      const petricor = sceneTimeline("#petricor");
      petricor.to(".petricor__screen--main", { z: 0, rotateY: 4, opacity: 1, filter: "blur(0px)", duration: .3 }, .05)
        .to(".petricor__screen--craft", { x: 510 * motion, y: 105, z: -430, rotateY: -16, opacity: .78, filter: "blur(1px)", duration: .28 }, .2)
        .fromTo(".petricor__material", { opacity: 0, x: -70 }, { opacity: 1, x: 0, stagger: .05, duration: .16 }, .34)
        .to(".petricor__world", { x: `${-12 * motion}vw`, duration: .34 }, .48)
        .to(".petricor__screen", { y: -190, z: 980 * motion, opacity: 0, filter: "blur(9px)", stagger: .05, duration: .27 }, .71)
        .to(".petricor .project-copy, .petricor__material", { opacity: 0, y: -45, duration: .15 }, .8);

      gsap.set(".ferias__screen", { z: -1250, opacity: 0, filter: "blur(14px)" });
      const ferias = sceneTimeline("#ferias");
      ferias.to(".ferias__screen--calendar", { z: -40, rotateX: 2, opacity: 1, filter: "blur(0px)", duration: .3 }, .05)
        .to(".ferias__screen--dashboard", { x: -500 * motion, z: -520, rotateY: 17, opacity: .78, filter: "blur(1px)", duration: .28 }, .18)
        .to(".ferias__screen--properties", { x: 515 * motion, z: -660, rotateY: -18, opacity: .68, filter: "blur(2px)", duration: .28 }, .24)
        .fromTo(".ferias__metric", { opacity: 0, y: 60, scale: .92 }, { opacity: 1, y: 0, scale: 1, stagger: .055, duration: .17 }, .36)
        .to(".ferias__world", { x: `${-10 * motion}vw`, duration: .32 }, .48)
        .to(".ferias__metric", { opacity: 0, y: -80, stagger: .025, duration: .14 }, .68)
        .to(".ferias__screen", { z: 1200 * motion, opacity: 0, filter: "blur(10px)", stagger: .04, duration: .28 }, .7)
        .to(".ferias .project-copy", { opacity: 0, y: -55, duration: .15 }, .81);

      gsap.set(".downloads__screen", { z: -1200, opacity: 0, filter: "blur(14px)" });
      const downloads = sceneTimeline("#downloads");
      downloads.to(".downloads__screen--popover", { z: -40, rotateY: -3, opacity: 1, filter: "blur(0px)", duration: .3 }, .04)
        .to(".downloads__screen--general", { x: -490 * motion, y: 70, z: -520, rotateY: 18, opacity: .75, filter: "blur(1px)", duration: .27 }, .2)
        .to(".downloads__screen--rules", { x: 500 * motion, y: 105, z: -650, rotateY: -18, opacity: .68, filter: "blur(2px)", duration: .27 }, .26)
        .fromTo(".downloads__badge", { opacity: 0, scale: .6, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: .2, ease: "back.out(1.7)" }, .38)
        .to(".downloads__screen--popover", { z: 300 * motion, duration: .2 }, .48)
        .to(".downloads__screen", { z: 1180 * motion, opacity: 0, filter: "blur(11px)", stagger: .04, duration: .29 }, .7)
        .to(".downloads .project-copy, .downloads__badge", { opacity: 0, y: -50, duration: .16 }, .8);

      const studio = sceneTimeline("#studio");
      studio.fromTo(".studio__kicker", { opacity: 0 }, { opacity: 1, duration: .12 }, .04)
        .fromTo(".studio__reveal > *", { yPercent: 108 }, { yPercent: 0, stagger: .075, duration: .2, ease: "power2.out" }, .1)
        .fromTo(".studio__disciplines", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .16 }, .46)
        .to(".studio__content", { opacity: 0, duration: .14 }, .86);

      const ending = sceneTimeline("#contact");
      ending.fromTo(".contact__reveal > *", { yPercent: 108 }, { yPercent: 0, stagger: .09, duration: .18, ease: "power2.out" }, .06)
        .fromTo(".contact__copy", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .18 }, .2)
        .fromTo(".contact__links", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .18 }, .3)
        .to(".contact__content", { opacity: 0, duration: .23 }, .55)
        .to(".contact__dark", { opacity: .9, duration: .32 }, .6)
        .fromTo(".contact__mark", { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .18 }, .7);

      chapters.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `[data-chapter="${index}"]`,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setChapter(index),
          onEnterBack: () => setChapter(index),
        });
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => root.style.setProperty("--scroll", `${self.progress * 100}%`),
      });
    }, root);

    const stages = Array.from(root.querySelectorAll<HTMLElement>(".stage"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("stage--far", !entry.isIntersecting)), { rootMargin: "18% 0px" });
    stages.forEach((stage) => observer.observe(stage.parentElement ?? stage));

    let pointerRaf = 0;
    let tx = 0, ty = 0, px = 0, py = 0, hx = 0, hy = 0;
    const dot = root.querySelector<HTMLElement>(".cursor-dot");
    const halo = root.querySelector<HTMLElement>(".cursor-halo");
    const onPointer = (event: PointerEvent) => { tx = event.clientX; ty = event.clientY; dot?.style.setProperty("transform", `translate3d(${tx - 3}px,${ty - 3}px,0)`); };
    const pointerTick = () => {
      px += (tx - px) * .055; py += (ty - py) * .055; hx += (tx - hx) * .1; hy += (ty - hy) * .1;
      halo?.style.setProperty("transform", `translate3d(${hx - 140}px,${hy - 140}px,0)`);
      root.style.setProperty("--mouse-x", `${(px / innerWidth - .5) * 2}`);
      root.style.setProperty("--mouse-y", `${(py / innerHeight - .5) * 2}`);
      pointerRaf = requestAnimationFrame(pointerTick);
    };
    if (!coarse && !reduced) { window.addEventListener("pointermove", onPointer); pointerRaf = requestAnimationFrame(pointerTick); }

    const magnetic = Array.from(root.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleaners = magnetic.map((el) => {
      const move = (event: PointerEvent) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * .22}px, ${(event.clientY - r.top - r.height / 2) * .3}px)`; halo?.classList.add("cursor-halo--large"); };
      const leave = () => { el.style.transform = "translate(0,0)"; halo?.classList.remove("cursor-halo--large"); };
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });

    ScrollTrigger.refresh();
    return () => {
      ctx.revert(); observer.disconnect(); lenis?.destroy(); cancelAnimationFrame(raf); cancelAnimationFrame(pointerRaf);
      window.removeEventListener("pointermove", onPointer); cleaners.forEach((clean) => clean());
    };
  }, []);

  return (
    <main ref={rootRef} className="portfolio" id="top">
      <div className={`loader ${loaded ? "loader--done" : ""}`} aria-hidden="true">
        <div className="loader__ring"><span /></div>
        <div className="loader__line" />
        <div className="loader__word">{"QUIT STACK LABS".split("").map((letter, index) => <span key={`${letter}-${index}`} style={{ animationDelay: `${.65 + index * .05}s` }}>{letter === " " ? "\u00a0" : letter}</span>)}</div>
        <div className="loader__sweep" />
      </div>

      <header className="chrome-header">
        <a href="#top" aria-label="Quit Stack Labs" data-magnetic><span className="diamond" />Quit Stack Labs</a>
        <span>Personal product studio</span>
      </header>
      <aside className="progress" aria-hidden="true">
        <div className="progress__track"><i /></div>
        <b>{String(chapter).padStart(2, "0")}</b>
        <span>{chapters[chapter]}</span>
      </aside>
      <div className="cursor-dot" /><div className="cursor-halo" />
      <Atmosphere />

      <section id="hero" className="scene scene--hero" data-chapter="0">
        <div className="stage hero">
          <div className="hero__fog" />
          <div className="hero__floor" />
          <div className="hero__corridor">
            {Array.from({ length: 12 }, (_, i) => <div className={`corridor-frame corridor-frame--${i % 4}`} style={{ transform: `translate3d(-50%,-50%,${-2400 + i * 240}px)` }} key={i} />)}
          </div>
          <div className="dust">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${8 + (i * 17) % 86}%`, top: `${8 + (i * 23) % 78}%`, animationDelay: `${-i * 1.7}s` }} />)}</div>
          <div className="hero__copy">
            <Kicker>Independent product practice</Kicker>
            <h1><span className="hero__word hero__word--1">Quit</span><span className="hero__word hero__word--2">Stack</span><span className="hero__word hero__word--3">Labs</span></h1>
            <p className="hero__sub">Useful software for quieter, more intentional lives.<br /><span>Independent product practice by José Queiroz.</span></p>
          </div>
          <div className="hero__cue">Scroll to enter<i /></div>
        </div>
      </section>

      <section id="my5" className="scene scene--my5 my5" data-chapter="1">
        <div className="stage">
          <div className="scene-glow scene-glow--plum" /><div className="rim-disc" />
          <ProjectCopy number="01" title="My5" category="Private emotional network" description="A private emotional network for up to five trusted adults. Share one feeling with your circle or reach one person directly; they can answer with a bounded voice note, image, or short video — no public profiles, feed, followers, popularity metrics, or emotional-data advertising." chips={["Expo mobile", "Privacy architecture", "Supabase", "Media lifecycle"]} color="#7A4DFF" />
          <div className="device-world my5__world">
            <Phone src="/work/my5-2.png" alt="My5 circle screen" className="my5__side my5__side--a" small contain />
            <Phone src="/work/my5-live.jpg" alt="My5 circle and emotional check-in" className="my5__hero" />
            <Phone src="/work/my5-3.png" alt="My5 check-in screen" className="my5__side my5__side--b" small contain />
          </div>
          <span className="depth-word my5__depth depth-word--a">private</span><span className="depth-word my5__depth depth-word--b">trusted</span><span className="depth-word my5__depth depth-word--c">quiet</span>
          <div className="transition-line my5__line" />
        </div>
      </section>

      <section id="nightshelf" className="scene scene--night ns" data-chapter="2">
        <div className="stage">
          <div className="scene-glow scene-glow--magenta" /><div className="ns__incoming" />
          <ProjectCopy number="02" title="NightShelf" category="A personal media library" description="One quiet shelf for films, series, anime, and books. NightShelf combines discovery, a personal queue, progress tracking, and a record of what mattered — designed around the person collecting, not an algorithm competing for attention." chips={["Product strategy", "Cross-media library", "Mobile-first UI", "Identity"]} align="right" color="#D48CFF" />
          <div className="device-world ns__world">
            {[5,6,7,8,2].map((n,i)=><Image width={1170} height={2532} className={`ns__panel ns__panel--${i}`} src={`/work/ns-${n}.png`} alt="" key={`${n}-${i}`} />)}
            <Phone src="/work/ns-1.png" alt="NightShelf library" className="ns__phone" />
            {[2,3,4].map((n,i)=><Image width={1170} height={2532} className={`ns__card ns__card--${i+1}`} src={`/work/ns-${n}.png`} alt={`NightShelf interface ${i+1}`} key={n} />)}
          </div>
          <div className="ns__categories"><span className="ns__category">Anime</span><span className="ns__category">Film</span><span className="ns__category">Series</span><span className="ns__category">Books</span></div>
          <div className="ns__identity"><b>NightShelf</b><span>Discover. Queue. Track.</span></div>
          <div className="transition-line ns__line" />
        </div>
      </section>

      <section id="weekline" className="scene scene--week weekline" data-chapter="3">
        <div className="stage">
          <ProjectCopy number="03" title="Weekline" category="Focus and work journal" description="A work journal built around the week rather than an endless task list. It connects daily focus, project notes, time, and shipped outcomes so progress is visible while the work is happening — and useful when it is time to reflect." chips={["Product design", "Weekly analytics", "Next.js", "Workflow systems"]} align="right" color="#9BC4FF" />
          <div className="weekline__set">
            <div className="weekline__rail" />
            <div className="weekline__timeline">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i)=><div className="weekline__tick" style={{ left:`${8+i*14}%` }} key={day}><span>{day}</span><i className="weekline__block" /><i className="weekline__block weekline__block--two" /></div>)}
            </div>
            <Phone src="/work/weekline-login.webp" alt="Weekline mobile experience" className="weekline__phone" contain />
            <Desktop src="/work/weekline-welcome.webp" alt="Weekline desktop experience" className="weekline__desktop" />
            <div className="weekline__float weekline__chart"><span>Week 34</span>{[46,70,58,91,76,34,21].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div>
            <div className="weekline__float weekline__project"><span>Focus</span><b>Portfolio motion system</b><em>03:42:18</em></div>
            <div className="weekline__float weekline__shipped"><span>Shipped</span><b>3</b><em>this week</em></div>
          </div>
          <div className="weekline__close">Know exactly what you shipped this week.</div>
        </div>
      </section>

      <section id="casa" className="scene scene--casa showcase casa" data-chapter="4">
        <div className="stage">
          <div className="showcase__glow showcase__glow--casa" />
          <ProjectCopy number="04" title="Casa do Cruzeiro" category="A digital home for living heritage" description="A bilingual editorial and hospitality website for the Casa de Nossa Senhora da Piedade in Ponte de Lima. It brings together five centuries of family history, classified architecture, accommodation, a living archive, and ongoing preservation projects without reducing the place to a booking page." chips={["Bilingual experience", "Storyblok CMS", "Editorial design", "Next.js"]} color="#C9B58A" href="https://www.casadapiedade.pt" linkText="Visit Casa do Cruzeiro" />
          <div className="showcase__world casa__world">
            <Desktop src="/work/casa-cruzeiro-history.jpg" alt="Casa do Cruzeiro history page" className="showcase__screen casa__screen casa__screen--history" label="History · 1524 → today" />
            <Desktop src="/work/casa-cruzeiro-home.jpg" alt="Casa do Cruzeiro website home page" className="showcase__screen showcase__screen--main casa__screen casa__screen--main" label="casadapiedade.pt" />
            <Desktop src="/work/casa-cruzeiro-projects.jpg" alt="Casa do Cruzeiro archive and digitisation project" className="showcase__screen casa__screen casa__screen--projects" label="Archive · transcription · digitisation" />
          </div>
          <div className="casa__year"><b>1524</b><span>A place with a memory longer than the interface.</span></div>
        </div>
      </section>

      <section id="petricor" className="scene scene--petricor showcase petricor" data-chapter="5">
        <div className="stage">
          <div className="showcase__glow showcase__glow--petricor" />
          <ProjectCopy number="05" title="Petricor" category="Handcrafted woodwork portfolio" description="An image-led portfolio for a woodworking practice where material, joinery, and process carry more weight than sales chrome. The site gives custom furniture and functional objects room to breathe, while a structured work catalogue makes projects easy to explore and maintain." chips={["Brand direction", "Art direction", "Responsive web", "Next.js"]} color="#D6A45D" href="https://petricor.pt" linkText="Visit Petricor" />
          <div className="showcase__world petricor__world">
            <Desktop src="/work/petricor-site.webp" alt="Petricor woodworking portfolio" className="showcase__screen showcase__screen--main petricor__screen petricor__screen--main" label="petricor.pt" />
            <Desktop src="/work/petricor-craft.webp" alt="Petricor project and craft detail" className="showcase__screen petricor__screen petricor__screen--craft" label="Material · process · object" />
          </div>
          <div className="petricor__materials"><span className="petricor__material">wood</span><span className="petricor__material">grain</span><span className="petricor__material">joinery</span></div>
        </div>
      </section>

      <section id="ferias" className="scene scene--ferias showcase ferias" data-chapter="6">
        <div className="stage">
          <div className="showcase__glow showcase__glow--ferias" />
          <ProjectCopy number="06" title="Férias BV" category="Property operations in one view" description="A full property-management workspace for the daily reality behind short stays: occupancy, revenue, costs, arrivals, departures, guests, and multiple properties. A lane-packed calendar keeps overlapping bookings legible, while live pricing, status, and notes stay close to each reservation." chips={["Product design", "Next.js", "Supabase", "Secure multi-property data"]} align="right" color="#79E0C0" href="https://feriasbv.com" linkText="Visit Férias BV" />
          <div className="showcase__world ferias__world">
            <Desktop src="/work/ferias-dashboard-current.jpg" alt="Férias BV operating dashboard" className="showcase__screen ferias__screen ferias__screen--dashboard" label="Dashboard · arrivals · financials" />
            <Desktop src="/work/ferias-calendar-current.jpg" alt="Férias BV visual booking calendar" className="showcase__screen showcase__screen--main ferias__screen ferias__screen--calendar" label="Monthly booking calendar" />
            <Desktop src="/work/ferias-properties-current.jpg" alt="Férias BV property and rate management" className="showcase__screen ferias__screen ferias__screen--properties" label="Properties · rates · costs" />
          </div>
          <div className="ferias__metrics"><span className="ferias__metric"><b>3</b> calendar views</span><span className="ferias__metric"><b>5</b> booking states</span><span className="ferias__metric"><b>1</b> operating picture</span></div>
        </div>
      </section>

      <section id="downloads" className="scene scene--downloads showcase downloads" data-chapter="7">
        <div className="stage">
          <div className="showcase__glow showcase__glow--downloads" />
          <ProjectCopy number="07" title="Downloads Organizer" category="Native macOS automation you can trust" description="A menu-bar utility that watches local folders and applies ordered rules to rename and move finished downloads. It starts in dry-run, ignores incomplete files, records every real action, and makes it undoable — with multi-folder support, reusable presets, rule previews, and local-only processing." chips={["SwiftUI", "SwiftData", "FSEvents", "Safety-first automation"]} color="#79B8FF" />
          <div className="showcase__world downloads__world">
            <Desktop src="/work/downloads-general.jpg" alt="Downloads Organizer general settings" className="showcase__screen downloads__screen downloads__screen--general" label="General · local file processing" />
            <Desktop src="/work/downloads-popover.jpg" alt="Downloads Organizer menu-bar utility" className="showcase__screen showcase__screen--main downloads__screen downloads__screen--popover" label="Downloads Organizer · live" />
            <Desktop src="/work/downloads-rules.jpg" alt="Downloads Organizer rules and preset packs" className="showcase__screen downloads__screen downloads__screen--rules" label="Rules · previews · presets" />
          </div>
          <div className="downloads__badge"><Image src="/work/downloads-organizer-icon.webp" alt="Downloads Organizer app icon" width={112} height={112} /><span>Local files.<br />Reversible actions.</span></div>
        </div>
      </section>

      <section id="studio" className="scene scene--studio studio" data-chapter="8">
        <div className="stage"><div className="studio__light" />
          <div className="studio__content"><Kicker><span className="studio__kicker">The studio</span></Kicker>
            <div className="studio__reveal"><div><h2>A studio name for one person</h2></div><div><h2>who likes making the whole thing.</h2></div><div className="studio__paragraph"><p>Quit Stack Labs is José Queiroz’s independent product practice — a place for turning stubborn problems into thoughtful, useful software.</p></div><div className="studio__paragraph"><p>I work across strategy, systems, interface, interaction, and engineering. The interesting part is rarely one layer. It is how all of them meet.</p></div></div>
            <div className="studio__disciplines">{["Product strategy","Interface design","Interaction","Mobile","Web","Systems","Engineering","Automation"].map(x=><span key={x}>{x}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="contact" className="scene scene--contact contact" data-chapter="9">
        <div className="stage"><div className="contact__points">{Array.from({length:7},(_,i)=><i key={i} style={{left:`${12+(i*19)%78}%`,top:`${14+(i*29)%70}%`}} />)}</div>
          <div className="contact__content"><Kicker>Contact</Kicker><div className="contact__reveal"><div><h2>Have a problem worth</h2></div><div><h2>getting close to?</h2></div></div><p className="contact__copy">I’m interested in thoughtful products, unusual systems, and ideas that deserve a clearer shape.</p>
            <div className="contact__links"><a href="mailto:zemqueiroz@gmail.com" data-magnetic><span>01</span>Email<i>↗</i></a><a href="https://github.com/josequeiroz" target="_blank" rel="noreferrer" data-magnetic><span>02</span>GitHub<i>↗</i></a><a href="https://www.linkedin.com/in/josequeiroz/" target="_blank" rel="noreferrer" data-magnetic><span>03</span>LinkedIn<i>↗</i></a></div>
          </div>
          <div className="contact__dark" /><div className="contact__mark"><span className="diamond" /><b>Quit Stack Labs</b><small>Personal work by José Queiroz</small></div>
        </div>
      </section>
    </main>
  );
}
