import { site } from '@/app/site.ts';

export function OnboardSection() {
  return (
    <div class='onboard-section'>
      <img src={site.icon} alt='' height={84} />
      <h1>Welcome to {site.name}!</h1>
      <p>{site.description}</p>

      <a href='/user/signup' class='button'>Sign Up</a>
    </div>
  );
}
