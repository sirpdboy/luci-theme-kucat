<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false,
    "line_length":200
  },
  "MD033": false,
  "MD041": false
} -->

[lede]: https://github.com/coolsnowwolf/lede
[official]: https://github.com/openwrt/openwrt
[immortalwrt]: https://github.com/immortalwrt/immortalwrt

![hello](https://views.whatilearened.today/views/github/sirpdboy/deplives.svg) [![](https://img.shields.io/badge/TG群-点击加入-FFFFFF.svg)](https://t.me/joinchat/AAAAAEpRF88NfOK5vBXGBQ)

# KuCat Theme Config Plugin

   You can set KuCat theme font size, color scheme, shortcut tools,
   
   and manage login and desktop background images here.
   
  <p align="center">
  <a target="_blank" href="https://github.com/sirpdboy/luci-theme-kucat/releases">
    <img src="https://img.shields.io/github/release/sirpdboy/luci-theme-kucat.svg?style=flat-square&label=luci-theme-kucat&colorB=green">
  </a>
</p>

[中文](README_CN.md) | [English]

![screenshots](https://raw.githubusercontent.com/sirpdboy/openwrt/master/doc/说明1.jpg)


# [luci-theme-kucat](https://github.com/sirpdboy/luci-theme-kucat)
- Development time: December 2021
- Release time: February 2023
- Open source date: April 2023
- Main supports LEDE18.06 and official 18.06 branch open source time: April 2023 version: 1.2.6
- JS supports official website 19.07-24.10 branch latest version: May 2025 version: 2.5.9 compatible with OPENWRT 24.10 branch.
- UCode version supports official website branch 19.07-24.10 latest version: November 2025 version: 3.1.2 compatible with OPENWRT latest version.
- The new version no longer supports the advancedplus plugin. Please use the matching Luci app ucat config dedicated JS version plugin.

# Function Introduction
- Being cool is beauty, born from movement.
- A toolbar with 5 shortcut keys.
- Basic BUG, adapted to all plugins currently available
- We have made a lot of optimizations for mobile phones and other devices
- There are matching theme setting tools, which can adjust shortcut keys, background images, and various color schemes to choose from.

# As mentioned earlier, the development of the Cool Cat theme drew inspiration and borrowed some code from Opentopd theme, Jerryk God's Argon theme, and Thinktip God's Neobird theme. Thank you for your valuable contributions!


# Special Instructions
- When there are advanced settings and KUCAT theme setting tools in the system, the settings in the advanced settings shall prevail.
- If there are any issues with the settings, you can restore them using function 4 after logging in via SSH.
- If it is an advanced setting, to restore the default settings, you can use:/etc/init.d/advancedplus reset
- If it is the KUCAT setting tool, to restore the default settings, you can use:/etc/init.d/kucat reset

## describe

- luci-theme-kucat  ：https://github.com/sirpdboy/luci-theme-kucat
- luci-app-kucat-config  ：https://github.com/sirpdboy/luci-app-kucat-config 


## Branch Introduction

There are currently two main branches that are adapted to different versions of the **OpenWrt** source code.  
The table below will provide a detailed introduction:

| Branch | Version | Description                        | Matching source                                           |
| ------ | ------- | ---------------------------------- | --------------------------------------------------------- |
| master | v3.x.x  | Support the latest version of LuCI | [Official OpenWrt][official] • [ImmortalWrt][immortalwrt] |
| 23.05  | v2.x.x  | Support the 23.05 version of LuCI  | [Official OpenWrt][official] • [ImmortalWrt][immortalwrt] |
| 18.06  | v1.x.x  | Support the 18.06 version of LuCI  | [Lean's LEDE][lede]                                         |

## Getting started

### Build for Lean's LEDE project

```bash
rm -rf luci-app-kucat-config # if have
git clone -b 18.06 https://github.com/sirpdboy/luci-theme-kucat.git luci-theme-kucat
make menuconfig #choose LUCI->Theme->luci-theme-kucat
make -j1 V=s
```
### Build for OpenWrt official SnapShots and ImmortalWrt

```bash
cd openwrt/package
git clone https://github.com/sirpdboy/luci-theme-kucat.git
make menuconfig #choose LUCI->Theme->Luci-theme-kucat
make -j1 V=s
```bash


### Install for LuCI 18.06 ( Lean's LEDE )

```bash
wget --no-check-certificate https://github.com/sirpdboy/luci-theme-kucat/releases/download/v1.5.6/luci-theme-kucat_1.5.6-20240302_all.ipk
opkg install luci-theme-kucat*.ipk
```

### Install for OpenWrt official SnapShots and ImmortalWrt

```bash
wget --no-check-certificate https://github.com/sirpdboy/luci-theme-kucat/releases/download/v2.6.18/luci-theme-kucat_2.6.18-r20251018_all.ipk
opkg install luci-theme-kucat*.ipk
```

### Install luci-app-kucat-config

```bash
wget --no-check-certificate -O luci-theme-kucat_2.6.10-r20250720_all.ipk https://github.com/sirpdboy/luci-app-kucat-config/releases/download/v1.1.0/luci-theme-kucat_2.6.10-r20250720_all.ipk
opkg install luci-app-kucat-config*.ipk
```


## interface

![screenshots](./doc/pc.jpg)

![screenshots](./doc/mob.jpg)

# My other project

- Watch Dog ： https://github.com/sirpdboy/luci-app-watchdog
- Net Speedtest ： https://github.com/sirpdboy/luci-app-netspeedtest
- Task Plan : https://github.com/sirpdboy/luci-app-taskplan
- Power Off Device : https://github.com/sirpdboy/luci-app-poweroffdevice
- OpentoPD Theme : https://github.com/sirpdboy/luci-theme-opentopd
- Ku Cat Theme : https://github.com/sirpdboy/luci-theme-kucat
- Ku Cat Theme Config : https://github.com/sirpdboy/luci-app-kucat-config
- NFT Time Control : https://github.com/sirpdboy/luci-app-timecontrol
- Parent Control: https://github.com/sirpdboy/luci-theme-parentcontrol
- Eqos Plus: https://github.com/sirpdboy/luci-app-eqosplus
- Advanced : https://github.com/sirpdboy/luci-app-advanced
- ddns-go : https://github.com/sirpdboy/luci-app-ddns-go
- Advanced Plus）: https://github.com/sirpdboy/luci-app-advancedplus
- Net Wizard: https://github.com/sirpdboy/luci-app-netwizard
- Part Exp: https://github.com/sirpdboy/luci-app-partexp
- Lukcy: https://github.com/sirpdboy/luci-app-lukcy

## HELP

|     <img src="https://img.shields.io/badge/-Alipay-F5F5F5.svg" href="#赞助支持本项目-" height="25" alt="图飞了"/>  |  <img src="https://img.shields.io/badge/-WeChat-F5F5F5.svg" height="25" alt="图飞了" href="#赞助支持本项目-"/>  | 
| :-----------------: | :-------------: |
|![xm1](https://raw.githubusercontent.com/sirpdboy/openwrt/master/doc/支付宝.png) | ![xm1](https://raw.githubusercontent.com/sirpdboy/openwrt/master/doc/微信.png) |

<a href="#readme">
    <img src="https://img.shields.io/badge/-TOP-orange.svg" alt="no" title="Return TOP" align="right"/>
</a>

![hello](https://visitor-badge-deno.deno.dev/sirpdboy.sirpdboy.svg) [![](https://img.shields.io/badge/TGGroup-ClickJoin-FFFFFF.svg)](https://t.me/joinchat/AAAAAEpRF88NfOK5vBXGBQ)
