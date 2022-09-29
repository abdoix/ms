/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            AffiliateNetworks.js	
 */
var AffiliateNetworks = function() 
{
    var handleAutoLogin = function()
    {
        $('.auto-login-affiliate-network').on('click',function(e)
        {
            e.preventDefault();
 
            $('#affiliate-networks .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    var win = window.open(iResponse.getBaseURL() + '/affiliate-networks/auto-login/' + $(this).val() + '.html', 'auto_login_' + $(this).val());
                    
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
    
    var handleApiSwitch = function()
    {
        $('#api-type').on('change',function()
        {
            if($(this).val() == 'hasoffers')
            {
                $('#company-name').removeAttr('disabled');
                $('#network-id').removeAttr('disabled');
            }
            else
            {
                $('#company-name').val(null);
                $('#network-id').val(null);
                $('#company-name').prop('disabled',true);
                $('#network-id').prop('disabled',true);
            }
        });
        
        $('#api-type').change();
    };
    
    return {
        init: function() 
        {
            handleAutoLogin();
            handleApiSwitch();
        }
    };

}();

// initialize and activate the script
$(function(){ AffiliateNetworks.init(); });