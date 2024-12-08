import { App, FreshContext, HttpError } from 'fresh';
import { State } from '@/app/types.ts';
import { clearDb } from '@/tasks/db_reset.ts';
import { STATUS_CODE } from '@std/http/status';
import { sendFollowUp } from '@/app/follow-up.ts';
import { isPushEnabled } from '@/lib/push.ts';
import { Meth } from '@/lib/meth.ts';

const actions = [
  { name: 'Clear Database', route: 'clear-db', action: async () => await clearDb() },
  {
    name: 'Test Push Notifications', route: 'test-push', action: async (ctx: FreshContext<State>) => {
      if (!isPushEnabled()) throw new HttpError(STATUS_CODE.NotFound, 'Push notifications not enabled');
      const user = ctx.state.user;
      if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
      await sendFollowUp(user);
      return `${user.pushSubscriptions} push subscriptions`;
    }
  },
];

const ADMIN_USERNAME = Deno.env.get('ADMIN_USERNAME');
const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD');

export function isAdminEnabled(): boolean {
  return !!ADMIN_USERNAME && !!ADMIN_PASSWORD;
}

if (!isAdminEnabled()) {
  console.warn('ADMIN_USERNAME and/or ADMIN_PASSWORD environment variables are not set.');
}

function verifyBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;

  const credentials = atob(authHeader.slice(6));
  const [providedUsername, providedPassword] = credentials.split(':');
  return providedUsername === ADMIN_USERNAME && providedPassword === ADMIN_PASSWORD;
}

const adminPageHtml = `
  <title>Admin</title>
  <meta name="color-scheme" content="light dark" />
  <meta name="viewport="width=device-width, initial-scale=1" />
  <h1>Admin</h1>
    ${actions.map(action => `
      <div>
        <a href="/admin/${action.route}">
          <button>${action.name}</button>
        </a>
      </div>
    `).join('')}
`;

export function adminPlugin(app: App<State>) {
  app.get('/admin', (ctx) => {
    if (!isAdminEnabled()) throw new HttpError(STATUS_CODE.NotFound);

    const authHeader = ctx.req.headers.get('Authorization');
    if (!verifyBasicAuth(authHeader)) {
      return new Response('Unauthorized', {
        status: STATUS_CODE.Unauthorized,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' },
      });
    }

    return new Response(adminPageHtml, { headers: { 'Content-Type': 'text/html' } });
  });

  app.get('/admin/:action', async (ctx) => {
    if (!isAdminEnabled()) throw new HttpError(STATUS_CODE.NotFound);

    const actionName = ctx.params.action;
    const action = actions.find(a => a.route === actionName);

    if (!action) {
      throw new HttpError(STATUS_CODE.NotFound);
    }

    const authHeader = ctx.req.headers.get('Authorization');
    if (!verifyBasicAuth(authHeader)) {
      return new Response('Unauthorized', {
        status: STATUS_CODE.Unauthorized,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' },
      });
    }

    try {
      const result = await action.action(ctx);
      return Response.json(result);
    } catch (e) {
      return new Response('Error: ' + Meth.getErrorMessage(e), { status: 500 });
    }
  });
}