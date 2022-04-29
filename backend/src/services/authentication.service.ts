import lang from 'lang';

import { findByEmail } from 'services/salesforce/account.service';

export const getAuthIssue = async (email: string) => {
  const account = await findByEmail(email);

  if (account && account.Id) {
    return lang.invalidEmailPassword;
  }

  return lang.newLead;
};
