/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Templates.js	
 */
var Templates = function() 
{
    var getConfigTemplates = function()
    {
        $('.tmp-configs-type').on('change',function()
        {
            var name = $(this).val();
            
            $('#tmp-parameters-result').val('');
     
            if((name != null && name != '' && name != undefined))
            {
                iResponse.blockUI();
                
                var data = 
                { 
                    'controller' : 'Pmta',
                    'action' : 'getTemplateConfig',
                    'parameters' : 
                    {
                        'name' : name,
                        'type' : $('#tmp-type').val()
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
                                $('#tmp-parameters-result').val(result['data']['config']);
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
        
        $('#tmp-type').on('change',function()
        {
            $('.tmp-configs-type').selectpicker('refresh');
            $('.tmp-configs-type').change();
        });
    };

    var updateConfigTemplates = function()
    {
        $('.update-tmp-config').on('click',function(e)
        {
            e.preventDefault();

            var serverIds = $('#tmp-servers').val();
            var type = $('#tmp-type').val();
            var name = $("#tmp-parameters").val();
            var content = $('#tmp-parameters-result').val();
           
            if((name != null && name != '' && name != undefined) && (content != null && content != '' && content != undefined))
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
                    'action' : 'saveTemplateConfig',
                    'parameters' : 
                    {
                        'servers-ids' : serverIds,
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
                                iResponse.alertBox({title: 'Config Updated Successfully !', type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
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
            getConfigTemplates();
            updateConfigTemplates();
        }
    };

}();

// initialize and activate the script
$(function(){ Templates.init(); });