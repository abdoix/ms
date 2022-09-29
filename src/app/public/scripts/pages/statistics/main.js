/**
 * @framework       iResponse Framework 
 * @version         2.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Stats.js	
 */
var Stats = function() 
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
        
        $('.move-selected-columns').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');
            
            $('#' + from + ' option:selected').each(function(){
               $(this).remove().appendTo('#' + to);   
            });
            
            $('#' + from).change();
            $('#' + to).change();
        });
        
        $('.move-option-vert').unbind("click").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            var target = $(this).attr('data-target');
            var direction = $(this).attr('data-dir');
            var listbox = document.getElementById(target);
            var selIndex = listbox.selectedIndex;
            
            var increment = -1;
            if(direction == 'up')
                    increment = -1;
            else
                    increment = 1;
            
            if(-1 == selIndex) 
            {
                iResponse.alertBox({title: "Please select an option to move.", type: "error", allowOutsideClick: "true", confirmButtonClass: "btn-danger"});
                return;
            }
            
            if((selIndex + increment) < 0 || (selIndex + increment) > (listbox.options.length-1)) 
            {
		return;
            }

            var selValue = listbox.options[selIndex].value;
            var selText = listbox.options[selIndex].text;
            listbox.options[selIndex].value = listbox.options[selIndex + increment].value
            listbox.options[selIndex].text = listbox.options[selIndex + increment].text

            listbox.options[selIndex + increment].value = selValue;
            listbox.options[selIndex + increment].text = selText;

            listbox.selectedIndex = selIndex + increment;
        });
    };
    
    return {
        init: function() 
        {
            handleSelects();
            
            $('#submit-report').on('click',function(e){
                e.preventDefault();
                
                $('#selected-columns option').each(function(){
                    $(this).prop('selected',true);
                });
                
                $('#report-form').submit();
            });
        }
    };

}();

// initialize and activate the script
$(function(){ Stats.init(); });