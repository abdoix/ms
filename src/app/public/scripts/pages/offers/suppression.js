/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Suppression.js	
 */
var Suppression = function() 
{
    var handleAffiliateNetworkChange = function()
    {
        $("#affiliate-networks").on('change',function()
        {
            var affiliateNetworkIds = $(this).val();
            
            if(affiliateNetworkIds == null || affiliateNetworkIds == undefined)
            {
                return false;
            }
            
            var data = 
            {
                'controller': 'Affiliate',
                'action': 'getOffers',
                'parameters':
                {
                    'affiliate-network-ids' : affiliateNetworkIds
                }
            };

            // clean last results
            $("#offers").html('');
            $("#offers").selectpicker('refresh');
            
            iResponse.blockUI();
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                timeout: 3600000,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var lists = result['data']['offers'];

                            for (var i in lists)
                            {
                                var value = lists[i];
                                $("#offers").append('<option value="'+value['id']+'">(' + value['affiliate_network_name'] + ') ' + value['production_id'] + ' - ' + value['name'] + '</option>');
                            }
                            
                            // update the dropdown
                            $("#offers").selectpicker('refresh');
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
    };

    var handleSuppressionStart = function()
    {
        if(iResponse.getCurrentURL().indexOf('suppression') > 0)
        {
            $('.start-suppression').on('click',function(e)
            {
                e.preventDefault();

                var offers = $('#offers').val();
                var lists = $("#lists").val();
                
                if(offers == null || offers == undefined || offers.length == 0)
                {
                    iResponse.alertBox({title: 'Please select at least one offer !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }

                if(lists == null || lists == undefined || lists.length == 0)
                {
                    iResponse.alertBox({title: 'Please select at least one data list !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
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
                    'controller' : 'Affiliate',
                    'action' : 'startSuppression',
                    'parameters' : 
                    {
                        'offers' : offers,
                        'lists' : lists
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
                        
                        // refresh table 
                        $('.filter-submit').click();
                        
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
        }
    };

    var handleCountriesSelect = function()
    {
        if(iResponse.getCurrentURL().indexOf('suppression') > 0)
        {
            $('#countries option').prop('selected', true);
            $('#countries').selectpicker('refresh');
            $('#countries').change();
        }
    };
    
    var handleEmailsLists = function()
    {
        $("#data-providers,#isps").on('change',function()
        {
            var dataProviderIds = $("#data-providers").val();
            var isps = $("#isps").val();
            
            var data = 
            {
                'controller': 'DataLists',
                'action': 'getEmailsLists',
                'parameters':
                {
                    'data-provider-ids' : dataProviderIds,
                    'isp-ids' : isps
                }
            };

            // clean last results
            $("#lists").html('');
            $("#lists").selectpicker('refresh');
            
            iResponse.blockUI();
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async : true,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var lists = result['data']['data-lists'];
                            for (var i in lists) $("#lists").append('<option value="'+lists[i]['id']+'" selected>' + lists[i]['name'] + ' (count : ' + lists[i]['total_count'] + ')</option>');

                            // update the dropdown
                            $("#lists").selectpicker('refresh');
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
        
        $('#isps').change();
    };
    
    var handleSuppressionDetails = function()
    {
        $('.suppression-details').on('click',function()
        {
            var processesIds = [];
            var i = 0;
            
            $('#suppression-processes .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    processesIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(processesIds.length == 0)
            {
                iResponse.alertBox({title: 'Please select one process !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            if(processesIds.length > 1)
            {
                iResponse.alertBox({title: 'Please select only one process at a time !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var data = 
            { 
                'controller' : 'Affiliate',
                'action' : 'getSupressionDetails',
                'parameters' : 
                {
                    'processes-id' : processesIds[0]
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
                            $("#suppression-processes-details .suppression-processes-details-container").html(result['data']['details']);
                            $("#suppression-processes-details").modal('toggle');
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
    };
    
    var handleStopProcess = function()
    {
        $('.stop-process').on('click',function(e)
        {
            e.preventDefault();
            
            var processesIds = [];
            var i = 0;
            
            $('#suppression-processes .checkboxes').each(function()
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
                    'controller' : 'Affiliate',
                    'action' : 'stopSupressionProcesses',
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
            handleAffiliateNetworkChange();
            handleSuppressionStart();
            handleCountriesSelect();
            handleEmailsLists();
            handleSuppressionDetails();
            handleStopProcess();
        }
    };
}();

// initialize and activate the script
$(function(){ Suppression.init(); });