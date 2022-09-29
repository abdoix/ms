/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            PmtaCommands.js	
 */
var PmtaCommands = function() 
{
    var handlePreloadedData = function()
    {
        if(iResponse.getCurrentURL().indexOf('pmta/commands') > 0)
        {
            var params = iResponse.getCurrentURL().replaceAll(iResponse.getBaseURL() + '/pmta/commands','').trim();
            
            if(params != undefined && params != '')
            {
                params = params.startsWith('/') ? params.slice(1,params.length) : params;
                params = params.endsWith('/') ? params.slice(0,-1) : params;
                params = params.split('/');
                
                if(params.length >= 2)
                {
                    var servers = atob(params[0].replaceAll('-','=')) != '' ? atob(params[0].replaceAll('-','=')).split(',') : [];
                    
                    $('#commands-servers').val(servers);   
                    $('#commands-servers').selectpicker('refresh');
                    $('#commands-servers').change();
                    
                    var vmtas = atob(params[1].replaceAll('-','=')).split(',');
            
                    $('#commands-vmtas option').each(function()
                    {
                        var vmta = $(this).val().split('|')[0] + '|' + $(this).val().split('|')[1];
                        
                        for (var i in vmtas) 
                        {
                            if(vmtas[i] == vmta.trim())
                            {
                                $(this).prop('selected',true);
                            }
                        }
                    });
                    
                    $('#commands-vmtas').selectpicker('refresh');
                    $('#commands-vmtas').change();
                }
            }
        }
    }
    
    var handleCommandsServerChange = function()
    {
        $('#commands-servers').on('change',function()
        {
            iResponse.blockUI();
  
            var serverIds = $('#commands-servers').val();
            
            $('#commands-vmtas').html('');
            $('#commands-vmtas').selectpicker('refresh');
                
            if(serverIds != undefined && serverIds != null && serverIds.length > 0)
            {
                var data = 
                { 
                    'controller' : 'Pmta',
                    'action' : 'getServerVmtas',
                    'parameters' : 
                    {
                        'server-ids' : serverIds
                    }
                };

                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : data,
                    dataType : 'JSON',
                    async: false,
                    timeout: 3600000,
                    success:function(result) 
                    {
                        if(result != false)
                        {
                            var status = result['status'];

                            if(status == 200)
                            {
                                for (var i in result['data']['vmtas']) 
                                {
                                    var vmta = result['data']['vmtas'][i];
                                    $('#commands-vmtas').append('<option value="' + vmta['server-id'] + '|' + vmta['id'] + '|' + vmta['name'] + '" data-ip="' + vmta['ip'] + '" data-rdns="' + vmta['rdns'] + '" data-domain="' + vmta['domain'] + '"> ( ' + vmta['server-name'] + ' ) ' + vmta['name'] + ' => ' + vmta['rdns'] + '</option>');
                                }

                                $('#commands-vmtas').selectpicker('refresh');
                                $('.show-pmta-trigger').click();
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
                $('.hide-pmta-trigger').click();
            }

            iResponse.unblockUI();
        });
        
        // reset everything as the page refreshed 
        $('#commands-servers').val(null);
        $('#commands-servers').selectpicker('refresh');
    };
    
    var showPmtas = function()
    {
        $('.export-pmta-trigger').on('click',function(e)
        {
            e.preventDefault();

            var monitors = '<div class="row">';
            var port = $('#pmta-port').val();
            $('#pmtas-monitors').html('');
            
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();
 
            $('#commands-servers option:selected').each(function()
            {
                var ip = $(this).attr('data-main-ip');
                var name = $(this).text();
                
                if(ip != null && ip != undefined && ip != '')
                {
                    var win = window.open('http://' + ip + ':' + port,'pmta_' + name);
                    
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

            button.html(html);
            button.removeAttr('disabled');
            iResponse.unblockUI();
        });
        
        $('.show-pmta-trigger').on('click',function(e)
        {
            e.preventDefault();

            var monitors = '<div class="row">';
            var port = $('#pmta-port').val();
            $('#pmtas-monitors').html('');
            
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var index = 0;
            
            $('#commands-servers option:selected').each(function()
            {
                var ip = $(this).attr('data-main-ip');
                var name = $(this).text();
                var id = $(this).attr('value');
                
                if(ip != null && ip != undefined && ip != '')
                {
                    if(index > 0 && index % 2 == 0)
                    {
                        monitors += '</div><div class="row">';
                    }

                    monitors += '<div class="col-md-6"><div class="portlet light bordered"> <div class="portlet-title"> <div class="caption"> <i class="icon-equalizer font-blue-dark"></i> <span class="caption-subject font-blue-dark uppercase">' + name + '</span> </div> <span style="float:right;margin-top:13px;margin-right: 13px;"><input type="checkbox" class="make-switch data-list-switch pmta-servers-monitors" data-size="small" data-on-text="<i class=\'fa fa-check\'></i>" data-off-text="<i class=\'fa fa-times\'></i>" data-server-id="' + id + '"/> </span></div> <div class="portlet-body">'
                    monitors += '<iframe src="http://' + ip + ':' + port + '" style="border:none;width:100%;height:400px"></iframe>';
                    monitors += '</div></div></div>';

                    index++;
                }
            });

            monitors + "</div>";

            $('#pmtas-monitors').html(monitors);
            $('#monitors-status').val('visible');
            
            // reinit switch
            $('.make-switch').bootstrapSwitch();
            
            button.html(html);
            button.removeAttr('disabled');
            
            // select all
            $('.select-all-servers').first().click();
            
            iResponse.unblockUI();
        });
        
         $('.hide-pmta-trigger').on('click',function(e)
        {
            e.preventDefault();
            $('#pmtas-monitors').html('');
            $('#monitors-status').val('hidden');
            $('#servers-sum').html('( 0 Servers Selected )');
        });

        $('.deselect-all-servers').on('click',function()
        {
            $('.pmta-servers-monitors').each(function()
            {
                $(this).bootstrapSwitch('state',false,false);
            });
            
            $('#servers-sum').html('( 0 Servers Selected )');
        });
        
        $('.select-all-servers').on('click',function()
        {
            $('.pmta-servers-monitors').each(function()
            {
                $(this).bootstrapSwitch('state',true,false);
            });
            
            $('#servers-sum').html('( ' + $('.pmta-servers-monitors').size() + ' Server(s) Selected )');
        });
    };
    
    var executePmtaCommand = function()
    {
        $('.pmta-action-trigger').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = [];
            
            if($('#monitors-status').val() == 'visible')
            {
                $('.pmta-servers-monitors').each(function()
                {
                    if($(this).bootstrapSwitch('state') == true)
                    {
                        servers.push($(this).attr('data-server-id'));
                    }
                });
            }
            else
            {
                servers = $('#commands-servers').val();
            }
            
            var target = $('#command-target').val();
            var vmtas = $('#commands-vmtas').val();
            var queues = $('#commands-queues').val();
            var scheduleTimes = $('#schedule-times').val();
            var schedulePeriod = $('#schedule-period').val();
            var action = button.attr('data-action');
            
            // check if there is a server selected 
            if(servers == null || servers == undefined || servers.length == 0)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'executePmtaCommand',
                'parameters' : 
                {
                    'servers' : servers,
                    'target' : target,
                    'vmtas' : vmtas,
                    'queues' : queues,
                    'schedule-times' : scheduleTimes,
                    'schedule-period' : schedulePeriod,
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
    
    return {
        init: function() 
        {
            handleCommandsServerChange();
            executePmtaCommand();
            handlePreloadedData();
            showPmtas();
        }
    };

}();

// initialize and activate the script
$(function(){ PmtaCommands.init(); });