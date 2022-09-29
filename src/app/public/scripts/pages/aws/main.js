/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            AWS.js	
 */
var AWS = function() 
{
    var getAccountDomains = function()
    {
        $('#accounts').on('change',function()
        {
            var account = $(this).val();
            
            // delete old domains
            $('#aws-domains').html('');
            $('#aws-domains').selectpicker('refresh');
            
            if(account == null || account == undefined || account == '')
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data =
            { 
                'controller' : 'Amazon',
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
                                $('#aws-domains').append("<option value='" + domains[i]['id'] + "'>" + domains[i]['value'] + "</option>");
                            }
                            
                            $('#aws-domains').selectpicker('refresh');
                            $('#aws-domains').change();
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
        $('.create-aws-instances').on('click',function(evt)
        {
            evt.preventDefault();

            var accountId = $('#aws-accounts').val();
            var nbInstances = parseInt($("#aws-nb-of-instances").val());
            var nbIps = parseInt($("#aws-instance-nb-ips").val());
            var storage = parseInt($("#aws-instance-storage").val());
            var regions = $("#aws-regions").val();
            var domains = $("#aws-domains").val();
            var os = $("#aws-os").val();
            var instanceType = $("#aws-instance-type").val();
            var subnets = $("#aws-subnets-filter").val();
            
            if(accountId == null || accountId == undefined || accountId == 0)
            {
                iResponse.alertBox({title: 'Please select an account !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(nbInstances == null || nbInstances == undefined || nbInstances == 0)
            {
                iResponse.alertBox({title: 'Please enter a number of instances to create !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(nbIps == null || nbIps == undefined || nbIps == 0)
            {
                iResponse.alertBox({title: 'Please enter a number of private ips to assign !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(storage == null || storage == undefined || storage < 8)
            {
                iResponse.alertBox({title: 'Please enter a storage equal or greater than 8Gb !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            if(regions == null || regions == undefined || regions.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one region !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(os == null || os == undefined)
            {
                iResponse.alertBox({title: 'Please select an operating system !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(instanceType == null || instanceType == undefined)
            {
                iResponse.alertBox({title: 'Please select a type of instances !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }

            var button = $(this);
            var html = button.html();

            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }

            button.html("<i class='fa fa-spinner fa-spin'></i> Starting ...");
            button.attr('disabled','disabled');

            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'Amazon',
                'action' : 'createInstances',
                'parameters' : 
                {
                    'account-id' : accountId,
                    'nb-of-instances' : nbInstances,
                    'nb-of-ips' : nbIps,
                    'storage' : storage,
                    'regions' : regions,
                    'domains' : domains,
                    'os' : os,
                    'instance-type' : instanceType,
                    'subnets-filter' : subnets
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
            
            $('#ec2-processes .checkboxes').each(function()
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
            
            var button = $(this);
            var html = button.html();
  
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
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }

                button.html("<i class='fa fa-spinner fa-spin'></i> Stopping ...");
                button.attr('disabled','disabled');
            
                var data = 
                { 
                    'controller' : 'Amazon',
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
        });
    };

    var handleAccountActions = function()
    {
        $('.aws-execute-action').on('click',function(e)
        {
            e.preventDefault();
            var accounts = [];
            var i = 0;
            
            if($('#account-action').val() == null || $('#account-action').val() == '' || $('#account-action').val() == undefined)
            {
                iResponse.alertBox({title: 'Please select an action !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            $('#amazon-accounts .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    accounts[i] = $(this).val();
                    i++;
                }
            });
            
            if(accounts.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one account !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var button = $(this);
            var html = button.html();
            
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
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }
                
                button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
                button.attr('disabled','disabled');

                var data = {};

                if($('#account-action').val() == 'aws-refresh-instances-ips')
                {
                    data = { 'controller' : 'Amazon', 'action' : 'refreshInstancesIps', 'parameters' : {'accounts-ids' : accounts, 'region' : $('#account-region').val()}};
                }
                else if($('#account-action').val() == 'aws-fetch-eips')
                {
                    data = { 'controller' : 'Amazon', 'action' : 'fetchElasticIps', 'parameters' : {'accounts-ids' : accounts, 'region' : $('#account-region').val()}};
                }
                else if($('#account-action').val() == 'aws-start-rotates-restarts')
                {
                    data = { 'controller' : 'Amazon', 'action' : 'executeRotatesRestarts', 'parameters' : {'accounts-ids' : accounts, 'region' : $('#account-region').val()}};
                }
                else if($('#account-action').val() == 'aws-start-restarts')
                {
                    data = { 'controller' : 'Amazon', 'action' : 'executeRestarts', 'parameters' : {'accounts-ids' : accounts, 'region' : $('#account-region').val()}};
                }

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
                            }
                            else
                            {
                                iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                            }
                        }

                        button.html(html);
                        button.removeAttr('disabled');
                        iResponse.unblockUI();
                        
                        // refresh table 
                        $('.filter-submit').click();
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
        });
        
        $('.aws-show-processes').on('click',function(e)
        {
            e.preventDefault();
            var accounts = [];
            var i = 0;

            $('#amazon-accounts .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    accounts[i] = $(this).val();
                    i++;
                }
            });
            
            if(accounts.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one account !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            for (var i = 0; i < accounts.length; i++)
            {
                var win = window.open(iResponse.getBaseURL() + '/amazon-accounts/processes/' + accounts[i] + '.html','aws_processes_' + accounts[i]);
                    
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
    };
    
    var handleAccountStopProcess = function()
    {
        $('.stop-account-process').on('click',function(e)
        {
            e.preventDefault();
            
            var processesIds = [];
            var i = 0;
            
            $('#aws-processes .checkboxes').each(function()
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
            
            var button = $(this);
            var html = button.html();
  
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
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }

                button.html("<i class='fa fa-spinner fa-spin'></i> Stopping ...");
                button.attr('disabled','disabled');
            
                var data = 
                { 
                    'controller' : 'Amazon',
                    'action' : 'stopAccountsProcesses',
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
        });
    };
    
    var handleInstancesActions = function()
    {
        $('.aws-insatnces-actions').on('click',function(e)
        {
            e.preventDefault();
            var action = $(this).attr("data-action");
            var instancesIds = [];
            var i = 0;
            
            $('#amazon-instances .checkboxes').each(function()
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
            
            var button = $(this);
            var html = button.html();
            
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
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }

                button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
                button.attr('disabled','disabled');
                
                var data = 
                { 
                    'controller' : 'Amazon',
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
        });
    };

    var handleInstancesLogs = function()
    {
        $('.aws-logs-calculate').on('click',function(e)
        {
            e.preventDefault();
            var instancesIds = [];
            var i = 0;
            
            $('#amazon-instances .checkboxes').each(function()
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
            
            var button = $(this);
            var html = button.html();
            
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
                if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
                {
                    return false;
                }

                button.html("<i class='fa fa-spinner fa-spin'></i> Calculating ...");
                button.attr('disabled','disabled');
                
                var data = 
                { 
                    'controller' : 'Amazon',
                    'action' : 'calculateInstancesLogs',
                    'parameters' : 
                    {
                        'instances-ids' : instancesIds
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
        });
    };
    
    return {
        init: function() 
        {
            handleCreateInstances();
            handleStopProcess();
            handleInstancesActions();
            handleInstancesLogs();
            getAccountDomains();
            handleAccountActions();
            handleAccountStopProcess();
        }
    };

}();

// initialize and activate the script
$(function(){ AWS.init(); }); 