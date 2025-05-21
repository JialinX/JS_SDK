import { ourEIP1193Provider } from '../src/provider';
import { setupFlutterBridge } from '../src/bridge';

describe('EIP-1193 Provider', () => {
    beforeEach(() => {
        (global as any).window = {};
        setupFlutterBridge();
    });

    it('should handle request with params', async () => {
        const mockResponse = ['0x123'];
        (window as any).flutter_inappwebview = {
            callHandler: jest.fn((handlerName, args) => {
                setTimeout(() => {
                    (window as any).flutterBridge.receiveFromFlutter(args.callbackId, true, mockResponse);
                }, 10);
            })
        };

        const result = await ourEIP1193Provider.request({
            method: 'eth_accounts',
            params: []
        });
        expect(result).toEqual(mockResponse);
    });

    it('should handle request without params', async () => {
        const mockResponse = '0x1';
        (window as any).flutter_inappwebview = {
            callHandler: jest.fn((handlerName, args) => {
                setTimeout(() => {
                    (window as any).flutterBridge.receiveFromFlutter(args.callbackId, true, mockResponse);
                }, 10);
            })
        };

        const result = await ourEIP1193Provider.request({
            method: 'eth_chainId'
        });
        expect(result).toBe(mockResponse);
    });

    it('should handle event listeners', () => {
        const listener = jest.fn();
        ourEIP1193Provider.on('test_event', listener);
        ourEIP1193Provider.removeListener('test_event', listener);
    });
}); 