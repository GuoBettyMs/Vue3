const BleConnection = {
  Scan: 'scan',
  Connecting: 'connecting',
  Connect: 'connect',
  Reconnect: 'reconnect',
  Binding: 'binding',
  Communication: 'communication',
  Ota: 'ota',
  Disconnect: 'disconnect',
  Error: 'error'
};
const errorLists = ["errorOutRev","errorBattVolt","errorBattTemp_L","errorBattTemp_H","errorBoardTemp_H",
  "errorDcOutOCP","errorDcOutOVP:","errorDICInitFail","errorDcOutVol",
  "errorTimeOut","errorConnectionBroken","errorBatteryOver","errorBatteryLow",
  "errorCellsNode","errorNoBattery","errorCapacity:","errorUnknown"]

/**
 * @brief 从字节数组中读取一个字节，并推进索引
 * @param data         字节数组（Uint8Array/Buffer/普通数组）
 * @param indexRef     { index: n } 索引对象
 * @return 一个字节值（0–255 的整数）
 */
function getByte(data, indexRef) {
  if (!data || !indexRef || indexRef.index >= data.length) {
      console.warn("获取字节失败：数据不足或索引越界");
      return 0;
  }
  const byte = data[indexRef.index];
  indexRef.index++;
  return byte;
}

/**
 * @brief 根据 num 决定位宽、根据 deviceName 选错误表，把索引映射成错误字符串。
 * @param {number} num -  遍历长度 
 * @param {number} value - 原始输入值      
 * @param {string} deviceName - 设备名称
 * @return {string}     错误字符串
 */
function getByteType(num, value, deviceName) {
    // 无错误直接返回空字符串    
    if (value === 0) return "";
    // 确定遍历长度：num为4时17位，否则9位
    const len = num === 4 ? 17 : 9;
    // 找到第一个置位的索引
    const index = getFirstSetBitIndex(value, len);
    if (index === -1) return "";
    // MP305B 设备直接返回错误列表
    if (deviceName === "MP305B") {
        return errorLists[index] || "";
    }
    // 其他设备的特殊映射
    const specialCases = {
        1: "errorUnknown",
        2: "errorUnknown",
        3: "errorBattTemp_H_A"
    };
    return specialCases[index] || errorLists[index] || "";
}
  

/**
 * 找到 value 中第一个置位的索引（从低位到高位），限制在 maxBits 范围内
 *
 * @param {number} value - 原始输入值
 * @param {number} maxBits - 限制范围
 * @returns {number} 索引
 *
 */
function getFirstSetBitIndex(value, maxBits) {
    // 使用位运算快速找到最低位的1
    const lowestBit = value & -value;

    //求位索引:最低位 1 在第几位
    const index = Math.log2(lowestBit);

    // 检查是否在有效范围内
    return index < maxBits ? index : -1;
}

function getImageUrl(name, icon, unit, retina = '') {
  // 使用 new URL() 让 vite 正确处理路径
  return new URL(`./assets/img/${name}/${icon}${retina}.${unit}`, import.meta.url).href
}

/**
 * 检测当前浏览器是否支持 WebHID 和 Web Bluetooth 两个 API，用来告诉调用方“这个浏览器能不能用 HID / 蓝牙功能”
 * @returns {Object} 一个包含两个布尔标志、原因的对象
 *
 * 兼容性提醒：
 * 1. Chrome 89+ / Edge 89+ 支持 WebHID
 * 2. Chrome 56+ / Edge 79+ 支持 Web Bluetooth
 * 3. Firefox / Safari 均不支持
 */
function verdictBrowser(){
    return {
        hidBool: !!navigator.hid,
        bleBool: !!navigator.bluetooth,
        secureContext: window.isSecureContext,
    };
}

/**
 * 按规则格式化单个数值，返回字符串（便于直接绑定到 input 的 v-model）
 *
 * @param {string|number} value - 原始输入值，可能是空串、数字字符串或数字
 * @param {Object} rule - 格式化规则
 * @param {number} [rule.max=Infinity]  - 允许的最大值（上界）
 * @param {number} [rule.min=-Infinity] - 允许的最小值（下界）
 * @param {number} [rule.decimal=0]     - 保留的小数位数
 * @param {string} [rule.default='0']   - 输入非法时返回的默认值
 * @returns {string} 格式化后的字符串
 *
 * 说明：
 * 1. 空值 / null / undefined / 非数字 → 直接返回 default
 * 2. 合法数字 → 先按 [min, max] 限幅，再按 decimal 保留小数
 * 3. 返回字符串是刻意的：input 的 v-model 需要字符串，且 toFixed 天然返回字符串
 * 4. 注意 toFixed 存在浮点舍入误差，如 (1.005).toFixed(2) === "1.00"
 */
function formatSingleValue(value, rule) {
    // 解构规则，提供默认值；default 是 JS 保留字，必须重命名为 defaultValue
    const { max = Infinity, min = -Infinity, decimal = 0, default: defaultValue = '0' } = rule;

    // 步骤 1：拦截非法输入
    // - ''、null、undefined 直接判空
    // - Number(value) 为 NaN（如 'abc'、{}）也视为非法
    // 注意：Number([]) === 0，数组会漏过此判断，业务上一般不会传数组
    if (value === '' || value === null || value === undefined || isNaN(Number(value))) {
        return defaultValue;
    }

    // 步骤 2：转数字并限幅
    // Math.max 先限下界，Math.min 再限上界，顺序不能反
    // 例：min=-10, max=100, 输入 200 → Math.max(200,-10)=200 → Math.min(200,100)=100
    let numValue = Number(value);
    numValue = Math.min(Math.max(numValue, min), max);   // 上下限都限

    // 步骤 3：按指定小数位输出字符串
    // decimal=0 时返回整数字符串，如 "5"（不含小数点）
    return numValue.toFixed(decimal);
}


/**
 * 把数字格式化为「整数部分补零到 start 位 + '.' + 固定 2 位小数」的字符串
 *
 * @param {number} start - 整数部分最少保留的位数，不足用 '0' 左补齐
 * @param {number} num   - 待格式化的数字
 * @returns {string} 形如 "05.00"、"-03.50"、"123.46" 的字符串
 *
 * 说明：
 * 1. 小数固定保留 2 位（四舍五入）
 * 2. 整数部分不足 start 位时左侧补 '0'
 * 3. 负号单独处理，补零补在负号之后、数字之前（避免出现 "0-3.50" 这种错误）
 * 4. NaN / Infinity 等非有限数返回全零占位，不抛异常
 */
function formatNumber(start, num) {
    // 步骤 0：非有限数（NaN、Infinity、-Infinity）兜底
    // 返回 start 个 '0' 加 ".00"，保证调用方拿到的始终是合法字符串
    // Math.max(0, start) 防止 start 为负数时 repeat 抛错
    if (!Number.isFinite(num)) return `${'0'.repeat(Math.max(0, start))}.00`;

    // 步骤 1：保留 2 位小数，得到字符串
    // 例：5 → "5.00"，3.14159 → "3.14"，-7.5 → "-7.50"
    const fixedStr = num.toFixed(2);

    // 步骤 2：拆分整数部分和小数部分
    // toFixed 保证结果一定含 '.'，split 后 decimalPart 一定存在
    let [integerPart, decimalPart] = fixedStr.split('.');

    // 步骤 3：处理负号
    // padStart 会把负号当普通字符，补零会补到负号前面，
    // 如 "-3".padStart(3,'0') === "0-3"，所以先把负号剥离出来
    const sign = integerPart.startsWith('-') ? '-' : '';
    if (sign) integerPart = integerPart.slice(1);

    // 步骤 4：整数部分补零后与小数部分拼接
    // padStart 对「目标长度 ≤ 当前长度」不做任何处理，所以 start 偏小也不会出错
    // 例：start=2, integerPart="5"  → "05"
    //     start=4, integerPart="123" → "0123"（注意是左侧补零，不是截断）
    return `${sign}${integerPart.padStart(start, '0')}.${decimalPart}`;
}

export{
    BleConnection,
    getByteType,
    verdictBrowser,
    getByte,
    formatSingleValue,
    formatNumber,
    getImageUrl
}