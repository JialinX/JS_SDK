interface Window {
    flutterBridge: {
        callbacks: Record<string, { resolve: (value: any) => void; reject: (reason: any) => void }>;
        sendToFlutter: (action: string, data: any) => Promise<any>;
        receiveFromFlutter: (callbackId: string, success: boolean, result: any) => void;
    };
    flutter_inappwebview?: {
        callHandler: (handlerName: string, ...args: any[]) => void;
    };
} 