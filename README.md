# Flutter Web3 Provider

一个用于Flutter WebView的Web3 Provider实现，支持EIP-1193规范和EIP-6963钱包发现协议。

## 安装

```bash
npm install flutter-web3-provider
```

## 使用方法

### 1. 在Flutter WebView中注入bridge

```dart
WebView(
  onWebViewCreated: (WebViewController controller) {
    controller.addJavaScriptChannel(
      'jsBridgeHandler',
      onMessageReceived: (JavaScriptMessage message) {
        // 处理来自Web的消息
      },
    );
  },
)
```

### 2. 传统方式使用Provider

```typescript
import { ourEIP1193Provider } from 'flutter-web3-provider';

// 使用Provider
const accounts = await ourEIP1193Provider.request({
  method: 'eth_requestAccounts'
});
```

### 3. 使用EIP-6963钱包发现协议

```typescript
import { initializeEIP6963 } from 'flutter-web3-provider';

// 初始化EIP-6963协议
initializeEIP6963();

// dApp可以这样发现你的钱包
window.addEventListener('eip6963:announceProvider', (event) => {
  const { info, provider } = event.detail;
  console.log('发现钱包:', info.name);
  // 使用provider
});

// dApp发送钱包发现请求
window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));
```

## 支持的方法

- eth_accounts
- eth_requestAccounts
- eth_chainId
- wallet_switchEthereumChain
- wallet_addEthereumChain
- eth_sendTransaction
- eth_signTransaction
- eth_sign
- personal_sign
- eth_signTypedData
- eth_signTypedData_v4
- eth_call
- eth_getBalance
- eth_getCode
- eth_getTransactionCount
- eth_getTransactionByHash
- eth_getTransactionReceipt
- eth_estimateGas
- eth_gasPrice
- eth_blockNumber
- eth_getBlockByNumber 