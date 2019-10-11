import request from '@/utils/request';

const PRE_URL = '/valid';

/**
 * 获取所有zookeeper配置
 */
export default async function binlogList(params) {
  return request(`${PRE_URL}/binlogList`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
