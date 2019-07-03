import md5 from 'md5';

export default function myMd5(val) {
  return md5(val);
}

export function md5Pwd(username, pwd) {
  // salt为任意乱序字符串，目的在于使加密后的密码不容易被破解
  const salt = 'Z_00544-L'; // 得与后端一致
  return md5(md5(pwd + salt) + username).toUpperCase();
}
