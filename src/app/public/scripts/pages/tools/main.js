/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Tools.js	
 */
var Tools = function() 
{    
    var handleMailboxExtractor = function()
    {
        $('#return-type').on('change',function()
        {
            if($(this).val() === 'header-value')
            {
                $('#return-header-key').removeAttr('disabled');
            }
            else
            {
                $('#return-header-key').prop('disabled',true);
            }
        });
        
        $('.filtering-add').on('click',function()
        {
            var template = atob($(this).attr('data-template'));
            var lastIndex = 0;
            
            $('.filters-header-parameter').each(function()
            {
                var i = $(this).attr('data-index');
                
                if(lastIndex < i)
                {
                    lastIndex = i;
                }
            });
            
            lastIndex++;
            
            $('.filtering-container').append(template.replaceAll('data-index="0"','data-index="' + lastIndex + '"'));
            $('select.filters-type').selectpicker('refresh');
            $('#mailboxes').height($('#extractor-params-container').height() - 48);
            
            $('.filtering-remove').unbind("click").on('click',function()
            {
                var element = $(this).closest('.filtering-item');

                swal({
                    title: "Are you sure you want to delete this filter?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes",
                    closeOnConfirm: true
                },
                function () 
                {
                    element.remove();
                    $('#mailboxes').height($('#extractor-params-container').height() - 48);
                });
            });
        });
        
        $('.filtering-remove').unbind("click").on('click',function()
        {
            var element = $(this).closest('.filtering-item');

            swal({
                title: "Are you sure you want to delete this filter?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            },
            function () 
            {
                element.remove();
                $('#mailboxes').height($('#extractor-params-container').height() - 48);
            });
        });
        
        $('.extract-mailbox').on('click',function()
        {
            var extractType = $(this).attr('data-extract-type');
            var mailboxes = $("#mailboxes").val();
            var folder = $("#folder").val();
            var dateRange = $("#date-range").val();
            var returnType = $("#return-type").val();
            var filterType = $("#filter-type").val();
            var separator = $("#results-separator").val();
            var returnHeaderKey = $('#return-header-key').val();
            var maxEmailsNumber = $('#max-emails-number').val();
            var emailsOrder = $('#emails-order').val();
            
            // delete old results
            $('#results').html('');

            var button = $(this);
            var html = button.html();
            
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Extracting ...");
            button.attr('disabled','disabled');
            
            iResponse.blockUI();
            
            var filters = [];
            var i = 0;
            
            $('.filters-header-parameter').each(function()
            {
                var index = $(this).attr('data-index');
                var filterParameter = $(this).val();
                var filterType = $('.filters-type[data-index="' + index + '"]').val();
                var filterValue = $('.filters-header-value[data-index="' + index + '"]').val();
                filters[i] = {'key' : filterParameter,'condition' : filterType ,'value' : filterValue};
                i++;
            });
            
            var data = 
            { 
                'controller' : 'Tools',
                'action' : 'mailboxExtractor',
                'parameters' : 
                {
                    'mailboxes' : mailboxes,
                    'folder' : folder,
                    'max-emails-number' : maxEmailsNumber,
                    'date-range' : dateRange,
                    'emails-order' : emailsOrder,
                    'return-type' : returnType,
                    'separator' : separator,
                    'return-header-key' : returnHeaderKey,
                    'filter-type' : filterType,
                    'filters' : filters
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
                            var results = result['data']['results'];
                            
                            if(extractType === 'file')
                            {
                                var content = '';
                                
                                for (var key in results) 
                                {
                                    content += results[key] + separator + "\n"; 
                                }
                                
                                var a = document.createElement('a');
                                a.href = 'data:text/plain,' +  encodeURIComponent(content);
                                a.target = '_blank';
                                a.download = 'results.txt';

                                document.body.appendChild(a);
                                a.click();
                            }
                            else if(extractType === 'zip')
                            {
                                var zip = new JSZip();
      
                                for (var key in results) 
                                {
                                    zip.file(key + ".txt",results[key] + separator + "\n"); 
                                }
                                
                                zip.generateAsync({type:"blob"}).then(function (blob) { 
                                    saveAs(blob, "results.zip");
                                });
                            }
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                        
                        button.html(html);
                        button.removeAttr('disabled');
                        iResponse.unblockUI();
                    }
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
            handleMailboxExtractor();
        }
    };

}();

// initialize and activate the script
$(function(){ Tools.init(); });