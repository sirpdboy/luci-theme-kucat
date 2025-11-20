'use strict';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';
'require view';

var callAvailSpace = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'space'
});

var callDelkucat = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'deld',
    params: ['filename'],
    expect: { '': {} }
});

var callRenamekucat = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'renamed',
    params: ['newname'],
    expect: { '': {} }
});

var callReadFile = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'read_file',
    params: ['filename'],
    expect: { '': {} }
});

var bg_path = '/www/luci-static/kucat/background/';

return view.extend({
    load: function() {
        return Promise.all([
            uci.load('kucat'),
            L.resolveDefault(callAvailSpace(), {}),
            L.resolveDefault(fs.list(bg_path), {})
        ]);
    },

    render: function(data) {
        var m, s, o;

        m = new form.Map('kucat', _('Desktop Wallpaper Upload'),
            _('Kucat Theme Desktop Background Wallpaper Upload and Management.'));

        // 添加样式
        var style = E('style', {}, `
            /* 浏览模式切换 */
            .view-mode-toggle {
                margin: 0 15px;
                display: flex;
            }
            .view-mode-btn {
                padding: 8px 16px;
                background: #999;
                cursor: pointer;
                border-radius: 4px;
            }
            .view-mode-btn.active {
                background: #007cff;
                color: white;
                border-color: #007cff;
            }
            
            /* 大图网格布局 */
            .grid-view {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin: 0 15px;
            }
            .grid-item {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            .grid-item:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            .grid-item.selected {
                border-color: #007cff;
                background: #f0f8ff;
            }
            .grid-preview {
                width: 100%;
                height: 120px;
                object-fit: cover;
                border-radius: 4px;
                margin-bottom: 8px;
            }
            .grid-info {
                font-size: 12px;
                color: #666;
            }
            .grid-name {
                font-weight: bold;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* 选择控制 */
            .selection-controls {
                margin: 0 15px ;
            }
            .selection-info {
                margin-top: 12px;
                font-weight: bold;
                font-size: 14px;
            }
            .selection-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .selection-batch-actions {
                display: flex;
                gap: 2px;
                align-items: center;
                flex-wrap: wrap;
            }
            .batch-action-btn {
                padding: 6px 12px;
                border: 1px solid #6c757d;
                background: #6c757d;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            .batch-action-btn:hover {
                background: #5a6268;
                border-color: #545b62;
            }
            .batch-action-btn.select-all {
                background: #28a745;
                border-color: #28a745;
            }
            .batch-action-btn.select-all:hover {
                background: #218838;
                border-color: #1e7e34;
            }
            .batch-action-btn.invert {
                background: #17a2b8;
                border-color: #17a2b8;
            }
            .batch-action-btn.invert:hover {
                background: #138496;
                border-color: #117a8b;
            }
            
            /* 复选框样式 */
            .file-checkbox {
                margin-right: 8px;
            }
            .grid-checkbox {
                position: absolute;
                top: 5px;
                left: 5px;
                z-index: 2;
                transform: scale(1.2);
            }
            
            /* 图片加载失败样式 */
            .image-error {
                width: 80px;
                height: 60px;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 12px;
                border: 1px solid #ddd;
                border-radius: 3px;
                align-content: center;
            }
            .grid-image-error {
                width: 100%;
                height: 120px;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 12px;
                border-radius: 4px;
                margin-bottom: 8px;
            }
            
            /* 预览模态框 */
            .preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .preview-modal-content {
                max-width: 90%;
                max-height: 90%;
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .preview-modal-image {
                max-width: 100%;
                max-height: 80vh;
                border-radius: 4px;
            }
            .preview-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                border: none;
                border-radius: 50%;
                width: 40px!important;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .preview-modal-info {
                margin-top: 10px;
                color: #333;
            }
        `);

        var container = E('div', { 'class': 'cbi-map' });
        container.appendChild(style);

        container.appendChild(E('h3', _('Desktop Wallpaper Upload')));
        container.appendChild(E('div', { 'class': 'cbi-section-descr' }, [
            E('p', _('Available space: %1024.2mB').format(data[1].space * 1024)),
            E('p', _('You can upload files in formats such as gif/jpg/png/webp to create your favorite wallpapers')),
            E('p', _('Files will be uploaded to <code>%s</code>.').format(bg_path))
        ]));

        var uploadBtn = E('button', {
            'class': 'btn cbi-button cbi-button-action',
            'style': 'margin: 10px 0;',
            'click': ui.createHandlerFn(this, function(ev) {
                var file = '/tmp/kucat_desktop_bg.tmp';
                return ui.uploadFile(file, ev.target).then(function(res) {
                    console.log('Upload completed, res:', res);
                    if (!res || !res.name) {
                        throw new Error(_('No file selected or upload failed'));
                    }
                    return L.resolveDefault(callRenamekucat(res.name), {}).then(function(ret) {
                        if (ret && ret.result === 0) {
                            ui.addNotification(null, E('p', _('File uploaded successfully!')));
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            var errorMsg = ret ? (ret.error || 'Unknown error') : 'No response from server';
                            ui.addNotification(null, E('p', _('Failed to upload file: %s').format(errorMsg)));
                            return L.resolveDefault(fs.remove(file), {});
                        }
                    }).catch(function(rpcError) {
                        console.error('RPC call error:', rpcError);
                        ui.addNotification(null, E('p', _('RPC call failed: %s').format(rpcError.message || rpcError)));
                        return L.resolveDefault(fs.remove(file), {});
                    });
                }).catch(function(e) {
                    console.error('Upload error:', e);
                    ui.addNotification(null, E('p', _('Upload error: %s').format(e.message)));
                    return L.resolveDefault(fs.remove(file), {});
                });
            })
        }, _('Upload...'));
        
        container.appendChild(uploadBtn);
        
        container.appendChild(E('div', { 'style': 'text-align: right; font-style: italic;' }, [
            E('span', {}, [
                _('© github '),
                E('a', { 
                    'href': 'https://github.com/sirpdboy', 
                    'target': '_blank',
                    'style': 'text-decoration: none;'
                }, 'by sirpdboy')
            ])
        ]));

        var files = data[2] || [];
        if (files.length > 0) {
            container.appendChild(E('h3', _('Background file list')));
            
            // 浏览模式切换
            var viewModeToggle = E('div', { 'class': 'view-mode-toggle' }, [
                E('button', {
                    'class': 'view-mode-btn active',
                    'data-mode': 'list',
                    'click': ui.createHandlerFn(this, function(ev) {
                        document.querySelectorAll('.view-mode-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        ev.target.classList.add('active');
                        listView.style.display = 'table';
                        gridView.style.display = 'none';
                        selectedFiles.clear();
                    })
                }, _('List View')),
                E('button', {
                    'class': 'view-mode-btn',
                    'data-mode': 'grid',
                    'click': ui.createHandlerFn(this, function(ev) {
                        document.querySelectorAll('.view-mode-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        ev.target.classList.add('active');
                        listView.style.display = 'none';
                        gridView.style.display = 'grid';
                        selectedFiles.clear();
                    })
                }, _('Grid View'))
            ]);
            
            container.appendChild(viewModeToggle);
            
            // 存储选中的文件
            var selectedFiles = new Set();
            var allFileNames = files.map(file => file.name);
            
            // 选择控制面板
            var selectionControls = E('div', { 'class': 'selection-controls' }, [

                E('div', { 'class': 'selection-batch-actions' }, [
		
                    E('button', {
                        'class': 'batch-action-btn select-all',
                        'click': ui.createHandlerFn(this, function() {
                            // 全选功能
                            selectedFiles.clear();
                            allFileNames.forEach(filename => {
                                selectedFiles.add(filename);
                            });
                            updateSelectionControls();
                            updateAllCheckboxes(true);
                        })
                    }, _('Select All')),
                    E('button', {
                        'class': 'batch-action-btn invert',
                        'click': ui.createHandlerFn(this, function() {
                            // 反选功能
                            allFileNames.forEach(filename => {
                                if (selectedFiles.has(filename)) {
                                    selectedFiles.delete(filename);
                                } else {
                                    selectedFiles.add(filename);
                                }
                            });
                            updateSelectionControls();
                            updateAllCheckboxes();
                        })
                    }, _('Invert Selection')),
                    E('button', {
                        'class': 'batch-action-btn',
                        'click': ui.createHandlerFn(this, function() {
                            // 取消全选
                            selectedFiles.clear();
                            updateSelectionControls();
                            updateAllCheckboxes(false);
                        })
                    }, _('Select None')),
                    E('button', {
                        'class': 'btn cbi-button cbi-button-remove',
                        'click': ui.createHandlerFn(this, function() {
                            if (selectedFiles.size === 0) {
                                ui.addNotification(null, E('p', _('Please select files to delete.')));
                                return;
                            }
                            
                            var filenames = Array.from(selectedFiles);
                            var confirmMsg = _('Are you sure you want to delete %d selected files?').format(selectedFiles.size);
                            
                            if (confirm(confirmMsg)) {
                                var deletePromises = filenames.map(function(filename) {
                                    return L.resolveDefault(callDelkucat(filename), {});
                                });
                                
                                Promise.all(deletePromises).then(function(results) {
                                    var successCount = results.filter(function(ret) {
                                        return ret && ret.result === 0;
                                    }).length;
                                    
                                    if (successCount === filenames.length) {
                                        ui.addNotification(null, E('p', _('File deleted successfully!')));
                                    } else {
                                        ui.addNotification(null, E('p', _('Some files failed to delete.')));
                                    }
                                    location.reload();
                                }).catch(function(error) {
                                    ui.addNotification(null, E('p', _('Delete operation failed: %s').format(error.message)));
                                });
                            }
                        })
                    }, _('Delete Selected')),

                    E('div', { 'class': 'selection-info' }, _('Selected: 0 files'))
                ])
            ]);
            
            container.appendChild(selectionControls);
            
            // 更新所有复选框状态
            function updateAllCheckboxes(checked) {
                if (checked === true || checked === false) {
                    // 设置所有复选框为指定状态
                    document.querySelectorAll('.file-checkbox, .grid-checkbox').forEach(checkbox => {
                        checkbox.checked = checked;
                    });
                    document.querySelectorAll('.grid-item').forEach(item => {
                        if (checked) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                    });
                } else {
                    // 根据selectedFiles更新复选框状态
                    document.querySelectorAll('.file-checkbox, .grid-checkbox').forEach(checkbox => {
                        checkbox.checked = selectedFiles.has(checkbox.value);
                    });
                    document.querySelectorAll('.grid-item').forEach(item => {
                        var checkbox = item.querySelector('.grid-checkbox');
                        if (checkbox && selectedFiles.has(checkbox.value)) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                    });
                }
            }
            
            // 更新选择控制面板
            function updateSelectionControls() {
                var info = selectionControls.querySelector('.selection-info');
                var selectedCount = selectedFiles.size;
                var totalCount = allFileNames.length;
                info.textContent = _('Selected: %d of %d files').format(selectedCount, totalCount);
                
                // 如果选择了所有文件，显示特殊提示
                if (selectedCount === totalCount && totalCount > 0) {
                    info.innerHTML = _('Selected: <strong>All %d files</strong>').format(totalCount);
                }
            }
            
            // 列表视图
            var listView = E('table', { 
                'class': 'table cbi-section-table',
                'style': 'display: table;'
            }, [
                E('tr', { 'class': 'tr table-titles' }, [
                    E('th', { 'class': 'th' }, [ _('Select') ]),
                    E('th', { 'class': 'th' }, [ _('Preview') ]),
                    E('th', { 'class': 'th' }, [ _('Filename') ]),
                    E('th', { 'class': 'th' }, [ _('Modified date') ]),
                    E('th', { 'class': 'th' }, [ _('Size') ])
                ])
            ]);
            
            // 网格视图
            var gridView = E('div', { 
                'class': 'grid-view',
                'style': 'display: none;'
            });
            
            files.forEach(L.bind(function(file) {
                var previewUrl = '/luci-static/kucat/background/' + file.name;
                var timestamp = new Date().getTime();
                
                // 列表视图行
                var row = E('tr', { 'class': 'tr' });
                
                // 选择列
                var selectCell = E('td', { 'class': 'td' });
                var checkbox = E('input', {
                    'type': 'checkbox',
                    'class': 'file-checkbox',
                    'value': file.name,
                    'change': ui.createHandlerFn(this, function(ev) {
                        if (ev.target.checked) {
                            selectedFiles.add(file.name);
                        } else {
                            selectedFiles.delete(file.name);
                        }
                        updateSelectionControls();
                    })
                });
                selectCell.appendChild(checkbox);
                row.appendChild(selectCell);
                
                // 预览列
                var previewCell = E('td', { 'class': 'td' });
                var previewContainer = E('div', { 'style': 'display: flex;justify-content: center;' });
                
                    var smallPreview = E('img', {
                        'class': 'file-list-preview',
                        'src': previewUrl + '?t=' + timestamp,
                        'alt': file.name,
                        'title': _('Click to view larger preview'),
                        'style': 'cursor: pointer; width: 80px; height: 60px; object-fit: cover;',
                        'onerror': "this.style.display='none'; this.nextElementSibling.style.display='block';",
                        'click': ui.createHandlerFn(this, function() {
                            showImagePreview(file, previewUrl);
                        })
                    });
                    
                    var errorDiv = E('div', { 
                        'class': 'image-error',
                        'style': 'display: none;'
                    }, _('Unknow file'));
                    
                    previewContainer.appendChild(smallPreview);
                    previewContainer.appendChild(errorDiv);
                previewCell.appendChild(previewContainer);
                row.appendChild(previewCell);
                
                // 文件名列
                row.appendChild(E('td', { 'class': 'td' }, [ file.name ]));
                
                // 修改日期列
                row.appendChild(E('td', { 'class': 'td' }, [ 
                    new Date(file.mtime * 1000).toLocaleString() 
                ]));
                
                // 文件大小列
                row.appendChild(E('td', { 'class': 'td' }, [ 
                    String.format('%1024.2mB', file.size) 
                ]));

                listView.appendChild(row);
                
                // 网格视图项
                var gridItem = E('div', { 
                    'class': 'grid-item',
                    'click': ui.createHandlerFn(this, function(ev) {
                        // 如果点击的不是复选框，则显示预览
                        if (!ev.target.matches('input[type="checkbox"]')) {
                                showImagePreview(file, previewUrl);
                        }
                    })
                });
                
                var gridCheckbox = E('input', {
                    'type': 'checkbox',
                    'class': 'grid-checkbox',
                    'value': file.name,
                    'change': ui.createHandlerFn(this, function(ev) {
                        ev.stopPropagation();
                        if (ev.target.checked) {
                            selectedFiles.add(file.name);
                            gridItem.classList.add('selected');
                        } else {
                            selectedFiles.delete(file.name);
                            gridItem.classList.remove('selected');
                        }
                        updateSelectionControls();
                    })
                });
                
                var gridImageContainer = E('div', { 'style': 'position: relative;' });
                
                    var gridPreview = E('img', {
                        'class': 'grid-preview',
                        'src': previewUrl + '?t=' + timestamp,
                        'alt': file.name,
                        'onerror': "this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    });
                    
                    var gridError = E('div', { 
                        'class': 'grid-image-error',
                        'style': 'display: none;'
                    }, _('Unknow file'));
                    
                    gridImageContainer.appendChild(gridPreview);
                    gridImageContainer.appendChild(gridError);
                
                var gridName = E('div', { 'class': 'grid-name' }, file.name);
                var gridInfo = E('div', { 'class': 'grid-info' }, [
                    String.format('%1024.2mB', file.size),
                    E('br'),
                    new Date(file.mtime * 1000).toLocaleDateString()
                ]);
                
                gridItem.appendChild(gridCheckbox);
                gridItem.appendChild(gridImageContainer);
                gridItem.appendChild(gridName);
                gridItem.appendChild(gridInfo);
                
                gridView.appendChild(gridItem);
                
            }, this));
            
            container.appendChild(listView);
            container.appendChild(gridView);
            
            function showImagePreview(file, previewUrl) {
                var modal = E('div', { 'class': 'preview-modal' }, [
                    E('button', {
                        'class': 'preview-modal-close',
                        'click': function() {
                            modal.remove();
                        }
                    }, '×'),
                    E('div', { 'class': 'preview-modal-content' }, [
                        E('img', {
                            'class': 'preview-modal-image',
                            'src': previewUrl + '?t=' + new Date().getTime(),
                            'alt': file.name,
                            'onerror': "this.parentNode.removeChild(this);"
                        }),
                        E('div', { 'class': 'preview-modal-info' }, [
                            E('div', { 'style': 'font-weight: bold;' }, file.name),
                            E('div', { 'style': 'font-size: 14px; color: #666;' }, 
                                String.format(_('Size: %1024.2mB, Modified: %s'), 
                                file.size, new Date(file.mtime * 1000).toLocaleString()))
                        ])
                    ])
                ]);
                
                // 点击模态框背景关闭
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
                
                // ESC键关闭
                document.addEventListener('keydown', function closeOnEsc(e) {
                    if (e.key === 'Escape') {
                        modal.remove();
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                });
                
                document.body.appendChild(modal);
            }
            
        } else {
            container.appendChild(E('h3', _('Background file list')));
            container.appendChild(E('p', E('em', _('No files found.'))));
        }

        return container;
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
