/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Roles.js	
 */
var Roles = function() 
{
    var handleCheckboxes = function()
    {
        $('.select-all-checkboxes').on('click',function()
        {
            var target = $(this).attr('data-class-target');
            var status = $(this).attr('data-status');
            
            if(status === 'all')
            {
                $("input:checkbox","." + target).each(function()
                {
                    $(this).prop("checked",false);
                    $(this).click();
                    $(this).prop("checked",true);
                });
                   
                $(this).attr('data-status','none');
            }
            else
            {
                $("input:checkbox","." + target).each(function()
                {
                    $(this).prop("checked",true);
                    $(this).click();
                    $(this).prop("checked",false);
                });
                
                $(this).attr('data-status','all');
            }
        });
    };
    
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
        
        $('select.select-actions').unbind("change").on('change',function(e)
        {
            e.stopPropagation();
            var count = $('option:selected',this).length;
            var parent = $(this).closest('div.form-group');
            var sibling = parent.find('span.options-sum').first();
            sibling.html('( ' + count + ' Users Selected )');
        });
    };
    
    var getRoleUsers = function()
    {
        $('#roles').on('change',function()
        {
            var roleId = $(this).val();
            
            if(roleId == null || roleId <= 0 || roleId == undefined)
            {
                return false;
            }
            
            var data = 
            { 
                'controller' : 'Roles',
                'action' : 'getRoleUsers',
                'parameters' : 
                {
                    'role-id' : roleId
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
                            $('#users').val(result['data']['users']);
                            $('#users').change();
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
    
    var getUsersRoles = function()
    {
        $('#users').on('change',function()
        {
            $('#roles').val(null);
            $('#roles').change();
                            
            var userId = $(this).val();
            
            if(userId == null || userId <= 0 || userId == undefined)
            {
                return false;
            }
            
            var data = 
            { 
                'controller' : 'Roles',
                'action' : 'getUserRoles',
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
                            $('#roles').val(result['data']['roles']);
                            $('#roles').change();
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
    
    return {
        init: function() 
        {
            handleCheckboxes();
            getRoleUsers();
            getUsersRoles();
            handleSelects();
        }
    };

}();

// initialize and activate the script
$(function(){ Roles.init(); });