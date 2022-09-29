/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Scaleway.js	
 */
var Scaleway = function() 
{
    var getAccountDomains = function()
    {
        $('#accounts').on('change',function()
        {
            var account = $(this).val();
            
            // delete old domains
            $('#scaleway-domains').html('');
            $('#scaleway-domains').selectpicker('refresh');
            
            if(account == null || account == undefined || account == '')
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data =
            { 
                'controller' : 'Scaleway',
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
                                $('#scaleway-domains').append("<option value='" + domains[i]['id'] + "'>" + domains[i]['value'] + "</option>");
                            }
                            
                            $('#scaleway-domains').selectpicker('refresh');
                            $('#scaleway-domains').change();
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
    
    var handleCreateInstances = function()
    {
        $('.create-scaleway-instances').on('click',function(evt)
        {
            evt.preventDefault();

            var accountId = $('#scaleway-accounts').val();
            var nbInstances = parseInt($("#scaleway-nb-of-instances").val());
            var region = $("#scaleway-region").val();
            var domains = $("#scaleway-domains").val();
            var size = $("#scaleway-size").val();
            
            if(accountId === null || accountId === undefined || accountId === 0)
            {
                iResponse.alertBox({title: 'Please select an account !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(nbInstances === null || nbInstances === undefined || nbInstances === 0)
            {
                iResponse.alertBox({title: 'Please enter a number of instances to create !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            if(region === null || region === undefined)
            {
                iResponse.alertBox({title: 'Please select a region !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(domains === null || domains === undefined || domains.length === 0)
            {
                iResponse.alertBox({title: 'Please select at least one domain !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(domains.length < nbInstances)
            {
                iResponse.alertBox({title: 'The number of domains should be equal to the number of instances !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
           
            if(size === null || size === undefined)
            {
                iResponse.alertBox({title: 'Please select a size of instances !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            var button = $(this);
            var html = button.html();

            if(button.attr('disabled') === true || button.attr('disabled') === 'disabled')
            {
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Starting ...");
            button.attr('disabled','disabled');

            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Scaleway',
                'action' : 'createInstances',
                'parameters' : 
                {
                    'account-id' : accountId,
                    'nb-of-instances' : nbInstances,
                    'region' : region,
                    'domains' : domains,
                    'size' : size
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

    var handleStopProcess = function()
    {
        $('.stop-process').on('click',function(e)
        {
            e.preventDefault();
            
            var processesIds = [];
            var i = 0;
            
            $('#scaleway-processes .checkboxes').each(function()
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
                    'controller' : 'Scaleway',
                    'action' : 'stopInstancesProcesses',
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

    var handleInstancesActions = function()
    {
        $('.scaleway-insatnces-actions').on('click',function(e)
        {
            e.preventDefault();
            var action = $(this).attr("data-action");
            var instancesIds = [];
            var i = 0;
            
            $('#scaleway-instances .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    instancesIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(instancesIds.length == 0)
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
                    'controller' : 'Scaleway',
                    'action' : 'executeInstancesActions',
                    'parameters' : 
                    {
                        'instances-ids' : instancesIds,
                        'action' : action
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

    var handleLocation = function ()
    {
        $('#scaleway-region').on('change',function()
        {
            var location = $(this).val();
            
            if(location === 'nl-ams-1')
            {
              $('#scaleway-size option[value="RENDER-S"]').attr("disabled", true);
            }
            else
            {
                $('#scaleway-size option[value="RENDER-S"]').attr("disabled", false);
            }
        });
    };
    
    return {
        init: function() 
        {
            handleCreateInstances();
            handleStopProcess();
            handleInstancesActions(); 
            getAccountDomains();
            handleLocation();
        }
    };

}();

// initialize and activate the script
$(function(){ Scaleway.init(); });