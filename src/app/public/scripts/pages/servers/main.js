/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Servers.js	
 */
var Servers = function() 
{ 
    var handleServerLoginType = function()
    {
        $('#server-login-type').change(function(){
           var value = $(this).val();
           
           if(value == 'user-pass')
           {
               $('.srv-user-pass').removeClass('hide');
               $('.srv-pem').addClass('hide');
               $('.srv-passphrase').addClass('hide');
           }
           else if(value == 'pem')
           {
               $('.srv-pem').removeClass('hide');
               $('.srv-passphrase').removeClass('hide');
               $('.srv-user-pass').addClass('hide');
           }
           else if(value == 'rsa')
           {
               $('.srv-pem').addClass('hide');
               $('.srv-passphrase').addClass('hide');
               $('.srv-user-pass').addClass('hide');
           }
        });
        
        $('#srv-submit-button').click(function()
        {
            var value = $('#server-login-type').val();
           
            if($("#server-id").val() == undefined)
            {
                if(value == 'user-pass')
                {
                    if($('#server-password').val() == '') 
                    {
                         iResponse.alertBox({title: 'Please Check username or password is missing !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                         return false;
                    }
                }
                else if(value == 'pem')
                {
                    if($('#pem-file').val() == '')
                    {
                         iResponse.alertBox({title: 'Please check pem file is missing !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                         return false;
                    }
                }
            }
            
            $(this).html("<i class='fa fa-spinner fa-spin'></i> Loading ...");
            $(this).attr('disabled','disabled');
            $(this).closest('form').submit();
        });
        
        if(iResponse.getCurrentURL().indexOf('add') > 0)
        {
            $("#server-provider option").each(function(){if($(this).val() != ''){$(this).prop('selected',true);return;}});
            $('#server-provider').selectpicker('refresh');
            $('#server-provider').change();
        }
    };
    
    var handleCheckMtaServer = function()
    {
        $('.check-server').click(function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            var serverId = button.attr('server-id');
            
            if(serverId == null || serverId <= 0 || serverId == undefined)
            {
                iResponse.alertBox({title: 'Incorrect server id : ' + serverId, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Checking ...");
            button.attr('disabled','disabled');
            
            var data = { 
                'controller' : 'Servers',
                'action' : 'checkMtaServer',
                'parameters' : 
                {
                    'server-id' : serverId
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
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var handleCheckManagementServer = function()
    {
        $('.check-management-server').click(function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            var serverId = button.attr('server-id');
            
            if(serverId == null || serverId <= 0 || serverId == undefined)
            {
                iResponse.alertBox({title: 'Incorrect server id : ' + serverId, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Checking ...");
            button.attr('disabled','disabled');
            
            var data = { 
                'controller' : 'Servers',
                'action' : 'checkManagementServer',
                'parameters' : 
                {
                    'server-id' : serverId
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
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var handleCheckSmtpServer = function()
    {
        $('.check-smtp-server').click(function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            var serverId = button.attr('server-id');
            
            if(serverId == null || serverId <= 0 || serverId == undefined)
            {
                iResponse.alertBox({title: 'Incorrect server id : ' + serverId, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var userId = 0;
            var found = false;
            
            // find the selected user 
            $('#smtp-users').find('input[type="checkbox"].checkboxes').each(function()
            {
                if($(this).is(':checked') && found == false)
                {
                    userId = $(this).val();
                    found = true;
                }
            });
            
            if(userId == 0)
            {
                iResponse.alertBox({title: 'Please select an smtp user to check with ! ', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Checking ...");
            button.attr('disabled','disabled');
            
            var data = { 
                'controller' : 'Servers',
                'action' : 'checkSmtpServer',
                'parameters' : 
                {
                    'server-id' : serverId,
                    'user-id' : userId
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
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html("<i class='fa fa-refresh'></i> Check Server");
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var handleExtractRdns = function()
    {
        $('.extract-server-rdns').click(function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            var serverId = button.attr('server-id');
            
            if(serverId == null || serverId <= 0 || serverId == undefined)
            {
                iResponse.alertBox({title: 'Incorrect server id : ' + serverId, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Extracting ...");
            button.attr('disabled','disabled');
            
            var data = { 
                'controller' : 'Servers',
                'action' : 'extractServerRdns',
                'parameters' : 
                {
                    'server-id' : serverId
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
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});

                            var a = document.createElement('a');
                            a.href = 'data:text/plain,' +  encodeURIComponent(result['data']['rdns']);
                            a.target = '_blank';
                            a.download = 'rdns_' + serverId + '.csv';

                            document.body.appendChild(a);
                            a.click();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var handleInstallMultiServers = function()
    {
        $('.install-servers').on('click',function(e)
        {
            e.preventDefault();
 
            $('#mta-servers .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    var win = window.open(iResponse.getBaseURL() + '/mta-servers/install/' + $(this).val() + '.html', 'install_' + $(this).val());
                    
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
    
    var handleOldServerIps = function()
    {
        $('#old-server').change(function()
        {
            if($(this).val() != null && $(this).val() != 0 && $(this).val() != undefined)
            {
                iResponse.blockUI();

                var data = 
                { 
                    'controller' : 'Servers',
                    'action' : 'getMtaServer',
                    'parameters' : 
                    {
                        'server-id' : $(this).val()
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
                                $('#main-ip').val(result['data']['server']['main_ip']).prop('disabled',true);
                                $('#ssh-port').val(result['data']['server']['ssh_port']).prop('disabled',true);
                                $('#username').val(result['data']['server']['ssh_username']).prop('disabled',true);
                                $('#password').val(result['data']['server']['ssh_password']).prop('disabled',true);
                            }
                            else
                            {
                                iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            }
                            
                            iResponse.unblockUI();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) 
                    {
                        iResponse.unblockUI();
                        iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    }
                });
            }
            else
            {
                $('#main-ip').val(null).removeAttr('disabled');
                $('#ssh-port').val("22").removeAttr('disabled');
                $('#username').val(null).removeAttr('disabled');
                $('#password').val(null).removeAttr('disabled');
            }
            
        });
    };
    
    var handleConfigureIps = function()
    {
        $('.configure-ips').click(function(e)
        {
            e.preventDefault();

            var mainIp = $('#main-ip').val();
            var port = $('#ssh-port').val();
            var username = $('#username').val();
            var password = $('#password').val();
            var ipsMap = $('#ips-map').val();
            
            if(mainIp == null || mainIp == undefined)
            {
                iResponse.alertBox({title: 'Invalid main ip !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(port == null || port == undefined)
            {
                iResponse.alertBox({title: 'Invalid port !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(username == null || username == undefined)
            {
                iResponse.alertBox({title: 'Invalid username !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(password == null || password == undefined)
            {
                iResponse.alertBox({title: 'Invalid password !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(ipsMap == null || ipsMap == undefined)
            {
                iResponse.alertBox({title: 'Insert ips map ( ip;gateway;netmask ) !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});              
                return false;
            }
            
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Configuring Ips ...");
            button.attr('disabled','disabled');

            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'configureIps',
                'parameters' : 
                {
                    'main-ip' : mainIp,
                    'port' : port,
                    'username' : username,
                    'password' : password,
                    'ips-map' : ipsMap
                }
            };
                
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                timeout: 3600000,
                success:function(result) 
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
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var copyProxyIps = function()
    {
        $('.copy-proxies').on('click',function(e)
        {
            e.preventDefault();
            
            var proxiesIds = [];
            var index = 0;

            $('#proxy-servers .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    proxiesIds[index] = $(this).val();
                    index++;
                }
            });

            if(proxiesIds.length == 0)
            {
                iResponse.alertBox({title: 'Please check at least one proxy server', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            var button = $(this).first();
            var html = button.html();

            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return '';
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Copying Proxies ...");
            button.attr('disabled','disabled');

            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'getProxies',
                'parameters' : 
                {
                    'proxy-ids' : proxiesIds,
                    'proxy-type' : button.attr('data-proxy-type')
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                timeout: 3600000,
                success:function(result) 
                {

                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        { 
                            $("#proxy-servers-model .proxy-servers-container").html(result['data']['proxies']);
                            $("#proxy-servers-model").modal('toggle');
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }

                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});

                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        })
    };
    
    var handleInstallProxy = function()
    {
        $('.install-proxy').click(function(e)
        {
            e.preventDefault();

            var serversIds = $('#mta-servers').val();
            var username = $('#proxy-username').val();
            var password = $('#proxy-password').val();
            var proxyPort = $('#http-proxy-port').val();
            var socksPort = $('#socks-proxy-port').val();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Installing Proxy ...");
            button.attr('disabled','disabled');
            
            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'installProxy',
                'parameters' : 
                {
                    'servers-ids' : serversIds,
                    'proxy-username' : username,
                    'proxy-password' : password,
                    'http-proxy-port' : proxyPort,
                    'socks-proxy-port' : socksPort
                }
            };
                
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                timeout: 3600000,
                success:function(result) 
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
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    var executeServerCommand = function()
    {
        $('.server-actions-trigger').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = $('#actions-servers').val();
            var action = button.attr('data-action');
            
            // check if there is a server selected 
            if(servers == null || servers == undefined)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'executeServersCommand',
                'parameters' : 
                {
                    'servers' : servers,
                    'action' : action
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
                            $('#log-result').html(result['data']['logs']);
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
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    button.html(html);
                    button.removeAttr('disabled');
                    iResponse.unblockUI();
                }
            });
        });
    };
    
    var handleVmtaFilter = function()
    {
        $('.apply-vmta-filter').on('click',function()
        {
            var values = $('#filter-vmtas-list').val();
            
            if(values != null && values != '')
            {
                // clear old results
                $('#vmtas .checkboxes').each(function()
                {
                    if($(this).is(":checked"))
                    {
                        $(this).click();
                        $(this).prop("checked",false);
                    }
                });
                
                values = values.split("\n");
                
                if(values != null && values.length > 0)
                {
                    $('#vmtas .checkboxes').each(function()
                    {
                        var checkbox = $(this);
                        
                        $(this).closest('tr').find('td').each(function()
                        {
                            for (var i in values) 
                            {
                                if($(this).html().trim() === values[i].trim())
                                {
                                    checkbox.click();
                                    checkbox.prop("checked",true);
                                }
                            }
                        });
                    });
                }
            }
            
            $('#vmtas-filter').modal('toggle');
        });
    };
    
    var handleAddtionalIps = function ()
    {
        $('.configure-additional-ips').on('click',function(e)
        {
            e.preventDefault(); 
            var serverId = $('#servers-ips').val();
            var lines = $('#lines').val();
            
            if(serverId === null || serverId <= 0 || serverId === undefined)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(lines === null || lines === undefined || lines.length === 0)
            {
                iResponse.alertBox({title: 'No ips list !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
       
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') === true || button.attr('disabled') === 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> loading ...");
            button.attr('disabled','disabled');
 
            var data = 
            { 
                'controller' : 'Servers',
                'action' : 'configureAdditionalIps',
                'parameters' : 
                {
                    'serverId' : serverId,
                    'lines' : lines
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                timeout: 3600000,
               success:function(result) 
               {
                   if(result != false)
                    {
                        var status = result['status'];

                        if(status === 200)
                        { 
                           iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    
                    button.html(html);
                    button.removeAttr('disabled');
                }
           });
            
        });
    };

    var getAccountDomains = function()
    {
        $('#accounts').on('change',function()
        {
            var account = $(this).val();

            // delete old domains
            $('#domains').html('');
            $('#domains').selectpicker('refresh');

            if(account == null || account == undefined || account == '')
            {
                return false;
            }

            iResponse.blockUI();

            var data =
            { 
                'controller' : 'Servers',
                'action' : 'getAccountDomains',
                'parameters' : 
                {
                    'account' : account
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
                            var domains = result['data']['domains'];

                            for (var i in domains) 
                            {
                                $('#domains').append("<option value='" + domains[i]['id'] + "'>" + domains[i]['value'] + "</option>");
                            }

                            $('#domains').selectpicker('refresh');
                            $('#domains').change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }

                        iResponse.unblockUI();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    iResponse.unblockUI();
                }
            });
        });
        
        $('#accounts').change();
    };
    
    return {
        init: function() 
        {
            handleServerLoginType();
            handleCheckMtaServer();
            handleCheckManagementServer();
            handleExtractRdns();
            handleCheckSmtpServer();
            handleInstallMultiServers();
            handleOldServerIps();
            handleConfigureIps();
            handleInstallProxy();
            copyProxyIps();
            executeServerCommand();
            handleVmtaFilter(); 
            handleAddtionalIps();
            getAccountDomains();
        }
    };

}();

// initialize and activate the script
$(function(){ Servers.init(); });