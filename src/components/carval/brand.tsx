import { CarFront } from 'lucide-react';

export function Brand() {
  return <a className="brand" href="/" aria-label="CarVal home"><span className="brand-mark"><CarFront size={23} strokeWidth={1.7} /></span><span>Car<span className="brand-accent">Val</span></span></a>;
}