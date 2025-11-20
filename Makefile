# SPDX-License-Identifier: GPL-3.0-only
#
# Copyright (C) 2021-2025  sirpdboy  <herboy2008@gmail.com> 
# https://github.com/sirpdboy/luci-app-kucat-config
# This is free software, licensed under the Apache License, Version 2.0 .
#
include $(TOPDIR)/rules.mk
NAME:=kucat-config
PKG_NAME:=luci-app-$(NAME)
PKG_VERSION:=2.1.0
PKG_RELEASE:=20251117

PKG_MAINTAINER:=sirpdboy team <herboy2008@gmail.com>

LUCI_TITLE:=LuCI support for Kucat theme setting by sirpdboy
LUCI_DEPENDS:=+curl
LUCI_PKGARCH:=all


define Build/Compile
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
rm -f /tmp/luci-*
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/kucat
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
