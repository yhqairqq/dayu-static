const MASK_INFO = {
  VIEW: 1,
  ADD: 2,
  EDIT: 4,
  DEL: 8,
};
const check = (pathname, mask) => {
  const pers = localStorage.getItem('optPermissions');
  if (pers) {
    const map = JSON.parse(pers);
    const list = map[pathname];
    if (!list) return false; // 不存在该资源的设置

    if (mask) {
      for (let i = 0; i < mask.length; i += 1) {
        const tag = MASK_INFO[mask[i]];
        if (list.includes(tag)) return true;
      }
    }
  }
  return false;
};

export default check;
