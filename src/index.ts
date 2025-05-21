// 导入内部依赖项
import './bridge'; // 自动初始化 Flutter Bridge
// import { autoAnnounce } from './eip6963';

// 导出对外接口
export { ourEIP1193Provider } from './provider';
export { jsWalletEngine, emitEvent } from './walletEngine';
export { walletInfo, initializeEIP6963, announceProvider } from './eip6963';
export type { FlutterBridge } from './types';

// autoAnnounce();
