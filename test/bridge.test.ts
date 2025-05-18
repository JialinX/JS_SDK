import { setupFlutterBridge } from '../src/bridge';

describe('bridge', () => {
    beforeEach(() => {
        (global as any).window = {};
        setupFlutterBridge();
    });

    it('should attach flutterBridge to window', () => {
        expect((window as any).flutterBridge).toBeDefined();
        expect(typeof (window as any).flutterBridge.sendToFlutter).toBe('function');
    });

    it('should reject if bridge not available', async () => {
        await expect((window as any).flutterBridge.sendToFlutter('action', {}))
            .rejects
            .toBe('Bridge not available');
    });

    it('should resolve/reject callback', async () => {
        // mock flutter_inappwebview
        (window as any).flutter_inappwebview = {
            callHandler: jest.fn((handlerName, args) => {
                // 模拟异步回调
                setTimeout(() => {
                    (window as any).flutterBridge.receiveFromFlutter(args.callbackId, true, 'ok');
                }, 10);
            })
        };
        const result = await (window as any).flutterBridge.sendToFlutter('action', {});
        expect(result).toBe('ok');
    });
}); 