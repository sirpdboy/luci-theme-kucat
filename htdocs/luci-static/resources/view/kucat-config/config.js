'use strict';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';
'require view';


var opacity_sets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20];
var ts_sets =  [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1];

return view.extend({

    load: function() {
		return Promise.all([
			uci.load('kucat')
		]);
    },

    render: function(data) {
		var m, s, o;
		m = new form.Map('kucat', _('KuCat Theme Config'),
			_('You can set KuCat theme font size, color scheme, shortcut tools, and manage login and desktop background images here.'));
		
		s = m.section(form.TypedSection, 'basic', '');
		s.anonymous = true;

		// Wallpaper Source
		o = s.option( form.ListValue, 'background', _('Wallpaper Source'), 
			_('Local wallpapers need to be uploaded by oneself, and those that are automatically downloaded will only be downloaded on the first visit every day, reducing frequent remote access and making usage smoother.'));
		o.value('0', _('Local wallpaper'));
		o.value('1', _('Auto download Iciba wallpaper'));
		o.value('2', _('Auto download unsplash wallpaper'));
		o.value('3', _('Auto download Bing wallpaper'));
		o.value('4', _('Auto download Bird 4K wallpaper'));
		o.default = '0';
		o.rmempty = false;
		
		// Set font size
		o = s.option( form.ListValue, 'fontmode', _('Set font size'));
		o.rmempty = false;
		o.value('0', _('Small font'));
		o.value('1', _('Normal font'));
		o.value('2', _('Large font'));
		o.default = '0';

		// Wallpaper synchronization
		o = s.option( form.Flag, 'bklock', _('Wallpaper synchronization'),
			_('Is the login wallpaper consistent with the desktop wallpaper? If selected, it means that the desktop wallpaper and login wallpaper are the same image.'));
		o.rmempty = false;
		o.default = '0';

		// Expand Toolbar
		o = s.option( form.Flag, 'setbar', _('Expand navigation bar'),
			_('Expand or shrink the five quick navigation bars'));
		o.rmempty = false;
		o.default = '0';

		// Refreshing mode
		o = s.option( form.Flag, 'bgqs', _('Refreshing mode'));
		o.rmempty = false;
		o.default = '0';

		// Enable Daily Word
		o = s.option( form.Flag, 'dayword', _('Enable Daily Word'));
		o.rmempty = false;
		o.default = '0';

		// Status Homekey settings
		o = s.option( form.ListValue, 'gohome', _('Status Homekey settings'));
		o.value('overview', _('Overview'));
		o.value('processes', _('Processes'));
		o.value('realtime', _('Realtime_Graphs'));
		o.value('netdata', _('Netdata'));
		o.default = 'overview';
		o.rmempty = false;

		// System Userkey settings
		o = s.option( form.ListValue, 'gouser', _('System Userkey settings'));
		o.value('kucat-config', _('KuCat Config'));
		o.value('netwizard', _('Netwizard'));
		o.value('system', _('System'));
		o.value('admin', _('Administration'));
		o.value('filemanager', _('File_Manager'));
		o.value('ttyd', _('Terminal'));
		o.value('poweroffdevice', _('PowerOff'));
		o.default = 'kucat';
		o.rmempty = false;

		// Services Ssrkey settings
		o = s.option( form.ListValue, 'gossr', _('Services Ssrkey settings'));
		o.value('shadowsocksr', _('SSR'));
		o.value('bypass', _('bypass'));
		o.value('nikki', _('Nikki'));
		o.value('passwall', _('passwall'));
		o.value('passwall2', _('passwall2'));
		o.value('openclash', _('OpenClash'));
		o.value('homeproxy', _('HomeProxy'));
		o.value('mosdns', _('MosDNS'));
		o.value('smartdns', _('SmartDNS'));
		o.value('AdGuardHome', _('AdGuard_Home'));
		o.default = 'OpenClash';
		o.rmempty = false;



		return m.render();
	}
});
