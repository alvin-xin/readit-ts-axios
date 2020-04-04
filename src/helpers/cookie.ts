/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-29
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-29
 */

// 利用正则表达式解析到name对应的值
const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie;
