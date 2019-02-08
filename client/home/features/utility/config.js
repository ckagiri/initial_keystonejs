import { Realtime } from 'leancloud-realtime';
import { connectUser } from 'member/reducers/leancloud';

export const sitekey = '6Ldl_i4UAAAAACee28w-q4XcYbWhV5fp6kSk5KQb';
export const realtime = new Realtime({
    appId: 'GmFLPIY7wMloC7w5XFMr0CXi-gzGzoHsz',
    appKey: 'gzpWbRLmgPtMl8OixoicCN49',
    plugins: ['ImageMessage'],
    region: 'cn', // 美国节点为 "us"
    pushOfflineMessages: true,
});
export const signatureFactory = (clientId) => {
    let entity = { memberId: clientId };
    return dispatch(connectUser(entity));
};