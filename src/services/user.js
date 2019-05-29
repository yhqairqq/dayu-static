import request from '@/utils/request';

const PRE_URL = "/user";

export async function query() {
  return request(PRE_URL + '/users');
}

export async function queryCurrent() {
  return request(PRE_URL + '/getCurrent', {
    method: 'POST'
  });
}
