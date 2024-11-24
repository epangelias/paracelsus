import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export class RateLimiter {
  requests = 0;
  maxRequests: number;
  interval: number;

  constructor({ maxRequests, interval } = { maxRequests: 10, interval: 60 }) {
    this.maxRequests = maxRequests;
    this.interval = interval * 1000;

    if (Deno.env.get('GITHUB_ACTIONS') === "true") return;

    setInterval(() => this.requests = 0, this.interval);
  }

  request() {
    if (this.requests >= this.maxRequests) {
      throw new HttpError(
        STATUS_CODE.TooManyRequests,
        `Rate limit exceeded. Try again in ${this.interval / 1000} seconds.`,
      );
    }
    this.requests++;
  }
}
