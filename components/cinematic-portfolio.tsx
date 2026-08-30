"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const chapters = ["Enter", "Casa da Piedade", "Petricor", "NightShelf", "Weekline", "Férias BV", "Downloads Organizer", "My5", "Studio", "Contact"];
const projectLinks = [
  { chapter: 1, id: "casa", label: "Casa da Piedade" },
  { chapter: 2, id: "petricor", label: "Petricor" },
  { chapter: 3, id: "nightshelf", label: "NightShelf" },
  { chapter: 4, id: "weekline", label: "Weekline" },
  { chapter: 5, id: "ferias", label: "Férias BV" },
  { chapter: 6, id: "downloads", label: "Downloads Organizer" },
  { chapter: 7, id: "my5", label: "My5" },
];

function Kicker({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <div className="kicker" style={tone ? { color: tone } : undefined}>{children}</div>;
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

function PortraitScreen({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <figure className={`portrait-screen ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 600px) 44vw, 360px" /></figure>;
}

function FloatingPhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <figure className={`floating-photo ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 820px) 38vw, 320px" /></figure>;
}

function MotionField() {
  return <div className="motion-field" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>;
}

function ProjectCopy({ number, title, category, description, contribution, decision, align = "left", color, href, linkText = "Visit project" }: { number: string; title: string; category: string; description: string; contribution: string; decision: string; align?: "left" | "right"; color: string; href?: string; linkText?: string }) {
  const external = href?.startsWith("http");
  return (
    <div className={`project-copy project-copy--${align}`}>
      <Kicker tone={color}>Project {number}</Kicker>
      <h2>{title}</h2>
      <div className="project-copy__category">{category}</div>
      <p>{description}</p>
      <dl className="project-copy__details">
        <div><dt>My role</dt><dd>{contribution}</dd></div>
        <div><dt>Defining decision</dt><dd>{decision}</dd></div>
      </dl>
      {href ? <a className="project-copy__link" href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} data-magnetic>{linkText} <span>↗</span></a> : null}
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
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const timer = window.setTimeout(() => setLoaded(true), reduced ? 30 : coarse ? 1700 : 2850);
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
    const motion = reduced ? 0.24 : coarse ? 0.72 : 1.4;
    root.dataset.motion = reduced ? "reduced" : coarse ? "compact" : "full";
    let lenis: Lenis | null = null;
    let lenisTick: ((time: number) => void) | null = null;

    if (!reduced && !coarse) {
      lenis = new Lenis({ lerp: .14, wheelMultiplier: 1, smoothWheel: true, syncTouch: true, touchMultiplier: 1.05, overscroll: false });
      lenisTick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      const sceneTimeline = (selector: string) => gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: { trigger: selector, start: "top top", end: "bottom bottom", scrub: reduced ? false : coarse ? 0.35 : true, invalidateOnRefresh: true },
      });

      const hero = sceneTimeline("#hero");
      hero.to(".hero__corridor", { z: 2280 * motion, duration: 1 }, 0)
        .to(".hero__brand-lockup", { z: 460 * motion, y: -54, scale: 1.14, opacity: 0, filter: "brightness(2.15) saturate(1.1) blur(10px)", duration: .34 }, .04)
        .to(".hero__word--1", { z: 520 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .44)
        .to(".hero__word--2", { z: 312 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .49)
        .to(".hero__word--3", { z: 624 * motion, y: -80, opacity: 0, filter: "blur(18px)", duration: .46 }, .54)
        .to(".hero__sub", { opacity: 0, y: -150, duration: .32 }, .2)
        .to(".hero__copy > .kicker", { opacity: 0, y: -70, duration: .22 }, .08)
        .to(".hero__cue", { opacity: 0, y: 60, duration: .16 }, .02)
        .to(".hero__floor", { opacity: 0, duration: .32 }, .3);

      gsap.set(".my5__hero", { z: -1450, rotateY: 46, rotateX: 4, opacity: 0 });
      gsap.set(".my5__side--a", { x: -120, z: -1450, rotateY: 34, opacity: 0 });
      gsap.set(".my5__side--b", { x: 120, z: -1500, rotateY: -34, opacity: 0 });
      const my5 = sceneTimeline("#my5");
      my5.to(".my5__hero", { z: -120, rotateY: 0, rotateX: 0, opacity: 1, duration: .24, ease: "power2.out" }, .04)
        .to(".my5__hero", { z: 330 * motion, duration: .2 }, .3)
        .to(".my5__hero", { z: -430, rotateY: -12, duration: .22 }, .5)
        .to(".my5__hero", { z: -950, opacity: 0, duration: .18 }, .82)
        .to(".my5__side--a", { x: -450 * motion, z: -680, rotateY: 22, opacity: .9, duration: .24 }, .38)
        .to(".my5__side--b", { x: 490 * motion, z: -870, rotateY: -22, opacity: .78, duration: .24 }, .38)
        .fromTo(".my5__depth", { opacity: 0, x: -60 }, { opacity: 1, x: 0, stagger: .05, duration: .16 }, .44)
        .to(".my5__depth", { opacity: 0, y: -100, stagger: .04, duration: .16 }, .76)
        .to(".my5 .project-copy", { opacity: 0, y: -80, duration: .14 }, .74)
        .to(".my5__line", { scaleX: 1, opacity: 1, duration: .14 }, .86);

      gsap.set(".ns__phone", { z: -950, rotateY: 26, opacity: 0 });
      gsap.set(".ns__panel", { z: -1500, opacity: 0 });
      gsap.set(".ns__card", { opacity: 0, z: -220 });
      const ns = sceneTimeline("#nightshelf");
      ns.to(".ns__incoming", { scaleY: 240, opacity: 0, duration: .13 }, .03)
        .to(".ns__panel", { z: -650, opacity: .72, stagger: .035, duration: .28 }, .06)
        .to(".ns__phone", { z: 180 * motion, rotateY: 0, opacity: 1, duration: .32 }, .18)
        .to(".ns__card--1", { opacity: 1, x: -340 * motion, y: -220 * motion, z: 120, rotateY: -16, rotateZ: -5, duration: .24 }, .42)
        .to(".ns__card--2", { opacity: 1, x: 390 * motion, y: -25, z: 60, rotateY: 16, rotateZ: 5, duration: .24 }, .42)
        .to(".ns__card--3", { opacity: 1, x: -135, y: 250 * motion, z: -20, rotateY: -8, duration: .24 }, .42)
        .fromTo(".ns__category", { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: .045, duration: .17 }, .5)
        .to(".ns__panel, .ns__card", { z: 1500 * motion, opacity: 0, stagger: .02, duration: .3 }, .6)
        .to(".ns__phone", { z: -700, opacity: 0, duration: .2 }, .72)
        .fromTo(".ns__identity", { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .1 }, .8)
        .to(".ns__identity", { opacity: 0, duration: .08 }, .92)
        .to(".ns__line", { scaleX: 1, opacity: 1, duration: .08 }, .92);

      gsap.set(".weekline__screen", { z: -1300, opacity: 0 });
      const week = sceneTimeline("#weekline");
      week.to(".weekline__rail", { scaleX: 1, duration: .25 }, .05)
        .fromTo(".weekline__tick", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: .035, duration: .16 }, .1)
        .fromTo(".weekline__block", { scaleX: 0 }, { scaleX: 1, stagger: .028, duration: .12 }, .2)
        .to(".weekline__screen--focus", { z: 80, rotateY: 0, opacity: 1, duration: .28, ease: "power2.out" }, .14)
        .to(".weekline__screen--report", { x: -410 * motion, y: -65, z: -360, rotateY: 18, opacity: .82, duration: .27 }, .24)
        .to(".weekline__screen--export", { x: 415 * motion, y: 45, z: -430, rotateY: -18, opacity: .76, duration: .27 }, .28)
        .to(".weekline__screen--projects", { x: -690 * motion, y: 115, z: -760, rotateY: 24, opacity: .52, duration: .25 }, .34)
        .to(".weekline__screen--motion", { x: 690 * motion, y: -120, z: -820, rotateY: -24, opacity: .46, duration: .25 }, .37)
        .to(".weekline__screen--themes", { x: 120, y: -310, z: -720, rotateX: -9, opacity: .44, duration: .25 }, .4)
        .to(".weekline__gallery", { x: `${-10 * motion}vw`, rotateY: -4, duration: .3 }, .5)
        .to(".weekline__screen--focus", { z: 380 * motion, scale: 1.05, duration: .18 }, .58)
        .to(".weekline__screen", { y: -240, z: 1250 * motion, opacity: 0, stagger: { amount: .04 }, duration: .18 }, .78)
        .fromTo(".weekline__close", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .08 }, .88)
        .to(".weekline__close", { opacity: 0, duration: .04 }, .96);

      gsap.set(".casa__screen", { z: -1200, opacity: 0 });
      gsap.set(".casa__photo", { z: -900, opacity: 0 });
      const casa = sceneTimeline("#casa");
      casa.to(".casa .motion-field", { rotate: 105, scale: 1.22, opacity: .72, duration: 1 }, 0)
        .fromTo(".casa .motion-field i", { y: 90, opacity: 0 }, { y: -80, opacity: .7, stagger: .035, duration: .55 }, .1)
        .to(".casa__screen--main", { z: -50, rotateY: -4, opacity: 1, duration: .22, ease: "power2.out" }, 0)
        .to(".casa__screen--history", { x: -470 * motion, z: -480, rotateY: 18, opacity: .78, duration: .26 }, .22)
        .to(".casa__screen--projects", { x: 490 * motion, z: -620, rotateY: -18, opacity: .68, duration: .26 }, .28)
        .to(".casa__photo--property", { x: -570 * motion, y: 210, z: -320, rotateZ: -7, opacity: .86, duration: .22 }, .34)
        .to(".casa__photo--pool", { x: 590 * motion, y: -215, z: -500, rotateZ: 8, opacity: .76, duration: .22 }, .38)
        .to(".casa__photo--heritage", { x: 430 * motion, y: 245, z: -700, rotateZ: -5, opacity: .62, duration: .22 }, .41)
        .fromTo(".casa__year", { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: .14 }, .46)
        .to(".casa__screen--main", { z: 330 * motion, scale: 1.06, duration: .2 }, .48)
        .to(".casa__world", { x: `${-7 * motion}vw`, y: `${-3 * motion}vh`, rotateY: -4, duration: .36 }, .5)
        .to(".casa__screen, .casa__photo", { z: 1250 * motion, opacity: 0, stagger: { amount: .04 }, duration: .18 }, .78)
        .to(".casa .project-copy, .casa__year", { opacity: 0, y: -55, duration: .14 }, .86);

      gsap.set(".petricor__screen", { z: -1100, opacity: 0 });
      gsap.set(".petricor__photo", { z: -1000, opacity: 0 });
      const petricor = sceneTimeline("#petricor");
      petricor.to(".petricor .motion-field", { rotate: -120, scale: 1.3, opacity: .7, duration: 1 }, 0)
        .fromTo(".petricor .motion-field i", { x: -90, opacity: 0 }, { x: 100, opacity: .65, stagger: .034, duration: .58 }, .08)
        .to(".petricor__screen--main", { z: 0, rotateY: 4, opacity: 1, duration: .22 }, 0)
        .to(".petricor__screen--craft", { x: 510 * motion, y: 105, z: -430, rotateY: -16, opacity: .78, duration: .28 }, .2)
        .to(".petricor__photo--table", { x: -575 * motion, y: -190, z: -470, rotateZ: -8, opacity: .82, duration: .23 }, .25)
        .to(".petricor__photo--joinery", { x: -490 * motion, y: 230, z: -620, rotateZ: 7, opacity: .68, duration: .23 }, .3)
        .to(".petricor__photo--chair", { x: 600 * motion, y: -225, z: -720, rotateZ: -6, opacity: .6, duration: .23 }, .34)
        .fromTo(".petricor__material", { opacity: 0, x: -70 }, { opacity: 1, x: 0, stagger: .05, duration: .16 }, .34)
        .to(".petricor__world", { x: `${-12 * motion}vw`, y: `${2 * motion}vh`, rotateY: 4, duration: .4 }, .48)
        .to(".petricor__screen, .petricor__photo", { y: -190, z: 980 * motion, opacity: 0, stagger: { amount: .04 }, duration: .18 }, .78)
        .to(".petricor .project-copy, .petricor__material", { opacity: 0, y: -45, duration: .14 }, .86);

      gsap.set(".ferias__screen", { z: -1250, opacity: 0 });
      const ferias = sceneTimeline("#ferias");
      ferias.to(".ferias .motion-field", { rotate: 140, scale: 1.28, opacity: .68, duration: 1 }, 0)
        .fromTo(".ferias .motion-field i", { scale: .2, opacity: 0 }, { scale: 1.4, opacity: .62, stagger: .032, duration: .54 }, .1)
        .to(".ferias__screen--calendar", { z: -40, rotateX: 2, opacity: 1, duration: .22 }, 0)
        .to(".ferias__screen--dashboard", { x: -500 * motion, z: -520, rotateY: 17, opacity: .78, duration: .28 }, .18)
        .to(".ferias__screen--properties", { x: 515 * motion, z: -660, rotateY: -18, opacity: .68, duration: .28 }, .24)
        .to(".ferias__screen--year", { x: -360 * motion, y: -285, z: -760, rotateX: -8, opacity: .52, duration: .25 }, .3)
        .to(".ferias__screen--guests", { x: 390 * motion, y: 285, z: -820, rotateX: 8, opacity: .48, duration: .25 }, .34)
        .fromTo(".ferias__metric", { opacity: 0, y: 60, scale: .92 }, { opacity: 1, y: 0, scale: 1, stagger: .055, duration: .17 }, .36)
        .to(".ferias__world", { x: `${-10 * motion}vw`, y: `${-3 * motion}vh`, rotateY: -3, duration: .4 }, .48)
        .to(".ferias__metric", { opacity: 0, y: -80, stagger: .02, duration: .12 }, .76)
        .to(".ferias__screen", { z: 1200 * motion, opacity: 0, stagger: { amount: .04 }, duration: .18 }, .78)
        .to(".ferias .project-copy", { opacity: 0, y: -55, duration: .14 }, .86);

      gsap.set(".downloads__screen", { z: -1200, opacity: 0 });
      const downloads = sceneTimeline("#downloads");
      downloads.to(".downloads .motion-field", { rotate: -155, scale: 1.35, opacity: .75, duration: 1 }, 0)
        .fromTo(".downloads .motion-field i", { y: -100, opacity: 0 }, { y: 120, opacity: .72, stagger: .034, duration: .58 }, .08)
        .to(".downloads__screen--popover", { z: -40, rotateY: -3, opacity: 1, duration: .22 }, 0)
        .to(".downloads__screen--general", { x: -490 * motion, y: 70, z: -520, rotateY: 18, opacity: .75, duration: .27 }, .2)
        .to(".downloads__screen--rules", { x: 500 * motion, y: 105, z: -650, rotateY: -18, opacity: .68, duration: .27 }, .26)
        .fromTo(".downloads__badge", { opacity: 0, scale: .6, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: .2, ease: "back.out(1.7)" }, .38)
        .to(".downloads__world", { x: `${7 * motion}vw`, y: `${-3 * motion}vh`, rotateY: 4, duration: .4 }, .46)
        .to(".downloads__screen--popover", { z: 300 * motion, duration: .2 }, .5)
        .to(".downloads__screen", { z: 1180 * motion, opacity: 0, stagger: { amount: .04 }, duration: .18 }, .78)
        .to(".downloads .project-copy, .downloads__badge", { opacity: 0, y: -50, duration: .14 }, .86);

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
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("stage--far", !entry.isIntersecting)), { rootMargin: "35% 0px" });
    stages.forEach((stage) => observer.observe(stage.parentElement ?? stage));

    let pointerRaf = 0;
    let pointerRunning = false;
    let tx = 0, ty = 0, px = 0, py = 0, lx = 0, ly = 0;
    const cursor = root.querySelector<HTMLElement>(".cursor-system");
    const lightningLayer = root.querySelector<HTMLElement>(".click-fx-layer");
    const strikeTimers: number[] = [];
    const strikeFrames = new Set<number>();
    const onPointer = (event: PointerEvent) => {
      tx = event.clientX; ty = event.clientY;
      root.classList.add("cursor-ready");
      cursor?.style.setProperty("transform", `translate3d(${tx}px,${ty}px,0)`);
      if (!pointerRunning) { pointerRunning = true; pointerRaf = requestAnimationFrame(pointerTick); }
    };
    const pointerTick = () => {
      const dx = tx - lx, dy = ty - ly;
      const velocity = Math.min(Math.hypot(dx, dy) / 28, 1);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      px += (tx - px) * .065; py += (ty - py) * .065;
      cursor?.style.setProperty("--cursor-angle", `${angle}deg`);
      cursor?.style.setProperty("--cursor-speed", velocity.toFixed(3));
      lx += (tx - lx) * .34; ly += (ty - ly) * .34;
      root.style.setProperty("--mouse-x", `${(px / innerWidth - .5) * 2}`);
      root.style.setProperty("--mouse-y", `${(py / innerHeight - .5) * 2}`);
      root.style.setProperty("--parallax-x", `${(px / innerWidth - .5) * 34}px`);
      root.style.setProperty("--parallax-y", `${(py / innerHeight - .5) * 24}px`);
      root.style.setProperty("--parallax-x-soft", `${(px / innerWidth - .5) * 12}px`);
      root.style.setProperty("--parallax-y-soft", `${(py / innerHeight - .5) * 9}px`);
      if (Math.abs(tx - px) + Math.abs(ty - py) > .08 || Math.abs(tx - lx) + Math.abs(ty - ly) > .08) pointerRaf = requestAnimationFrame(pointerTick);
      else pointerRunning = false;
    };
    if (!coarse && !reduced) window.addEventListener("pointermove", onPointer);

    const onStrike = (event: PointerEvent) => {
      if (reduced || event.button !== 0 || !event.isPrimary || !lightningLayer) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("a,button,input,textarea,select,option,label,[role='button'],[role='link'],[contenteditable='true']")) return;
      const strike = document.createElement("span");
      strike.className = "click-lightning";
      strike.style.left = `${event.clientX}px`;
      strike.style.top = `${event.clientY}px`;
      const canvas = document.createElement("canvas"); canvas.className = "click-lightning__canvas";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
      const context = canvas.getContext("2d");
      const impact = document.createElement("i"); impact.className = "click-lightning__impact";
      const sigil = document.createElement("span"); sigil.className = "click-lightning__sigil";
      sigil.append(document.createElement("i"), document.createElement("i"));
      strike.append(canvas, impact, sigil);
      lightningLayer.appendChild(strike);

      if (context) {
        type BoltPoint = { x: number; y: number };
        const clickPoint = { x: event.clientX, y: event.clientY };
        const slant = (Math.random() > .5 ? 1 : -1) * (80 + Math.random() * 55);
        const ratio = clickPoint.y / innerHeight;
        const topPoint = { x: clickPoint.x - slant * ratio, y: -24 };
        const bottomPoint = { x: clickPoint.x + slant * (1 - ratio), y: innerHeight + 24 };
        const segment = (from: BoltPoint, to: BoltPoint, count: number) => Array.from({ length: count + 1 }, (_, index) => {
          const t = index / count;
          const envelope = Math.sin(Math.PI * t);
          const jag = (Math.random() - .5) * (24 + Math.random() * 24) * envelope;
          return { x: from.x + (to.x - from.x) * t + jag, y: from.y + (to.y - from.y) * t };
        });
        const upper = segment(topPoint, clickPoint, Math.max(5, Math.ceil((clickPoint.y + 24) / 22)));
        const lower = segment(clickPoint, bottomPoint, Math.max(5, Math.ceil((innerHeight - clickPoint.y + 24) / 22)));
        const mainBolt = [...upper.slice(0, -1), ...lower];
        const branches: BoltPoint[][] = [];
        for (let index = 4; index < mainBolt.length - 4; index += 5 + Math.floor(Math.random() * 5)) {
          if (Math.random() < .42) continue;
          const origin = mainBolt[index];
          const direction = Math.random() > .5 ? 1 : -1;
          const length = 3 + Math.floor(Math.random() * 4);
          const branch = [origin];
          for (let step = 1; step <= length; step++) branch.push({
            x: origin.x + direction * step * (11 + Math.random() * 10) + (Math.random() - .5) * 15,
            y: origin.y + step * (12 + Math.random() * 11),
          });
          branches.push(branch);
        }

        const started = performance.now();
        let frame = 0;
        const stroke = (points: BoltPoint[], width: number, color: string, blur: number, alpha: number) => {
          context.beginPath(); context.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
          context.lineWidth = width; context.strokeStyle = color; context.shadowColor = color; context.shadowBlur = blur; context.globalAlpha = alpha; context.stroke();
        };
        const renderStrike = (now: number) => {
          strikeFrames.delete(frame);
          const elapsed = now - started;
          const fade = Math.max(0, 1 - elapsed / 620);
          const flicker = elapsed < 85 ? 1 : elapsed < 145 ? .18 : elapsed < 255 ? .82 : elapsed < 330 ? .28 : .58;
          context.setTransform(dpr, 0, 0, dpr, 0, 0); context.clearRect(0, 0, innerWidth, innerHeight);
          context.save(); context.globalCompositeOperation = "lighter"; context.lineCap = "round"; context.lineJoin = "round";
          context.translate((Math.random() - .5) * 1.6, (Math.random() - .5) * .8);
          branches.forEach((branch) => { stroke(branch, 3.8, "#6e8cff", 16, fade * flicker * .18); stroke(branch, .75, "#bfeeff", 7, fade * flicker * .72); });
          stroke(mainBolt, 11, "#527eff", 28, fade * flicker * .16);
          stroke(mainBolt, 4.2, "#75dfff", 18, fade * flicker * .5);
          stroke(mainBolt, 1.45, "#f6fdff", 8, fade * flicker);
          stroke(mainBolt, .55, "#ffffff", 2, fade);
          context.restore();
          if (elapsed < 620) { frame = requestAnimationFrame(renderStrike); strikeFrames.add(frame); }
        };
        frame = requestAnimationFrame(renderStrike); strikeFrames.add(frame);
        strikeTimers.push(window.setTimeout(() => { cancelAnimationFrame(frame); strikeFrames.delete(frame); strike.remove(); }, 900));
      } else strikeTimers.push(window.setTimeout(() => strike.remove(), 900));
    };
    if (!reduced && !coarse) window.addEventListener("pointerdown", onStrike);

    const magnetic = !reduced && !coarse ? Array.from(root.querySelectorAll<HTMLElement>("[data-magnetic]")) : [];
    const cleaners = magnetic.map((el) => {
      const move = (event: PointerEvent) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * .22}px, ${(event.clientY - r.top - r.height / 2) * .3}px)`; cursor?.classList.add("cursor-system--active"); };
      const leave = () => { el.style.transform = "translate(0,0)"; cursor?.classList.remove("cursor-system--active"); };
      el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });

    const jumpers = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-project-jump]"));
    const jumpCleaners = jumpers.map((link) => {
      const jump = (event: MouseEvent) => {
        const target = document.querySelector<HTMLElement>(link.hash);
        if (!target) return;
        event.preventDefault();
        if (lenis && !reduced) lenis.scrollTo(target, { duration: 1.35, easing: (t) => 1 - Math.pow(1 - t, 4) });
        else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      };
      link.addEventListener("click", jump);
      return () => link.removeEventListener("click", jump);
    });

    ScrollTrigger.refresh();
    return () => {
      ctx.revert(); observer.disconnect();
      if (lenisTick) gsap.ticker.remove(lenisTick);
      lenis?.destroy(); cancelAnimationFrame(pointerRaf);
      delete root.dataset.motion;
      root.classList.remove("cursor-ready"); window.removeEventListener("pointermove", onPointer); window.removeEventListener("pointerdown", onStrike); strikeTimers.forEach((timer) => window.clearTimeout(timer)); strikeFrames.forEach((frame) => cancelAnimationFrame(frame)); cleaners.forEach((clean) => clean()); jumpCleaners.forEach((clean) => clean());
    };
  }, []);

  return (
    <main ref={rootRef} className="portfolio" id="top">
      <a className="skip-link" href="#casa">Skip intro to selected work</a>
      <div className={`loader ${loaded ? "loader--done" : ""}`} aria-hidden="true">
        <div className="loader__ring"><i /><i /></div>
        <div className="loader__brand">
          <Image className="loader__brand-piece loader__brand-piece--top" src="/qsl-icon.png" alt="" width={86} height={89} priority />
          <Image className="loader__brand-piece loader__brand-piece--middle" src="/qsl-icon.png" alt="" width={86} height={89} priority />
          <Image className="loader__brand-piece loader__brand-piece--bottom" src="/qsl-icon.png" alt="" width={86} height={89} priority />
          <span className="loader__brand-scan" />
        </div>
        <div className="loader__line" />
        <div className="loader__word">{"QUIET STACK LABS".split("").map((letter, index) => <span key={`${letter}-${index}`} style={{ animationDelay: `${.65 + index * .05}s` }}>{letter === " " ? "\u00a0" : letter}</span>)}</div>
        <div className="loader__sweep" />
      </div>

      <header className="chrome-header">
        <a href="#top" aria-label="Quiet Stack Labs — back to the beginning" data-magnetic>
          <Image className="chrome-header__logo" src="/qsl-icon.png" alt="" width={38} height={39} priority />
        </a>
        <span>Personal product studio</span>
      </header>
      <nav className="project-jump" aria-label="Jump to a project">
        <span className="project-jump__title">Selected work</span>
        <div className="project-jump__rail"><i /></div>
        <div className="project-jump__items">
          {projectLinks.map((project, index) => (
            <a key={project.id} href={`#${project.id}`} data-project-jump className={chapter === project.chapter ? "project-jump__link--active" : ""} aria-current={chapter === project.chapter ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{project.label}</b><i />
            </a>
          ))}
        </div>
      </nav>
      <div className="click-fx-layer" aria-hidden="true" />
      <div className="cursor-system" aria-hidden="true">
        <div className="cursor-aura" /><div className="cursor-trail" />
        <div className="cursor-orbit"><i className="cursor-node cursor-node--a" /><i className="cursor-node cursor-node--b" /><span className="cursor-glyph"><i /><i /></span></div>
        <div className="cursor-core" />
      </div>
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
            <Image className="hero__brand-lockup" src="/qsl-icon.png" alt="Quiet Stack Labs" width={196} height={202} priority />
            <Kicker>Independent product practice</Kicker>
            <h1><span className="hero__word hero__word--1">Quiet</span><span className="hero__word hero__word--2">Stack</span><span className="hero__word hero__word--3">Labs</span></h1>
            <p className="hero__sub">Useful software for quieter, more intentional lives.<br /><span>Independent product practice by José Queiroz.</span></p>
          </div>
          <div className="hero__cue">Scroll to enter<i /></div>
        </div>
      </section>

      <section id="casa" className="scene scene--casa showcase casa" data-chapter="1">
        <div className="stage">
          <div className="showcase__glow showcase__glow--casa" />
          <MotionField />
          <ProjectCopy number="01" title="Casa da Piedade" category="A digital home for living heritage" description="A bilingual editorial and hospitality website for the Casa de Nossa Senhora da Piedade in Ponte de Lima. It brings together five centuries of family history, classified architecture, accommodation, a living archive, and ongoing preservation projects without reducing the place to a booking page." contribution="Content architecture, interface design, and development" decision="Build one bilingual system for history, stays, preservation projects, and editorial publishing." color="#C9B58A" href="https://www.casadapiedade.pt" linkText="Visit Casa da Piedade" />
          <div className="showcase__world casa__world">
            <FloatingPhoto src="/work/casa-property.jpg" alt="Casa da Piedade exterior and gardens" className="casa__photo casa__photo--property" />
            <FloatingPhoto src="/work/casa-pool.jpg" alt="Casa da Piedade pool and landscape" className="casa__photo casa__photo--pool" />
            <FloatingPhoto src="/work/casa-heritage.jpg" alt="Casa da Piedade historic architectural detail" className="casa__photo casa__photo--heritage" />
            <Desktop src="/work/casa-cruzeiro-history.jpg" alt="Casa da Piedade history page" className="showcase__screen casa__screen casa__screen--history" label="History · 1524 → today" />
            <Desktop src="/work/casa-cruzeiro-home.jpg" alt="Casa da Piedade website home page" className="showcase__screen showcase__screen--main casa__screen casa__screen--main" label="casadapiedade.pt" />
            <Desktop src="/work/casa-cruzeiro-projects.jpg" alt="Casa da Piedade archive and digitisation project" className="showcase__screen casa__screen casa__screen--projects" label="Archive · transcription · digitisation" />
          </div>
          <div className="casa__year"><b>1524</b><span>A place with a memory longer than the interface.</span></div>
        </div>
      </section>

      <section id="petricor" className="scene scene--petricor showcase petricor" data-chapter="2">
        <div className="stage">
          <div className="showcase__glow showcase__glow--petricor" />
          <MotionField />
          <ProjectCopy number="02" title="Petricor" category="Handcrafted woodwork portfolio" description="An image-led portfolio for a woodworking practice where material, joinery, and process carry more weight than sales chrome. The site gives custom furniture and functional objects room to breathe, while a structured work catalogue makes projects easy to explore and maintain." contribution="Art direction, information architecture, design, and development" decision="Let the material lead, then structure every object as a maintainable project record." color="#D6A45D" href="https://petricor.pt" linkText="Visit Petricor" />
          <div className="showcase__world petricor__world">
            <FloatingPhoto src="/work/petricor-table.jpg" alt="Petricor handcrafted table" className="petricor__photo petricor__photo--table" />
            <FloatingPhoto src="/work/petricor-joinery.jpg" alt="Petricor joinery detail" className="petricor__photo petricor__photo--joinery" />
            <FloatingPhoto src="/work/petricor-chair.jpg" alt="Petricor handcrafted chair" className="petricor__photo petricor__photo--chair" />
            <Desktop src="/work/petricor-site.webp" alt="Petricor woodworking portfolio" className="showcase__screen showcase__screen--main petricor__screen petricor__screen--main" label="petricor.pt" />
            <Desktop src="/work/petricor-craft.webp" alt="Petricor project and craft detail" className="showcase__screen petricor__screen petricor__screen--craft" label="Material · process · object" />
          </div>
          <div className="petricor__materials"><span className="petricor__material">wood</span><span className="petricor__material">grain</span><span className="petricor__material">joinery</span></div>
        </div>
      </section>

      <section id="nightshelf" className="scene scene--night ns" data-chapter="3">
        <div className="stage">
          <div className="scene-glow scene-glow--magenta" /><div className="ns__incoming" />
          <ProjectCopy number="03" title="NightShelf" category="A personal media library" description="A swipe-first place to discover, save, and track films, series, anime, and books. NightShelf separates the lightness of discovery from the commitment of a personal library, then brings progress, ratings, and meaningful recommendations back around what the person chose." contribution="Product strategy, interaction design, full-stack, and mobile development" decision="A swipe saves to Queue first; moving something into the Library remains a deliberate second step." align="right" color="#D48CFF" href="https://www.nightshelf.pt" linkText="Visit NightShelf" />
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

      <section id="weekline" className="scene scene--week weekline" data-chapter="4">
        <div className="stage">
          <ProjectCopy number="04" title="Weekline" category="Focus and work journal" description="A work journal built around the week rather than an endless task list. Focus sessions become a readable weekly record, with project context, self-review, visual summaries, and a clear view of what actually moved." contribution="Product design, interaction design, and full-stack development" decision="Make every focus session part of a weekly record that can be reviewed, copied, or exported." align="right" color="#9BC4FF" href="https://www.weekline.app" linkText="Visit Weekline" />
          <div className="weekline__set">
            <div className="weekline__rail" />
            <div className="weekline__timeline">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i)=><div className="weekline__tick" style={{ left:`${8+i*14}%` }} key={day}><span>{day}</span><i className="weekline__block" /><i className="weekline__block weekline__block--two" /></div>)}
            </div>
            <div className="weekline__gallery">
              <PortraitScreen src="/work/weekline-834.jpg" alt="Weekline projects view" className="weekline__screen weekline__screen--projects" />
              <PortraitScreen src="/work/weekline-832.jpg" alt="Weekline weekly report" className="weekline__screen weekline__screen--report" />
              <PortraitScreen src="/work/weekline-830.jpg" alt="Weekline focus timer" className="weekline__screen weekline__screen--focus" />
              <PortraitScreen src="/work/weekline-833.jpg" alt="Weekline export studio" className="weekline__screen weekline__screen--export" />
              <PortraitScreen src="/work/weekline-835.jpg" alt="Weekline motion background settings" className="weekline__screen weekline__screen--motion" />
              <PortraitScreen src="/work/weekline-836.jpg" alt="Weekline colour themes" className="weekline__screen weekline__screen--themes" />
            </div>
          </div>
          <div className="weekline__close">Know exactly what you shipped this week.</div>
        </div>
      </section>

      <section id="ferias" className="scene scene--ferias showcase ferias" data-chapter="5">
        <div className="stage">
          <div className="showcase__glow showcase__glow--ferias" />
          <MotionField />
          <ProjectCopy number="05" title="Férias BV" category="Property operations in one view" description="A full property-management workspace for the daily reality behind short stays: occupancy, revenue, costs, arrivals, departures, guests, and multiple properties. A lane-packed calendar keeps overlapping bookings legible, while live pricing, status, and notes stay close to each reservation." contribution="Product strategy, operational modelling, design, and development" decision="Put status, season-aware pricing, guests, and costs around one legible booking calendar." align="right" color="#79E0C0" href="https://feriasbv.com" linkText="Visit Férias BV" />
          <div className="showcase__world ferias__world">
            <Desktop src="/work/ferias-year-current.jpg" alt="Férias BV annual occupancy calendar" className="showcase__screen ferias__screen ferias__screen--year" label="Year · occupancy patterns" />
            <Desktop src="/work/ferias-dashboard-current.jpg" alt="Férias BV operating dashboard" className="showcase__screen ferias__screen ferias__screen--dashboard" label="Dashboard · arrivals · financials" />
            <Desktop src="/work/ferias-calendar-current.jpg" alt="Férias BV visual booking calendar" className="showcase__screen showcase__screen--main ferias__screen ferias__screen--calendar" label="Monthly booking calendar" />
            <Desktop src="/work/ferias-properties-current.jpg" alt="Férias BV property and rate management" className="showcase__screen ferias__screen ferias__screen--properties" label="Properties · rates · costs" />
            <Desktop src="/work/ferias-guests-current.jpg" alt="Férias BV guest history and revenue view" className="showcase__screen ferias__screen ferias__screen--guests" label="Guests · stays · revenue" />
          </div>
          <div className="ferias__metrics"><span className="ferias__metric"><b>3</b> calendar views</span><span className="ferias__metric"><b>5</b> booking states</span><span className="ferias__metric"><b>1</b> operating picture</span></div>
        </div>
      </section>

      <section id="downloads" className="scene scene--downloads showcase downloads" data-chapter="6">
        <div className="stage">
          <div className="showcase__glow showcase__glow--downloads" />
          <MotionField />
          <ProjectCopy number="06" title="Downloads Organizer" category="Native macOS automation you can trust" description="A menu-bar utility that watches local folders and applies ordered rules to rename and move finished downloads. It starts in dry-run, ignores incomplete files, records every real action, and makes it undoable — with multi-folder support, reusable presets, rule previews, and local-only processing." contribution="Product strategy, native macOS design, and Swift engineering" decision="Preview first, wait for completed files, and make every real move visible and undoable." color="#79B8FF" href="mailto:zemqueiroz@gmail.com?subject=Downloads%20Organizer%20project" linkText="Ask about Downloads Organizer" />
          <div className="showcase__world downloads__world">
            <Desktop src="/work/downloads-general.jpg" alt="Downloads Organizer general settings" className="showcase__screen downloads__screen downloads__screen--general" label="General · local file processing" />
            <Desktop src="/work/downloads-popover.jpg" alt="Downloads Organizer menu-bar utility" className="showcase__screen showcase__screen--main downloads__screen downloads__screen--popover" label="Downloads Organizer · live" />
            <Desktop src="/work/downloads-rules.jpg" alt="Downloads Organizer rules and preset packs" className="showcase__screen downloads__screen downloads__screen--rules" label="Rules · previews · presets" />
          </div>
          <div className="downloads__badge"><Image src="/work/downloads-organizer-icon.webp" alt="Downloads Organizer app icon" width={112} height={112} /><span>Local files.<br />Reversible actions.</span></div>
        </div>
      </section>

      <section id="my5" className="scene scene--my5 my5" data-chapter="7">
        <div className="stage">
          <div className="scene-glow scene-glow--plum" /><div className="rim-disc" />
          <ProjectCopy number="07" title="My5" category="Private emotional network" description="A private emotional network for up to five trusted adults. Share one feeling with your circle or reach one person directly; they can answer with a bounded voice note, image, or short video — no public profiles, feed, followers, popularity metrics, or emotional-data advertising." contribution="Product strategy, trust model, mobile design, and engineering" decision="No chat or feed: one feeling, one bounded response, then the private moment disappears." color="#7A4DFF" href="mailto:zemqueiroz@gmail.com?subject=My5%20project" linkText="Ask about My5" />
          <div className="device-world my5__world">
            <Phone src="/work/my5-2.png" alt="My5 circle screen" className="my5__side my5__side--a" small contain />
            <Phone src="/work/my5-live.jpg" alt="My5 circle and emotional check-in" className="my5__hero" />
            <Phone src="/work/my5-3.png" alt="My5 check-in screen" className="my5__side my5__side--b" small contain />
          </div>
          <span className="depth-word my5__depth depth-word--a">private</span><span className="depth-word my5__depth depth-word--b">trusted</span><span className="depth-word my5__depth depth-word--c">quiet</span>
          <div className="transition-line my5__line" />
        </div>
      </section>

      <section id="studio" className="scene scene--studio studio" data-chapter="8">
        <div className="stage"><div className="studio__light" />
          <div className="studio__content"><Kicker><span className="studio__kicker">The studio</span></Kicker>
            <div className="studio__reveal"><div><h2>A studio name for one person.</h2></div><div><h2>One person who makes the whole thing.</h2></div><div className="studio__paragraph"><p>I’m José Queiroz, an independent product designer and engineer. Quiet Stack Labs is where I turn stubborn problems into thoughtful, useful software.</p></div><div className="studio__paragraph"><p>I move from the problem and product model through interface, motion, implementation, and launch. That continuity is the point: clear decisions and a product that still feels like one idea.</p></div></div>
            <div className="studio__disciplines">{["Product strategy","Interface design","Interaction","Mobile","Web","Systems","Engineering","Automation"].map(x=><span key={x}>{x}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="contact" className="scene scene--contact contact" data-chapter="9">
        <div className="stage"><div className="contact__points">{Array.from({length:7},(_,i)=><i key={i} style={{left:`${12+(i*19)%78}%`,top:`${14+(i*29)%70}%`}} />)}</div>
          <div className="contact__content"><Kicker>Start a conversation</Kicker><div className="contact__reveal"><div><h2>Have a problem worth</h2></div><div><h2>getting close to?</h2></div></div><p className="contact__copy">Tell me what you’re building, where it feels stuck, and what a good outcome would look like. I work directly across product thinking, design, and implementation.</p>
            <div className="contact__availability"><i />For selected collaborations, independent products, and thoughtful systems.</div>
            <div className="contact__links"><a href="mailto:zemqueiroz@gmail.com?subject=Project%20conversation%20%E2%80%94%20Quiet%20Stack%20Labs" data-magnetic><span>01</span>Start a conversation<i>↗</i></a><a href="https://github.com/ZeMQueiroz" target="_blank" rel="noopener noreferrer" data-magnetic><span>02</span>GitHub<i>↗</i></a><a href="https://www.linkedin.com/in/josemqueiroz/" target="_blank" rel="noopener noreferrer" data-magnetic><span>03</span>LinkedIn<i>↗</i></a></div>
          </div>
          <div className="contact__dark" />
          <div className="contact__mark">
            <div className="contact__brand">
              <Image className="contact__brand-icon" src="/qsl-icon.png" alt="" width={220} height={228} />
              <b>Quiet Stack</b><em>Labs</em>
            </div>
            <small>Personal work by José Queiroz</small>
            <a className="contact__final-link" href="mailto:zemqueiroz@gmail.com?subject=Project%20conversation%20%E2%80%94%20Quiet%20Stack%20Labs" data-magnetic>Start a conversation <span>↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
