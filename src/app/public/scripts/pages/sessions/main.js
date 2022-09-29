/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Sessions.js	
 */
var Sessions = function() 
{
    var handleForceDisconnect = function()
    {
        $('.kill-sessions').on('click',function(e)
        {
            e.preventDefault();
            var ids = [];
            var index = 0;
            
            $('#sessions .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    ids[index] = $(this).val();
                    index++;
                }
            });
            
            if(ids.length > 0)
            {
                iResponse.blockUI();

                var data = 
                { 
                    'controller' : 'Tools',
                    'action' : 'forceDisconnectUsers',
                    'parameters' : 
                    {
                        'users-ids' : ids
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
                            
                            $('.data-ajax-list .filter-submit').click();
                            
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
        });
    };
    
    return {
        init: function() 
        {
            handleForceDisconnect();
        }
    };
}();

// initialize and activate the script
$(function(){ Sessions.init(); });