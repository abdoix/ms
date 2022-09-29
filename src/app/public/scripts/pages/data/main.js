/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Data.js	
 */
var Data = function() 
{
    var handleUploadLists = function()
    {
        $('#datalists-upload').fileupload({
            disableImageResize: false,
            autoUpload: false,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            maxFileSize: 8000000000,
            acceptFileTypes: /(\.|\/)(txt|csv|zip)$/i
        }).bind('fileuploadsend', function (e, data) {
            data.data.append('data-provider-id',$('#data-providers').val());
            data.data.append('list-name',$('#name').val());
            data.data.append('emails-type',$('#initial-types').val());
            data.data.append('isp',$('#isps').val());
            data.data.append('country',$('#countries').val());
            data.data.append('verticals',$('#verticals').val());
            data.data.append('list-old-id',$('#lists').val());
            data.data.append('file-type',$('#file-types').val());
            data.data.append('list-deviding-value',$('#deviding-value').val());
            data.data.append('duplicate-value',$('#duplicate-value').val());
            data.data.append('encrypt-emails',$('#encrypt-emails').val()); 
            data.data.append('allow-duplicates',$('#allow-duplicates').val());
            data.data.append('filter-data',$('#filter-data').val());
        }).bind('fileuploadprogress', function (e, data) 
        {
            $('#fileupload').addClass('fileupload-processing');
            $('.fileupload-process').hide();
        })
        .bind('fileuploaddone', function (e, data) 
        {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
            $('.data-ajax-list .filter-submit').click();
        })
        .bind("fileuploadprocessfail", function(e, data) {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
        }); 
        
        $('#file').on('change',function(){
            $('.template-upload').find('.progress').each(function(){$(this).css('border','1px #ccc solid')});
            $('.template-upload').find('.btn.start').each(function(){$(this).css('margin-top','31px')});
            $('.template-upload').find('.btn.cancel').each(function(){$(this).css('margin-top','31px')});
        });
        
        $('#data-lists').on('draw.dt',function (){
            $("#isps").change();
        });
        
        $('#allow-duplicates').on('change',function(){
            if($(this).val() == 'enabled')
            {
                $('#duplicate-value').prop('disabled',true);
            }
            else
            {
                $('#duplicate-value').removeAttr('disabled');
            }
        });
    };

    var handleBlacklists = function()
    {
        $('#blacklists-upload').fileupload({
            disableImageResize: false,
            autoUpload: false,
            maxNumberOfFiles: 1,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            maxFileSize: 8000000000,
            acceptFileTypes: /(\.|\/)(txt)$/i
        }).bind('fileuploadprogress', function (e, data) 
        {
            $('#fileupload').addClass('fileupload-processing');
            $('.fileupload-process').hide();
        })
        .bind('fileuploaddone', function (e, data) 
        {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
            $('.data-ajax-list .filter-submit').click();
        })
        .bind("fileuploadprocessfail", function(e, data) {
            $('#fileupload').removeClass('fileupload-processing');
            $('.fileupload-process').hide();
            $('.data-ajax-list .filter-submit').click();
        }); 
        
        $('#file').on('change',function(){
            $('.template-upload').find('.progress').each(function(){$(this).css('border','1px #ccc solid')});
            $('.template-upload').find('.btn.start').each(function(){$(this).css('margin-top','31px')});
            $('.template-upload').find('.btn.cancel').each(function(){$(this).css('margin-top','31px')});
        });
    };
    
    var handleExistingListSelect = function()
    {
        $('#lists').on('change',function()
        {
            var value = $(this).val();

            if(value == '' || value == undefined || value == null)
            {
                $('#name').removeAttr('disabled');
                $('#countries').removeAttr('disabled').selectpicker('refresh');
                $('#encrypt-emails').removeAttr('disabled').selectpicker('refresh');
                $('#deviding-value').removeAttr('disabled');
            }
            else
            {
                $('#name').val(null).prop('disabled',true);
                $('#countries').val(null).prop('disabled',true).selectpicker('refresh');
                $('#encrypt-emails').val(null).prop('disabled',true).selectpicker('refresh');
                $('#deviding-value').prop('disabled',true);
            }
        });
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
            
            $("#lists").html('<option value="" selected="true">None</option>');
            $("#lists").selectpicker('refresh');
            
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
                            var lists = result['data']['data-lists'];

                            for (var i in lists)
                            {
                                var value = lists[i];
                                $("#lists").append('<option value="'+value['id']+'">' + value['name'] + ' (count : ' + value['total_count'] + ')</option>');
                            }
                            
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
    };

    var handleFetchEmails = function()
    {
        $('.fetch-emails').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var ids = $('#ids').val();
            
            // check if there is an id inserted 
            if(ids == null || ids == undefined)
            {
                iResponse.alertBox({title: 'No ids entered !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');
            
            // delete last results
            $('#emails').html('');
            
            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'DataLists',
                'action' : 'fetchEmails',
                'parameters' : 
                {
                    'ids' : ids
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
                            $('#emails').html(result['data']['emails']);
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
    
    var handleBlacklistEmails = function()
    {
        $('.blacklist-emails').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var emails = $('#emails').val();
            
            // check if there is an id inserted 
            if(emails == null || emails == undefined)
            {
                iResponse.alertBox({title: 'No emails entered !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');

            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'DataLists',
                'action' : 'blacklistEmails',
                'parameters' : 
                {
                    'emails' : emails
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
    
    var handleDeleteEmails = function()
    {
        $('.delete-emails').on('click',function(e)
        {
            e.preventDefault();

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            var emails = $('#emails').val();
            
            // check if there is an id inserted 
            if(emails == null || emails == undefined)
            {
                iResponse.alertBox({title: 'No emails entered !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Executing ...");
            button.attr('disabled','disabled');

            iResponse.blockUI();

            var data = 
            { 
                'controller' : 'DataLists',
                'action' : 'deleteEmails',
                'parameters' : 
                {
                    'emails' : emails
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
    
    return {
        init: function() 
        {
            handleUploadLists();
            handleBlacklists();
            handleExistingListSelect();
            handleEmailsLists();
            handleFetchEmails();
            handleBlacklistEmails();
            handleDeleteEmails();
        }
    };
}();

// initialize and activate the script
$(function(){ Data.init(); });