/**
 * @format
 * @Author: Alvin
 * @Date 2020-03-28
 * @Last modified by: Alvin
 * @Last modified time: 2020-03-28
 */
export default class Cancel {
  messgae?: string

  constructor(message?: string) {
    this.messgae = message;
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel;
}
