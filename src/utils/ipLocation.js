// src/utils/ipLocation.js
export async function checkIpLocation() {
  try {
    // 使用明确支持 CORS 的免费 API
    const response = await fetch('https://ipinfo.io/json');
    // //后端服务器
    // const response = await fetch('https://szisd.com/webIp/check_mainland_ip.php');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const ipData = await response.json();
    
    // ipinfo.io 使用 'country' 字段返回两位国家代码
    const allowedRegions = ['CN', 'HK', 'MO', 'TW'];
    const isChina = allowedRegions.includes(ipData.country);
    
    return {
      isChina,
      country: ipData.country,
      countryCode: ipData.country,
      ip: ipData.ip
    };
  } catch (error) {
    console.error('IP 定位失败:', error);
    // 默认允许访问
    return { isChina: true };
  }
}