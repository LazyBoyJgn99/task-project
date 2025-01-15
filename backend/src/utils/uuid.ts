/**
 * @description 生成一个自定义的UUID
 * @description 此函数生成的UUID包含两部分：时间戳、随机字符串
 * @description 时间戳确保了UUID的唯一性，而随机字符串增加了UUID的复杂度和安全性
 * @returns {string} 生成的UUID字符串，长度为32位
 */
export function GenerateUUID(): string {
  // 获取当前时间戳，转换为36进制，并确保长度不会超过12位
  const timestamp = Date.now().toString(36).padEnd(12, '0'); // 用'0'补齐到12位
  // 生成剩余部分的随机字符串，确保是20位
  const randomPart = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });

  // 确保最终长度为32位
  return (timestamp + randomPart).substring(0, 32);
}
