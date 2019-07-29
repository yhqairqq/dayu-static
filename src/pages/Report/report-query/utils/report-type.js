/**
 * 报表类型对应类
 */
export const TABLE = 1; // 表格
export const LINE = 2; // 线性图
export const BAR = 3; // 柱状图
export const PIE = 4; // 饼图
export const RADAR = 5; // 雷达图

export function splitType(type) {
  const graph = [];
  if (!type || type === 'null') {
    graph.push(TABLE);
    return graph;
  }
  const arr = type.split(',');
  arr.forEach(item => {
    graph.push(parseInt(item, 10));
  });
  return graph;
}

/**
 * 判断是否有表格
 * @param {*} types
 */
export function includeTable(types) {
  if (!types || types.length <= 0) return false;

  return types.includes(TABLE);
}

export function includeGraph(types) {
  if (!types || types.length <= 0) return false;
  return (
    types.includes(LINE) || types.includes(BAR) || types.includes(PIE) || types.includes(RADAR)
  );
}
