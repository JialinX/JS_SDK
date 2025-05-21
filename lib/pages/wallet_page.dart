import 'dart:js_util' as js_util;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'dart:developer' as developer;

class WalletPage extends StatefulWidget {
  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  String? walletAddress;
  String? error;

  Future<void> connectWallet() async {
    // 显示确认弹窗
    bool? confirm = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('确认连接'),
          content: Text('是否确认连接钱包？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text('取消'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text('确认'),
            ),
          ],
        );
      },
    );

    // 如果用户点击取消，直接返回
    if (confirm != true) {
      return;
    }

    try {
      if (!kIsWeb) {
        setState(() {
          error = '请在Web端（Chrome浏览器）运行';
        });
        return;
      }
      final ethereum = js_util.getProperty(js_util.globalThis, 'ethereum');
      if (ethereum == null) {
        setState(() {
          error = '未检测到钱包插件，请先安装如MetaMask、OKX、Bitget等钱包插件。';
        });
        return;
      }
      // 用js_util.callMethod调用request，参数用jsify转为JS对象，返回Promise
      final accounts = await js_util.promiseToFuture<List>(
        js_util.callMethod(ethereum, 'request', [
          js_util.jsify({'method': 'eth_requestAccounts'})
        ]),
      );
      String? address;
      if (accounts.isNotEmpty) {
        address = accounts[0].toString();
      }
      if (address != null) {
        setState(() {
          walletAddress = address;
          error = null;
        });
      } else {
        setState(() {
          error = '未能获取到钱包地址';
        });
      }
    } catch (e) {
      String msg = '连接失败: $e';
      // 处理MetaMask用户拒绝授权的情况
      if (e is Map && e['code'] == 4001) {
        msg = '用户拒绝了钱包连接请求';
      } else if (e.toString().contains('4001')) {
        msg = '用户拒绝了钱包连接请求';
      }
      setState(() {
        error = msg;
      });
    }
  }

  void _onButtonPressed(String name) async {
    // 显示确认弹窗
    bool? confirm = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('确认操作'),
          content: Text('是否确认执行 $name 操作？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text('取消'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text('确认'),
            ),
          ],
        );
      },
    );

    // 如果用户点击取消，直接返回
    if (confirm != true) {
      return;
    }

    try {
      final ethereum = js_util.getProperty(js_util.globalThis, 'ethereum');
      if (ethereum == null) {
        setState(() {
          error = '未检测到钱包插件';
        });
        return;
      }

      switch (name) {
        case 'send message':
          // 发送消息
          await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'eth_sendTransaction',
                'params': [{
                  'from': walletAddress,
                  'to': '0x0000000000000000000000000000000000000000',
                  'data': '0x',
                }]
              })
            ]),
          );
          break;

        case 'sign message':
          // 签名消息
          final message = 'Hello Web3!';
          final result = await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'personal_sign',
                'params': [message, walletAddress]
              })
            ]),
          );
          print('签名结果: $result');
          break;

        case 'get balance':
          // 获取余额
          final balance = await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'eth_getBalance',
                'params': [walletAddress, 'latest']
              })
            ]),
          );
          print('余额: $balance');
          break;

        case 'send transaction':
          // 发送交易
          await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'eth_sendTransaction',
                'params': [{
                  'from': walletAddress,
                  'to': '0x0000000000000000000000000000000000000000',
                  'value': '0x0',
                }]
              })
            ]),
          );
          break;

        case 'getter':
          // 调用合约的getter方法
          await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'eth_call',
                'params': [{
                  'to': '0x0000000000000000000000000000000000000000',
                  'data': '0x',
                }, 'latest']
              })
            ]),
          );
          break;

        case 'setter':
          // 调用合约的setter方法
          await js_util.promiseToFuture(
            js_util.callMethod(ethereum, 'request', [
              js_util.jsify({
                'method': 'eth_sendTransaction',
                'params': [{
                  'from': walletAddress,
                  'to': '0x0000000000000000000000000000000000000000',
                  'data': '0x',
                }]
              })
            ]),
          );
          break;
      }

      // 显示成功提示
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$name 操作执行成功')),
      );

    } catch (e) {
      setState(() {
        error = '操作失败: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('连接钱包')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (walletAddress != null) ...[
              Text('已连接钱包: $walletAddress', style: TextStyle(fontSize: 18)),
              const SizedBox(height: 24),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('send message'),
                    child: Text('send message'),
                  ),
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('sign message'),
                    child: Text('sign message'),
                  ),
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('get balance'),
                    child: Text('get balance'),
                  ),
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('send transaction'),
                    child: Text('send transaction'),
                  ),
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('getter'),
                    child: Text('getter'),
                  ),
                  ElevatedButton(
                    onPressed: () => _onButtonPressed('setter'),
                    child: Text('setter'),
                  ),
                ],
              ),
            ],
            if (error != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text(error!, style: TextStyle(color: Colors.red)),
              ),
            if (walletAddress == null)
              ElevatedButton(
                onPressed: connectWallet,
                child: Text('连接钱包'),
              ),
          ],
        ),
      ),
    );
  }
} 