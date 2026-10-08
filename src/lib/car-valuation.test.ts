import { afterEach, describe, expect, it, vi } from 'vitest';
import { predictCarPrice, PREDICTION_ENDPOINT, type CarDetails } from './car-valuation';

const details: CarDetails = { year: 2019, km_driven: 45000, fuel: 'Petrol', seller_type: 'Individual', transmission: 'Manual', owner: 'First Owner', mileage: 18.5, engine: 1197, max_power: 82, seats: 5 };
afterEach(() => vi.unstubAllGlobals());
describe('CarVal prediction contract', () => {
  it('POSTs entered car details as JSON to the requested prediction endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ predicted_price_inr: 550000 }) });
    vi.stubGlobal('fetch', fetchMock);
    await predictCarPrice(details);
    expect(PREDICTION_ENDPOINT).toBe('http://localhost:8000/predict');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/predict', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details) }));
  });
  it('uses the actual predicted_price_inr rather than a fixed final prediction', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ predicted_price_inr: 723456 }) }));
    expect(await predictCarPrice(details)).toBe(723456);
  });
  it.each([{}, { predicted_price_inr: '550000' }, { predicted_price_inr: -1 }, { predicted_price_inr: Infinity }])('rejects invalid predictions: %j', async (response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => response }));
    await expect(predictCarPrice(details)).rejects.toThrow('invalid estimate');
  });
  it('shows a service error for unsuccessful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(predictCarPrice(details)).rejects.toThrow('could not complete');
  });
  it('shows a connection error when the model is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(predictCarPrice(details)).rejects.toThrow('prediction server is running');
  });
});