import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Expand, Grid2X2, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import ScaledSlide from "@/components/presentation/ScaledSlide";
import PresentationSlide, { slides } from "@/components/presentation/PresentationSlide";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/assets/docg-logo-white.png";
import "./presentation.css";

const clampSlide = (value: number) => Math.max(0, Math.min(slides.length - 1, value));

const Presentation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSlide = Number(searchParams.get("slide") ?? "1") - 1;
  const initialSlide = Number.isFinite(requestedSlide) ? clampSlide(requestedSlide) : 0;
  const [current, setCurrent] = useState(initialSlide);
  const [overview, setOverview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const printMode = searchParams.has("print");

  const goTo = useCallback((index: number) => {
    const next = clampSlide(index);
    setCurrent(next);
    setOverview(false);
    const params = new URLSearchParams(searchParams);
    params.set("slide", String(next + 1));
    params.delete("print");
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const toggleFullscreen = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!document.fullscreenElement) await stage.requestFullscreen();
    else await document.exitFullscreen();
  }, []);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (printMode) return;
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); goTo(current + 1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); goTo(current - 1); }
      if (event.key.toLowerCase() === "g") setOverview(value => !value);
      if (event.key === "F5") { event.preventDefault(); void toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, printMode, toggleFullscreen]);

  useEffect(() => {
    document.title = `${current + 1}/${slides.length} — ${slides[current]?.title ?? "DocG AI Presentation"}`;
  }, [current]);

  useEffect(() => {
    if (!printMode) return;
    const images = Array.from(document.images);
    const ready = Promise.all(images.map(image => image.complete
      ? Promise.resolve()
      : new Promise<void>(resolve => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        })));
    void ready.then(() => window.setTimeout(() => window.print(), 500));
  }, [printMode]);

  const printDeck = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("slide");
    params.set("print", "");
    window.open(`${window.location.pathname}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const activeSlide = useMemo(() => slides[current] ?? slides[0], [current]);
  if (!activeSlide) return null;

  if (printMode) {
    return <div className="presentation-print">{slides.map((slide, index) => <PresentationSlide key={slide.id} slide={slide} index={index} />)}</div>;
  }

  return (
    <div className={`presentation-app ${fullscreen ? "is-fullscreen" : ""}`} ref={stageRef}>
      <SEOHead title="Investor Presentation" description="DocG AI Canadian healthcare market and platform presentation." path="/presentation" />
      <header className="deck-toolbar">
        <a href="/" aria-label="Return to DocG AI"><img src={logo} alt="DocG AI" /></a>
        <div className="deck-title"><strong>Canadian Business Case</strong><span>{activeSlide.section}</span></div>
        <div className="deck-actions">
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" aria-label="View all slides" onClick={() => setOverview(value => !value)}><Grid2X2 /></Button></TooltipTrigger><TooltipContent>Overview (G)</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" aria-label="Open print and PDF view" onClick={printDeck}><Download /></Button></TooltipTrigger><TooltipContent>Export PDF</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" aria-label="Present fullscreen" onClick={() => void toggleFullscreen()}><Expand /></Button></TooltipTrigger><TooltipContent>Present (F5)</TooltipContent></Tooltip>
        </div>
      </header>

      <main className="deck-workspace">
        {overview ? (
          <section className="deck-overview" aria-label="Slide overview">
            <div className="overview-heading"><div><span>10-slide presentation</span><h1>DocG AI · Canadian Business Case</h1></div><Button size="icon" variant="ghost" aria-label="Close overview" onClick={() => setOverview(false)}><X /></Button></div>
            <div className="overview-grid">{slides.map((slide, index) => <button type="button" className={current === index ? "is-active" : ""} key={slide.id} onClick={() => goTo(index)}><div className="overview-preview"><ScaledSlide><PresentationSlide slide={slide} index={index} /></ScaledSlide></div><span>{slide.number}</span><strong>{slide.section}</strong></button>)}</div>
          </section>
        ) : (
          <>
            <section className="deck-stage" aria-live="polite">
              <ScaledSlide label={`Slide ${current + 1}: ${activeSlide.title}`}><PresentationSlide slide={activeSlide} index={current} /></ScaledSlide>
            </section>
            <nav className="deck-nav" aria-label="Presentation navigation">
              <Button size="icon" variant="ghost" aria-label="Previous slide" disabled={current === 0} onClick={() => goTo(current - 1)}><ChevronLeft /></Button>
              <div className="deck-progress">{slides.map((slide, index) => <button type="button" key={slide.id} className={current === index ? "is-active" : ""} aria-label={`Go to slide ${index + 1}`} onClick={() => goTo(index)}><span>{slide.number}</span></button>)}</div>
              <Button size="icon" variant="ghost" aria-label="Next slide" disabled={current === slides.length - 1} onClick={() => goTo(current + 1)}><ChevronRight /></Button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
};

export default Presentation;
