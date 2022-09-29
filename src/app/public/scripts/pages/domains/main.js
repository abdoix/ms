/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Domains.js	
 */
var Domains = function() 
{
    var handleRemoveBrands = function()
    {
        $('.remove-brands').unbind("click").on('click',function(e)
        {
            e.preventDefault();
            var domainsIds = [];
            var i = 0;
            
            $('#domains .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    domainsIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(domainsIds.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one domain !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
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
                    'controller' : 'Domains',
                    'action' : 'removeBrands',
                    'parameters' : 
                    {
                        'domains-ids' : domainsIds
                    }
                };

                iResponse.blockUI();

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
    
    var handleUploadBrands = function()
    {
        $('#brands-upload').fileupload({
            disableImageResize: false,
            autoUpload: false,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            maxFileSize: 20000000,
            acceptFileTypes: /(\.|\/)(zip)$/i
        })
        .bind('fileuploadsend', function (e, data) {
            data.data.append('controller','Domains');
            data.data.append('action','uploadBrands');
        })
        .bind('fileuploadprogress', function (e, data) 
        {
            $('#fileupload').addClass('fileupload-processing');
            $('.fileupload-process').hide();
        })
        .bind('fileuploaddone', function (e, data) 
        {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
        })
        .bind("fileuploadprocessfail", function(e, data) {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
        }); 
        
        $('#file').on('change',function(){
            $('.template-upload').find('.progress').first().css('border','1px #ccc solid');
            $('.template-upload').find('.btn.start').first().css('margin-top','31px');
            $('.template-upload').find('.btn.cancel').first().css('margin-top','31px');
        });
    };

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
        
        $('#multi-accounts').on('change',function()
        {
            var account = $(this).val();
            
            // delete old domains
            $('#multi-domains').html('');
            $('#multi-domains').selectpicker('refresh');
            
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
                                $('#multi-domains').append("<option value='" + domains[i]['id'] + "'>" + domains[i]['value'] + "</option>");
                            }
                            
                            $('#multi-domains').selectpicker('refresh');
                            $('#multi-domains').change();
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
    
    var getDomainRecords = function()
    {
        $('#domains').on('change',function()
        {
            var domainId = $(this).val();
            
            // remove old records
            $('.mapping-item').remove();
            
            if(domainId == null || domainId <= 0 || domainId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Domains',
                'action' : 'getDomainRecords',
                'parameters' : 
                {
                    'domain-id' : domainId
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
                            var records = result['data']['records'];
                            
                            var mappingIndex = 0;
                            
                            for (var i = 0;i < records.length;i++) 
                            {
                                var record = records[i];

                                $('.mapping-add').click();
 
                                $('select.record-type[data-index="' + mappingIndex + '"]').val(record['type']);
                                $('select.record-type[data-index="' + mappingIndex + '"]').selectpicker('refresh');
                                $('input.record-host[data-index="' + mappingIndex + '"]').val(record['host']);
                                $('input.record-value[data-index="' + mappingIndex + '"]').val(record['value']);
                                $('select.record-ttl[data-index="' + mappingIndex + '"]').val(record['ttl']);
                                $('select.record-ttl[data-index="' + mappingIndex + '"]').selectpicker('refresh');

                                mappingIndex++;
                            }
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
    
    var handleAddRecord = function()
    {
        $('.mapping-delete-all').on('click',function(e)
        {
            e.preventDefault();
            
            swal(
            {
                    title: "Are you sure you want to delete all elements ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes",
                    closeOnConfirm: true
            },
            function () 
            {
                $('.mapping-item').each(function(){
                    $(this).remove();
                });
                
                $('.mapping-add').click();
            });
        });
        
        $('.mapping-add').on('click',function()
        {
            var template = atob($(this).attr('data-template'));
            var lastIndex = 0;
            var found = false;
            
            $('select.record-type').each(function()
            {
                var i = parseInt($(this).attr('data-index'));
                
                if(lastIndex < i)
                {
                    lastIndex = i;
                }
                
                found = true;
            });
            
            lastIndex = found == false ? 0 : lastIndex+1;
            $('.mapping-container').append(template.replaceAll('data-index="0"','data-index="' + lastIndex + '"'));
            $('select.record-type[data-index="' + lastIndex + '"]').selectpicker({iconBase:"fa",tickIcon:"fa-check",dropupAuto:false});
            $('select.record-ttl[data-index="' + lastIndex + '"]').selectpicker({iconBase:"fa",tickIcon:"fa-check",dropupAuto:false});
            
            $('.mapping-remove').on('click',function()
            {
                var element = $(this).closest('.mapping-item');

                swal({
                    title: "Are you sure you want to delete this element?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes",
                    closeOnConfirm: true
                },
                function () 
                {
                    element.remove();
                });
            });
        });  
    };
    
    var handleRecordsSave = function()
    {
        $('.records-save').on('click',function(event)
        {
            event.preventDefault();
            
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var domainId = $('#domains').val();
            
            // check if there is a domain selected 
            if(domainId == null || domainId == '' || domainId == 0)
            {
                iResponse.alertBox({title: 'No domain selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var records = [];
            var i = 0;
            
            $('select.record-type').each(function()
            {
                var index = parseInt($(this).attr('data-index'));
                var type = $(this).val();
                
                if(type == null || type == undefined || type == '')
                {
                    iResponse.alertBox({title: 'There is a record missing type !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }

                var host = $('input.record-host[data-index="' + index + '"]').val();
                
                if(host == null || host == undefined || host == '')
                {
                    iResponse.alertBox({title: 'There is a record missing host !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }
                
                var value = $('input.record-value[data-index="' + index + '"]').val();
                
                if(value == null || value == undefined || value == '')
                {
                    iResponse.alertBox({title: 'There is a record missing value !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }
                
                var ttl = $('select.record-ttl[data-index="' + index + '"]').val();
                
                if(ttl == null || ttl == undefined || ttl == '')
                {
                    iResponse.alertBox({title: 'There is a record missing ttl !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }

                records[i] = {
                    'type' : type,
                    'host' : host,
                    'value' : value,
                    'ttl' : ttl
                }

                i++;
            });
            
            records = btoa(JSON.stringify(records));
            
            // showing the terminal
            button.html("<i class='fa fa-spinner fa-spin'></i> Saving Records ...");
            button.attr('disabled','disabled');
            
            var data = 
            { 
                'controller' : 'Domains',
                'action' : 'setDomainRecords',
                'parameters' : 
                {
                    'domain-id' : domainId,
                    'records' : records
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
                            $('.mapping-item').remove();
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
        
        $('.multi-records-save').on('click',function(event)
        {
            event.preventDefault();
            
            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var domainsIds = $('#multi-domains').val();
            
            // check if there is a domain selected 
            if(domainsIds == null || domainsIds == '' || domainsIds.length == 0)
            {
                iResponse.alertBox({title: 'No domain selected !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            var records = [];
            var i = 0;
            
            $('select.record-type').each(function()
            {
                var index = parseInt($(this).attr('data-index'));
                var type = $(this).val();
                
                if(type == null || type == undefined || type == '')
                {
                    iResponse.alertBox({title: 'There is a record missing type !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }

                var host = $('input.record-host[data-index="' + index + '"]').val();
                
                if(host == null || host == undefined || host == '')
                {
                    iResponse.alertBox({title: 'There is a record missing host !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }
                
                var value = $('input.record-value[data-index="' + index + '"]').val();
                
                if(value == null || value == undefined || value == '')
                {
                    iResponse.alertBox({title: 'There is a record missing value !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }
                
                var ttl = $('select.record-ttl[data-index="' + index + '"]').val();
                
                if(ttl == null || ttl == undefined || ttl == '')
                {
                    iResponse.alertBox({title: 'There is a record missing ttl !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    return false;
                }

                records[i] = {
                    'type' : type,
                    'host' : host,
                    'value' : value,
                    'ttl' : ttl
                }

                i++;
            });
            
            records = btoa(JSON.stringify(records));
            
            // showing the terminal
            button.html("<i class='fa fa-spinner fa-spin'></i> Saving Records ...");
            button.attr('disabled','disabled');
            
            var data = 
            { 
                'controller' : 'Domains',
                'action' : 'setMultiDomainsRecords',
                'parameters' : 
                {
                    'domains-ids' : domainsIds,
                    'records' : records
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
                            $('.mapping-item').remove();
                            iResponse.alertBox({title: result['message'], type: "success", allowOutsideClick: "true", confirmButtonClass: "btn-primary"});
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                    
                    button.html(html);
                    button.removeAttr('disabled');
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                    button.html(html);
                    button.removeAttr('disabled');
                }
            });
        });
    };
    
    return {
        init: function() 
        {
            handleRemoveBrands();
            handleUploadBrands();
            getAccountDomains();
            getDomainRecords();
            handleAddRecord();
            handleRecordsSave();
        }
    };
}();

// initialize and activate the script
$(function(){ Domains.init(); });