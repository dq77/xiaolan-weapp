import Request from '@/utils/request.js';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});
