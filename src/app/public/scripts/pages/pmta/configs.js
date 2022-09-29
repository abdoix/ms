/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            PmtaConfig.js	
 */
var PmtaConfig = function() 
{
    var handleServersChange = function()
    {
        $('#servers').on('change',function()
        {
            var serverId = $(this).val();
            $('#vmtas').html('');
            $('#vmtas').selectpicker('refresh');
            $('#vmtas-result').val('');
            
            if(serverId > 0)
            {
                iResponse.blockUI();
                
                var data = 
                { 
                    'controller' : 'Pmta',
                    'action' : 'getServerVmtas',
                    'parameters' : 
                    {
                        'server-ids' : [serverId]
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
                                for (var i in result['data']['vmtas']) 
                                {
                                    $('#vmtas').append('<option value="' + result['data']['vmtas'][i]['name'] + '">' + result['data']['vmtas'][i]['name'] + '</option>');
                                }
                                
                                $('#vmtas').selectpicker('refresh');
                                
                                $('select.configs-type').prop('disabled',false);
                                $('select.configs-type').selectpicker('refresh');
                                $('select.configs-type').change();
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
                $('select.configs-type').val(null);
                $('select.configs-type').prop('disabled',true);
                $('select.configs-type').selectpicker('refresh');
                $('select.configs-type').change();
            }
        });
        
        $('#servers').change();
    };
    
    var getPmtaConfig = function()
    {
        $('.configs-type').on('change',function()
        {
            var serverId = $('#servers').val();
            var type = $(this).attr('data-type');
            var name = $(this).val();
            
            $('#' + type + '-result').val('');
     
            if(serverId > 0 && (name != null && name != '' && name != undefined))
            {
                iResponse.blockUI();
                
                var data = 
                { 
                    'controller' : 'Pmta',
                    'action' : 'getConfig',
                    'parameters' : 
                    {
                        'server-id' : serverId,
                        'type' : type,
                        'name' : name
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
                                $('#' + type + '-result').val(result['data']['config']);
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

    var updatePmtaConfig = function()
    {
        $('.update-config').on('click',function(e)
        {
            e.preventDefault();

            var serverId = $('#servers').val();
            var type = $(this).attr('data-type');
            var name = $("#" + type).val();
            var content = $('#' + type + '-result').val();
            
            if(serverId > 0 && (type != null && type != '' && type != undefined) && (name != null && name != '' && name != undefined) && (content != null && content != '' && content != undefined))
            {
                var button = $(this);
                var html = button.html();
            
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }

                button.html("<i class='fa fa-spinner fa-spin'></i> Updating ...");
                button.attr('disabled','disabled');
            
                iResponse.blockUI();
                
                var data = 
                { 
                    'controller' : 'Pmta',
                    'action' : 'saveConfig',
                    'parameters' : 
                    {
                        'server-id' : serverId,
                        'type' : type,
                        'name' : name,
                        'content' : content
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
                                iResponse.alertBox({title: 'Config Updated Successuflly !', type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
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
            }
        });
    };

    return {
        init: function() 
        {
            handleServersChange();
            getPmtaConfig();
            updatePmtaConfig();
        }
    };

}();

// initialize and activate the script
$(function(){ PmtaConfig.init(); });