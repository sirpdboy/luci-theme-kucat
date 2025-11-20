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

    render: function() {
		var m, s, o;

		m = new form.Map('kucat', _('KuCat Theme Color Schemes List'), 
			_('Pre set 6 color schemes, enable wallpaper as desktop wallpaper, theme RGB values such as 255,0,0 (representing red), dark mode with wallpaper blur for better effect. No matter how many schemes are enabled, only the first scheme should be used'));
		var s = m.section(form.TableSection, 'theme', '');
		s.addremove = true;
		s.anonymous = false;
		s.sortable = true;

		o = s.option(form.Value, 'remarks', _('Remarks'),
			_('Give a descriptive name for this color scheme'));
		o.rmempty = false;

		o = s.option(form.Flag, 'use', _('Enable'),
			_('Enable this color scheme'));
		o.rmempty = false;
		o.default = '1';
		o = s.option(form.Flag, 'bkuse', _('Use wallpaper'),
			_('Use desktop wallpaper'));
		o.rmempty = false;
		o.default = '1';

		o = s.option(form.ListValue, 'mode', _('Light dark mode'),
			_('Select the theme appearance mode'));
		o.value('auto', _('Auto'));
		o.value('light', _('Light'));
		o.value('dark', _('Dark'));
		o.default = 'light';
		o.rmempty = false;

		o = s.option(form.Value, 'primary_rgbm', _('Main color(RGB)'),
			_("RGB values like '255,0,0' for red, or use preset names"));
		o.value('blue', _('RoyalBlue'));
		o.value('green', _('MediumSeaGreen'));
		o.value('orange', _('SandyBrown'));
		o.value('red', _('TomatoRed'));
		o.value('black', _('Black tea eye protection gray'));
		o.value('gray', _('Cool night time(gray and dark)'));
		o.value('bluets', _('Cool Ocean Heart (transparent and bright)'));
		o.rmempty = false;
		o.default = '74,161,133';
		o = s.option(form.ListValue, 'primary_rgbm_ts', _('Wallpaper transparency'),
			_('Wallpaper transparency level (0: Transparent, 1: Opaque)'));
		for (var i = 0; i < ts_sets.length; i++) {
			o.value(ts_sets[i].toString(), ts_sets[i].toString());
		}
		o.rmempty = false;
		o.default = '0.9';

		o = s.option(form.ListValue, 'primary_opacity', _('Wallpaper blur radius'),
			_('Wallpaper blur effect (0: no blur)'));
		for (var i = 0; i < opacity_sets.length; i++) {
			o.value(opacity_sets[i].toString(), opacity_sets[i].toString());
		}
		o.datatype = 'ufloat';
		o.rmempty = false;
		o.default = '0';
		o = s.option(form.Value, 'primary_rgbs', _('Fence Color(RGB)'),
			_("Fence background color in RGB (suggest dark values)"));
		o.default = '225,112,88';
		o.rmempty = false;

		o = s.option(form.ListValue, 'primary_rgbs_ts', _('Fence color transparency'),
			_('Fence background transparency (0: Transparent, 1: Opaque)'));
		for (var i = 0; i < ts_sets.length; i++) {
			o.value(ts_sets[i].toString(), ts_sets[i].toString());
		}
		o.datatype = 'ufloat';
		o.rmempty = false;
		o.default = '0.1';

		return m.render();
	}
});
