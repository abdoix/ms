/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            AutoResponders.js	
 */
var AutoResponders = function() 
{
    var initPage = function()
    { 
        $('#servers').val(null);
        $('#servers').selectpicker('refresh');
        $('#servers').change();
        
        $('#components').val(null);
        $('#components').selectpicker('refresh'); 
        $('#components').change();
        
        $('#affiliate-networks').val(null);
        $('#affiliate-networks').selectpicker('refresh');
        $('#affiliate-networks').change();
        
        $('#offers').html('').val(null);
        $('#offers').selectpicker('refresh');
        $('#offers').change();
    };
    
    var handleRandomizeLines = function()
    {
        $('.randomize-lines').click(function(e)
        {
            e.preventDefault();
            
            var target = $(this).attr('data-randomize-target');
            var values = $('#' + target).val().replace(/^\s*[\r\n]/gm,"").split("\n");
            
            if(values.length > 0)
            {
                var currentIndex = values.length, temporaryValue, randomIndex;

                while (0 !== currentIndex) 
                {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex -= 1;

                  temporaryValue = values[currentIndex];
                  values[currentIndex] = values[randomIndex];
                  values[randomIndex] = temporaryValue;
                }
            }
            
            $('#' + target).val(values.join("\n"));
        });
    };

    var handleSmtpMtaSwitch = function()
    {
        $('#smtp-mta-switcher').on('switchChange.bootstrapSwitch', function(event, state) 
        { 
            event.preventDefault();
            
            if(state == true)
            {
                $('.vmta-user-label').html('Vmtas');
                $('#header').html(btoa($('.reset-headers').first().attr('data-original-mta-header')));
                $('#auto-responder-type').val('mta');
            }
            else
            {
                $('.vmta-user-label').html('Smtp Users');
                $('#header').html(btoa($('.reset-headers').first().attr('data-original-smtp-header')));
                $('#auto-responder-type').val('smtp');
            }
            
            $('.refresh-servers').click();
        });
    };
    
    var handleServersRefresh = function()
    {
        $('.refresh-servers').on('click',function(e)
        {
            e.preventDefault();
            
            $('#servers').html("");
            $('#servers').selectpicker('refresh');
            $('#components').html("");
            $('#components').selectpicker('refresh');
            
            var type = $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'mta' : 'smtp';

            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getServers',
                'parameters' : 
                {
                    'type' : type
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json', 
                data : data,
                async: AutoResponders.async,
                dataType : 'JSON',
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var servers = result['data']['servers'];
                            
                            for (var i in servers) 
                            {
                                if(type == 'smtp')
                                {
                                    $('#servers').append("<option value='" + servers[i]['id'] + "'>(" + servers[i]['provider_name'] + ") " + servers[i]['name'] + "</option>");
                                }
                                else
                                {
                                    $('#servers').append("<option value='" + servers[i]['id'] + "'>(" + servers[i]['provider_name'] + ") " + servers[i]['name'] + "</option>");
                                }
                            }
                            
                            $('#servers').selectpicker('refresh');
                            $('#servers').change();
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
    
    var handleServersChange = function()
    {
        $('#servers').on('change',function()
        {
            var serverId = $(this).val();
            
            $('#components').html("");
            $('#components').selectpicker('refresh');

            if(serverId == null || serverId <= 0 || serverId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : $('#smtp-mta-switcher').bootstrapSwitch('state') == true ? 'getVmtas' : 'getSmtpUsers',
                'parameters' : 
                {
                    'server-ids' : [serverId],
                    'isp-id' : 0,
                    'vmtas-type' : 'all-vmtas'
                }
            };

            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json', 
                data : data,
                async: AutoResponders.async,
                dataType : 'JSON',
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            if($('#smtp-mta-switcher').bootstrapSwitch('state') == false)
                            {
                                var smtpUsers = result['data']['smtp-users'];

                                for (var i in smtpUsers) 
                                {
                                    $('#components').append("<option value='" + smtpUsers[i]['id'] + "'> " + smtpUsers[i]['username'] + "</option>");
                                }
                            }
                            else
                            {
                                var vmtas = result['data']['vmtas'];
                            
                                for (var i in vmtas) 
                                {
                                    var star = vmtas[i]['type'] != 'Default' ? '*' : ''; 
                                    var domain = vmtas[i]['type'] != 'Default' ? vmtas[i]['custom_domain'] : vmtas[i]['domain'];
                                    $('#components').append("<option value='" + vmtas[i]['id'] + "' data-server-id='" + vmtas[i]['mta_server_id'] + "' data-rdns='" + vmtas[i]['domain'] + "' data-ip='" + vmtas[i]['ip'] + "'>(" + vmtas[i]['mta_server_name'] + ") " + vmtas[i]['ip'] + " (" + domain + ") " + star + "</option>");
                                }
                            }
                            
                            $('#components').selectpicker('refresh');
                            $('#components').change();
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
    
    var handleAffiliateNetworksChange = function()
    {
        $('#affiliate-networks').on('change',function()
        {
            var affiliateNetworkId = $(this).val();
            
            $('#offers').html("");
            $('#offers').selectpicker('refresh');
            $('#offers').change();
            
            if(affiliateNetworkId == null || affiliateNetworkId <= 0 || affiliateNetworkId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getOffers',
                'parameters' : 
                {
                    'affiliate-network-id' : affiliateNetworkId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                async: AutoResponders.async,
                dataType : 'JSON',
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var offers = result['data']['offers']; 
                            
                            for (var i in offers) 
                            {
                                $('#offers').append("<option value='" + offers[i]['id'] + "'>(" + offers[i]['production_id'] + ") " + offers[i]['name'] + "</option>");
                            }
                            
                            $('#offers').selectpicker('refresh');
                            $('#offers').change();
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
    
    var handleOffersChange = function()
    {
        $('#offers').on('change',function()
        {
            var offerId = $(this).val();
            
            $('#from-names').html("");
            $('#from-names').selectpicker('refresh');
            $('#from-names').change();
            
            $('#subjects').html("");
            $('#subjects').selectpicker('refresh');
            $('#subjects').change();
                            
            $('#creatives').html("");
            $('#creatives').selectpicker('refresh');
            $('#creatives').change();
            
            if(offerId == null || offerId <= 0 || offerId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getOfferDetails',
                'parameters' : 
                {
                    'offer-id' : offerId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                async: AutoResponders.async,
                dataType : 'JSON',
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var froms = result['data']['from-names'];
                            
                            for (var i in froms) 
                            {
                                $('#from-names').append("<option value='" + froms[i]['id'] + "'>" + froms[i]['value'] + "</option>");
                            }
                            
                            var subjects = result['data']['subjects'];
                            
                            for (var i in subjects) 
                            {
                                $('#subjects').append("<option value='" + subjects[i]['id'] + "'>" + subjects[i]['value'] + "</option>");
                            }
                            
                            var creatives = result['data']['creatives'];
                            
                            for (var i in creatives) 
                            {
                                $('#creatives').append("<option value='" + creatives[i]['id'] + "'>" + creatives[i]['name'] + "</option>");
                            }
                            
                            $('#from-names').selectpicker('refresh');
                            $('#from-names').change();
                            
                            $('#subjects').selectpicker('refresh');
                            $('#subjects').change();
                            
                            $("#creatives").val($("#creatives > option:nth-child(2)").val()).selectpicker('refresh');
                            $('#creatives').selectpicker('refresh');
                            $('#creatives').change();
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
    
    var handleCreativesChange = function()
    {
        $('#creatives').on('change',function()
        {
            var creativeId = $(this).val();
            var linkType = $('#link-type').val();
            
            if(creativeId == null || creativeId <= 0 || creativeId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getCreativeDetails',
                'parameters' : 
                {
                    'creative-id' : creativeId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                async: AutoResponders.async,
                dataType : 'JSON',
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status'];

                        if(status == 200)
                        {
                            var creative = result['data']['creative'];
                            
                            // check for open tracking 
                            if($('#track-opens').val() == 'enabled')
                            {
                                if(linkType == 'routing-gcloud' || linkType == 'routing-bitly' || linkType == 'routing-tinyurl' 
                                || linkType == 'attr-gcloud'  || linkType == 'attr-bitly' || linkType == 'attr-tinyurl')
                                {
                                    creative += "<img alt='' src='[short_open]' width='1px' height='1px' style='visibility:hidden'/>";
                                }
                                else
                                {
                                    creative += "<img alt='' src='http://[domain]/[open]' width='1px' height='1px' style='visibility:hidden'/>";
                                }
                            }
                            
                            $("#body").val(creative);
                            $("#body").change();
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
        
        // short link change
        $('#link-type').on('change',function()
        {
            var body = $('#body').val();
            var value = $(this).val();

            if(value == 'routing-gcloud' || value == 'routing-bitly' || value == 'routing-tinyurl' 
            || value == 'attr-gcloud'  || value == 'attr-bitly' || value == 'attr-tinyurl')
            {
                body = body.replaceAll('http://[domain]/[open]','[short_open]');
                body = body.replaceAll('http://[domain]/[url]','[short_url]');
                body = body.replaceAll('http://[domain]/[unsub]','[short_unsub]');
                body = body.replaceAll('http://[domain]/[optout]','[short_optout]');

                body = body.replaceAll('http://[rdns]/[open]','[short_open]');
                body = body.replaceAll('http://[rdns]/[url]','[short_url]');
                body = body.replaceAll('http://[rdns]/[unsub]','[short_unsub]');
                body = body.replaceAll('http://[rdns]/[optout]','[short_optout]');
            }
            else 
            {
                body = body.replaceAll('[short_open]','http://[domain]/[open]');
                body = body.replaceAll('[short_url]','http://[domain]/[url]');
                body = body.replaceAll('[short_unsub]','http://[domain]/[unsub]');
                body = body.replaceAll('[short_optout]','http://[domain]/[optout]');

                body = body.replaceAll('[short_open]','http://[rdns]/[open]');
                body = body.replaceAll('[short_url]','http://[rdns]/[url]');
                body = body.replaceAll('[short_unsub]','http://[rdns]/[unsub]');
                body = body.replaceAll('[short_optout]','http://[rdns]/[optout]');
            }

            $('#body').val(body);
        });

        // display creative
        $('.display-creative').on('click',function(e) 
        {
            e.preventDefault();
            var body = $('#body').val();
            
            if($('#smtp-mta-switcher').bootstrapSwitch('state') == true)
            {
                var vmtas = $('#components option:selected');
            
                if(vmtas.length > 0 && vmtas.first().val() != '')
                {
                    body = body.replaceAll('[domain]',vmtas.first().attr('data-rdns'));
                }
            }
            else
            {
                body = body.replaceAll('[domain]',$('#static-domain').val());
            }

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
    
    var handleEncodings = function()
    {
        $('#from-names,#from-names-encoding').on('change',function()
        {
            // check for from name 
            if($('#from-names').val() != null && $('#from-names').val() != undefined && $('#from-names').val() != '')
            {
                var fromName  = $("option:selected",'#from-names').html().replace(/(\r\n|\n|\r)/gm,"");
                var fromEncoding = $("#from-names-encoding").val();

                if(fromEncoding == 'b64')
                {
                    fromName = "=?UTF-8?B?" + btoa(fromName) +  "?=";
                }
                else if(fromEncoding == 'uni')
                {
                    fromName = "=?UTF-8?Q?=" + iResponse.encodeToUnicode(fromName).replaceAll(" ",'=') +  "?=";
                }

                $('#from-name').val(fromName);
            }
        });
        
        $('#subjects,#subjects-encoding').on('change',function()
        {
           // check for subject
            if($('#subjects').val() != null && $('#subjects').val() != undefined && $('#subjects').val() != '')
            {
                var subject  = $("option:selected",'#subjects').html().replace(/(\r\n|\n|\r)/gm,"");
                var subjectEncoding = $("#subjects-encoding").val();

                if(subjectEncoding == 'b64')
                {
                    subject = "=?UTF-8?B?" + btoa(subject) +  "?=";
                }
                else if(subjectEncoding == 'uni')
                {
                    subject = "=?UTF-8?Q?=" + iResponse.encodeToUnicode(subject).replaceAll(" ",'=') +  "?=";
                }

                $('#subject').val(subject);
            } 
        });
    };
    
    var handleEditAutoResponder = function()
    {
        var autoResponderId = parseInt($('#auto-responder-id').val());

        if(autoResponderId > 0)
        {
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Production',
                'action' : 'getAutoReponder',
                'parameters' : 
                {
                    'auto-responder-id' : autoResponderId
                }
            };
            
            $.ajax({
                type: 'POST',
                url: iResponse.getBaseURL() + '/api.json',
                data : data,
                dataType : 'JSON',
                async: AutoResponders.async,
                success:function(result) 
                {
                    if(result != false)
                    {
                        var status = result['status']; 

                        if(status == 200)
                        {
                            var autoResponder = result['data']['auto-responder'];
                            
                            if(autoResponder != null)
                            {
                                AutoResponders.async = false;
                                
                                // check auto responder type state
                                if(autoResponder['type'] == 'smtp')
                                {
                                    $('#smtp-mta-switcher').bootstrapSwitch('state',false);
                                }
                                
                                $('#name').val(autoResponder['name']);
                                
                                // select server
                                if(autoResponder['server-id'] != null)
                                {
                                    $('#servers').val(autoResponder['server-id']);
                                    $('#servers').selectpicker('refresh');
                                    $('#servers').change();
                                }
                                
                                // select component
                                if(autoResponder['component-id'] != null)
                                {
                                    $('#components').val(autoResponder['component-id']);
                                    $('#components').selectpicker('refresh');
                                    $('#components').change();
                                }
                                
                                // select sponsors
                                $('#affiliate-networks').val(autoResponder['affiliate-network-id']).change();
                                
                                $('#offers').val(autoResponder['offer-id']);
                                $('#offers').selectpicker('refresh');
                                $('#offers').change();
                                
                                $('#creatives').val(autoResponder['offer-creative-id']);
                                $('#from-names').val(autoResponder['from-name-id']).change();
                                $('#from-names-encoding').val(autoResponder['from-names-encoding']).change();
                                $('#subjects').val(autoResponder['subject-id']).change();
                                $('#subjects-encoding').val(autoResponder['subjects-encoding']).change();
                                
                                // header / body part
                                $('#return-path').val(autoResponder['return-path']).change();
                                $('#static-domain').val(autoResponder['static-domain']).change();
                                $('#creatives-content-type').val(autoResponder['creative-content-type']).change();
                                $('#creatives-charset').val(autoResponder['creative-charset']).change();
                                $('#link-type').val(autoResponder['link-type']).change();
                                $('#creatives-content-transfert-encoding').val(autoResponder['creative-content-transfert-encoding']).change();
                                $('#header').val(autoResponder['header']);
                                $('#body').val(autoResponder['body']);
                                
                                // actions part
                                $('#on-open').bootstrapSwitch('state',(autoResponder['on-open'] == 'on'));
                                $('#on-click').bootstrapSwitch('state',(autoResponder['on-click'] == 'on'));
                                $('#on-unsub').bootstrapSwitch('state',(autoResponder['on-unsub'] == 'on'));
                                $('#on-optout').bootstrapSwitch('state',(autoResponder['on-optout'] == 'on'));
                                
                                AutoResponders.async = true;
                            }
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
        }
    };
    
    var async = true;
    
    return {
        init: function() 
        {
            initPage();
            handleRandomizeLines();
            handleSmtpMtaSwitch();
            handleServersRefresh();
            handleServersChange();
            handleAffiliateNetworksChange();
            handleOffersChange();
            handleCreativesChange();
            handleEncodings();
            handleEditAutoResponder();
        }
    };
}();

// initialize and activate the script
$(function(){ AutoResponders.init(); });
