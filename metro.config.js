const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const asyncStorageShim = path.resolve(__dirname, 'src/shims/async-storage.js');

/**
 * @react-native-async-storage əvəzinə yalnız JS shim — native RNAsyncStorage çağrılmır
 * ("cannot create db" xətası olmur). Token saxlama üçün src/storage/tokens.ts istifadə olunur.
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    // Watchman qovluq icazəsi / fchmod xətası olduqda Metro başlamır — Node watcher etibarlıdır
    useWatchman: process.env.METRO_USE_WATCHMAN === '1',
    resolveRequest: (context, moduleName, platform) => {
      if (
        moduleName === '@react-native-async-storage/async-storage' ||
        moduleName.startsWith('@react-native-async-storage/async-storage/')
      ) {
        return {
          filePath: asyncStorageShim,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
});
