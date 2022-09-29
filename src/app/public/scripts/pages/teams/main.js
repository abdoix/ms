/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Teams.js	
 */
var Teams = function() 
{
    var handleSelects = function ()
    {
        $('.select-all-options').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            var parent = $(this).closest('div.form-group');
            var target = $(this).attr('data-target');
            var select = parent.find('select' + target).first();
        
            $(select).find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            select.change();
        });
        
        $('.deselect-all-options').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var parent = $(this).closest('div.form-group');
            var target = $(this).attr('data-target');
            var select = parent.find('select' + target).first();
        
            $(select).find('option').each(function(){
                $(this).prop('selected',false);
            });
            
            select.change();
        });
        
        $('select.select-actions').unbind("change").on('change',function(e){
            e.stopPropagation();
            var object = $(this).attr('data-object-name');
            var count = $('option:selected',this).length;
            var parent = $(this).closest('div.form-group');
            var sibling = parent.find('span.options-sum').first();
            sibling.html('( ' + count + ' ' + object + ' Selected )');
        });
        
        $('.selects-move').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');
            
            $('#' + from + ' option:selected').remove().appendTo('#' + to);
            $('#' + from).change();
            $('#' + to).change();
        });
        
        new Clipboard('.copy-selected-ips', 
        {
            text: function() 
            {
                var text = "";
                var index = 0;
                
                $('#authorized-vmtas option:selected').each(function(){
                    text += $(this).attr('data-ip').trim() + "\n";
                    index++;
                });
                
                return text.slice(0,-1);
            }
        });
    };
    
    var handleFilterSelect = function()
    {
        $('.filter-ips-selection').on('click',function(event)
        {
            event.preventDefault();
            
            var values = $('#filter-select-text').val();
            
            if($('#filter-select-type').val() == 'authorized-servers')
            {
                var target = 'mta-servers';
                
                if(values != undefined && values != '')
                {
                    values = values.split("\n");

                    $('select#' + target).find('option').each(function()
                    {
                        for (var i in values) 
                        {
                            if($(this).html().trim().toLowerCase() == values[i].trim().toLowerCase())
                            {
                                $(this).prop('selected',true);
                            }
                        }
                    });
                    
                    $('#' + target).change();
                }
            }
            else if($('#filter-select-type').val() == 'available-servers')
            {
                var target = 'bulk-servers';
                
                if(values != undefined && values != '')
                {
                    values = values.split("\n");

                    $('select#' + target).find('option').each(function()
                    {
                        for (var i in values) 
                        {
                            if($(this).html().trim().toLowerCase() == values[i].trim().toLowerCase())
                            {
                                $(this).prop('selected',true);
                            }
                        }
                    });
                    
                    $('#' + target).change();
                }
            }
            else
            {
                var target = '';
                
                switch($('#filter-select-type').val())
                {
                    case 'authorized' : 
                    {
                        target = 'authorized-vmtas';
                        break;
                    }
                    case 'unauthorized' : 
                    {
                        target = 'unauthorized-vmtas';
                        break;
                    }
                    case 'available' : 
                    {
                        target = 'available-bulk-vmtas';
                        break;
                    }
                    case 'selected' : 
                    {
                        target = 'selected-bulk-vmtas';
                        break;
                    }
                }

                if(target != '' && values != undefined && values != '')
                {
                    values = values.split("\n");

                    $('#' + target).find('option').each(function()
                    {
                        var selected = false;

                        for (var i in values) 
                        {
                            if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(values[i].trim())) 
                            {  
                                if($(this).attr('data-ip').trim() == values[i].trim())
                                {
                                    selected = true;
                                }
                            }
                            else
                            {
                                if($(this).text().trim().toLowerCase().indexOf(values[i].trim().toLowerCase().replaceAll('.','_')) >= 0)
                                {
                                    selected = true;
                                }
                            }
                        }

                        $(this).prop('selected',selected);
                    });
                }
            }
        });
    };
    
    var getTeamsUsers = function()
    {
        $('#teams').on('change',function()
        {
            var teamId = $(this).val();
            
            $('#members').html('');
            $('#members').selectpicker('refresh');
            $('#members').change();
                            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getTeamMembers',
                'parameters' : 
                {
                    'team-id' : teamId
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
                            var members = result['data']['users'];
     
                            for (var i in members) 
                            {
                                $('#members').append('<option value="' + members[i]['id'] + '">' + members[i]['first_name'] + ' ' + members[i]['last_name'] + '</option>');
                            }
                            
                            $('#members').selectpicker('refresh');
                            $('#members').change();
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
        
        $('#teams-list').on('change',function()
        {
            var teamId = $(this).val();
            
            $('#affected-users').html('');
            $('#affected-users').change();
            $('#uaffected-users').html('');
            $('#uaffected-users').change();
            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getTeamMembersAffectation',
                'parameters' : 
                {
                    'team-id' : teamId
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
                            var affetedUsers = result['data']['affected-users'];
                            var unaffectedUsers = result['data']['unaffected-users'];
     
                            for (var i in affetedUsers) 
                            {
                                $('#affected-users').append('<option value="' + affetedUsers[i]['id'] + '">' + affetedUsers[i]['first_name'] + ' ' + affetedUsers[i]['last_name'] + '</option>');
                            }
                            
                            for (var i in unaffectedUsers) 
                            {
                                $('#unaffected-users').append('<option value="' + unaffectedUsers[i]['id'] + '">' + unaffectedUsers[i]['first_name'] + ' ' + unaffectedUsers[i]['last_name'] + '</option>');
                            }
                            
                            $('#unaffected-users').change();
                            $('#affected-users option').prop('selected', true);
                            $('#affected-users').change();
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
        
        $('.update-affectation').on('click',function(e){
            e.preventDefault(); 
            $(this).html("<i class='fa fa-spinner fa-spin'></i> Loading ...");
            $(this).attr('disabled','disabled');
            $('#affected-users option').prop('selected', true);
            $('#affected-users').change();
            $(this).closest('form').submit();
        });
    };

    var getUsersTeams = function()
    {
        $('#users-list').on('change',function()
        {
            $('#teams-list').val(null);
            $('#teams-list').change();
                            
            var userId = $(this).val();
            
            if(userId == null || userId <= 0 || userId == undefined)
            {
                return false;
            }
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getUserTeams',
                'parameters' : 
                {
                    'user-id' : userId
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
                            $('#teams-list').val(result['data']['teams']);
                            $('#teams-list').change();
                        }
                        else
                        {
                            iResponse.alertBox({title: result['message'], type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) 
                {
                    iResponse.alertBox({title: textStatus + ' : ' + errorThrown, type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                }
            });
        });
    };
    
    var getTeamMemberAuthorisations = function()
    {
        $('#members').on('change',function()
        {
            var teamId = $('#teams').val();
            var userId = $(this).val();
            
            $('#mta-servers').html('');
            $('#mta-servers').selectpicker('refresh');
            $('#mta-servers').change();
            $('#authorized-vmtas').html('');
            $('#authorized-vmtas').change();
            $('#unauthorized-vmtas').html('');
            $('#unauthorized-vmtas').change();
            
            $('#authorized-smtp-servers').html('');
            $('#authorized-smtp-servers').change();
            $('#unauthorized-smtp-servers').html('');
            $('#unauthorized-smtp-servers').change();
            
            $('#affiliate-networks').html('');
            $('#affiliate-networks').selectpicker('refresh');
            $('#affiliate-networks').change();
            $('#authorized-offers').html('');
            $('#authorized-offers').change();
            $('#unauthorized-offers').html('');
            $('#unauthorized-offers').change();
            
            $('#authorized-isps').html('');
            $('#authorized-isps').change();
            $('#unauthorized-isps').html('');
            $('#unauthorized-isps').change();
            
            $('#data-providers').html('');
            $('#data-providers').selectpicker('refresh');
            $('#data-providers').change();
            $('#authorized-data-lists').html('');
            $('#authorized-data-lists').change();
            $('#unauthorized-data-lists').html('');
            $('#unauthorized-data-lists').change();
            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            if(userId == null || userId == '' || userId == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getMemberAuthorisations',
                'parameters' : 
                {
                    'team-id' : teamId,
                    'user-id' : userId
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
                            $('#mta-servers').html(result['data']['mtaServers']);
                            $('#mta-servers').selectpicker('refresh');
                            $('#mta-servers').change();
                            
                            $('#unauthorized-smtp-servers').html(result['data']['smtpServers']);
                            $('#unauthorized-smtp-servers').change();
                            $('#smtp-servers-selector').click();
                            
                            $('#affiliate-networks').html(result['data']['affiliateNetworks']);
                            $('#affiliate-networks').selectpicker('refresh');
                            $('#affiliate-networks').change();
                            
                            $('#data-providers').html(result['data']['dataProviders']);
                            $('#data-providers').selectpicker('refresh');
                            $('#data-providers').change();
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

    var getMemberVmtas = function()
    {
        $('#mta-servers').on('change',function()
        {
            var serverIds = $(this).val();
            var teamId = $('#teams').val();
            var userId = $('#members').val();
            
            $('#authorized-vmtas').html('');
            $('#authorized-vmtas').change();
            $('#unauthorized-vmtas').html('');
            $('#unauthorized-vmtas').change();
                            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            if(serverIds == null || serverIds == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getMemberVmtas',
                'parameters' : 
                {
                    'team-id' : teamId,
                    'user-id' : userId,
                    'server-ids' : serverIds
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
                            $('#unauthorized-vmtas').html(result['data']['vmtas']);
                            $('#unauthorized-vmtas').change();
                            $('#vmtas-selector').click();
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
    
    var getMemberOffers = function()
    {
        $('#affiliate-networks').on('change',function()
        {
            var affiliateNetworksIds = $(this).val();
            var teamId = $('#teams').val();
            var userId = $('#members').val();
            
            $('#authorized-offers').html('');
            $('#authorized-offers').change();
            $('#unauthorized-offers').html('');
            $('#unauthorized-offers').change();
                            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            if(affiliateNetworksIds == null || affiliateNetworksIds == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getMemberOffers',
                'parameters' : 
                {
                    'team-id' : teamId,
                    'user-id' : userId,
                    'affiliate-networks-ids' : affiliateNetworksIds
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
                            $('#unauthorized-offers').html(result['data']['offers']);
                            $('#unauthorized-offers').change();
                            $('#offers-selector').click();
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
    
    var getMemberDataLists = function()
    {
        $('#data-providers').on('change',function()
        {
            var dataProvidersIds = $(this).val();
            var teamId = $('#teams').val();
            var userId = $('#members').val() ;
            
            $('#authorized-data-lists').html('');
            $('#authorized-data-lists').change();
            $('#unauthorized-data-lists').html('');
            $('#unauthorized-data-lists').change();
                            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            if(dataProvidersIds == null || dataProvidersIds == undefined)
            {
                return false;
            }
            
            iResponse.blockUI();
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'getMemberDataLists',
                'parameters' : 
                {
                    'team-id' : teamId,
                    'user-id' : userId,
                    'data-providers-ids' : dataProvidersIds
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
                            $('#unauthorized-data-lists').html(result['data']['data-lists']);
                            $('#unauthorized-data-lists').change();
                            $('#data-lists-selector').click();
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
    
    var updateMemberAuthorisations = function()
    {
        $('.update-team-authorisations').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var button = $(this);
            var html = button.html();
            
            var teamId = $('#teams').val();
            var userId = $('#members').val();
            
            if(teamId == null || teamId <= 0 || teamId == undefined)
            {
                return false;
            }
            
            if(userId == null || userId == '' || userId == undefined)
            {
                return false;
            }
            
            // vmtas 
            $('select#authorized-vmtas').find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            var vmtasIds = $('#authorized-vmtas').val();
            
            // smtp servers 
            $('select#authorized-smtp-servers').find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            var smtpServersIds = $('#authorized-smtp-servers').val();
 
            // offers 
            $('select#authorized-offers').find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            var offersIds = $('#authorized-offers').val();
            
            // data lists 
            $('select#authorized-data-lists').find('option').each(function(){
                $(this).prop('selected', true);
            });
            
            var dataListsIds = $('#authorized-data-lists').val();

            iResponse.blockUI();
            if(button.attr('disabled') == true || button.attr('disabled') == 'disabled')
            {
                return false;
            }
            
            button.html("<i class='fa fa-spinner fa-spin'></i> Updating ...");
            button.attr('disabled','disabled');
            
            var data = 
            { 
                'controller' : 'Teams',
                'action' : 'updateMemberAuthorisations',
                'parameters' : 
                {
                    'team-id' : teamId,
                    'user-id' : userId,
                    'vmtas-ids' : vmtasIds,
                    'smtp-servers-ids' : smtpServersIds,
                    'offers-ids' : offersIds,
                    'data-lists-ids' : dataListsIds
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
            handleSelects();
            handleFilterSelect();
            getUsersTeams();
            getTeamsUsers();
            getTeamMemberAuthorisations();
            getMemberVmtas();
            getMemberOffers();
            getMemberDataLists();
            updateMemberAuthorisations();
        }
    };
}();

// initialize and activate the script
$(function(){ Teams.init(); });