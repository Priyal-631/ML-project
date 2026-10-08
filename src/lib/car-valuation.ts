export const PREDICTION_ENDPOINT = 'http://localhost:8000/predict';

export interface CarDetails {
  year: number;
  km_driven: number;
  fuel: string;
  seller_type: string;
  transmission: string;
  owner: string;
  mileage: number;
  engine: number;
  max_power: number;
  seats: number;
}

// The model API is separate from the frontend. Update the endpoint or field
// names here if your Python API uses a different deployment or schema.
export async function predictCarPrice(details: CarDetails): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(PREDICTION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('The valuation service could not complete your request. Please try again.');
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('predicted_price_inr' in data) ||
      typeof data.predicted_price_inr !== 'number' || !Number.isFinite(data.predicted_price_inr) || data.predicted_price_inr < 0) {
      throw new Error('The valuation service returned an invalid estimate. Please try again.');
    }
    return data.predicted_price_inr;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('The analysis is taking longer than expected. Please try again.');
    if (error instanceof TypeError) throw new Error('We couldn’t reach the valuation service. Make sure your prediction server is running and allows requests from this website.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function formatPrice(value: number) {
  return Math.round(value).toLocaleString('en-IN');
}