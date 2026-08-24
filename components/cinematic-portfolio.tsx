"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const chapters = ["Enter", "My5", "NightShelf", "Weekline", "Z Kairos", "Orbit", "Studio", "Contact"];

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

function ProjectCopy({ number, title, category, description, chips, align = "left", color }: { number: string; title: string; category: string; description: string; chips: string[]; align?: "left" | "right"; color: string }) {
  return (
    <div className={`project-copy project-copy--${align}`}>
      <Kicker tone={color}>Project {number}</Kicker>
      <h2>{title}</h2>
      <div className="project-copy__category">{category}</div>
      <p>{description}</p>
      <Chips items={chips} />
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

      gsap.set(".zk__dashboard", { z: -860, rotateX: 10, rotateY: -14, opacity: 0, filter: "blur(14px)" });
      gsap.set(".zk__pass", { z: -400, x: -180, y: 120, rotateY: 22, opacity: 0 });
      const zk = sceneTimeline("#zkairos");
      zk.fromTo(".zk__node", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, stagger: .022, duration: .14 }, .02)
        .fromTo(".zk__edge", { scaleX: 0 }, { scaleX: 1, stagger: .03, duration: .18 }, .08)
        .fromTo(".zk__note", { opacity: 0, y: 35 }, { opacity: 1, y: 0, stagger: .05, duration: .17 }, .12)
        .to(".zk__dashboard", { z: 90, rotateX: 0, rotateY: 0, opacity: 1, filter: "blur(0px)", duration: .32 }, .3)
        .to(".zk__note", { z: 1500 * motion, opacity: 0, stagger: .04, duration: .3 }, .46)
        .to(".zk__pass", { z: 1100 * motion, x: 120, y: -140, rotateY: -8, opacity: 1, duration: .22 }, .58)
        .to(".zk__pass", { opacity: 0, duration: .06 }, .76)
        .to(".zk__dashboard", { z: -1500, opacity: 0, duration: .22 }, .78)
        .to(".zk__node", { scale: 1.5, x: (i) => ((i % 4) - 1.5) * 90 * motion, y: (i) => (Math.floor(i / 4) - 1) * 70 * motion, stagger: .01, duration: .22 }, .78)
        .to(".zk__edge", { opacity: .3, duration: .18 }, .78);

      gsap.set(".orbit-card", { z: -1000, opacity: 0, filter: "blur(12px)" });
      const orbit = sceneTimeline("#orbit");
      orbit.to(".orbit-card", { z: 0, opacity: 1, filter: "blur(0px)", stagger: .06, duration: .28 }, .06)
        .to(".orbit__track", { x: `${-42 * motion}vw`, duration: .48 }, .32)
        .to(".orbit-card", { z: 900 * motion, opacity: 0, rotateY: (i) => i % 2 ? -10 : 10, stagger: .035, duration: .25 }, .68)
        .fromTo(".orbit__closing", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .12 }, .82)
        .to(".orbit__closing", { opacity: 0, duration: .08 }, .93);

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
          <ProjectCopy number="01" title="My5" category="Private emotional network" description="A private place for the five people who matter most — built around honest check-ins, emotional safety, and conversation without performance." chips={["Product design", "Mobile", "Privacy", "Full-stack engineering"]} color="#7A4DFF" />
          <div className="device-world my5__world">
            <Phone src="/work/my5-2.png" alt="My5 circle screen" className="my5__side my5__side--a" small contain />
            <Phone src="/work/my5-1.png" alt="My5 emotional network" className="my5__hero" contain />
            <Phone src="/work/my5-3.png" alt="My5 check-in screen" className="my5__side my5__side--b" small contain />
          </div>
          <span className="depth-word my5__depth depth-word--a">private</span><span className="depth-word my5__depth depth-word--b">trusted</span><span className="depth-word my5__depth depth-word--c">quiet</span>
          <div className="transition-line my5__line" />
        </div>
      </section>

      <section id="nightshelf" className="scene scene--night ns" data-chapter="2">
        <div className="stage">
          <div className="scene-glow scene-glow--magenta" /><div className="ns__incoming" />
          <ProjectCopy number="02" title="NightShelf" category="Personal media library" description="A nocturnal home for everything you want to watch, read, and remember — discovery and tracking without the streaming-service noise." chips={["Product strategy", "Web application", "Mobile", "Identity"]} align="right" color="#D48CFF" />
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
          <ProjectCopy number="03" title="Weekline" category="Focus and work journal" description="A weekly view that turns scattered work into visible momentum — priorities, notes, shipped work, and reflection in one calm system." chips={["Product design", "Analytics", "Next.js", "Workflow systems"]} align="right" color="#9BC4FF" />
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

      <section id="zkairos" className="scene scene--zk zk" data-chapter="4">
        <div className="stage">
          <ProjectCopy number="04 · Ongoing" title="Z Kairos" category="Personal operating system" description="A living operating system for tasks, routines, finances, reviews, and knowledge — designed to make the whole of life easier to see." chips={["Systems design", "Obsidian", "Automation", "Knowledge management"]} color="#B9A8FF" />
          <div className="zk__network">
            {Array.from({length:12},(_,i)=><i className="zk__node" key={i} style={{left:`${12+(i*31)%78}%`,top:`${12+(i*47)%74}%`}} />)}
            {[24,-32,52,-14,-46,78].map((r,i)=><i className="zk__edge" key={r} style={{left:`${18+i*11}%`,top:`${22+(i*13)%56}%`,transform:`rotate(${r}deg)`}} />)}
          </div>
          <div className="device-world zk__world">
            <Desktop src="/work/zkairos-dashboard.webp" alt="Z Kairos dashboard" className="zk__dashboard" violet label="Z Kairos" />
            <div className="zk__pass"><Image src="/work/zkairos-dashboard.webp" alt="Z Kairos system view" fill sizes="520px" /><span>Weekly review / 34</span></div>
            {["Routines","Finances","Weekly review","Tasks"].map((x,i)=><div className={`zk__note zk__note--${i}`} key={x}><span>0{i+1}</span><b>{x}</b><i /></div>)}
          </div>
        </div>
      </section>

      <section id="orbit" className="scene scene--orbit orbit" data-chapter="5">
        <div className="stage">
          <div className="orbit__intro"><Kicker>Selected satellites</Kicker><h2>Other things<br /><span>in orbit.</span></h2><p>Websites, utilities, and operational systems — each made close to the problem.</p></div>
          <div className="orbit__track">
            <article className="orbit-card orbit-card--0"><Desktop src="/work/downloads-organizer.webp" alt="macOS Downloads Organizer" label="Downloads Organizer" /><div><span>macOS utility · 2026</span><h3>Downloads Organizer</h3><p>A native-feeling tool that quietly keeps a busy Downloads folder under control.</p></div></article>
            <article className="orbit-card orbit-card--1"><Desktop src="/work/petricor-site.webp" alt="Petricor website" label="petricor.pt" /><div><span>Commerce · Craft</span><h3>Petricor</h3><p>A tactile digital storefront for hand-made pieces, designed around material and process.</p><a href="https://petricor.pt" target="_blank" rel="noreferrer" data-magnetic>Visit site ↗</a></div></article>
            <article className="orbit-card orbit-card--2"><Desktop src="/work/casa-piedade-site.webp" alt="Casa de Nossa Senhora da Piedade website" label="casadapiedade.pt" /><div><span>Hospitality · Editorial</span><h3>Casa da Piedade</h3><p>A calm, image-led home for a historic place in the Azores.</p><a href="https://www.casadapiedade.pt" target="_blank" rel="noreferrer" data-magnetic>Visit site ↗</a></div></article>
            <article className="orbit-card orbit-card--3"><Desktop src="/work/ferias-dashboard.webp" alt="Property management system" label="Property operations" /><div><span>Operations · Full stack</span><h3>Property Management</h3><p>Bookings, calendars, arrivals, and daily operations brought into one clear view.</p><a href="https://feriasbv.com" target="_blank" rel="noreferrer" data-magnetic>Visit site ↗</a></div></article>
          </div>
          <div className="orbit__closing">Different scales. The same care.</div>
        </div>
      </section>

      <section id="studio" className="scene scene--studio studio" data-chapter="6">
        <div className="stage"><div className="studio__light" />
          <div className="studio__content"><Kicker><span className="studio__kicker">The studio</span></Kicker>
            <div className="studio__reveal"><div><h2>A studio name for one person</h2></div><div><h2>who likes making the whole thing.</h2></div><div className="studio__paragraph"><p>Quit Stack Labs is José Queiroz’s independent product practice — a place for turning stubborn problems into thoughtful, useful software.</p></div><div className="studio__paragraph"><p>I work across strategy, systems, interface, interaction, and engineering. The interesting part is rarely one layer. It is how all of them meet.</p></div></div>
            <div className="studio__disciplines">{["Product strategy","Interface design","Interaction","Mobile","Web","Systems","Engineering","Automation"].map(x=><span key={x}>{x}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="contact" className="scene scene--contact contact" data-chapter="7">
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
