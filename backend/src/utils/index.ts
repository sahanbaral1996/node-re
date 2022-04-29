/**
 * Extract Full Name
 */
export const extractFullName = fullName => {
  const fullNameAry = fullName.split(' ');
  let firstName = '';
  let lastName = '';

  if (fullName.length <= 2) {
    firstName = fullNameAry[0];
    lastName = typeof fullNameAry[1] === 'undefined' ? '' : fullNameAry[1];
  } else {
    lastName = fullNameAry.pop();
    firstName = fullNameAry.join(' ');
  }

  return { firstName, lastName };
};
