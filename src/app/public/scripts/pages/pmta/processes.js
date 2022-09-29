/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            PmtaProcesses.js	
 */
var PmtaProcesses = function() 
{
    var handleServersChange = function()
    {
        $('#processes-servers').on('change',function()
        {
            iResponse.blockUI();
  
            var serverIds = $('#processes-servers').val();
            
            $('#processes-vmtas').html('');
            $('#processes-vmtas').selectpicker('refresh');
                
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
                                    $('#processes-vmtas').append('<option value="' + vmta['server-id'] + '|' + vmta['id'] + '|' + vmta['name'] + '" data-ip="' + vmta['ip'] + '" data-rdns="' + vmta['rdns'] + '" data-domain="' + vmta['domain'] + '"> ( ' + vmta['server-name'] + ' ) ' + vmta['name'] + ' => ' + vmta['rdns'] + '</option>');
                                }

                                $('#processes-vmtas').selectpicker('refresh');
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

            iResponse.unblockUI();
        });
    };

    var startPmtaProcesses = function()
    {
        $('.create-pmta-processes').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();

            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }

            var servers = $('#processes-servers').val();
            var vmtas = $('#processes-vmtas').val();
            var queues = $('#processes-queues').val();
            var pause = $('#processes-time-pause').val();
            var resume = $('#processes-time-resume').val();

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
                'action' : 'startProcesses',
                'parameters' : 
                {
                    'servers' : servers,
                    'vmtas' : vmtas,
                    'queues' : queues,
                    'pause-time' : pause,
                    'resume-time' : resume
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
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }

                    // refresh table 
                    $('.filter-submit').click();
                        
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
    
    var handleStopProcesses = function()
    {
        $('.stop-processes').on('click',function(e)
        {
            e.preventDefault();
            
            var processesIds = [];
            var i = 0;
            
            $('#pmta-processes .checkboxes').each(function()
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
                    'controller' : 'Pmta',
                    'action' : 'stopProcesses',
                    'parameters' : 
                    {
                        'processes-ids' : processesIds
                    }
                };

                iResponse.blockUI();

                $.ajax({
                    type: 'POST',
                    url: iResponse.getBaseURL() + '/api.json',
                    data : data,
                    dataType : 'JSON',
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
    
    return {
        init: function() 
        {
            handleServersChange();
            startPmtaProcesses();
            handleStopProcesses();
        }
    };

}();

// initialize and activate the script
$(function(){ PmtaProcesses.init(); });