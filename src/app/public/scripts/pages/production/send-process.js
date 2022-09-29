/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            MtaSend.js	
 */
var SendProcess = function() 
{
    var initPage = function()
    { 
        $('#servers').val(null).change();
        $('#available-vmtas').html('').val(null).change();
        $('#selected-vmtas').html('').val(null).change();
        
        $('#affiliate-networks').val(null);
        $('#affiliate-networks').selectpicker('refresh');
        $('#affiliate-networks').change();
        
        $('#offers').html('').val(null);
        $('#offers').selectpicker('refresh');
        $('#offers').change();
        
        $('#filter-select-type').val('servers-by-name');
        $('#filter-select-type').selectpicker('refresh');
        $('#filter-select-type').change();
        
        $('select#data-providers-ids option').each(function(){ if($(this).attr('value') != '') { $(this).prop('selected',true); return false;}});
        $('#data-providers-ids').selectpicker('refresh');
        
        $('select#isps option').each(function(){ if($(this).attr('value') != '') { $(this).prop('selected',true); return false;}});
        $('#isps').selectpicker('refresh');
    };
    
    var handleTinyMCE = function()
    {
        tinymce.init({
            selector: ".tnymce",
            plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code table charmap hr pagebreak nonbreaking anchor lists wordcount imagetools textpattern help charmap quickbars emoticons',
            mobile: {
              plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code table charmap hr pagebreak nonbreaking anchor lists wordcount textpattern help charmap quickbars emoticons'
            },
            menubar: 'file edit view insert format tools table tc help',
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect code | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen code preview print | insertfile image media link anchor | a11ycheck ltr rtl | showcomments addcomment',
            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_noneditable_class: "mceNonEditable",
            toolbar_mode: 'sliding',
            contextmenu: "link image imagetools table configurepermanentpen"
        });
    }
    
    var handleSelects = function ()
    {
        $('.select-all-options').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            var parent = $(this).closest('div.form-group');
            var target = $(this).attr('data-target');
            var select = parent.find('select' + target).first();
        
            $(select).find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            select.change();
        });
        
        $('.select-all-v4-ips').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var target = $(this).attr("data-target");
            
            $('#' + target).find('option').each(function()
            {
                if($(this).html().indexOf(':') == -1)
                {
                    $(this).prop('selected', true);
                }
                else
                {
                    $(this).prop('selected', false);
                }
            });
            
            $('#' + target).change();
        });
        
        $('.select-all-v6-ips').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var target = $(this).attr("data-target");
            
            $('#' + target).find('option').each(function()
            {
                if($(this).html().indexOf(':') > -1)
                {
                    $(this).prop('selected', true);
                }
                else
                {
                    $(this).prop('selected', false);
                }
            });
            
            $('#' + target).change();
        });
        
        $('.deselect-all-options').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var parent = $(this).closest('div.form-group');
            var target = $(this).attr('data-target');
            var select = parent.find('select' + target).first();
        
            $(select).find('option').each(function(){
                $(this).prop('selected',false);
            });
            
            select.change();
        });
        
        $('select.select-actions').on('change',function(e)
        {
            e.stopPropagation();
            var count = $('option:selected',this).length;
            var parent = $(this).closest('div.form-group');
            var sibling = parent.find('span.options-sum').first();
            sibling.html('( ' + count + ' Selected )');
        });

        $('.move-selected-ips').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');
            
            $('#' + from + ' option:selected').each(function(){
               $(this).remove().appendTo('#' + to);   
            });
            
            $('#' + from).change();
            $('#' + to).change();
        });
    };
    
    var handleCopyingElements = function()
    {
        new Clipboard('.copy-selected-servers', 
        {
            text: function() 
            {
                var text = "";
                var index = 0;
                
                $('#servers option:selected').each(function(){
                    text += $(this).html().trim() + "\n";
                    index++;
                });
                
                return text.slice(0,-1);
            }
        });
        
        new Clipboard('.copy-selected-ips', 
        {
            text: function(trigger) 
            {
                var target = trigger.getAttribute('data-target');
                var text = "";
                var index = 0;
                
                $('#' + target + ' option:selected').each(function(){
                    text += $(this).attr('data-ip').trim() + "\n";
                    index++;
                });
                
                return text.slice(0,-1);
            }
        });
        
        new Clipboard('.copy-selected-rdns', 
        {
            text: function(trigger) 
            {
                var target = trigger.getAttribute('data-target');
                var text = "";
                var index = 0;
                
                $('#' + target + ' option:selected').each(function(){
                    text += $(this).attr('data-rdns').trim() + "\n";
                    index++;
                });
                
                return text.slice(0,-1);
            }
        });
        
        new Clipboard('.copy-selected-from-name', 
        {
            text: function() 
            {
                var selectedOption = $('#from-names').find('option:selected').first();
                var text = selectedOption == undefined ? "" : selectedOption.html();
                return text;
            }
        });
        
        new Clipboard('.copy-selected-subject', 
        {
            text: function() 
            {
                var selectedOption = $('#subjects').find('option:selected').first();
                var text = selectedOption == undefined ? "" : selectedOption.html();
                return text;
            }
        });
    };
    
    var handleFilterSelection = function()
    {
        $('.filter-selection').on('click',function()
        {
            var type = $('#filter-select-type').val();
            var values = $('#filter-select-text').val();
            values = values.split("\n");
            
            if(values != null && values != '' && values.length > 0)
            {
                if(type == 'servers-by-name')
                {
                    $('#servers').val(null).change();
                    
                    $('#servers option').each(function()
                    {
                        var selected = false;
                        
                        for (var i in values)
                        {
                            if($(this).html().trim().toLowerCase() == values[i].trim().toLowerCase())
                            {
                                selected = true;
                                break;
                            }
                        }
                        
                        $(this).prop('selected',selected);
                    });
                    
                    $('#servers').change();
                }
                else if(type == 'servers-by-name-cont')
                {
                    $('#servers').val(null).change();
                    
                    $('#servers option').each(function()
                    {
                        var selected = false;
                        
                        for (var i in values)
                        {
                            if($(this).html().trim().toLowerCase().indexOf(values[i].trim().toLowerCase()) > -1)
                            {
                                selected = true;
                                break;
                            }
                        }
                        
                        $(this).prop('selected',selected);
                    });
                    
                    $('#servers').change();
                }
                else if(type == 'servers-by-name-rev')
                {
                    $('#servers').val(null).change();
                    
                    $('#servers option').each(function()
                    {
                        var found = false;
                        
                        for (var i in values)
                        {
                            if($(this).html().trim().toLowerCase() == values[i].trim().toLowerCase())
                            {
                                found = true;
                                break;
                            }
                        }

                        if(found == false) $(this).prop('selected',true);
                    });
                    
                    $('#servers').change();
                }
                else
                {
                    var data = 
                    { 
                        'controller' : 'Servers',
                        'action' : 'serversFilterSearch',
                        'parameters' : 
                        {
                            'type' : type,
                            'servers-ids' : $('#servers').val(),
                            'values' : values
                        }
                    };
                    
                    $.ajax({
                        type: 'POST',
                        url: iResponse.getBaseURL() + '/api.json',
                        data : data,
                        dataType : 'JSON',
                        async: SendProcess.async,
                        success:function(result) 
                        {
                            if(result != false)
                            {
                                var status = result['status'];

                                if(status == 200)
                                {
                                    SendProcess.async = false;
                                    
                                    $('#servers').val(result['data']['servers']);
                                    $('#servers').change();
                                    
                                    $('.move-selected-ips[data-from=selected-vmtas]').click();
                                    
                                    $('#available-vmtas option').each(function(){
                                        $(this).prop('selected',false);
                                    });
                            
                                    $('#available-vmtas').change();
                                    $('#selected-vmtas').change();
                                    
                                    switch(type)
                                    {
                                        case 'vmtas-by-ip':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var selected = false;

                                                for (var i in values)
                                                {
                                                    if($(this).attr('data-ip').trim().toLowerCase() == values[i].trim().toLowerCase())
                                                    {
                                                        selected = true;
                                                        break;
                                                    }
                                                }

                                                $(this).prop('selected',selected);
                                            });

                                            break; 
                                        }
                                        case 'vmtas-by-ip-rev':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var found = false;

                                                for (var i in values)
                                                {
                                                    if($(this).attr('data-ip').trim().toLowerCase() == values[i].trim().toLowerCase())
                                                    {
                                                        found = true;
                                                        break;
                                                    }
                                                }

                                                if(found == false) $(this).prop('selected',true);
                                            });

                                            break; 
                                        }
                                        case 'vmtas-by-rdns':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var selected = false;

                                                for (var i in values)
                                                {
                                                    if($(this).attr('data-rdns').trim().toLowerCase() == values[i].trim().toLowerCase())
                                                    {
                                                        selected = true;
                                                        break;
                                                    }
                                                }

                                                $(this).prop('selected',selected);
                                            });
                                            
                                            break; 
                                        }
                                        case 'vmtas-by-rdns-rev':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var found = false;

                                                for (var i in values)
                                                {
                                                    if($(this).attr('data-rdns').trim().toLowerCase() == values[i].trim().toLowerCase())
                                                    {
                                                        found = true;
                                                        break;
                                                    }
                                                }

                                                if(found == false) $(this).prop('selected',true);
                                            });

                                            break; 
                                        }
                                        case 'vmtas-by-domain':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var selected = false;
                                                var domain = $(this).attr('data-rdns').trim().split('.').length > 2 ? $(this).attr('data-rdns').trim().split('.').slice(-2).join('.') : $(this).attr('data-rdns').trim();
                                               
                                                for (var i in values)
                                                {
                                                    if(domain == values[i].trim().toLowerCase())
                                                    {
                                                        selected = true;
                                                        break;
                                                    }
                                                }

                                                $(this).prop('selected',selected);
                                            });
                                            
                                            break; 
                                        }
                                        case 'vmtas-by-domain-rev':
                                        {
                                            $('#available-vmtas option').each(function()
                                            {
                                                var found = false;
                                                var domain = $(this).attr('data-rdns').trim().split('.').length > 2 ? $(this).attr('data-rdns').trim().split('.').slice(-2).join('.') : $(this).attr('data-rdns').trim();
                                               
                                                for (var i in values)
                                                {
                                                    if(domain == values[i].trim().toLowerCase())
                                                    {
                                                        found = true;
                                                        break;
                                                    }
                                                }

                                                if(found == false) $(this).prop('selected',true);
                                            });
                                            
                                            break; 
                                        }
                                    }
                                    
                                    $('#available-vmtas').change();
                                    $('#selected-vmtas').change();
                                    $('.move-selected-ips[data-from=available-vmtas]').click();
                                    
                                    SendProcess.async = true;
                                }
                                else
                                {
                                    iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                                }
                            }

                            iResponse.unblockUI();
                        },
                        error: function (jqXHR, textStatus, errorThrown) 
                        {
                            iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            iResponse.unblockUI();
                        }
                    });
                }
            }
        });
    };
    
    var handleRandomizeLines = function()
    {
        $('.randomize-lines').click(function(e)
        {
            e.preventDefault();
            
            var target = $(this).attr('data-randomize-target');
            var values = $('#' + target).val().replace(/^\s*[\r\n]/gm,"").split("\n");
            
            if(values.length > 0)
            {
                var currentIndex = values.length, temporaryValue, randomIndex;

                while (0 !== currentIndex) 
                {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex -= 1;

                  temporaryValue = values[currentIndex];
                  values[currentIndex] = values[randomIndex];
                  values[randomIndex] = temporaryValue;
                }
            }
            
            $('#' + target).val(values.join("\n"));
        });
        
        $('.randomize-headers-lines').click(function(e)
        {
            e.preventDefault();

            var values = $('#headers-tabs .tab-pane.active textarea').val().replace(/^\s*[\r\n]/gm,"").split("\n");
            
            if(values.length > 0)
            {
                var currentIndex = values.length, temporaryValue, randomIndex;

                while (0 !== currentIndex) 
                {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex -= 1;

                  temporaryValue = values[currentIndex];
                  values[currentIndex] = values[randomIndex];
                  values[randomIndex] = temporaryValue;
                }
            }
            
            $('#headers-tabs .tab-pane.active textarea').val(values.join("\n"));
        });
        
        $('.randomize-placeholders-lines').click(function(e)
        {
            e.preventDefault();

            var values = $('#placeholders-tabs .tab-pane.active textarea').val().replace(/^\s*[\r\n]/gm,"").split("\n");
            
            if(values.length > 0)
            {
                var currentIndex = values.length, temporaryValue, randomIndex;

                while (0 !== currentIndex) 
                {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex -= 1;

                  temporaryValue = values[currentIndex];
                  values[currentIndex] = values[randomIndex];
                  values[randomIndex] = temporaryValue;
                }
            }
            
            $('#placeholders-tabs .tab-pane.active textarea').val(values.join("\n"));
        });
        
        $('.calculate-lines').bind('input propertychange', function()
        {
            var values = $(this).val().replace(/^\s*[\r\n]/gm,"").split("\n");
            $(this).closest('.form-group').find('.lines-sum').first().html('( ' + values.length + ' Lines )');
        });
    };
    
    var handlePopupMenu = function()
    {
        $('#servers option').contextmenu({
            target: '#pmta-contextual-menu',
            before: function (e, element, target) 
            {
                e.preventDefault();
                $('#pmta-contextual-menu').attr('data-element-clicked',e.target.getAttribute('data-main-ip'));
                return true;
            }
        });
        
        $('#send-process-form').contextmenu({target: '#send-process-contextual-menu'});
    };
    
    var handlePmtaPopupMenu = function()
    {
        $('.show-pmta').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var type = $(this).attr('data-type');
            
            if(type == 'selected')
            {
                $('#servers option:selected').each(function(){
                    var win = window.open('http://' + $(this).attr('data-main-ip') + ':' + $('#pmta-port').val(),'pmta_' + $(this).attr('data-main-ip'));
                    
                    if (win) 
                    {
                        win.focus();
                    } 
                    else
                    {
                        alert('Please allow popups for this website');
                    }
                });
            }
            else if(type == 'all')
            {
                $('#servers option').each(function(){
                    var win = window.open('http://' + $(this).attr('data-main-ip') + ':' + $('#pmta-port').val(),'pmta_' + $(this).attr('data-main-ip'));
                    
                    if (win) 
                    {
                        win.focus();
                    } 
                    else
                    {
                        alert('Please allow popups for this website');
                    }
                });
            }
            else
            {
                var ip = $('#pmta-contextual-menu').attr('data-element-clicked');
                var win = window.open('http://' + ip + ':' + $('#pmta-port').val(),'pmta_' + ip);
                    
                if (win) 
                {
                    win.focus();
                } 
                else
                {
                    alert('Please allow popups for this website');
                }
            }
            
            $('#pmta-contextual-menu').hide();
        });
    };
    
    var handleMenuitemsEvent = function()
    {
        $('.pmta-monitors-trigger').click(function()
        {
            window.open(iResponse.getBaseURL() + '/pmta/commands');
        });
        
        $('.send-drop-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Drop');
        });
        
        $('.send-test-all-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Test All');
        });
        
        $('.send-test-servers-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Test Servers');
        });
        
        $('.send-test-ips-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Test Ip');
        });
        
        $('.send-test-emails-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Test Emails');
        });
        
        $('.send-test-placeholders-trigger').click(function(e)
        {
            e.preventDefault();
            submitForm('Test Placeholders');
        });
        
        $('.generate-links').click(function(e)
        {
            e.preventDefault();
            generateLinks();
        });
        
        $('.send-help').click(function(e)
        {
            e.preventDefault();
            $('#mta-drops-helper').modal('toggle');
        });
    };
    
    var handleSmtpMtaSwitch = function()
    {
        $('#smtp-mta-switcher').on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();
            
            if(state == true)
            {
                $('.available-vmta-user-label').html('Available Vmtas');
                $('.selected-vmta-user-label').html('Selected Vmtas');
                $('#vmta-send-type').removeAttr('disabled');
                $('#vmta-send-type').selectpicker('refresh');
                $('#batch').val('1000');
                $('#x-delay').val('1000');
                $('#vmtas-emails-process').removeAttr("disabled");
                $('#vmtas-emails-process').selectpicker('refresh');
                $('#vmtas-emails-process').val('vmtas-rotation');
                $('#vmtas-emails-process').selectpicker('refresh');
                $('#vmtas-emails-process').change();
                $('#header1').html(btoa($('.reset-headers').first().attr('data-original-mta-header')));
            }
            else
            {
                $('.available-vmta-user-label').html('Available Smtp Users');
                $('.selected-vmta-user-label').html('Selected Smtp Users');
                $('#vmta-send-type').prop('disabled',true);
                $('#vmta-send-type').selectpicker('refresh');
                $('#batch').val('1');
                $('#x-delay').val('0');
                $('#vmtas-emails-process').val('emails-per-period');
                $('#vmtas-emails-process').selectpicker('refresh');
                $('#vmtas-emails-process').change();
                $('#vmtas-emails-process').prop("disabled",true);
                $('#vmtas-emails-process').selectpicker('refresh');
                $('#header1').html(btoa($('.reset-headers').first().attr('data-original-smtp-header')));
            }
            
            $('.refresh-servers').click();
        });
    };
    
    var handlePlaceholders = function()
    {
        $('.add-placeholders').on('click',function(e) 
        { 
            e.preventDefault();
            var index = $('#placeholders-tabs').find('.nav-tabs').find('li.tab').size() + 1;
            $('#placeholders-tabs').find('.nav-tabs').first().append('<li class="tab" data-index="' + index + '"><a id="placeholders-tab-click-' + index + '" href="#placeholders-tab' + index + '" data-toggle="tab">Placeholder ' + index + ' &nbsp;&nbsp;&nbsp;<i class="fa fa-close delete-placeholder-tab pull-right" style="cursor: pointer" data-tab-index="' + index + '"></i></a></li>');
            $('#placeholders-tabs').find('.tab-content').first().append('<div class="tab-pane" id="placeholders-tab' + index + '" data-index="' + index + '"> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label class="control-label full-width">Placeholder Rotation</label> <input id="placeholder-rotation' + index + '" type="text" class="form-control input-number placeholders-rotation" value="1"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label class="control-label">Combination</label> <br/> <input id="placeholder-combination' + index + '" type="checkbox" class="make-switch placeholders-combination" data-on-text="ON" data-off-text="OFF" data-size="normal" style="width: 100%"> </div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="form-group"> <label class="control-label full-width"> Placeholders ( Separated By Line ) <span class="lines-sum" style="margin-left: 5px;">( 0 Lines )</span> </label> <textarea id="placeholder' + index + '" type="text" name="placeholders[]" class="form-control calculate-lines" style="height: 223px" spellcheck="off"></textarea></div></div></div></div>');
            $('#placeholders-count').html('( ' + index + ' placeholder(s) found )');
   
            if ($().tabdrop)
            {
                $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                    text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                });
            }
            
            handleRandomizeLines();
            $(".make-switch").bootstrapSwitch();    
                
            $('.placeholders-combination').on('switchChange.bootstrapSwitch', function(event, state) 
            { 
                event.preventDefault();
                var target = $(this).closest('.tab-pane').find('.placeholders-rotation').first();

                if(state == true)
                {
                    target.val('1');
                    target.prop('disabled',true);
                    return false;
                }
                else
                {
                    target.val('1');
                    target.prop('disabled',false);
                    return false;
                }
            });
            window.dispatchEvent(new Event('resize'));
            handlePlaceholderRemoveEvent();
        });
        
        $('.reset-placeholders').on('click',function(e)
        {
            e.preventDefault();
            
            swal({
                title: "Are you sure ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function()
            {
                var tabsHeaders = '<ul class="nav nav-tabs"><li class="tab active" data-index="1"><a id="placeholders-tab-click-1" href="#placeholders-tab1" data-toggle="tab">Placeholder 1 </a></li></ul>';
                var tabs = '<div class="tab-content"><div class="tab-pane active" id="placeholders-tab1" data-index="1"> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label class="control-label full-width">Placeholder Rotation</label> <input id="placeholder-rotation1" type="text" class="form-control input-number placeholders-rotation" value="1"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label class="control-label">Combination</label> <br/> <input id="placeholder-combionation1" type="checkbox" class="make-switch placeholders-combination" data-on-text="ON" data-off-text="OFF" data-size="normal" style="width: 100%"> </div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="form-group"> <label class="control-label full-width"> Placeholders ( Separated By Line ) <span class="lines-sum" style="margin-left: 5px;">( 0 Lines )</span> </label> <textarea id="placeholder1" type="text" name="placeholders[]" class="form-control calculate-lines" style="height: 223px" spellcheck="off"></textarea></div></div></div></div></div>';
                
                // delete all previous placeholders
                $('#placeholders-tabs').html('');
                $('#placeholders-tabs').html(tabsHeaders + tabs);
                $('#placeholders-count').html('( 1 placeholder found )');
                
                if ($().tabdrop)
                {
                    $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                        text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                    });
                }
                
                handleRandomizeLines();
                $(".make-switch").bootstrapSwitch();
                
                $('.placeholders-combination').on('switchChange.bootstrapSwitch', function(event, state) 
                { 
                    event.preventDefault();
                    var target = $(this).closest('.tab-pane').find('.placeholders-rotation').first();

                    if(state == true)
                    {
                        target.val('1');
                        target.prop('disabled',true);
                        return false;
                    }
                    else
                    {
                        target.val('1');
                        target.prop('disabled',false);
                        return false;
                    }
                });
        
                window.dispatchEvent(new Event('resize'));
            });
        });
    }
    
    
    var handleHeaders = function()
    {
        $('.add-headers').on('click',function(e) 
        { 
            e.preventDefault();
            var type = $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp';
            var index = $('#headers-tabs').find('.nav-tabs').find('li.tab').size() + 1;
            $('#headers-tabs').find('.nav-tabs').first().append('<li class="tab" data-index="' + index + '"><a id="tab-click-' + index + '" href="#tab' + index + '" data-toggle="tab">Header ' + index + ' &nbsp;&nbsp;&nbsp;<i class="fa fa-close delete-tab pull-right" style="cursor: pointer" data-tab-index="' + index + '"></i></a></li>');
            $('#headers-tabs').find('.tab-content').first().append('<div class="tab-pane" id="tab' + index + '"><textarea id="header' + index + '" data-widearea="enable" class="form-control" style="height: 300px;" name="headers[]" spellcheck="false" wrap="on">' + atob($('.reset-headers').first().attr('data-original-' + type + '-header')) + '</textarea></div>');
            $('#headers-count').html('( ' + index + ' header(s) found )');
   
            if ($().tabdrop)
            {
                $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                    text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                });
            }
            
            // initial wideArea
            wideArea();
                
            window.dispatchEvent(new Event('resize'));
            handleHeaderRemoveEvent();
        });
        
        $('.upload-headers').on('click',function(e) { e.preventDefault(); $('#headers-file').click(); }); 
        
        $('#headers-file').on('change',function()
        {
            var files = document.getElementById('headers-file').files;

            if(files != null && files != undefined && files.length > 0)
            {
                var index = 1;

                // delete all previous headers
                $('#headers-tabs .nav-tabs').html('');
                $('#headers-tabs .tab-content').html('');
                
                for (var i = 0; i < files.length; i++) 
                {
                    var reader = new FileReader();
                    reader.readAsText(files[i],'UTF-8');

                    reader.onload = function(e) 
                    {
                        var content = e.target.result;
                        
                        if(content != null && content != undefined && content != '')
                        {
                            var active = index == 1 ? 'active' : '';
                            var closeButton = index != 1 ? '&nbsp;&nbsp;&nbsp;<i class="fa fa-close delete-tab pull-right" style="cursor: pointer" data-tab-index="' + index + '"></i>' : '';
                            $('#headers-tabs .nav-tabs').append('<li class="tab" data-index="' + index + '"><a id="tab-click-' + index + '" href="#tab' + index + '" data-toggle="tab">Header ' + index + ' ' + closeButton + '</a></li>');
                            $('#headers-tabs .tab-content').append('<div class="tab-pane ' + active + '" id="tab' + index + '"><textarea id="header' + index + '" data-widearea="enable" class="form-control" style="height: 300px;" name="headers[]" spellcheck="false" wrap="on">' + content + '</textarea></div>');
                            $('#headers-count').html('( ' + index + ' header(s) found )');
                            index++;
                            
                            if ($().tabdrop)
                            {
                                $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                                    text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                                });
                            }
                            
                            // initial wideArea
                            wideArea();
                            
                            window.dispatchEvent(new Event('resize'));
                            handleHeaderRemoveEvent();
                        }
                    };
                }
            }
        });
        
        $('.reset-headers').on('click',function(e)
        {
            e.preventDefault();
            
            swal({
                title: "Are you sure ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function()
            {
                var type = $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp';
                var headers = [atob($('.reset-headers').first().attr('data-original-' + type + '-header'))];
                var tabsHeaders = '<ul class="nav nav-tabs">';
                var tabs = '<div class="tab-content">';
                var index = 1;

                // delete all previous headers
                $('#headers-tabs').html('');

                for (var i in headers) 
                {
                    var active = index == 1 ? 'active' : '';
                    tabsHeaders += '<li class="tab ' + active + '"><a id="tab-click-' + index + '" href="#tab' + index + '" data-toggle="tab">Header ' + index + '</a></li>';
                    tabs += '<div class="tab-pane ' + active + '" id="tab' + index + '"><textarea id="header' + index + '" data-widearea="enable" class="form-control" style="height: 300px;" name="headers[]" spellcheck="false" wrap="on">' + headers[i] + '</textarea></div>';
                    index++;
                }

                tabsHeaders += '</ul>';
                tabs += '</div>';

                $('#headers-tabs').html(tabsHeaders + tabs);
                $('#headers-count').html('( 1 header found )');
                
                if ($().tabdrop)
                {
                    $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                        text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
                    });
                }
                
                // initial wideArea
                wideArea();
                
                window.dispatchEvent(new Event('resize'));
            });
        });
        
        $('.select-predefined-headers').on('click',function(e)
        {
            e.preventDefault();
            $('#headers-display').modal('toggle');
        });
        
        $('#apply-headers').on('click',function(e)
        {
            e.preventDefault();
            
            $('#predefined-headers option:selected').each(function()
            {
                var index = $('#headers-tabs').find('.nav-tabs').find('li.tab').size() + 1;
                $('.add-headers').click();
                $('#header' + index).val(atob($(this).attr('data-header-content')));
            });
            
            $('#headers-display').modal('toggle');
        });
    };
    
    var handleHeaderRemoveEvent = function()
    {
        $('.delete-tab').unbind("click").on('click',function(e) 
        { 
            e.preventDefault();
            var button = $(this);

            swal({
                title: "Are you sure ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function()
            {
                var index = button.attr('data-tab-index');
                $("#tab-click-1").click();
                $("#tab-click-" + index).remove();
                $("#tab-click-" + index).parent().remove();   
                $("#tab" + index).remove();
                $('li.tab' + index).first().remove();
                index = $('#headers-tabs').find('.nav-tabs').find('li').size();
                $('#headers-count').html('( ' + (index - 1) + ' header(s) found )');
                window.dispatchEvent(new Event('resize'));
            });
        });
    };
    
    var handlePlaceholderRemoveEvent = function()
    {
        $('.delete-placeholder-tab').unbind("click").on('click',function(e) 
        { 
            e.preventDefault();
            var button = $(this);

            swal({
                title: "Are you sure ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function()
            {
                var index = button.attr('data-tab-index');
                $("#placeholders-tab-click-1").click();
                $("#placeholders-tab-click-" + index).remove();
                $("#placeholders-tab-click-" + index).parent().remove();   
                $("#placeholders-tab" + index).remove();
                $('#placeholders-tabs li.tab' + index).first().remove();
                index = $('#placeholders-tabs').find('.nav-tabs').find('li').size();
                $('#placeholders-count').html('( ' + (index - 1) + ' placeholder(s) found )');
                window.dispatchEvent(new Event('resize'));
            });
        });
    };
    
    var generateLinks = function()
    {
        var linkType = $('#link-type').val();
      
        if(linkType == null || linkType == undefined)
        {
            iResponse.alertBox({title: 'Please select a link type !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
            return false;
        }
        
        var offerId = $('#offers').val();
      
        if(offerId === null || offerId === undefined || parseInt(offerId) === 0 || offerId === '')
        {
            iResponse.alertBox({title: 'Please select an offer id !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
            return false;
        }
        
        var vmtas = $('#selected-vmtas').val();
      
        if(vmtas === null || vmtas === undefined || vmtas.length == 0)
        {
            iResponse.alertBox({title: 'Please select at least one vmta or smtp user !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
            return false;
        }

        iResponse.blockUI();

        if(linkType == 'routing-gcloud' || linkType == 'routing-bitly' || linkType == 'routing-tinyurl' 
        || linkType == 'attr-gcloud'  || linkType == 'attr-bitly' || linkType == 'attr-tinyurl')
        {

        }
        var data = 
        { 
            'controller' : 'Production',
            'action' : 'generateLinks',
            'parameters' : 
            {
                'vmta' : vmtas[0],
                'offer-id' : offerId,
                'link-type' : linkType,
                'send-type' : $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp',
                'static-domain' : $('#static-domain').val()
            }
        };

        $.ajax({
            type: 'POST',
            url: iResponse.getBaseURL() + '/api.json',
            data : data,
            dataType : 'JSON',
            async: SendProcess.async,
            success:function(result) 
            {
                if(result != false)
                {
                    var status = result['status'];

                    if(status == 200)
                    {
                        $("#generated-links .generated-links-container").html(result['data']['links']);
                        $("#generated-links").modal('toggle');
                    }
                    else
                    {
                        iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    }
                }

                iResponse.unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) 
            {
                iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                iResponse.unblockUI();
            }
        });
    };
    
    var handleAutoReplySwitch = function()
    {
        
        $('#auto-reply-combination').on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();

            if(state == true)
            {
                $('#auto-reply-rotation').prop('disabled',false);
                $('#auto-reply-mailboxes').prop('disabled',false);
                return false;
            }
            else
            {
                $('#auto-reply-rotation').prop('disabled',true);
                $('#auto-reply-mailboxes').prop('disabled',true);
                return false;
            }
        });
        
    };
    
    var handleEmailsProcess = function()
    {
        $('#vmtas-emails-process').on('change',function() 
        {
            var value = $(this).val();
            
            if(value == 'vmtas-rotation')
            {
                $("#number-of-emails").attr('disabled','true');
                $("#emails-period-value").attr('disabled','true');
                $("#emails-period-type").attr('disabled','true').selectpicker('refresh');
                $("#x-delay").removeAttr('disabled');
                $("#batch").removeAttr('disabled');
                $('#batch').val('1000');
                $('#x-delay').val('1000');
            }
            else
            {
                $("#number-of-emails").removeAttr('disabled');
                $("#emails-period-value").removeAttr('disabled');
                $("#emails-period-type").removeAttr('disabled').selectpicker('refresh');
                $("#x-delay").attr('disabled','true');
                $("#batch").attr('disabled','true');
                $('#batch').val('1');
                $('#x-delay').val('0');
            }
        });
        
        $('#emails-split-type').change(function(){
            handleSendStatistics();
        });
        
        $('#data-duplicate').on('keyup',function(){
            handleSendStatistics();
        });
        
        $('#rcpt-combination').on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();

            if(state == true)
            {
                $('#rcpt-rotation').prop('disabled',true);
                return false;
            }
            else
            {
                $('#rcpt-rotation').prop('disabled',false);
                return false;
            }
        });
        
        $('.placeholders-combination').on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();
            var target = $(this).closest('.tab-pane').find('.placeholders-rotation').first();
            
            if(state == true)
            {
                target.val('1');
                target.prop('disabled',true);
                return false;
            }
            else
            {
                target.val('1');
                target.prop('disabled',false);
                return false;
            }
        });
    };
    
    var handleServersRefresh = function()
    {
        $('.refresh-servers').on('click',function(e)
        {
            e.preventDefault();
            
            $('#servers').html("");
            $('#available-vmtas').html("");
            $('#selected-vmtas').html("");
            $('#servers').change();
            $('#available-vmtas').change();
            $('#selected-vmtas').change();
            
            var type = $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp';

            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getServers',
                'parameters' : 
                {
                    'type' : type
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json', 
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var servers = result['data']['servers'];
                            
                            for (var i in servers) 
                            {
                                if(type == 'smtp')
                                {
                                    $('#servers').append("<option value='" + servers[i]['id'] + "'>" + servers[i]['name'] + "</option>");
                                }
                                else
                                {
                                    $('#servers').append("<option value='" + servers[i]['id'] + "' data-main-ip='" + servers[i]['main_ip'] + "'>" + servers[i]['name'] + "</option>");
                                }
                            }
                            
                            $('#servers').change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
        
        $('#isps,#vmta-send-type').on('change',function()
        {
            var servers = $('#servers').val();
            $('.refresh-servers').click();
            $('#servers').val(servers);
            $('#servers').change();
        });
    };
    
    var handleServersChange = function()
    {
        $('#servers').on('change',function()
        {
            var serverIds = $(this).val();
            var ispId = $('#isps').val();
            var vmtasType = $('#vmta-send-type').val();
            
            $('#available-vmtas').html("");
            $('#selected-vmtas').html("");
            $('#available-vmtas').change();
            $('#selected-vmtas').change();
            
            if(serverIds == null || serverIds == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'getVmtas' : 'getSmtpUsers',
                'parameters' : 
                {
                    'server-ids' : serverIds,
                    'isp-id' : ispId,
                    'vmtas-type' : vmtasType
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json', 
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            if($('#smtp-mta-switcher').bootstrapSwitch('state') == false)
                            {
                                var smtpUsers = result['data']['smtp-users'];

                                for (var i in smtpUsers) 
                                {
                                    $('#available-vmtas').append("<option value='" + smtpUsers[i]['smtp_server_id'] + "|" + smtpUsers[i]['id'] + "' data-server-id='" + smtpUsers[i]['smtp_server_id'] + "'> " + smtpUsers[i]['username'] + "</option>");
                                }
                            }
                            else
                            {
                                var vmtas = result['data']['vmtas'];
                            
                                for (var i in vmtas) 
                                {
                                    var star = vmtas[i]['type'] != 'Default' ? '*' : ''; 
                                    var domain = vmtas[i]['type'] != 'Default' ? vmtas[i]['custom_domain'] : vmtas[i]['domain'];
                                    $('#available-vmtas').append("<option value='" + vmtas[i]['mta_server_id'] + "|" + vmtas[i]['id'] + "' data-server-id='" + vmtas[i]['mta_server_id'] + "' data-rdns='" + vmtas[i]['domain'] + "' data-ip='" + vmtas[i]['ip'] + "'>(" + vmtas[i]['mta_server_name'] + ") " + vmtas[i]['ip'] + " (" + domain + ") " + star + "</option>");
                                }
                            }

                            $('#available-vmtas option').each(function(){
                                $(this).prop('selected',true);
                            });
                            
                            $('#available-vmtas').change();
                            
                            $('.move-selected-ips[data-from=available-vmtas]').click();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
        
        $('#selected-vmtas').change(function(){
            handleSendStatistics();
        });
    };
    
    var handleAffiliateNetworksChange = function()
    {
        $('#affiliate-networks').on('change',function()
        {
            var affiliateNetworkId = $(this).val();
            
            $('#offers').html("");
            $('#offers').selectpicker('refresh');
            $('#offers').change();
            
            if(affiliateNetworkId == null || affiliateNetworkId <= 0 || affiliateNetworkId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getOffers',
                'parameters' : 
                {
                    'affiliate-network-id' : affiliateNetworkId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var offers = result['data']['offers']; 
                            
                            for (var i in offers) 
                            {
                                $('#offers').append("<option value='" + offers[i]['id'] + "'>(" + offers[i]['production_id'] + ") " + offers[i]['name'] + "</option>");
                            }
                            
                            $('#offers').selectpicker('refresh');
                            $('#offers').change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
    };
    
    var handleOffersChange = function()
    {
        $('#offers').on('change',function()
        {
            var offerId = $(this).val();
            
            $('#from-names').html("");
            $('#from-names').selectpicker('refresh');
            $('#from-names').change();
            
            $('#subjects').html("");
            $('#subjects').selectpicker('refresh');
            $('#subjects').change();
                            
            $('#creatives').html("");
            $('#creatives').selectpicker('refresh');
            $('#creatives').change();
            
            if(offerId == null || offerId <= 0 || offerId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getOfferDetails',
                'parameters' : 
                {
                    'offer-id' : offerId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var froms = result['data']['from-names'];
                            
                            for (var i in froms) 
                            {
                                $('#from-names').append("<option value='" + froms[i]['id'] + "'>" + froms[i]['value'] + "</option>");
                            }
                            
                            var subjects = result['data']['subjects'];
                            
                            for (var i in subjects) 
                            {
                                $('#subjects').append("<option value='" + subjects[i]['id'] + "'>" + subjects[i]['value'] + "</option>");
                            }
                            
                            var creatives = result['data']['creatives'];
                            
                            for (var i in creatives) 
                            {
                                $('#creatives').append("<option value='" + creatives[i]['id'] + "'>" + creatives[i]['name'] + "</option>");
                            }
                            
                            $('#from-names').selectpicker('refresh');
                            $('#from-names').change();
                            
                            $('#subjects').selectpicker('refresh');
                            $('#subjects').change();
                            
                            $("#creatives").val($("#creatives > option:nth-child(2)").val()).selectpicker('refresh');
                            $('#creatives').selectpicker('refresh');
                            $('#creatives').change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
    };
    
    var handleCreativesChange = function()
    {
        $('#creatives').on('change',function()
        {
            var creativeId = $(this).val();
            var linkType = $('#link-type').val();
            
            if(creativeId == null || creativeId <= 0 || creativeId == undefined)
            {
                return false;
            }
            
            $("#body").val('');
            $("#body").change();
                            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getCreativeDetails',
                'parameters' : 
                {
                    'creative-id' : creativeId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var creative = result['data']['creative'];
                            
                            // check for open tracking 
                            if($('#track-opens').val() == 'enabled')
                            {
                                if(linkType == 'routing-gcloud' || linkType == 'routing-bitly' || linkType == 'routing-tinyurl' 
                                || linkType == 'attr-gcloud'  || linkType == 'attr-bitly' || linkType == 'attr-tinyurl')
                                {
                                    creative += "<img alt='' src='[short_open]' width='1px' height='1px' style='visibility:hidden'/>";
                                }
                                else
                                {
                                    creative += "<img alt='' src='http://[domain]/[open]' width='1px' height='1px' style='visibility:hidden'/>";
                                }
                            }
                            
                            $("#body").val(creative);
                            $("#body").change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
        
        // short link change
        $('#link-type').on('change',function()
        {
            var body = $('#body').val();
            var value = $(this).val();

            if(value == 'routing-gcloud' || value == 'routing-bitly' || value == 'routing-tinyurl' 
            || value == 'attr-gcloud'  || value == 'attr-bitly' || value == 'attr-tinyurl')
            {
                body = body.replaceAll('http://[domain]/[open]','[short_open]');
                body = body.replaceAll('http://[domain]/[url]','[short_url]');
                body = body.replaceAll('http://[domain]/[unsub]','[short_unsub]');
                body = body.replaceAll('http://[domain]/[optout]','[short_optout]');

                body = body.replaceAll('http://[rdns]/[open]','[short_open]');
                body = body.replaceAll('http://[rdns]/[url]','[short_url]');
                body = body.replaceAll('http://[rdns]/[unsub]','[short_unsub]');
                body = body.replaceAll('http://[rdns]/[optout]','[short_optout]');
            } 
            else 
            {
                body = body.replaceAll('[short_open]','http://[domain]/[open]');
                body = body.replaceAll('[short_url]','http://[domain]/[url]');
                body = body.replaceAll('[short_unsub]','http://[domain]/[unsub]');
                body = body.replaceAll('[short_optout]','http://[domain]/[optout]');

                body = body.replaceAll('[short_open]','http://[rdns]/[open]');
                body = body.replaceAll('[short_url]','http://[rdns]/[url]');
                body = body.replaceAll('[short_unsub]','http://[rdns]/[unsub]');
                body = body.replaceAll('[short_optout]','http://[rdns]/[optout]');
            }

            $('#body').val(body);
        });

        // display creative
        $('.display-creative').on('click',function(e)
        {
            e.preventDefault();
            var body = $('#body').val();
            var vmtas = $('#selected-vmtas option:selected');
            
            if(vmtas.length > 0)
            {
                body = body.replaceAll('[domain]',vmtas.first().attr('data-rdns'));
            }

            $("#creative-frame").css("min-height", ($(window).height() - 200) + "px");
            var frame = document.getElementById('creative-frame');
            var doc = frame.contentDocument || frame.contentWindow.document;
            doc.write(body);
            doc.close(); 
            
            $('#creative-frame').load(function(){
                $('#creative-loading').hide();
                $(this).show();
            });
            
            $('#creative-display').modal('toggle');
        });

        $('.upload-negative').on('click',function(e) { e.preventDefault(); $('#negative-file').click(); });

        $('#negative-file').on('change',function()
        {
            if($(this).val() == undefined || $(this).val() == '')
            {
                iResponse.blockUI();
            
                var data = 
                { 
                    'controller' : 'Production',
                    'action' : 'deleteNegative',
                    'parameters' : 
                    {
                        'negative-file' : $('#negative-path').val()
                    }
                };

                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : data,
                    dataType : 'JSON',
                    async: SendProcess.async,
                    success:function(result) 
                    {
                        if(result != false)
                        {
                            var status = result['status'];

                            if(status == 200)
                            {
                                $('#negative-path').val('');
                                $('#body-label').html('Email Body');
                                iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                            }
                            else
                            {
                                iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            }
                        }

                        iResponse.unblockUI();
                    },
                    error: function (jqXHR, textStatus, errorThrown) 
                    {
                        iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        iResponse.unblockUI();
                    }
                });
            } 
            else
            {
                // get the form data 
                var formData = new FormData();               
                formData.append('controller','Production');
                formData.append('action','uploadNegative');
                formData.append('negative-file',$('#negative-file').prop('files')[0]);
                
                // upload file
                iResponse.blockUI();

                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : formData,
                    dataType : 'JSON',
                    async: SendProcess.async,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success:function(result) 
                    {
                        if(result != false)
                        {
                            var status = result['status'];

                            if(status == 200)
                            {
                                $('#negative-path').val(result['data']['negative-file']);
                                $('#body-label').html('Email Body ( Negative File Uploaded ! Do not forget [negative] ) <a class="tooltips remove-negative" data-container="body" data-placement="top" data-original-title="Remove Negative" title="Remove Negative" href="javascript:;" style="color :#525e64;">Remove File</a>');
                                $('.remove-negative').unbind('click').on('click',function(e) { e.preventDefault(); $('#negative-file').val(''); $('#negative-file').change(); });  
                
                                iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                            }
                            else
                            {
                                iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            }
                        }

                        iResponse.unblockUI();
                    },
                    error: function (jqXHR, textStatus, errorThrown) 
                    {
                        iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        iResponse.unblockUI();
                    }
                });
            }
        });
    };
    
    var handleEmailsLists = function()
    {
        $(".refresh-data-lists").on('click',function(e)
        {
            e.preventDefault();
            
            var isp = $("#isps").val();
            var offerId = $("#offers").val();
            var dataProvidersIds = $("#data-providers-ids").val();
            var countries = $("#countries").val();
            var verticals = $("#verticals").val();
         
            // clean last results
            $("#data-lists").html('');
            $('#data-lists-sum').html('( 0 Email List(s) Selected  , 0 Emails Selected )');
            
            if((isp == undefined || isp == '' || isp <= 0) && (dataProvidersIds == undefined || dataProvidersIds == '' || dataProvidersIds <= 0) && (countries == undefined || countries == '' || countries == null))
            {
                return false;
            }

            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getEmailsLists',
                'parameters' : 
                {
                    'offer-id' : offerId,
                    'isp-id' : isp,
                    'data-providers-ids' : dataProvidersIds,
                    'countries' : countries,
                    'verticals' : verticals,
                    'filters' : {
                        'fresh' : $('#fresh-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'clean' : $('#clean-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'openers' : $('#openers-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'clickers' : $('#clickers-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'unsubs' : $('#unsubs-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'optouts' : $('#optouts-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'leaders' : $('#leaders-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'seeds' : $('#seeds-filter').bootstrapSwitch('state') == true ? 'enabled' : 'disabled',
                        'offer-id' : $('#offers').val()
                    }
                }
            };

            iResponse.blockUI({ target: '#data-lists' });
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var lists = result['data']['lists'];

                            for (var i in lists)
                            {
                                $("#data-lists").append('<div class="row" style="margin-left: -5px;border-bottom: 1px #ccc solid;height: 35px !important;"> <div class="col-md-12" style="height: 100%;"> <div class="form-group" style="margin-top: 6px;"> <label class="control-label" style="margin-top: 3px;">(' + lists[i]['id'] + ') - ' + lists[i]['name'] + ' ( Initial Count : ' + lists[i]['total-count'] + ' , <span style="color:#2ab4c0">Filtered Count : ' + lists[i]['available-count'] + '</span>) </label> <div style="float: right;"> <input id="data-list-' + lists[i]['id'] + '" name="lists[]" type="checkbox" class="make-switch data-list-switch" data-size="mini" data-on-text="<i class=\'fa fa-check\'></i>" data-off-text="<i class=\'fa fa-times\'></i>" value="' + lists[i]['id'] + '" data-list-count="' + lists[i]['available-count'] + '"> </div> </div> </div> </div>');
                            }
                            
                            // reinit switch
                            $('.make-switch').bootstrapSwitch();
                            
                            // recall the switch event
                            handleEmailsListsChange();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI('#data-lists');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI('#data-lists');
                }
            }); 
        });
    };
    
    var handleEmailsListsChange = function()
    {
        $('.data-list-switch').on('switchChange.bootstrapSwitch', function () 
        {
            dataCountHandler();
            handleSendStatistics();
        });

        $('#data-count').on('keyup',function(){
            handleSendStatistics();
        });
    };
    
    var dataCountHandler = function()
    {
        var lists = 0;
        var count = 0;
        
        $('.data-list-switch').each(function()
        {
            if($(this).prop('checked') == true)
            {
                count += parseInt($(this).attr('data-list-count'));
                lists++;
            }
        });

        $('#data-lists-sum').html('( ' + lists + ' Email List(s) Selected  , ' + count + ' Emails Selected )');
        $('#data-lists-sum').attr('data-actual-count',count);
        $('#data-count').val(count);
    };
    
    var handleListsSelection = function()
    {
        $('.deselect-all-lists').on('click',function(){
            $('.data-list-switch').each(function()
            {
                $(this).bootstrapSwitch('state',false,false);
            });
        });
        
        $('.select-all-lists').on('click',function(){
            $('.data-list-switch').each(function()
            {
                $(this).bootstrapSwitch('state',true,false);
            });
        });
    };
    
    var handleSendStatistics = function()
    {
        if($('#servers').val() != null && $('#servers').val().length && $('#selected-vmtas').val() != null && $('#selected-vmtas').val().length)
        {
            var fullCount = parseInt($('#data-lists-sum').attr('data-actual-count'));
            var offsetCount = parseInt($('#data-count').val());
            var count =  (offsetCount > fullCount) ? fullCount : offsetCount;
            var limit = ($('#emails-split-type').val() == 'servers') ? Math.ceil(count / $('#servers').val().length) : Math.ceil(count / $('#selected-vmtas').val().length);
            
            $("#send-stats").html('');
            
            $('#servers option').each(function()
            {
                if($(this).is(':selected'))
                {
                    var dataDuplicate = parseInt($('#data-duplicate').val());
                    var vmtasCount = $('#selected-vmtas option:selected[data-server-id=' + $(this).attr('value') + ']').length;
                    var serverLimit = ($('#emails-split-type').val() == 'servers') ? limit * dataDuplicate : limit * vmtasCount * dataDuplicate;
                    $("#send-stats").append('<div class="row" style="margin-left: -5px;border-bottom: 1px #ccc solid;height: 35px !important;"> <div class="col-md-12" style="height: 100%;"> <div class="form-group" style="margin-top: 6px;"> <label class="control-label" style="margin-top: 3px;">Server : ' + $(this).html() + ' => ' + vmtasCount + ' Vmta(s) / ' + serverLimit + ' Email(s)</label>  </div> </div> </div>');
                }
            });
        }
    }
    
    var submitForm = function(type)
    {
        if(type != 'Drop')
        {
            proceedSend(type);
        }
        else
        {
            var offer = $('#offers').val();
            
            if(offer == undefined || offer == '')
            {
                iResponse.alertBox({title: "Please select an offer !", type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'checkForSuppression',
                'parameters' : 
                {
                    'offer-id' : offer
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var valid = result['data']['valid']; 
                            
                            if(valid == true)
                            {
                                swal({
                                    title: "You're About To Procceed a Drop !",
                                    text: "Are you sure ?",
                                    type: "warning",
                                    showCancelButton: true,
                                    closeOnConfirm: true,
                                    showLoaderOnConfirm: true
                                }, 
                                function ()
                                {
                                    proceedSend(type);
                                });
                            }
                            else
                            {
                                swal({
                                    title: "You should run suppression process on this offer !",
                                    text: "Are you sure you want to continue ?",
                                    type: "warning",
                                    showCancelButton: true,
                                    closeOnConfirm: true,
                                    showLoaderOnConfirm: true,
                                    confirmButtonClass:"btn-danger"
                                }, 
                                function ()
                                {
                                    proceedSend(type);
                                });
                            }
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        }
    };
    
    var proceedSend = function(type)
    {
        // get the form data 
        var formData = new FormData($("#send-process-form")[0]);
        
        // append class & method
        formData.append('controller','Production');
        formData.append('action','proceedSend');

        // check for from name 
        if($('#from-names').val() != null && $('#from-names').val() != undefined && $('#from-names').val() != '')
        {
            var fromName  = $("option:selected",'#from-names').html().replace(/(\r\n|\n|\r)/gm,"");
            var fromEncoding = $("#from-names-encoding").val();
 
            if(fromEncoding == 'b64')
            {
                fromName = "=?UTF-8?B?" + btoa(fromName) +  "?=";
            }
            else if(fromEncoding == 'uni')
            {
                fromName = "=?UTF-8?Q?=" + iResponse.encodeToUnicode(fromName).replaceAll(" ",'=') +  "?=";
            }

            formData.append('from-name',fromName);
        }
        
        // check for subject
        if($('#subjects').val() != null && $('#subjects').val() != undefined && $('#subjects').val() != '')
        {
            var subject  = $("option:selected",'#subjects').html().replace(/(\r\n|\n|\r)/gm,"");
            var subjectEncoding = $("#subjects-encoding").val();

            if(subjectEncoding == 'b64')
            {
                subject = "=?UTF-8?B?" + btoa(subject) +  "?=";
            }
            else if(subjectEncoding == 'uni')
            {
                subject = "=?UTF-8?Q?=" + iResponse.encodeToUnicode(subject).replaceAll(" ",'=') +  "?=";
            }

            formData.append('subject',subject);
        }
        
        // get send type 
        var mtaSmtpType = $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp';
        
        // add some other data
        formData.append('smtp-mta-type',mtaSmtpType);
        formData.append('type',type);
        formData.append('data-actual-count',$('#data-lists-sum').attr('data-actual-count'));

        // placeholders combinations
        $('.placeholders-combination').each(function(){
            formData.append('placeholders-combinations[]',$(this).bootstrapSwitch('state'));
        });
        
        // placeholders rotations
        $('.placeholders-rotation').each(function(){
            
            if($(this).prop('disabled'))
            {
                formData.append('placeholders-rotations[]',1);
            }
            else
            {
                formData.append('placeholders-rotations[]',$(this).val());
            }
        });
        
        $.ajax(
        {
            type: 'POST',
            url: iResponse.getBaseURL() + '/api.json',
            data : formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            success : function(result) 
            {
                if(result != false)
                {
                    var status = result['status'];

                    if(status == 200)
                    {
                        iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                    }
                    else
                    {
                        iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
               iResponse.alertBox({title:textStatus + ' : ' + errorThrown,type:"error",allowOutsideClick:"true",confirmButtonClass:"btn-danger"});
            }
        }); 
    };
    
    var handleProcessServers = function()
    {
        $('#' + ((iResponse.getCurrentURL().indexOf('-drops') > 0) ? 'drops' : 'tests') + '-processes').on('click','.show-process-servers',function(e) 
        {
            e.preventDefault();
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-type');

            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getProcessServers',
                'parameters' : 
                {
                    'type' : type,
                    'id' : id
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            $("#servers-names .modal-title").html('Process Servers List');
                            $("#servers-names .servers-names-container").html(result['data']['servers']);
                            $("#servers-names").modal('toggle');
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }

                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
    };
    
    var handleProcessLists = function()
    {
        $('#' + ((iResponse.getCurrentURL().indexOf('-drops') > 0) ? 'drops' : 'tests') + '-processes').on('click','.show-process-lists',function(e)
        {
            e.preventDefault();
            var id = $(this).attr('data-id');
            var type = $(this).attr('data-type');

            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getProcessLists',
                'parameters' : 
                {
                    'type' : type,
                    'id' : id
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var title = type == 'drop' ? 'Mta Drops Data Lists' : 'Mta Tests Data Lists';
                            $("#data-lists .modal-title").html(title);
                            $("#data-lists .data-lists-container").html(result['data']['lists']);
                            $("#data-lists").modal('toggle');
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }

                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
    };

    var handleProcessActions = function()
    {
        $('.execute-process-actions').on('click',function(event)
        {
            event.preventDefault();
            
            var target = $(this).attr('data-target');
            var type = $(this).attr('data-type');
            var action = $(this).attr('data-action-type');
            var processesIds = [];
            var i = 0;
            
            $('#' + target + ' .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    processesIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(processesIds.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one process !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            swal({
                title: "Are you sure ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function()
            {
                var data = 
                { 
                    'controller' : 'Production',
                    'action' : 'executeProcessAction',
                    'parameters' : 
                    {
                        'type' : type,
                        'action' : action,
                        'processes-ids' : processesIds
                    }
                };

                iResponse.blockUI();

                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : data,
                    dataType : 'JSON',
                    async: SendProcess.async,
                    success:function(result) 
                    {
                        if(result != false)
                        {
                            var status = result['status'];

                            if(status == 200)
                            {
                                iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                                
                                // refresh table 
                                $('.filter-submit').click();
                            }
                            else
                            {
                                iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            }
                        }

                        iResponse.unblockUI();
                    },
                    error: function (jqXHR, textStatus, errorThrown) 
                    {
                        iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        iResponse.unblockUI();
                    }
                }); 
            });
        });
    };
    
    var handleProcessDetails = function()
    {
        $('.show-process-details').on('click',function(event)
        {
            event.preventDefault();
            
            var target = $(this).attr('data-target');
            var type = $(this).attr('data-type');

            $('#' + target + ' .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    var win = window.open(iResponse.getBaseURL() + '/production/process-details/' + type + '/' + $(this).val() + '.html', type + '_' + $(this).val());
                    
                    if (win) 
                    {
                        win.focus();
                    } 
                    else
                    {
                        alert('Please allow popups for this website');
                    }
                }
            });
        });
    };
    
    var handleProcessResend = function()
    {
        $('.resend-process').on('click',function(event)
        {
            event.preventDefault();
            
            var target = $(this).attr('data-target');
            var type = $(this).attr('data-type');

            $('#' + target + ' .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    var win = window.open(iResponse.getBaseURL() + '/production/send-process/' + type + '/' + $(this).val() + '.html', type + '_' + $(this).val());
                    
                    if (win) 
                    {
                        win.focus();
                    } 
                    else
                    {
                        alert('Please allow popups for this website');
                    }
                }
            });
        });
        
        var processId = parseInt($('#process-id').val());
        var processType = $('#process-type').val();

        if(processId > 0)
        {
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getProcess',
                'parameters' : 
                {
                    'process-type' : processType,
                    'process-id' : processId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status']; 

                        if(status == 200)
                        {
                            var process = result['data']['process'];
                            
                            if(process != null)
                            {
                                SendProcess.async = false;
                                
                                $('#data-providers-ids').val(process['data-providers-ids']).change();
                                $('#isps').val(process['isp-id']).change();
                                $('#vmta-send-type').val(process['vmta-send-type']).change();
                                
                                // check process type state
                                if(process['process-type'] == 'sd' || process['process-type'] == 'st')
                                {
                                    $('#smtp-mta-switcher').bootstrapSwitch('state',false);
                                }

                                // select servers
                                if(process['servers'] != null) $('#servers').val(process['servers']).change();
                                
                                // select vmtas 
                                if(process['selected-vmtas'] != null)
                                {
                                    $('.move-selected-ips[data-from=selected-vmtas]').click();
                                    $('#available-vmtas').val(process['selected-vmtas']).change();
                                    $('.move-selected-ips[data-from=available-vmtas]').click();
                                }
                                
                                $('#vmta-rotation').val(process['vmta-rotation']).change();
                                
                                // select sponsors
                                $('#affiliate-networks').val(process['affiliate-network-id']).change();
                                
                                $('#offers').val(process['offer-id']);
                                $('#offers').selectpicker('refresh');
                                $('#offers').change();
                                
                                $('#creatives').val(process['offer-creative-id']);
                                $('#from-names').val(process['from-name-id']).change();
                                $('#from-names-encoding').val(process['from-names-encoding']).change();
                                $('#subjects').val(process['subject-id']).change();
                                $('#subjects-encoding').val(process['subjects-encoding']).change();
                                
                                // body part
                                $('#static-domain').val(process['static-domain']).change();
                                $('#creatives-content-type').val(process['creative-content-type']).change();
                                $('#creatives-charset').val(process['creative-charset']).change();
                                $('#link-type').val(process['link-type']).change();
                                $('#creatives-content-transfert-encoding').val(process['creative-content-transfert-encoding']).change();
                                $('#body').val(process['body']);
                                
                                // headers part
                                $('#return-path').val(process['return-path']).change();
                                $('#headers-rotation').val(process['headers-rotation']).change();
                                
                                if(process['headers'] != null && process['headers'].length > 0)
                                {
                                    $('#header1').val(process['headers'][0]);
                                    
                                    if(process['headers'].length > 1)
                                    {
                                        for (var i = 1; i < process['headers'].length; i++)
                                        {
                                            $('.add-headers').click();
                                            $('#header' + (i+1)).val(process['headers'][i]);
                                        }
                                    }
                                }
                                
                                // emails and test part 
                                $('#vmtas-emails-process').val(process['vmtas-emails-process']).change();
                                $('#test-threads').val(process['test-threads']).change();
                                $('#batch').val(process['batch']).change();
                                $('#x-delay').val(process['x-delay']).change();
                                
                                if(process['vmtas-emails-process'] != 'vmtas-rotation')
                                {
                                    $('#number-of-emails').val(process['number-of-emails']).change();
                                    $('#emails-period-value').val(process['emails-period-value']).change();
                                    $('#emails-period-type').val(process['emails-period-type']).change();
                                }
                                
                                if(process['track-opens'] == 'disabled')
                                {
                                    $('#track-opens').val('disabled').change();
                                }
                                else
                                {
                                    $('#track-opens').val('enabled').change();
                                }
                                
                                $('#test-after').val(process['test-after']).change();
                                $('#rcpt-rotation').val(process['rcpt-rotation']).change();
                                
                                if(process['rcpt-combination'] == 'on')
                                {
                                    $('#rcpt-combination').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#rcpt-combination').bootstrapSwitch('state',false);
                                }
                                
                                if(process['rcpts'] != null) $('#rcpts').val(process['rcpts']).change();
                                
                                if(process['placeholders'] != null && process['placeholders'].length > 0)
                                {
                                    $('#placeholder1').val(process['placeholders'][0]);
                                    $('#placeholder-rotation1').val(process['placeholders-rotations'][0]).change();
                                    
                                    if(process['placeholders-combinations'] != undefined && process['placeholders-combinations'].length > 0)
                                    {
                                        if(process['placeholders-combinations'][0] == 'on')
                                        {
                                            $('#placeholder-combination1').bootstrapSwitch('state',true);
                                        }
                                        else
                                        {
                                            $('#placeholder-combination1').bootstrapSwitch('state',false);
                                        }
                                    }
                                           
                                    if(process['placeholders'].length > 1)
                                    {
                                        for (var i = 1; i < process['placeholders'].length; i++)
                                        {
                                            $('.add-placeholders').click();
                                            $('#placeholder' + (i+1)).val(process['placeholders'][i]);
                                            $('#placeholder-rotation' + (i+1)).val(process['placeholders-rotations'][i]).change();
                                            
                                            if(process['placeholders-combinations'] != undefined && process['placeholders-combinations'].length > i)
                                            {
                                                if(process['placeholders-combinations'][i] == 'on')
                                                {
                                                    $('#placeholder-combination' + (i+1)).bootstrapSwitch('state',true);
                                                }
                                                else
                                                {
                                                    $('#placeholder-combination' + (i+1)).bootstrapSwitch('state',false);
                                                }
                                            }
                                        }
                                    }
                                }

                                // data lists part 
                                if(process['countries'] != null) $('#countries').val(process['countries']).change();
                                if(process['verticals'] != null) $('#verticals').val(process['verticals']).change();

                                if(process['fresh-filter'] != null && process['fresh-filter'] == 'on')
                                {
                                    $('#fresh-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#fresh-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['clean-filter'] != null && process['clean-filter'] == 'on')
                                {
                                    $('#clean-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#clean-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['openers-filter'] != null && process['openers-filter'] == 'on')
                                {
                                    $('#openers-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#openers-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['clickers-filter'] != null && process['clickers-filter'] == 'on')
                                {
                                    $('#clickers-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#clickers-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['leaders-filter'] != null && process['leaders-filter'] == 'on')
                                {
                                    $('#leaders-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#leaders-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['unsubs-filter'] != null && process['unsubs-filter'] == 'on')
                                {
                                    $('#unsubs-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#unsubs-filter').bootstrapSwitch('state',false);
                                }
                                
                                if(process['optout-filter'] != null && process['optout-filter'] == 'on')
                                {
                                    $('#optout-filter').bootstrapSwitch('state',true);
                                }
                                else
                                {
                                    $('#optout-filter').bootstrapSwitch('state',false);
                                }
                                
                                
                                if(process['seeds-filter'] != null && process['seeds-filter'] == 'on')
                                {
                                    $('#seeds-filter').bootstrapSwitch('state',true);
                                }
                                else 
                                {
                                    $('#seeds-filter').bootstrapSwitch('state',false);
                                }
                                
                                // refresh lists 
                                $('.refresh-data-lists').click();
                                
                                // select lists 
                                if(process['lists'] != null)
                                {
                                    for (var i in process['lists'])
                                    {
                                        $('#data-list-' + process['lists'][i]).bootstrapSwitch('state',true);
                                    }
                                }
                                
                                $('#emails-split-type').val(process['emails-split-type']).change();
                                $('#data-start').val(process['data-start']).change();
                                $('#data-count').val(process['data-count']).change();
                                $('#data-duplicate').val(process['data-duplicate']).change();

                                SendProcess.async = true;
                            }
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        }
    };
    
    var handleBouncesLogs = function()
    {
        $('.mta-bounce-logs').unbind("click").on('click',function(e)
        {
            e.preventDefault();
            
            var target = $(this).attr('data-target');
            var processesIds = [];
            var i = 0;
            
            $('#' + target + ' .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    processesIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(processesIds.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one process !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getMtaBounceLogs',
                'parameters' : 
                {
                    'processes-ids' : processesIds,
                    'process-type' : $(this).attr('data-type')
                }
            };
            
            iResponse.blockUI();

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: SendProcess.async,
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var name = result['data']['name'];
                            var content = result['data']['content'];

                            var a = document.createElement('a');
                            a.href = 'data:text/csv,' +  encodeURIComponent(content);
                            a.target = '_blank';
                            a.download = name;

                            document.body.appendChild(a);
                            a.click();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }

                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            }); 
        });
    };
    
    var async = true;
 
    return {
        init: function() 
        {
            if(iResponse.getCurrentURL().indexOf('send-process') > 0)
            {
                initPage();
                handleSelects();
                handleCopyingElements();
                handleFilterSelection();
                handleRandomizeLines();
                handlePopupMenu();
                handlePmtaPopupMenu();
                handleMenuitemsEvent();
                handleSmtpMtaSwitch();
                handleAutoReplySwitch();
                handleHeaders();
                handlePlaceholders();
                handleEmailsProcess();
                handleServersRefresh();
                handleServersChange();
                handleAffiliateNetworksChange();
                handleOffersChange();
                handleCreativesChange();
                handleSendStatistics();
                handleEmailsLists();
                handleListsSelection();
                handleProcessResend();
                handleTinyMCE();
            }
            else
            {
                handleProcessServers();
                handleProcessLists();
                handleProcessActions();
                handleProcessDetails();
                handleProcessResend();
                handleBouncesLogs();
            }
        }
    };
}();

// initialize and activate the script
$(function(){ SendProcess.init(); });