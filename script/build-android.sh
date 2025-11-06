#!/bin/bash
set -e

trap "echo 'Quá trình build bị hủy bởi người dùng.'; exit 1" SIGINT
cd android
echo "Building APKs..."
./gradlew assembleRelease || { echo "Build APK thất bại!"; exit 1; }
cd ..

current_time=$(date +"%Y%m%d_%H%M%S")
version=$(node -p "require('./package.json').version")

# Lấy ABI của thiết bị đang kết nối
device_abi=$(adb shell getprop ro.product.cpu.abi | tr -d '\r')
echo "Thiết bị ABI: $device_abi"

# Danh sách ABI cần xử lý
abis=("arm64-v8a" "armeabi-v7a" "x86" "x86_64" "universal")
appname="task_manager"
# Duyệt qua từng ABI, copy + rename + cài nếu phù hợp
for abi in "${abis[@]}"; do
  input_path="android/app/build/outputs/apk/release/app-${abi}-release.apk"

  if [[ -f "$input_path" ]]; then
    output_name="${appname}_${version}_${abi}.apk"
    output_path="android/app/build/outputs/apk/release/${output_name}"

    mv "$input_path" "$output_path"
    echo "APK tạo: $output_path"

    # Nếu ABI khớp thiết bị thì cài đặt
    if [[ "$abi" == "$device_abi" ]]; then
      echo "Installing APK to device: $output_name"
      adb install -r "$output_path" || echo "Cài đặt thất bại!"
    fi
  else
    echo "Không tìm thấy APK cho ABI: $abi"
  fi
done
