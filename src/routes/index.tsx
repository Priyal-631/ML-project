import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Sparkles, ClipboardList, ScanLine, ChartNoAxesCombined } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from '@/components/carval/brand';
import { ValuationForm } from '@/components/carval/valuation-form';
import carImage from '@/assets/carval-car.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'CarVal — Know your car’s worth.' },
    { name: 'description', content: 'Discover your used car’s estimated resale value with CarVal. A simple, machine-learning-powered car price prediction.' },
    { property: 'og:title', content: 'CarVal — Know your car’s worth.' },
    { property: 'og:description', content: 'A few car details. An intelligent resale estimate. Discover your car’s worth with CarVal.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const steps = [
    { number: '01', icon: ClipboardList, title: 'Enter Details', text: 'Tell us about your car.' },
    { number: '02', icon: ScanLine, title: 'AI Analysis', text: 'Our machine learning model analyzes the information.' },
    { number: '03', icon: ChartNoAxesCombined, title: 'Get Your Estimate', text: 'Receive an estimated resale value.' },
  ];
  function focusForm() {
    document.getElementById('valuation')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById('year')?.focus({ preventScroll: true });
  }
  return <div className="carval-app">
    <header className="site-header"><Brand /><span className="header-tagline">Know your car’s worth.</span><Button variant="ghost" onClick={focusForm} className="header-action">Get a valuation <ArrowRight size={15} /></Button></header>
    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <span className="eyebrow"><span className="status-dot" /> AI-POWERED CAR VALUATION</span>
        <h1 id="hero-heading">Know what your<br />car is <span>worth.</span></h1>
        <p className="hero-description">Every car has a story. Find out what yours is worth.<br className="desktop-break" /> Get an intelligent resale estimate in just a few details.</p>
        <Button variant="valuation" size="lg" className="hero-cta" onClick={focusForm}>Predict Price <ArrowRight size={17} /></Button>
        <div className="powered-label"><Sparkles size={13} /> Powered by Machine Learning</div>
        <div className="hero-car"><img src={carImage} alt="An ivory sedan in side profile" width={1536} height={768} /><span className="car-caption">A smarter perspective on your next move.</span></div>
      </section>
      <ValuationForm />
      <section className="how-section" aria-labelledby="how-heading"><div className="how-heading"><span className="section-eyebrow">SIMPLE BY DESIGN</span><h2 id="how-heading">Your car’s value, in three steps.</h2><p>Less guesswork. More confidence.</p></div><div className="steps-grid">{steps.map(({ number, icon: Icon, title, text }) => <article className="step-card" key={number}><div className="step-top"><span>{number}</span><Icon size={23} strokeWidth={1.4} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    </main>
    <footer className="site-footer"><div><Brand /><p>CarVal — Smart Car Price Prediction</p></div><span><Sparkles size={13} /> Built using Machine Learning</span></footer>
  </div>;
}
