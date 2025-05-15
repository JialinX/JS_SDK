// JS Bridge全局对象
export function setupFlutterBridge() {
    window.flutterBridge = {
        // 回调管理
        callbacks: {},

        // 向Flutter发送消息
        sendToFlutter: function (action, data) {
            return new Promise((resolve, reject) => {
                const callbackId = Date.now().toString();
                this.callbacks[callbackId] = { resolve, reject };

                // 调用Flutter侧注入的函数
                if (window.flutter_inappwebview) {
                    // Android/iOS的Flutter WebView
                    window.flutter_inappwebview.callHandler('jsBridgeHandler', {
                        action: action,
                        data: data,
                        callbackId: callbackId
                    });
                } else {
                    console.error('Flutter WebView bridge not available');
                    reject('Bridge not available');
                }
            });
        },

        // 接收Flutter的响应
        receiveFromFlutter: function (callbackId, success, result) {
            const callback = this.callbacks[callbackId];
            if (callback) {
                if (success) {
                    callback.resolve(result);
                } else {
                    callback.reject(result);
                }
                delete this.callbacks[callbackId];
            }
        }
    };
}

// 自动设置Flutter Bridge
setupFlutterBridge(); 