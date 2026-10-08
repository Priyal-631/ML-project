import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CarFront, ShieldCheck, LoaderCircle, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from './form-field';
import { PriceResult } from './price-result';
import { predictCarPrice, type CarDetails } from '@/lib/car-valuation';

export function ValuationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    const number = (name: string) => Number(form.get(name));
    const text = (name: string) => String(form.get(name));
    const details: CarDetails = {
      year: number('year'), km_driven: number('km_driven'), fuel: text('fuel'),
      seller_type: text('seller_type'), transmission: text('transmission'), owner: text('owner'),
      mileage: number('mileage'), engine: number('engine'), max_power: number('max_power'), seats: number('seats'),
    };
    setLoading(true); setError(''); setPrice(null);
    try {
      setPrice(await predictCarPrice(details));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }), 80);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  return <section id="valuation" className="valuation-section" aria-labelledby="form-heading">
    <div className="valuation-card">
      <div className="form-heading"><span className="form-icon"><CarFront size={24} strokeWidth={1.5} /></span><div><h2 id="form-heading">Tell us about your car</h2><p>A few details. A clearer picture of its worth.</p></div><span className="form-step">01 / 01</span></div>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="fields-grid">
          <FormField name="year" label="Manufacturing Year" placeholder="e.g. 2019" min={1900} max={currentYear} />
          <FormField name="km_driven" label="Kilometers Driven" placeholder="e.g. 45000" unit="km" />
          <FormField name="fuel" label="Fuel Type" placeholder="Select fuel type" options={['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric']} />
          <FormField name="seller_type" label="Seller Type" placeholder="Select seller type" options={['Individual', 'Dealer', 'Trustmark Dealer']} />
          <FormField name="transmission" label="Transmission" placeholder="Select transmission" options={['Manual', 'Automatic']} />
          <FormField name="owner" label="Owner" placeholder="Select ownership" options={['First Owner', 'Second Owner', 'Third Owner', 'Fourth & Above Owner', 'Test Drive Car']} />
          <FormField name="mileage" label="Mileage" placeholder="e.g. 18.5" unit="kmpl" step={0.01} />
          <FormField name="engine" label="Engine" placeholder="e.g. 1197" unit="cc" />
          <FormField name="max_power" label="Max Power" placeholder="e.g. 82" unit="bhp" step={0.01} />
          <FormField name="seats" label="Number of Seats" placeholder="e.g. 5" min={1} />
        </fieldset>
        {error && <div className="form-error" role="alert"><CircleAlert size={19} /><p>{error}</p></div>}
        <Button type="submit" variant="valuation" size="valuation" disabled={loading}>{loading ? <><LoaderCircle className="loading-spinner" />Analyzing your car…</> : <>Predict Car Price <ArrowRight size={19} /></>}</Button>
        <p className="privacy-note"><ShieldCheck size={14} /> No personal details. Just your car.</p>
      </form>
    </div>
    <div ref={resultRef}>{price !== null && <PriceResult key={price} price={price} />}</div>
  </section>;
}