import { jsWalletEngine, emitEvent } from '../src/walletEngine';
import { setupFlutterBridge } from '../src/bridge';

describe('walletEngine', () => {
    beforeEach(() => {
        (global as any).window = {};
        setupFlutterBridge();
    });

    describe('request', () => {
        it('should handle eth_accounts request', async () => {
            const mockResponse = ['0x123'];
            (window as any).flutter_inappwebview = {
                callHandler: jest.fn((handlerName, args) => {
                    setTimeout(() => {
                        (window as any).flutterBridge.receiveFromFlutter(args.callbackId, true, mockResponse);
                    }, 10);
                })
            };

            const result = await jsWalletEngine.request('eth_accounts', []);
            expect(result).toEqual(mockResponse);
        });

        it('should handle eth_chainId request', async () => {
            const mockResponse = '0x1';
            (window as any).flutter_inappwebview = {
                callHandler: jest.fn((handlerName, args) => {
                    setTimeout(() => {
                        (window as any).flutterBridge.receiveFromFlutter(args.callbackId, true, mockResponse);
                    }, 10);
                })
            };

            const result = await jsWalletEngine.request('eth_chainId', []);
            expect(result).toBe(mockResponse);
        });

        it('should throw error for unsupported method', async () => {
            await expect(jsWalletEngine.request('unsupported_method', []))
                .rejects
                .toThrow('Unsupported method: unsupported_method');
        });
    });

    describe('event handling', () => {
        it('should add and remove event listeners', () => {
            const listener = jest.fn();
            jsWalletEngine.on('test_event', listener);
            emitEvent('test_event', 'test_data');
            expect(listener).toHaveBeenCalledWith('test_data');

            jsWalletEngine.removeListener('test_event', listener);
            emitEvent('test_event', 'test_data2');
            expect(listener).toHaveBeenCalledTimes(1);
        });
    });
}); 