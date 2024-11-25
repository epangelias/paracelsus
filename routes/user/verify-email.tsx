/* AI GENERATED COMMENT
Here is my feedback:

	handler function is not validated for unauthorized access, 
	an authenticated user should not be able to verify another user's email.
	
	Code style: 
	import statements can be organized, 
	grouping related imports together for better readability.
	
	Error handling: 
	HttpError messages should be descriptive and user-friendly, 
	providing helpful information for the user.
	
	Security: 
	no input validation on user-provided data (code) 
	potentially leading to SQL injection or other security vulnerabilities.
	
	Performance: 
	no caching mechanism for getUserByVerificationCode and updateUser 
	which could lead to performance issues.
	
	Maintainability: 
	extract.businesslogic into separate functions 
	for easier testing and maintenance.
	
	Readability: 
	variable names could be more descriptive, 
	such as 'verificationCode' instead of 'code'.
*/


import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { getUserByVerificationCode, updateUser } from '@/lib/user-data.ts';
import { STATUS_CODE } from '@std/http/status';
import { Page } from '@/components/Page.tsx';
import { Meth } from '@/lib/meth.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    const code = ctx.url.searchParams.get('code') as string;
    if (!code) throw new HttpError(STATUS_CODE.BadRequest, 'Missing verification code');
    const user = await getUserByVerificationCode(code);
    if (!user) {
      throw new HttpError(STATUS_CODE.NotFound, 'Verification code expired. Request a new one in the user settings');
    }
    if (!user.hasVerifiedEmail) user.tokens += 10;
    user.isEmailVerified = true;
    user.hasVerifiedEmail = true;
    await updateUser(user);
    return page();
  },
});

export default define.page(() => (
  <Page>
    <h1>Email Verified!</h1>
    <p>
      <a href='/'>Back</a>
    </p>
  </Page>
));
