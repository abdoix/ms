/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Offers.js	
 */
var Offers = function() 
{
    var handleOffersSwitch = function ()
    {
        $("#offer-form-switcher").on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();

            if(state == true)
            {
                $('#offers-manual-form').addClass('hide').fadeOut(500,function(){
                    $('#offers-api-form').removeClass('hide').fadeIn(500);
                });
                return false;
            }
            else
            {
                $('#offers-api-form').addClass('hide').fadeOut(500,function(){
                    $('#offers-manual-form').removeClass('hide').fadeIn(500);
                });
                return false;
            }
        });
    };

    var handleAllOffersSwitch = function ()
    {
        $('#get-all-offers').change(function()
        { 
            if (this.checked) 
            {
                $('#production-ids').attr('disabled',true);
                $('#production-ids').removeAttr('data-required');
            }
            else 
            {
                $('#production-ids').removeAttr('disabled');
                $('#production-ids').attr('data-required',true);
            }
        });
    };
    
    var handleAllCreativesSwitch = function ()
    {
        $('#get-all-creatives').change(function()
        { 
            if (this.checked) 
            {
                $('#max-creatives').val(0);
                $('#max-creatives').attr('disabled',true);
            }
            else 
            {
                $('#max-creatives').val(1);
                $('#max-creatives').attr('disabled',false);
            }
        });
    };
    
    var handleCountriesSelect = function ()
    {
        var offerId = $('#offer-id').val();

        if(offerId != undefined && offerId > 0)
        {
            var countries = $('#countries').attr('data-countries');
            
            if(countries != undefined && countries != '')
            {
                var array = countries.indexOf(',') >= 0 ? countries.split(',') : [countries];

                $('#countries').val(array);
                $('#countries').selectpicker('refresh');
            }
        }
    };
    
    var handleCreativeDisplay = function()
    {
        // display creative
        $('.display-creative').on('click',function(e) 
        {
            e.preventDefault();
            var body = $('#creative').val();
            $("#creative-frame").css("min-height", ($(window).height() - 200) + "px");
            var frame = document.getElementById('creative-frame');
            var doc = frame.contentDocument || frame.contentWindow.document;
            doc.write(body);
            doc.close(); 
            
            $('#creative-frame').load(function(){
                $('#creative-loading').hide();
                $(this).show();
            });
            
            $('#creative-display').modal('toggle');
        });
    };
    
    var handleOffersDetails = function()
    {
        $('.offer-details').unbind("click").on('click',function(e)
        {
            e.preventDefault();
            
            var offersIds = [];
            var i = 0;
            
            $('#offers .checkboxes').each(function()
            {
                if($(this).is(":checked"))
                {
                    offersIds[i] = $(this).val();
                    i++;
                }
            });
            
            if(offersIds.length == 0)
            {
                iResponse.alertBox({title: 'Please select at least one offer !', type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return false;
            }
            
            $('#offers-details .modal-body').html("");
            
            var data = 
            { 
                'controller' : 'Affiliate',
                'action' : 'getOffersDetails',
                'parameters' : 
                {
                    'offers-ids' : offersIds
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
                            $('#offers-details .modal-body').html(result['data']['details']);
                            $('#offers-details').modal('toggle');
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

    return {
        init: function() 
        {
            handleOffersSwitch();
            handleAllOffersSwitch();
            handleAllCreativesSwitch();
            handleCountriesSelect();
            handleCreativeDisplay();
            handleOffersDetails();
        }
    };

}();

// initialize and activate the script
$(function(){ Offers.init(); });