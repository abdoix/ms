/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Logs.js	
 */
var Logs = function() 
{
    var handleLogsScroll = function()
    {
        var logs = $('#logs');
        logs.scrollTop(logs[0].scrollHeight - logs.height());
    };

    return {
        init: function() 
        {
            handleLogsScroll();
        }
    };

}();

// initialize and activate the script
$(function(){ Logs.init(); });