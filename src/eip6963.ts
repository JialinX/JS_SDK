import { ourEIP1193Provider } from './provider';

// EIP-6963钱包信息
export const walletInfo = {
    uuid: "unique-provider-id", // 唯一标识符，生产环境需要确保真正唯一
    name: "Flutter Web3 Wallet",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMlpNMTIgMjBDNy41OSAyMCA0IDE2LjQxIDQgMTJDNCAxMC44NCA0LjIxIDkuNzMgNC41OCA4LjY3TDEwLjE3IDE0LjI3QzEwLjM3IDE0LjQ2IDEwLjY2IDE0LjU3IDEwLjk2IDE0LjU3QzExLjI2IDE0LjU3IDExLjU0IDE0LjQ2IDExLjc0IDE0LjI3TDEzLjUzIDEyLjQ3TDE1LjMzIDE0LjI3QzE1Ljc0IDE0LjY4IDE2LjQgMTQuNjggMTYuODEgMTQuMjdDMTcuMjIgMTMuODYgMTcuMjIgMTMuMiAxNi44MSAxMi43OUwxNS4wMSAxMEwxNi44MyA4LjE4QzE3LjI0IDcuNzcgMTcuMjQgNy4xMSAxNi44MyA2LjdDMTYuNDIgNi4yOSAxNS43NiA2LjI5IDE1LjM1IDYuN0wxMyA5LjA1TDEwLjA2IDYuMTFDMTAuNjEgNS43NCAxMS4yOSA1LjUgMTIgNS41QzE1LjAzIDUuNSAxNy41IDcuOTYgMTcuNSAxMUMxNy41IDExLjc4IDE3LjMzIDEyLjUzIDE3LjA0IDEzLjJDMTYuODIgMTMuNzMgMTcuMDYgMTQuMzIgMTcuNTkgMTQuNTRDMTguMTMgMTQuNzcgMTguNzEgMTQuNTIgMTguOTQgMTRDMTkuNDEgMTMuMDQgMTkuNjYgMTIuMDMgMTkuNjUgMTFDMTkuNjUgNi44NSAxNi4xNSAzLjM1IDEyIDMuMzVDMTAuOTYgMy4zNSA5Ljk2IDMuNTYgOS4wNiAzLjk0TDcuMjMgMi4xMUMxMC4yNSAwLjUyIDE0LjEzIDAuOTQgMTYuNyAzLjUxQzE5LjI3IDYuMDggMTkuNjkgOS45NiAxOC4xMSAxM0wxOS45IDExLjIxQzE5Ljk3IDExLjQ3IDIwIDExLjczIDIwIDEyQzIwIDE2LjQxIDE2LjQxIDIwIDEyIDIwWiIgZmlsbD0iIzJCOTBFRSIvPgo8L3N2Zz4K",
    rdns: "com.flutterweb3wallet"
};

// 初始化EIP-6963协议
export function initializeEIP6963() {
    // 监听钱包发现请求
    setupRequestListener();

    // 主动公告钱包
    announceProvider();
}

// 监听钱包请求事件
function setupRequestListener() {
    window.addEventListener("eip6963:requestProvider", () => {
        // 向请求方公告我们的provider
        announceProvider();
    });
}

// 公告钱包Provider
export function announceProvider() {
    window.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
            detail: {
                info: walletInfo,
                provider: ourEIP1193Provider
            }
        })
    );
}

// 页面加载时自动公告（延迟执行，避免与页面初始化冲突）
setTimeout(announceProvider, 0); 