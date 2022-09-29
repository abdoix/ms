/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            ServersInstallation.js	
 */
var ServersInstallation = function() 
{
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
        
        $('.move-option-vert').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var target = $(this).attr('data-target');
            var direction = $(this).attr('data-dir');
            var parent = $(this).closest('div.form-group');
            var select = parent.find('select' + target).first();
            var selIndex = select[0].selectedIndex;
            
            var increment = -1;
            if(direction == 'up')
                    increment = -1;
            else
                    increment = 1;
            
            if(-1 == selIndex) 
            {
                iResponse.alertBox({title: "Please select an option to move.", type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return;
            }
            
            if((selIndex + increment) < 0 || (selIndex + increment) > (select[0].options.length-1)) 
            {
		return;
            }

            var selValue = select[0].options[selIndex].value;
            var selText = select[0].options[selIndex].text;
            select[0].options[selIndex].value = select[0].options[selIndex + increment].value
            select[0].options[selIndex].text = select[0].options[selIndex + increment].text
            select[0].options[selIndex + increment].value = selValue;
            select[0].options[selIndex + increment].text = selText;
            select[0].selectedIndex = selIndex + increment;
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
        
        $('select.select-actions').unbind("change").on('change',function(e)
        {
            e.stopPropagation();
            
            var maxIps = $('#random-quantity').val() == undefined ? 60 : parseInt($('#random-quantity').val());
            var count = $('option:selected',this).length;
            var parent = $(this).closest('div.form-group');
            var sibling = parent.find('span.options-sum').first();
            sibling.html('( ' + count + ' IPs Selected )');
            
            // check for total selected 
            parent = $(this).closest('div.row');
            var ipsv4 = parent.find('select.ips-v4-mapping').first();
            var ipsv6 = parent.find('select.ips-v6-mapping').first();
            var count4 = $('option:selected',ipsv4).length;
            var count6 = $('option:selected',ipsv6).length;
            
            if((count4 + count6) > (maxIps * 2)) iResponse.alertBox({title: 'Each domain should contain only a total of ' + maxIps + ' ips!', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
        });
        
        $('#update-ips').on('change',function()
        {
            if($(this).is(':checked'))
            {
                $('#activate-dkim').prop('disabled',false);
                $('#activate-dkim').closest('label').removeClass('mt-checkbox-disabled');
                if(!$('#activate-dkim').is(':checked')) $('#activate-dkim').click();
                
                $('#activate-dmarc').prop('disabled',false);
                $('#activate-dmarc').closest('label').removeClass('mt-checkbox-disabled');
                if($('#activate-dmarc').is(':checked')) $('#activate-dmarc').click();
                
                $('#keep-old-subs').prop('disabled',false);
                $('#keep-old-subs').closest('label').removeClass('mt-checkbox-disabled');
                if(!$('#keep-old-subs').is(':checked')) $('#keep-old-subs').click();
            }
            else
            {
                if($('#activate-dkim').is(':checked')) $('#activate-dkim').click();       
                $('#activate-dkim').closest('label').addClass('mt-checkbox-disabled');
                $('#activate-dkim').prop('disabled',true);
                
                if($('#activate-dmarc').is(':checked')) $('#activate-dmarc').click();
                $('#activate-dmarc').closest('label').addClass('mt-checkbox-disabled');
                $('#activate-dmarc').prop('disabled',true);
      
                if($('#keep-old-subs').is(':checked')) $('#keep-old-subs').click();       
                $('#keep-old-subs').closest('label').addClass('mt-checkbox-disabled');
                $('#keep-old-subs').prop('disabled',true);

                $('#use-predefined-subs').closest('label').addClass('mt-checkbox-disabled');
                $('#use-predefined-subs').prop('disabled',true);
            }
        });
        
        $('#keep-old-subs').on('change',function()
        {
            if($(this).is(':checked'))
            {
                $('#use-predefined-subs').closest('label').addClass('mt-checkbox-disabled');
                $('#use-predefined-subs').prop('disabled',true);
            }
            else
            {
                $('#use-predefined-subs').prop('disabled',false);
                $('#use-predefined-subs').closest('label').removeClass('mt-checkbox-disabled');
            }
        });
        
        $('#install-tracking').on('change',function()
        {
            if($(this).is(':checked'))
            {
                $('#use-brands').prop('disabled',false);
                $('#use-brands').closest('label').removeClass('mt-checkbox-disabled'); 
                if(!$('#use-brands').is(':checked')) $('#use-brands').click();
                $('#use-ssl-certs').prop('disabled',false);
                $('#use-ssl-certs').closest('label').removeClass('mt-checkbox-disabled'); 
                if(!$('#use-ssl-certs').is(':checked')) $('#use-ssl-certs').click();
            }
            else
            {
                if($('#use-brands').is(':checked')) $('#use-brands').click();    
                $('#use-brands').closest('label').addClass('mt-checkbox-disabled');
                $('#use-brands').prop('disabled',true);
                if($('#use-ssl-certs').is(':checked')) $('#use-ssl-certs').click();    
                $('#use-ssl-certs').closest('label').addClass('mt-checkbox-disabled');
                $('#use-ssl-certs').prop('disabled',true);
            }
        });
    };

    var handleServersChangeEvent = function () 
    { 
        $('#servers').change(function()
        {
            // clear previous
            $('#server-id').html('-');
            $('#server-name').html('-');
            $('#server-ip').html('-');
            $('#server-os').html('-');
            $('#server-ram').html('-');
            $('#server-storage').html('-');
            $('#server-ips-v4-sum').html('-');
            $('#server-ips-v6-sum').html('-');
            $('.ips-v4-mapping').html('').change();
            $('.ips-v6-mapping').html('').change();
            $('select.domains-mapping').html('');
            $('select.domains-mapping').selectpicker('refresh');
            
            $('.mapping-item').each(function()
            {
                if(!$(this).hasClass('first'))
                {
                    $(this).slideUp(500).remove();
                }
            });
            
            var serverId = $(this).val();
            var template = $('.mapping-add').first().attr('data-template');
            
            if(serverId != undefined && serverId > 0)
            {
                var data = 
                {
                    'controller': 'Servers',
                    'action': 'getServerInfo',
                    'parameters':
                    {
                        'server-id': serverId,
                        'template' : template
                    }
                };

                iResponse.blockUI();
                
                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : data,
                    dataType : 'JSON',
                    timeout: 3600000,
                    success:function(result) 
                    {
                        if(result != false)
                        {
                            var status = result['status'];

                            if(status == 200)
                            {
                                $('#server-id').html(result['data']['server-id']);
                                $('#server-name').html(result['data']['server-name']);
                                $('#server-ip').html(result['data']['server-ip']);
                                $('#server-os').html(result['data']['server-os']);
                                $('#server-ram').html(result['data']['server-ram']);
                                $('#server-storage').html(result['data']['server-storage']);
                                $('#server-ips-v4-sum').html(result['data']['server-ips-v4-sum']);
                                $('#server-ips-v6-sum').html(result['data']['server-ips-v6-sum']);
                                $('.ips-v4-mapping').html(result['data']['ips-v4-options']);
                                $('.ips-v6-mapping').html(result['data']['ips-v6-options']);
                                $('select.domains-mapping').html(result['data']['domains-options']);
                                $('select.domains-mapping').selectpicker('refresh');
                                
                                // check if there are already installed domains
                                if("first-domain" in result['data'] && result['data']['first-domain'] != null && result['data']['first-domain'] != undefined && result['data']['first-domain'] != '')
                                {
                                    var firstDomainValue = result['data']['first-domain'];
                                    var domain = firstDomainValue.split('|')[1];
                                    
                                    $('select.domains-mapping[data-index="0"]').val(firstDomainValue);
                                    $('select.domains-mapping[data-index="0"]').selectpicker('refresh');

                                    $('select.ips-v4-mapping[data-index="0"] option').each(function()
                                    {
                                        if($(this).attr('domain') == domain)
                                        {
                                            $(this).prop('selected',true);
                                        }
                                    });

                                    $('select.ips-v6-mapping[data-index="0"] option').each(function()
                                    {
                                        if($(this).attr('domain') == domain)
                                        {
                                            $(this).prop('selected',true);
                                        }
                                    });

                                    $('select.ips-v4-mapping[data-index="0"]').change();
                                    $('select.ips-v6-mapping[data-index="0"]').change();
                                    
                                    $('.mapping-container').append(result['data']['mapping']);
                            
                                    // refresh events 
                                    handleSelects();
                                    
                                    var indexes = result['data']['indexes'];

                                    for (var i in indexes) 
                                    {
                                        $('select.domains-mapping[data-index="' + indexes[i] + '"]').selectpicker({iconBase:"fa",tickIcon:"fa-check",dropupAuto:false});
                                        $('select.domains-mapping[data-index="' + indexes[i] + '"]').selectpicker('refresh');
                                        $('select.domains-mapping[data-index="' + indexes[i] + '"]').change();

                                        $('select.ips-v4-mapping[data-index="' + indexes[i] + '"]').change();
                                        $('select.ips-v6-mapping[data-index="' + indexes[i] + '"]').change();
                                    }
                                    
                                    // refresh remove mapping event
                                    handleRemoveMapping();
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
        });
        
        var serverId = $('#server-id-old').val();
        
        if(serverId != null && serverId != undefined && serverId > 0)
        {
            $('#servers').val(serverId);
            $('#servers').selectpicker('refresh');
            $('#servers').change();
        }
    }
    
    var handleDomainsMapping = function()
    {
        $('.mapping-add').on('click',function()
        {
            var template = atob($(this).attr('data-template'));
            var lastIndex = 0;
            
            template.replaceAll("$domains","");
            template.replaceAll("$ipsv4","");
            template.replaceAll("$ipsv6","");
            
            $('select.domains-mapping').each(function()
            {
                var i = $(this).attr('data-index');
                
                if(lastIndex < i)
                {
                    lastIndex = i;
                }
            });
            
            lastIndex++;
            
            $('.mapping-container').append(template.replaceAll('data-index="0"','data-index="' + lastIndex + '"'));
            
            var domains = '';
            var ipsv4 = '';
            var ipsv6 = '';
            
            $('select.domains-mapping option').each(function()
            {  
                if($(this).is(':selected'))
                {
                    $(this).closest('select.domains-mapping').first().attr('data-old-value',$(this).attr('value'));
                }
            });
            
            $('select.domains-mapping[data-index="0"] option').each(function()
            {
                if($(this).attr('value') != '')
                {
                    domains += '<option value="' + $(this).attr('value') + '" data-domain-value="' + $(this).attr('data-domain-value') + '">' + $(this).html() + '</option>';
                }
            });
            
            $('select.ips-v4-mapping[data-index="0"] option').each(function()
            {
                if($(this).attr('value') != '')
                {
                    ipsv4 += '<option value="' + $(this).attr('value') + '" domain="' + $(this).attr('domain') + '">' + $(this).html() + '</option>';
                }
            });
           
            $('select.ips-v6-mapping[data-index="0"] option').each(function()
            {
                if($(this).attr('value') != '')
                {
                    ipsv6 += '<option value="' + $(this).attr('value') + '" domain="' + $(this).attr('domain') + '">' + $(this).html() + '</option>';
                }
            });
            
            $('select.domains-mapping[data-index="' + lastIndex + '"]').html(domains);
            $('select.domains-mapping[data-index="' + lastIndex + '"]').selectpicker({iconBase:"fa",tickIcon:"fa-check",dropupAuto:false});
            $('select.ips-v4-mapping[data-index="' + lastIndex + '"]').html(ipsv4);
            $('select.ips-v6-mapping[data-index="' + lastIndex + '"]').html(ipsv6);

            handleRemoveMapping();
            handleSelects();
        });
        
        // random mapping
        $('.mapping-random').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var maxIps = $('#random-quantity').val() == undefined ? 10 : parseInt($('#random-quantity').val());
            var domains = $('#random-domains').val().split("\n");
            var ipsv4Options = [];
            var domainsOptions = [];
            var index = 0;
            var template = $('.mapping-add').first().attr('data-template');
            
            // collect all ips
            $('select.ips-v4-mapping[data-index="0"] option').each(function(){
                ipsv4Options[index] = {
                    'value' : $(this).attr('value'),
                    'html' : $(this).html()
                };
                
                index++;
            });
            
            index = 0;
            
            // collect all domains
            $('select.domains-mapping[data-index="0"] option').each(function(){
                domainsOptions[index] = {
                    'value' : $(this).attr('value'),
                    'html' : $(this).html()
                };
                
                index++;
            });
            
            // remove all mappings
            $('.mapping-item:not(.first)').remove();
            
            $('select.domains-mapping[data-index="0"]').val(null);
            $('select.domains-mapping[data-index="0"]').selectpicker('refresh');
            $('select.ips-v4-mapping[data-index="0"]').val(null);
            $('select.ips-v6-mapping[data-index="0"]').val(null);

            button.html("<i class='fa fa-spinner fa-spin'></i> Randomizing ...");
            button.attr('disabled','disabled');
            
            var select = $('select.domains-mapping[data-index="0"]');
            var option = select.find('option[data-domain-value="' + domains[0] + '"]').first();
            var ips = $('select.ips-v4-mapping[data-index="0"]');
       
            select.val(option.val());
            option.prop('selected',true);
            select.selectpicker('refresh');
            select.change();

            ips.find('option').slice(0,maxIps).each(function(){
                $(this).prop('selected',true);
            });

            ips.change();

            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'getRandomMapping',
                'parameters' : 
                {
                    'domains' : domains,
                    'template' : template,
                    'ips-v4-options' : ipsv4Options,
                    'domains-options': domainsOptions,
                    'max-ips' : maxIps
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            $('.mapping-container').append(result['data']['mapping']);
                            
                            // refresh events 
                            handleSelects();
                                    
                            var indexes = result['data']['indexes'];
                            
                            for (var i in indexes) 
                            {
                                $('select.domains-mapping[data-index="' + indexes[i] + '"]').selectpicker({iconBase:"fa",tickIcon:"fa-check",dropupAuto:false});
                                $('select.domains-mapping[data-index="' + indexes[i] + '"]').selectpicker('refresh');
                                $('select.domains-mapping[data-index="' + indexes[i] + '"]').change();
                                
                                $('select.ips-v4-mapping[data-index="' + indexes[i] + '"]').change();
                                $('select.ips-v6-mapping[data-index="' + indexes[i] + '"]').change();
                            }
                            
                            // refresh remove mapping event
                            handleRemoveMapping();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                    iResponse.unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    button.html(html);
                    button.removeAttr('disabled');
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
    };
    
    var handleRemoveMapping = function()
    {
        $('.mapping-remove').unbind("click").on('click',function()
        {
            var element = $(this).closest('.mapping-item');

            swal({
                title: "Are you sure you want to delete this element?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function () 
            {
                var domain = element.find('select.domains-mapping').first().val();

                element.remove();

                $('select.domains-mapping option').each(function()
                {  
                    if($(this).val() == domain)
                    {
                        $(this).removeAttr('disabled');
                    }
                });

                $('select.domains-mapping').selectpicker('refresh');
            });
        });
    };
    
    var handleInstallingServers = function () 
    {
        $('#start-installation').click(function(event) 
        {
            event.preventDefault();
            
            var button = $(this);
            var valid = true;

            var serverId = $('#servers').val();

            var installServices = $('#install-services').is(':checked') ? 'enabled' : 'disabled';
            var updatePort = $('#update-port').is(':checked') ? 'enabled' : 'disabled';
            var updatePassword = $('#update-password').is(':checked') ? 'enabled' : 'disabled';
            var installFirewall = $('#install-firewall').is(':checked') ? 'enabled' : 'disabled';
            var updateIps = $('#update-ips').is(':checked') ? 'enabled' : 'disabled';
            var activateDmarc = $('#activate-dmarc').is(':checked') ? 'enabled' : 'disabled';
            var activateDkim = $('#activate-dkim').is(':checked') ? 'enabled' : 'disabled';
            var keepOldSubs = $('#keep-old-subs').is(':checked') ? 'enabled' : 'disabled';
            var usePredefinedSubs = $('#use-predefined-subs').is(':checked') ? 'enabled' : 'disabled';
            var useSSL = $('#use-ssl-certs').is(':checked') ? 'enabled' : 'disabled';
            var installTracking = $('#install-tracking').is(':checked') ? 'enabled' : 'disabled';
            var useBrands = $('#use-brands').is(':checked') ? 'enabled' : 'disabled';
            var installPMTA = $('#install-pmta').is(':checked') ? 'enabled' : 'disabled';

            // check if there is a server selected 
            if(serverId == null || serverId == '')
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if at least on of the installation procceses is enabled 
            if(updateIps == 'disabled' && installServices == 'disabled' && installTracking == 'disabled' && installPMTA == 'disabled' &&
            updatePort == 'disabled' && updatePassword == 'disabled' && useSSL == 'disabled')
            {
                iResponse.alertBox({title: 'Please select at least one instalation process !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var mapping = [];
            
            $('select.domains-mapping').each(function()
            {
                var index = $(this).attr('data-index');
                var value = $(this).val();

                if(value == null || value == undefined || value == '')
                {
                    iResponse.alertBox({title: 'There is a domain missing in you mapping !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    valid = false;
                }

                var ipsv4Index = 0;
                var ipsv4 = [];
                var ipsv6Index = 0;
                var ipsv6 = [];

                $('select.ips-v4-mapping[data-index="' + index + '"] option').each(function()
                {
                    if($(this).is(':selected'))
                    {
                        ipsv4[ipsv4Index] = $(this).attr('value');
                        ipsv4Index++;
                    }
                });

                $('select.ips-v6-mapping[data-index="' + index + '"] option').each(function()
                {
                    if($(this).is(':selected'))
                    {
                        ipsv6[ipsv6Index] = $(this).attr('value');
                        ipsv6Index++;
                    }
                });

                mapping[index] = {
                    'domain' : value,
                    'ips-v4' : ipsv4,
                    'ips-v6' : ipsv6
                }
            });
            
            if(valid == false)
            {
                return false;
            }
            
            // showing the terminal
            button.html("<i class='fa fa-spinner fa-spin'></i> Installing ...");
            button.attr('disabled','disabled');
            $('#installation-status').html('Installing In Progress <i class="fa fa-spinner fa-spin"></i>');

            // start installation
            var data = 
            {
                'controller': 'Servers',
                'action': 'beginInstallation',
                'parameters':
                {
                    'server-id' : serverId,
                    'install-services' : installServices,
                    'update-port' : updatePort,
                    'update-password' : updatePassword,
                    'update-ips' : updateIps,
                    'install-firewall' : installFirewall,
                    'activate-dmarc' : activateDmarc,
                    'activate-dkim' : activateDkim,
                    'keep-old-subs' : keepOldSubs,
                    'use-predefined-subs' : usePredefinedSubs,
                    'use-ssl' : useSSL,
                    'install-tracking' : installTracking,
                    'use-brands' : useBrands, 
                    'install-pmta' : installPMTA,
                    'mapping' : mapping,
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : false,
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            handleInstallationLogs(result['data']['server-id'],button);
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            
                            button.html("<i class='fa fa-terminal'></i> Proceed Instalation");
                            button.removeAttr('disabled');
                            $('#installation-status').html('Installation Interrupted !');
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html("<i class='fa fa-terminal'></i> Proceed Instalation");
                    button.removeAttr('disabled');
                    $('#installation-status').html('Installation Interrupted !');
                }
            });
        });
    };

    var handleInstallationLogs = function(serverId,button)
    {
        var data = 
        {
            'controller': 'Servers',
            'action': 'getInstallationLogs',
            'parameters':
            {
                'server-id' : serverId
            }
        };  
        
        $.ajax({
            type: 'POST',
            url: iResponse.getBaseURL() + '/api.json',
            data : data,
            dataType : 'JSON',
            async : false,
            timeout: 3600000,
            success:function(result) 
            {
                if(result != false)
                {
                    var status = result['status'];

                    if(status == 200)
                    {
                        $('#installation-log').html(result['data']['logs']);
                        document.getElementById("installation-log").scrollTop = document.getElementById("installation-log").scrollHeight;
                        
                        if(result['data']['process'] == "Installation completed !")
                        {
                            $('#installation-status').html('Installation completed !');
                            button.html("<i class='fa fa-magic'></i> Start Instalation");
                            button.removeAttr('disabled');
                            iResponse.alertBox({title: "Installation completed !", type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                            clearLogs(serverId);
                        }
                        else if(result['data']['process'] == "Installation interrupted !")
                        {
                            $('#installation-status').html('Installation interrupted !');
                            button.html("<i class='fa fa-magic'></i> Start Instalation");
                            button.removeAttr('disabled');
                            iResponse.alertBox({title: "Installation interrupted !", type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            clearLogs(serverId);
                        }
                        else
                        {
                            $('#installation-status').html(result['data']['process'] + ' <i class="fa fa-spinner fa-spin"></i>');
                            
                            setTimeout(function(){
                                handleInstallationLogs(serverId,button);
                            },2000);
                        }
                    }
                    else
                    {
                        iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) 
            {
                iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
            }
        });
    };
    
    var clearLogs = function(serverId)
    {
        var data = 
        {
            'controller': 'Servers',
            'action': 'clearInstallationLogs',
            'parameters':
            {
                'server-id' : serverId
            }
        };
        
         $.ajax({
            type: 'POST',
            url: iResponse.getBaseURL() + '/api.json',
            data : data,
            dataType : 'JSON',
            async : false,
            success:function(result) 
            {
                if(result != false)
                {
                    if(result['status'] != 200)
                    {
                        iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) 
            {
                iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
            }
        });
    };
    
    return {
        init: function() 
        {
            handleSelects();
            handleServersChangeEvent();
            handleDomainsMapping();
            handleInstallingServers();
        }
    };

}();

// initialize and activate the script
$(function(){ ServersInstallation.init(); });