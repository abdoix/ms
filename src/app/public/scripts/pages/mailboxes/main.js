/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Mailboxes.js	
 */
var Mailboxes = function() 
{
    var getAccountDomains = function()
    {
        $('#accounts').on('change',function()
        {
            var account = $(this).val();
            
            // delete old domains
            $('#domains').html('');
            $('#domains').selectpicker('refresh');
            
            if(account == null || account == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data =
            { 
                'controller' : 'Domains',
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
    };

    var handleOpenMailboxes = function()
    {
        $('.open-mailboxes').on('click',function(e)
        {
            e.preventDefault();
 
            $('#mailboxes .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    var win = window.open(iResponse.getBaseURL() + '/mailboxes/open/' + $(this).val() + '.html', 'mailbox_' + $(this).val());
                    
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
        })
    };
    
    return {
        init: function() 
        {
            getAccountDomains();
            handleOpenMailboxes();
        }
    };

}();

// initialize and activate the script
$(function(){ Mailboxes.init(); });