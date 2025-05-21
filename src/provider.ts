import { jsWalletEngine } from "./walletEngine";

// 存储事件监听器
const listeners = new Map<string, Set<(...args: any[]) => void>>();

// 触发事件函数
export function emitEvent(eventName: string, ...args: any[]) {
    if (listeners.has(eventName)) {
        for (const listener of listeners.get(eventName)!) {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Event listener error:`, error);
            }
        }
    }
}

// 实现一个基本的EIP-1193 Provider，直接委托给walletEngine
export const ourEIP1193Provider = {
    request: async ({ method, params }: { method: string; params?: any[] }) => {
        // 通过函数传递参数，避免模块顶层副作用
        return jsWalletEngine.request(method, params || []);
    },
    on: jsWalletEngine.on,
    removeListener: jsWalletEngine.removeListener
};



