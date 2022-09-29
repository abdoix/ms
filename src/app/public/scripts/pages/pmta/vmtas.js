/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            PmtaCommands.js	
 */
var PmtaGlobalVmtas = function() 
{
    var updateVmtas = function()
    {
        $('.update-global-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = $('#vmta-servers').val();
            var ispId = $('#isps').val();
            var domain = $('#domain').val();
            
            // check if there is a server selected 
            if(servers == null || servers == undefined)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there is a Isp selected 
            if(ispId == null || ispId == undefined)
            {
                iResponse.alertBox({title: 'No Isp selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there is a domain inserted 
            if(domain == null || domain == undefined)
            {
                iResponse.alertBox({title: 'No domain inserted !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'updateGlobalVmtas',
                'parameters' : 
                {
                    'servers' : servers,
                    'isp-id' : ispId,
                    'domain' : domain
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
        
        $('.create-smtp-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = $('#vmta-servers').val();
            var smtps = $('#smtps-list').val();
            
            // check if there is a server selected 
            if(servers == null || servers == undefined)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there are any smtps 
            if(smtps == null || smtps == undefined)
            {
                iResponse.alertBox({title: 'No SMTP servers entered !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'createSMTPVmtas',
                'parameters' : 
                {
                    'servers' : servers,
                    'smtps' : smtps
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
    
    var resetVmtas = function()
    {
        $('.reset-global-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = $('#vmta-servers').val();
            var ispId = $('#isps').val();
            
            // check if there is a server selected 
            if(servers == null || servers == undefined)
            {
                iResponse.alertBox({title: 'No server selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there is a Isp selected 
            if(ispId == null || ispId == undefined)
            {
                iResponse.alertBox({title: 'No Isp selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'resetGlobalVmtas',
                'parameters' : 
                {
                    'servers' : servers,
                    'isp-id' : ispId
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
        
        $('.reset-smtp-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var servers = $('#vmta-servers').val();
            
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
                'controller' : 'Pmta',
                'action' : 'resetSMTPVmtas',
                'parameters' : 
                {
                    'servers' : servers
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
    
    var updateIndividualVmtas = function()
    {
        $('.update-individual-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var mapping = $('#ips-domains-mapping').val();
            var ispId = $('#isps').val();
            
            // check if there is a server selected 
            if(mapping == null || mapping == undefined)
            {
                iResponse.alertBox({title: 'No ips/domains inserted !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there is a Isp selected 
            if(ispId == null || ispId == undefined)
            {
                iResponse.alertBox({title: 'No Isp selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'updateIndividualVmtas',
                'parameters' : 
                {
                    'mapping' : mapping,
                    'isp-id' : ispId
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
                            iResponse.alertBox({title: 'Vmtas Updated Successfully !', type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
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
    
    var resetIndividualVmtas = function()
    {
        $('.reset-individual-vmtas').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var ips = $('#ips-domains-mapping').val();
            var ispId = $('#isps').val();
            
            // check if there is a server selected 
            if(ips == null || ips == undefined)
            {
                iResponse.alertBox({title: 'No ips inserted !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            // check if there is a Isp selected 
            if(ispId == null || ispId == undefined)
            {
                iResponse.alertBox({title: 'No Isp selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Pmta',
                'action' : 'resetIndividualVmtas',
                'parameters' : 
                {
                    'ips' : ips,
                    'isp-id' : ispId
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
                            iResponse.alertBox({title: 'Vmtas Reseted Successfully !', type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
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
            updateVmtas();
            resetVmtas();
            updateIndividualVmtas();
            resetIndividualVmtas();
        }
    };
}();

// initialize and activate the script
$(function(){ PmtaGlobalVmtas.init(); });