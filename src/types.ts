// 导出类型定义
export interface FlutterBridge {
    callbacks: Record<string, { resolve: (value: any) => void; reject: (reason: any) => void }>;
    sendToFlutter: (action: string, data: any) => Promise<any>;
    receiveFromFlutter: (callbackId: string, success: boolean, result: any) => void;
}

// 全局类型扩展
declare global {
    interface Window {
        flutterBridge: FlutterBridge;
        flutter_inappwebview?: {
            callHandler: (handlerName: string, ...args: any[]) => void;
        };
    }
} 