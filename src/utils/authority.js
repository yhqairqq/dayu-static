// use localStorage to store the authority info, which might be sent from server in actual project.
const { NODE_ENV } = process.env;

export function getAuthority(str) {
  // return localStorage.getItem('ladon-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('ladon-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  if (!authority && NODE_ENV !== 'production') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('ladon-authority', JSON.stringify(proAuthority));
}
