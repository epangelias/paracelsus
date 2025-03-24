import { App } from 'fresh';
import { State } from './utils.ts';

import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { createUser, getUserById, setUserAuth } from '@/lib/user/user-data.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

async function getGitHubUser(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new HttpError(STATUS_CODE.BadRequest, await res.json());
  return await res.json() as { login: string; email: string, id: number };
}

export function isOauthEnabled() {
  try {
    createGitHubOAuthConfig();
    return true;
  } catch (_e) {
    return false;
  }
}

export function OauthPlugin(app: App<State>) {
  if (!isOauthEnabled()) return;

  const oauthConfig = createGitHubOAuthConfig();
  const {
    signIn,
    handleCallback,
    signOut,
  } = createHelpers(oauthConfig);

  app.get('/oauth/signin', async ctx => await signIn(ctx.req));
  app.get('/oauth/signout', async ctx => await signOut(ctx.req));
  app.get('/oauth/callback', async ctx => {
    const { response, sessionId, tokens } = await handleCallback(ctx.req);

    const data = await getGitHubUser(tokens.accessToken);

    const userId = `github:${data.id}`;

    if (!await getUserById(userId)) {
      await createUser({
        id: userId,
        email: data.email,
        name: data.login,
        isPremium: false,
      })
    }

    await setUserAuth(sessionId, userId);

    return response;
  });
}