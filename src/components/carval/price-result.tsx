import { useEffect, useState } from 'react';
import { BadgeCheck, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/car-valuation';

export function PriceResult({ price }: { price: number }) {
  const [displayPrice, setDisplayPrice] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplayPrice(price); return; }
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1);
      setDisplayPrice(price * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [price]);
  return <section className="price-result" aria-labelledby="result-heading">
    <span className="result-icon"><BadgeCheck size={27} strokeWidth={1.5} /></span>
    <h2 id="result-heading">Your estimated car value</h2>
    <div className="result-price" aria-hidden="true">₹ {formatPrice(displayPrice)}</div>
    <span className="sr-only" role="status">Your estimated car value is ₹ {formatPrice(price)}</span>
    <p>Estimated resale price</p>
    <span className="market-indicator"><TrendingUp size={14} /> Market estimate</span>
    <div className="result-note">An estimate, not a guaranteed sale price. Actual value may vary with your car’s condition and local demand.</div>
  </section>;
}