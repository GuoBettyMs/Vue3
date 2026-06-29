// src/utils/stringValidator.js

export class StringValidator {
    // 允许的字符：中文、英文、数字、空格、下划线
    static ALLOWED_PATTERN = /[^\u4e00-\u9fa5a-zA-Z0-9\s_]/g;
    
    // 获取字节长度
    static getByteLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x7f) length += 1;// ASCII字符
            else if (code <= 0x7ff) length += 2;// 扩展ASCII
            else length += 3;// 中文等
        }
        return length;
    }
    
    // 按字节截断
    static truncateToByteLength(str, maxBytes) {
        let result = '';
        let byteLength = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const code = str.charCodeAt(i);
            const charBytes = code <= 0x7f ? 1 : (code <= 0x7ff ? 2 : 3);
            
            if (byteLength + charBytes <= maxBytes) {
                result += char;
                byteLength += charBytes;
            } else {
                break;
            }
        }
        return result;
    }
    
    // 清理字符串
    static sanitize(str, maxBytes = 16) {
        if (!str) return '';
        
        // 移除特殊符号
        let cleaned = str.replace(this.ALLOWED_PATTERN, '');
        
        // 限制字节长度
        const byteLength = this.getByteLength(cleaned);
        if (byteLength > maxBytes) {
            cleaned = this.truncateToByteLength(cleaned, maxBytes);
        }
        
        return cleaned;
    }
    
    // 检查字符串是否有效
    static isValid(str, maxBytes = 16) {
        if (!str) return true;
        
        // 检查是否有特殊符号
        if (this.ALLOWED_PATTERN.test(str)) {
            return false;
        }
        
        // 检查字节长度
        const byteLength = this.getByteLength(str);
        if (byteLength > maxBytes) {
            return false;
        }
        
        return true;
    }
}