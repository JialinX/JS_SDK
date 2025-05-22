#!/bin/bash

# 安装 Flutter
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# 安装 Flutter 依赖
flutter doctor
flutter pub get

# 构建 Web 版本
flutter build web

# 确保构建输出目录存在
mkdir -p build/web 