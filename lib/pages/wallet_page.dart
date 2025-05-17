import 'dart:js_util' as js_util;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class WalletPage extends StatefulWidget {
  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  String? walletAddress;
  String? error;

  Future<void> connectWallet() async {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('连接钱包')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (walletAddress != null)
              Text('已连接钱包: $walletAddress', style: TextStyle(fontSize: 18)),
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