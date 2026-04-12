/**
 * Yalnız JS yaddaşı — native RNAsyncStorage çağırılmır.
 * Metro resolver bu faylı @react-native-async-storage/async-storage əvəzinə verir.
 */
'use strict';

const mem = Object.create(null);

const legacy = {
  getItem: key => Promise.resolve(mem[key] != null ? mem[key] : null),
  setItem: (key, value) => {
    mem[key] = String(value);
    return Promise.resolve();
  },
  removeItem: key => {
    delete mem[key];
    return Promise.resolve();
  },
  mergeItem: (key, value) => {
    const prev = mem[key] != null ? mem[key] : '{}';
    try {
      const o = JSON.parse(prev);
      Object.assign(o, JSON.parse(value));
      mem[key] = JSON.stringify(o);
    } catch {
      mem[key] = String(value);
    }
    return Promise.resolve();
  },
  clear: () => {
    for (const k of Object.keys(mem)) {
      delete mem[k];
    }
    return Promise.resolve();
  },
  getAllKeys: () => Promise.resolve(Object.keys(mem)),
  multiGet: keys =>
    Promise.resolve(keys.map(k => [k, mem[k] != null ? mem[k] : null])),
  multiSet: (pairs) => {
    for (const [k, v] of pairs) {
      mem[k] = String(v);
    }
    return Promise.resolve();
  },
  multiRemove: keys => {
    for (const k of keys) {
      delete mem[k];
    }
    return Promise.resolve();
  },
  multiMerge: (pairs) => {
    for (const [key, value] of pairs) {
      legacy.mergeItem(key, value);
    }
    return Promise.resolve();
  },
};

function createAsyncStorage() {
  return legacy;
}

module.exports = legacy;
module.exports.default = legacy;
module.exports.createAsyncStorage = createAsyncStorage;
