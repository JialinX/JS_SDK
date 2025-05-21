import { initializeEIP6963, announceProvider, autoAnnounce, walletInfo } from '../src/eip6963';
import { ourEIP1193Provider } from '../src/provider';

describe('EIP-6963 Implementation', () => {
    let mockDispatchEvent: jest.Mock;
    let mockAddEventListener: jest.Mock;
    let mockSetTimeout: jest.Mock;

    beforeEach(() => {
        mockDispatchEvent = jest.fn();
        mockAddEventListener = jest.fn();
        mockSetTimeout = jest.fn((cb) => {
            cb();
            return 1;
        });

        // 关键：mock globalThis.window，确保 addEventListener 是 function
        Object.defineProperty(globalThis, 'window', {
            value: {
                dispatchEvent: mockDispatchEvent,
                addEventListener: mockAddEventListener,
                CustomEvent: class {
                    constructor(type: string, options: any) {
                        this.type = type;
                        this.detail = options.detail;
                    }
                    type: string;
                    detail: any;
                }
            },
            configurable: true,
            writable: true,
        });

        jest.spyOn(globalThis, 'setTimeout').mockImplementation(mockSetTimeout);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        // 清理 globalThis.window
        delete (globalThis as any).window;
    });

    it('should initialize EIP-6963 correctly', () => {
        initializeEIP6963();
        expect(mockAddEventListener).toHaveBeenCalledWith(
            'eip6963:requestProvider',
            expect.any(Function)
        );
    });

    it('should announce provider with correct wallet info', () => {
        announceProvider();
        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'eip6963:announceProvider',
                detail: {
                    info: walletInfo,
                    provider: ourEIP1193Provider
                }
            })
        );
    });

    it('should handle provider request event', () => {
        initializeEIP6963();
        const requestCallback = mockAddEventListener.mock.calls[0][1];

        // 模拟触发请求事件
        requestCallback();

        // 验证是否调用了 announceProvider
        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'eip6963:announceProvider'
            })
        );
    });

    it('should auto announce after initialization', () => {
        autoAnnounce();

        // 验证 setTimeout 被调用
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);

        // 验证 announceProvider 被调用
        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'eip6963:announceProvider'
            })
        );
    });
}); 