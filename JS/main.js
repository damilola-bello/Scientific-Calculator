var has_user_input = false;
var first_operand=0;
var second_operand=0;
var no_zero_input = true;//You can't enter zero(s) at the beginning
var is_dot_present = false;
var is_operand = false;//Is there first operand
var is_equals = false;
var active_operator = false;//Is the last command an operator
var active_operation = false;//Has the user pressed any operator
var s_o_display_text = '';//Single operand display
var percent_value = '';//Stores the percentage value
var is_pi = false;
var display1_before_s_o = '';//Grab display1 when single operanded operation is entered
var $display1 = $('#display1');
var $display2 = $('#display2');
var current_operand = ''; var previous_operand = '';
var question_string = '';
var history_expression = false;

$(document).ready(function(){

    $('body').on('click', function (e) {
        var $target = $(e.target);
        var $wrapper = $('#outer_wrapper');
        var $calc_type = $('#calc_type_div');
        var $scientic_div = $('#scientific');
        var $standard_link = '#standard_a';
        var $scientific_link = '#scientific_a';
        //select either standard or scientific
        if(($target.closest('#hamburger_div').length > 0) || ($target.closest('#calc_type_div').length > 0))
        {
            if($('#history_list_div').is(':visible'))
            {//If History is visible, hide it
                $('#history_list_div').fadeToggle(200);
            }

            var width = window.innerWidth;
            var $is_scientific_visible = ($scientic_div.is(':visible'));
            if ($target.is($standard_link) && $is_scientific_visible === true)
            {//hide scientific div
                $scientic_div.fadeOut(1000, function() {
                    responsive(width, false);
                    $('#calc_type_name_p').text('Standard');s_o_display_text=''; percent_value='';
                    flush_screen();

                });

            }
            else if($target.is($scientific_link) && $is_scientific_visible === false)
            {//Show the scientific div
                responsive(width, true);
                $scientic_div.fadeIn(1000);
                $('#calc_type_name_p').text('Scientific');s_o_display_text=''; percent_value='';
                flush_screen();
            }

            if($calc_type.is(':visible'))
            {//Resets the buttons to the default style, $calc_type is visible now, but on the last line of this block, it's going to get toggled
                $('#wrapper_buttons').css("opacity", "1.0");
                $('#wrapper_buttons button').removeClass("no_hover");
                $('#wrapper_buttons button').addClass("hvr");
            }
            else
            {
                $('#wrapper_buttons').css("opacity", "0.2");
                $('#wrapper_buttons button').removeClass("hvr");
                $('#wrapper_buttons button').addClass("no_hover");
            }

            $calc_type.fadeToggle(600);

        }
        else if(e.target.hasAttribute('data-question') && (e.target.hasAttribute('data-answer')))
        {
            flush_screen();
            var question, answer;
            question = e.target.getAttribute('data-question');
            answer = e.target.getAttribute('data-answer');
            $display1.val(question);
            $display2.val(answer);
            $('#history_list_div').fadeToggle(200);
            history_expression = true;
        }
        //If user clicks away from the ul while it is visible, close it
        else if($('#calc_type_div').is(':visible'))
        {
            $('#wrapper_buttons').css("opacity", "1.0");
            $('#wrapper_buttons button').removeClass("no_hover");
            $('#wrapper_buttons button').addClass("hvr");
            $calc_type.fadeToggle(200);
        }
        else if($target.is('#delete_icon'))
        {
            wipe_history();
        }
        else if($('#history_list_div').is(':visible'))
        {//If History is visible, hide it
            $('#history_list_div').fadeToggle(200);
        }
        else if($target.closest('#wrapper_buttons').length > 0)
        {
            handle_click(e);
        }
        else if($target.closest('#close').length > 0)
        {
            close_calculator(e);
        }
        else if($target.closest('#left').length > 0)
        {
            if($display1.scrollLeft() > 0)
            {
                $display1.scrollLeft($display1.scrollLeft() - 10);
                if($display1.scrollLeft() == 0)
                {//if the display1 is at the leftmost end, disable left button
                    disable_left_right('left');
                }

                //Test for right also
                var count = document.getElementById('count_display1');
                var display1 = document.getElementById('display1');
                if(count.clientWidth > display1.clientWidth)
                {//if display1 content is > display1 width, enable right button
                    enable_left_right('right');
                }
            }
            else
            {
                disable_left_right('left');
            }
        }
        else if($target.closest('#right').length > 0)
        {
            if($('#right').css('opacity')!=='1')
            {//return if display is already at the rightmost end
                return;
            }
            var count = document.getElementById('count_display1');
            var display1 = document.getElementById('display1');
            if(count.clientWidth > display1.clientWidth)
            {//if display1 content is > display1 width
                var text_width = count.clientWidth;
                var visible_width = display1.clientWidth;
                //subtract the visible_width from the total width i.e. (visible+hidden)
                //This will bring the user to the rightmost end
                $display1.scrollLeft(text_width - visible_width);

                //Disable the right button since the user is at the rightmost end
                disable_left_right('right');

                //Test for left button also
                if($display1.scrollLeft() != 0)
                {//Enable the left button, as long as not it's not it the left most part
                    enable_left_right('left');
                }
            }
        }
        else if($target.closest('#history_div').length > 0)
        {
            if($('#history_img').css('opacity')==='1')
            {
                $('#history_list_div').fadeToggle(400);
            }
        }
    });

    $(document).on('keypress', handle_key);
    $(document).on('keydown', handle_key_backspace);
    $(window).resize(function (){
        responsive(window.innerWidth, $('#scientific').is(':visible'));
    });

});

function responsive (width, full_calc)
{
    var $wrapper = $('#outer_wrapper');
    if(full_calc === false)
    {
        if(width < 351)
        {
            $wrapper.css("width", "198px");
        }
        else if(width < 601)
        {
            $wrapper.css("width", "257px");
        }
        else
        {
            $wrapper.css("width", "321px");
        }
    }
    else if(full_calc === true)
    {
        if(width < 351)
        {
            $wrapper.css("width", "290px");
        }
        else if(width < 601)
        {
            $wrapper.css("width", "378px");
        }
        else
        {
            $wrapper.css("width", "467px");
        }
    }
}

function wipe_history ()
{
    if(confirm('Do you want to wipe out your calculation(s) history?'))
    {
        question_string = '';
        $('#history_img').css('opacity', '0.3');
        $('#history_img').css('cursor', 'default');
        $('#history_ul_wrapper li').fadeOut(1000, function () {
            $('#history_ul_wrapper li').remove();
        });
    }
}

/*function close_calculator()
{
    if(confirm('Do you want to exit Calculator?'))
    {
        close();
    }
} */

function handle_click(e) {
    var $target = $(e.target);

    if($target.is('#clear_screen'))
    {
        flush_screen();
    }

    else if($target.is('#clear_output'))
    {
        flush_output();
    }

    else if($target.is('#backspace'))
    {
        backspace()
    }

    else if($target.hasClass('number'))
    {
        number($target);
    }
    else if($target.hasClass('operator'))
    {
        operation($target);
    }
    else if($target.is('#dot'))
    {
        dot();
    }
    else if($target.is('#equals'))
    {
        equal_to();
    }
}

function disable_left_right (str)
{
    switch(str)
    {
        case 'left':
            $('#left').css('opacity', '0.3');
            $('#left').css('cursor', 'default');
            break;
        case 'right':
            $('#right').css('opacity', '0.3');
            $('#right').css('cursor', 'default');
            break;
        case 'both':
            $('#left').css('opacity', '0.3');
            $('#left').css('cursor', 'default');
            $('#right').css('opacity', '0.3');
            $('#right').css('cursor', 'default');
            break;
    }
}

function enable_left_right (str)
{
    switch(str)
    {
        case 'left':
            $('#left').css('opacity', '1.0');
            $('#left').css('cursor', 'pointer');
            break;
        case 'right':
            $('#right').css('opacity', '1.0');
            $('#right').css('cursor', 'pointer');
            break;
        case 'both':
            $('#left').css('opacity', '1.0');
            $('#left').css('cursor', 'pointer');
            $('#right').css('opacity', '1.0');
            $('#right').css('cursor', 'pointer');
            break;
    }
}

function flush_screen () {
    first_operand=0;
    second_operand=0;
    current_operand = '';
    previous_operand = '';
    is_operand = false;
    active_operation = false;
    history_expression = false;
    disable_left_right('both');
    $('count_display1').val('');//Clear the content of count_display1 which is an invisible version of display1
    flush_output();
    $display1.val('');//This must be after flush_output(), because it sets display1 in some scenerios. This is a hard reset!
}

function flush_output () {
    if(history_expression === true)
    {//If there's an history_expression on display, you can't flush output
        return;
    }
    $display2.val('0');
    $display2.css("font-size", "1.5em");
    has_user_input = false;
    no_zero_input = true;
    is_dot_present = false;
    active_operator = false;
    is_equals = false;
    if(s_o_display_text !== '' || percent_value != '')
    {
        $display1.val(display1_before_s_o);
        s_o_display_text = '';
        display1_before_s_o = '';
        percent_value = '';
    }
}

function equals_reset ()
{
    first_operand=0;
    second_operand=0;
    current_operand = '';
    previous_operand = '';
    is_operand = false;
    active_operation = false;
    $display2.css("font-size", "1.65em");
    active_operator = false;
    is_dot_present = false;
    percent_value = '';
    is_equals = false;
}

function backspace () {
    if(has_user_input===false || active_operator === true)
    {//There's nothing to backspace if user hasn't entered any value
    //If the output of the operation or the first operand is on display2 after pressing an operator, you can't backspace
        return;
    }

    if(s_o_display_text !== '')
    {
        return;
    }

    var length = $display2.val().length;
    if(length === 1)
    {
        if(is_equals === true)
        {
            $display2.val('0');
        }
        else
        {
            flush_output();
        }
        return;
    }
    else if(length === 2 || length === 3)
    {
        if($display2.val() === '0.' || $display2.val() === '-0.')
        {
            flush_output();
            return;
        }
        if(length === 2 && $display2.val().charAt(0) === '-')
        {
            flush_output();
            return;
        }
    }

    //Adjust the font-size as the user backspace
    var a = maximum_number('output');

    if(is_dot_present===true)
    {//check if the next backspaced digit is dot, if so no more dot in the operand
        var value = $display2.val().charAt(length-1);
        if(value === '.')
        {
            is_dot_present = false;
            no_zero_input = true;//if dot is baclspaced, then you can type in zero(s)
        }
    }
    $display2.val($display2.val().substring(0, length-1));
    if($display2.val().length===1 && $display2.val()==='0')
    {//if user backspace to one remaining zero digit, you can't add more zeros
        no_zero_input = true;
    }
    percent_value = '';
}

function handle_key_backspace (e)
{
    if(e.keyCode == 8)
    {
        backspace();
    }
}

function dot ()
{
    if(history_expression === true)
    {
        return;
    }

    if(is_dot_present===false)
    {
        var display;


        if((s_o_display_text !== ''))
        {//when a dot if pressed after s_o operation
            if(is_equals === true)
            {
                $display1.val('');
            }
            else
            {
                $display1.val(display1_before_s_o);
            }
            s_o_display_text = '';
            display1_before_s_o = '';

            display = '0';
        }
        else if(active_operator === true)
        {
            display = '0';
        }
        else
        {
            display = $display2.val();
        }

        if(maximum_number('input')===false)
        {
            return;
        }
        $display2.val(display+'.');

        if((is_equals === true) && $display2.val().length < 2)
        {//If equals to was pressed, once a new digit is entered, reset the font-size, thats why i made the condition < 2, so the moment a digit is entered, it resets and ONLy once too
            $display2.css("font-size", "1.5em");
        }

        is_dot_present = true;
        has_user_input = true;
        no_zero_input = false;//Once there's a dot, then you can add as many zeros as you wish
        active_operator = false;
        //$display2.css("font-size", "1.65em");
        percent_value = '';
    }
}

function plus_minus ()
{
    if(history_expression === true)
    {//If history_expression is on display, you can't use plus or minus
        return;
    }

    if(has_user_input === false)
    {
        return;
    }
    if(active_operation === false && s_o_display_text === '')//(1st condition)No operation yet, just digits inputted that's all
    {//(2nd condition)If no operation yet and no s_o operator, then enter this block
        //&& has_user_input === true(implicitly), if false, it can't get here. Look at the beginning of the block.
        var len = $display2.val().length;
        var is_negative = ($display2.val().charAt(0) === '-') ? true : false;
        var value = (is_negative) ? ($display2.val().substring(1, len)) : ('-'+$display2.val());
        $display2.val(value);
        return;
    }
    else
    {
        var len = $display2.val().length;

        if(s_o_display_text === '')
        {
            if(display1_before_s_o === '')
            {//Save display1 text in display1_before_s_o, so you have a copy of what the input was before changing the input text as the user presses the plus or minus sign
                display1_before_s_o = $display1.val();
            }
            s_o_display_text = 'negate( '+$display2.val()+' )';
        }
        else
        {
            s_o_display_text = 'negate( '+s_o_display_text+' )';
        }
        $display1.val(display1_before_s_o+s_o_display_text);
        var is_negative = ($display2.val().charAt(0) === '-') ? true : false;
        var value = (is_negative) ? ($display2.val().substring(1, len)) : ('-'+$display2.val());
        active_operator = false//No more active operator after negate, it's just like entering a number
        $display2.val(value);
    }
    percent_value = '';
}

function percentage ()
{
    generic_single_operanded_operator('', 'percentage');
}

function to_power_x ()
{
    generic_single_operanded_operator('10^', 'to_power_x');
}

function generic_single_operanded_operator(opr_string, opr_name_string)
{
    if(has_user_input === false || history_expression === true)
    {
        return;
    }

    var s_o_display;//Declared solely for percentage, to know if the were previous s_o operands while is_equals is true, if so, it flushes display1
    if(is_equals === true)
    {//If user presses equals, reset
        s_o_display = s_o_display_text;
        s_o_display_text = '';
        display1_before_s_o = '';
    }

    var len = $display2.val().length;

    if(s_o_display_text === '')
    {
        if(display1_before_s_o === '')
        {//Save display1 text in display1_before_s_o, so you have a copy of what the input was before changing the input text as the user presses the plus or minus sign
            display1_before_s_o = $display1.val();
        }
        if(opr_name_string !== 'percentage')
        {
            s_o_display_text = opr_string+'( '+$display2.val()+' )';
        }
    }
    else
    {
        if(opr_name_string !== 'percentage')
        {
            s_o_display_text = opr_string+'( '+s_o_display_text+' )';
        }
    }


    var value;
    var digit = $display2.val();
    switch(opr_name_string)
    {
        case 'square_root':
            value = Math.sqrt(Number(digit));
            percent_value = '';
            break;
        case 'square':
            value = Math.pow(Number(digit), 2);
            percent_value = '';
            break;
        case 'one_over_x':
            value = 1 / (Number(digit));
            percent_value = '';
            break;

        case 'to_power_x':
            value = Math.pow(10, (Number(digit)));
            break;

        case 'log':
            value = Math.log10((Number(digit)));
            break;

        case 'cos':
            value = Math.cos((Number(digit)));
            break;

        case 'tan':
            value = Math.tan((Number(digit)));
            break;

        case 'sin':
            value = Math.sin((Number(digit)));
            break;

        case 'percentage':

            if(percent_value === '')
            {//Store display2 as the percentvalue, which will be used now and subsequently
                percent_value = digit;
            }
            else
            {

            }

            if(active_operation === true && active_operator === false || (is_equals === true))
            {
                var a = Number(digit);
                if(a === 0)
                {
                    percent_value = '';
                    s_o_display_text = '';
                    display1_before_s_o = '';
                    flush_output();
                    return;
                }
                if(is_equals === true)
                {
                    if(s_o_display !== '')
                    {
                        //If there was a previous s_o operation before this, clear display1
                        $display1.val('');
                        s_o_display_text = '';
                        display1_before_s_o = '';
                    }
                    value = (Number(percent_value)) * (Number($display2.val())/100);
                }
                else
                {
                    //Always get the percentage of the first operand
                    value = (first_operand) * (Number($display2.val())/100);
                }

            }
            else if(active_operator === true)
            {//can only run this once, active_operator gets toggled at the end of this function
                value = (first_operand) * (Number(percent_value)/100);
            }
            else
            {
                value = (Number(digit)) * (Number(percent_value)/100);
            }

            break;
    }

    active_operator = false//No more active operator after a single operanded operation, it's just like entering a number
    $display2.val(value);
    if(is_valid_number(value) === false)
    {
        return;
    }

    if(opr_name_string === 'percentage')
    {
        s_o_display_text = $display2.val();
    }
    $display1.val(display1_before_s_o+s_o_display_text);
    check_overflow();
}

function square_root ()
{
    generic_single_operanded_operator('\u221A', 'square_root');

}

function square ()
{
    generic_single_operanded_operator('sqr', 'square');
}

function log ()
{
    generic_single_operanded_operator('log', 'log');
}

function cos ()
{
    generic_single_operanded_operator('cos', 'cos');
}

function tan ()
{
    generic_single_operanded_operator('tan', 'tan');
}

function sin ()
{
    generic_single_operanded_operator('sin', 'sin');
}

function pi()
{
    $display2.val(Math.PI);
    percent_value = '';
    active_operator = false;
    is_pi = true;
}

function one_over_x ()
{
    generic_single_operanded_operator('1/', 'one_over_x');
}

function handle_key(e) {
    var key_value = e.which || e.keyCode;//not great, if e.which is 0, the first part becomes falsey
    if(key_value >=48 && key_value <=57)
    {
        number(String.fromCharCode(key_value));
    }
    else if(key_value == 42)
    {
        multiplication();
    }
    else if(key_value == 43)
    {
        addition();
    }
    else if(key_value == 45)
    {
        subtraction();
    }
    else if(key_value == 46)
    {//period key
        dot();
    }
    else if(key_value == 47)
    {
        division();
    }
    else if(key_value == 61)
    {
        equal_to();
    }
}

function maximum_number (type)
{//Adjusts the font-size for both input and output. The longer the output, the smaller the font
    var length = $('#display2').val().length;

    if($('#scientific').is(':visible'))
    {
        if(type === 'input')
        {
            if(length >=38)
            {
                alert('You\'ve the maximum number of digits for Standard Calculator. 38 digits.');
                return false;
            }
        }

        if(length > 27)//starts from 28 digits
        {
            if(length > 34)
            {
                $('#display2').css("font-size", "1.2em");
            }
            else if(length > 31)
            {
                $('#display2').css("font-size", "1.3em");
            }
            else if(length > 29)
            {
                $('#display2').css("font-size", "1.4em");
            }
            else
            {
                $('#display2').css("font-size", "1.5em");
            }
        }
    }
    else
    {
        if(type === 'input')
        {
            if(length >=25)
            {
                alert('You\'ve the maximum number of digits for Standard Calculator. 25 digits.');
                return false;
            }
        }

        if(length >17)//starts from 18 digits
        {
            if(length > 23)
            {
                $('#display2').css("font-size", "1.1em");
            }
            else if(length > 21)
            {
                $('#display2').css("font-size", "1.2em");
            }
            else if(length > 19)
            {
                $('#display2').css("font-size", "1.4em");
            }
            else
            {
                $('#display2').css("font-size", "1.5em");
            }
        }
    }
    return true;
}

function number ($target)
{
    var digit;
    digit = (typeof $target === 'object') ? $target.text() : $target;
    if((no_zero_input === true && digit==='0') || history_expression === true)
    {
        return;
    }

    var value;
    var display2_val;

    if((s_o_display_text !== ''))
    {
        if(is_equals === true)
        {//NOTE!!! I'M SETTING THIS TO TRUE SO IT CAN ENTER THE NEXT IF STATEMENT!!!
            //i.e. is_equals === true && active_operator === true
            active_operator = true;
        }
        else
        {
            $display1.val(display1_before_s_o);
            s_o_display_text = '';
            display1_before_s_o = '';
            $display2.val('0');
        }

    }
    if(active_operator === true || (is_equals === true && active_operator === true))
    {
        if(is_equals === true)
        {
            active_operator = false;
            if(s_o_display_text !== '')
            {//Reset it from one operanded operation to new operation
                s_o_display_text = '';
                display1_before_s_o = '';
                $display1.val('');//thus flush display1
            }
        }
        display2_val = '';
        //if there's an equal to already pressed, then a number, clear display2
    }
    else
    {
        var len = $display2.val().length;

        display2_val = (len === 1 && $display2.val() === '0') ? '' : $display2.val();
        //Adjust the font in the textbox as it grows
        var is_scientific_visible = ($('scientific').is(':visible')) ? true : false;
        var adjust_digits = false;
        adjust_digits = (is_scientific_visible === true && len >27) ? true : false;
        adjust_digits = (is_scientific_visible === false && len >17) ? true : false;
        if(adjust_digits === true)
        {
            if(maximum_number('input')===false)
            {
                return;
            }
        }
    }

    if(has_user_input===false)
    {
        value = '';
        has_user_input=true;
    }
    else
    {
        value = display2_val;
    }

    if(is_pi === true)
    {//Reset is_pi and set value to empty so the number overwrites pi
        value = '';
        is_pi = false;
    }

    $display2.val(value+digit);
    no_zero_input = (active_operator === true && digit === '0') ? true : false;

    percent_value = '';
    active_operator = false;

    if((is_equals === true) && $display2.val().length < 2)
    {//If equals to was pressed, once a new digit is entered, reset the font-size, thats why i made the condition < 2, so the moment a digit is entered, it resets and ONLy once too
        $display2.css("font-size", "1.5em");
    }
    check_overflow();
}

function operation ($target) {

    if(!$target.hasClass('s_o'))
    {//If $target is NOT a single operanded operator
        is_dot_present = false;
        percent_value = '';
    }

    if($target.is('#plus'))
    {
        addition();
    }
    else if($target.is('#minus'))
    {
        subtraction();
    }
    else if($target.is('#multiply'))
    {
        multiplication();
    }
    else if($target.is('#divide'))
    {
        division();
    }
    else if($target.is('#plus_minus'))
    {
        plus_minus();
    }
    else if($target.is('#square_root'))
    {
        square_root();
    }
    else if($target.is('#square'))
    {
        square();
    }
    else if($target.is('#one_over_x'))
    {
        one_over_x();
    }
    else if($target.is('#percentage'))
    {
        percentage();
    }
    else if($target.is('#pi'))
    {
        pi();
    }
    else if($target.is('#xy'))
    {
        xy();
    }
    else if($target.is('#to_power_x'))
    {
        to_power_x();
    }
    else if($target.is('#log'))
    {
        log();
    }
    else if($target.is('#cos'))
    {
        cos();
    }
    else if($target.is('#tan'))
    {
        tan();
    }
    else if($target.is('#sin'))
    {
        sin();
    }
    else if($target.is('#mod'))
    {
        modulo();
    }
}

function addition ()
{
    generic_operator('addition', ' + ');
}

function subtraction ()
{
    generic_operator('subtraction', ' - ');
}

function modulo ()
{
    generic_operator('modulo', ' % ');
}

function xy ()
{
    generic_operator('to_power', ' ^ ');
}

function multiplication ()
{
    generic_operator('multiplication', ' * ');
}

function division ()
{
    generic_operator('division', ' \u00F7 ');
}

function do_previous_calculation ()
{
    var answer;

    switch(previous_operand)
    {
        case 'addition':
            answer = first_operand + second_operand;
            break;
        case 'subtraction':
            answer = first_operand - second_operand;
            break;
        case 'multiplication':
            answer = first_operand * second_operand;
            break;
        case 'division':
            answer = first_operand / second_operand;
            break;
        case 'modulo':
            answer = first_operand % second_operand; alert(first_operand % second_operand);
            break;
        case 'to_power':
            answer = Math.pow(first_operand, second_operand);
            break;
    }
    first_operand = answer;
    $display2.val(answer);
    if(is_valid_number(answer) === false)
    {
        return;
    }
    var a = maximum_number();
}

function calculate (type)
{
    var answer;
    switch (type)
    {
        case 'addition':
            answer = first_operand + second_operand;
            break;
        case 'subtraction':
            answer = first_operand - second_operand;
            break;
        case 'multiplication':
            answer = first_operand * second_operand;
            break;
        case 'division':
            answer = first_operand / second_operand;
            break;
        case 'modulo':
            answer = first_operand % second_operand;
            break;
        case 'to_power':
            answer = Math.pow(first_operand, second_operand);
    }
    return answer;
}

function generic_operator (operator_name, operator_string)
{
    if(is_equals === true)
    {
        equals_reset();
    }
    if(current_operand === operator_name)//if user enter operator more than once
    {
        if(active_operator===true)
        {
            return;
        }
    }
    //You can only access this part of the code downwards with ONLY one click of the operator
    previous_operand=current_operand;
    current_operand=operator_name;

    if(active_operator === true)
    {
        var len=$display1.val().length;
        $display1.val($display1.val().substring(0, len-3) + operator_string);
        return;
    }

    if(is_operand===false)
    {
        is_operand=true;
        first_operand = Number($display2.val());

        //removes the last dot in the digit as it is unnecessary
        var input = $display2.val();
        var len = input.length;
        input = (input.charAt(len-1)==='.') ? input.substring(0,len-1) : input;

        //get number(string) user entered + the operator string, show in display1
        if(s_o_display_text !== '')
        {//if there was single operanded operation before, leave it on display and append this operator string to it
            $display1.val($display1.val()+operator_string);
            s_o_display_text = '';
            display1_before_s_o = '';
        }
        else
        {
            if(history_expression === true)
            {//If user wants to perform a two operanded operation on an historic expression, append the operator to the question and reset historic_experssion
                history_expression = false;
                $display1.val($display1.val()+operator_string);
            }
            else
            {
                $display1.val(input+operator_string);
            }
        }
    }
    else{
        var input = $display2.val();
        second_operand = Number(input);
        if(previous_operand===operator_name)
        {
            var answer = calculate(operator_name);

            first_operand = answer;
            $display2.val(answer);
            if(is_valid_number(answer) === false)
            {
                return;
            }
            var a = maximum_number();
        }
        else
        {
            do_previous_calculation();
        }

        var len = input.length;//remove the last dot
        input = (input.charAt(len-1)==='.') ? input.substring(0,len-1) : input;
        if(s_o_display_text !== '')
        {
            s_o_display_text = '';
            display1_before_s_o = '';
            input = '';
        }
        //add the string input and the operator string to display1
        $display1.val($display1.val()+input+operator_string);
    }
    active_operator = true;
    active_operation = true;

    check_overflow();
}

function is_valid_number (value)
{
    if(!($.isNumeric(value)))//Using jQUery isNumeric because it works with all browsers
    {
        alert('Invalid Input!');
        flush_screen();
        return false;
    }
    return true;
}

function equal_to ()
{
    if(history_expression === true)
    {
        $display1.val('');//Clear display1 if user chooses an historic expression and follows that with an equals to sign
        history_expression = false;
    }

    if(has_user_input === false && (is_pi !== true))
    {//Don't return if Pi value is entered
        return;
    }

    if(is_pi === true)
    {//If Pi is true, reset it
        is_pi = false;
    }

    var answer;
    if(active_operator === true || active_operation === true)
    {
        var input = $display2.val();
        //alert($display2.val()+' '+active_operator+' '+active_operation+' '+is_equals);
        if(is_equals === true)
        {//do this incase there will be repeatitive equals, it then keeps doing the operation with the output and second operand
            first_operand = Number(input);

            var str = get_operator_string();
            question_string = first_operand.toString()+str+second_operand.toString();
        }
        else
        {
            second_operand = Number(input);//This will come in handy if there's continuous equals command, second_operand won't change, while first_operand gets sets to every output of each command
            question_string = $display1.val()+input;//The last input gets added to display1 to form the question
        }
        answer = calculate(current_operand);

        $display2.val(answer);
        if(is_valid_number(answer) === false)
        {
            return;
        }
        var a = maximum_number();
        $display1.val(''); //clear display1
        $('count_display1').val('');//Clear the invisible span that keeps track of display1
    }
    if(is_operand === true)
    {//This won't be true for digits just entered
        is_equals = true;
        active_operator = true;
        $('#history_img').css('opacity', '1.0');
        $('#history_img').css('cursor', 'pointer');
        var li = document.createElement('li');
        var content = document.createTextNode(question_string+' = '+answer);
        li.appendChild(content);
        li.setAttribute('data-question', question_string);
        li.setAttribute('data-answer', answer);
        document.getElementById('history_ul_list').appendChild(li);

    }
    else
    {//If the user inputs digit(s) without an operation and then presses equal_to, then set then input to none
        has_user_input = false;
    }
    //After the user presses equals, you can then enter a decimal point
    is_dot_present = false;
    disable_left_right('both');
}

function get_operator_string ()
{
    var opr_str;
    switch(current_operand)
    {
        case 'addition':
            opr_str = ' + ';
            break;
        case 'subtraction':
            opr_str = ' - ';
            break;
        case 'division':
            opr_str = ' \u00F7 ';
            break;
        case 'multiplication':
            opr_str = ' * ';
            break;
        case 'modulo':
            opr_str = ' % ';
            break;
        case 'to_power':
            opr_str = ' ^ ';
            break;
    }
    return opr_str;
}

function check_overflow ()
{
    var display1 = document.getElementById('display1');
    var count = document.getElementById('count_display1');
    count.textContent = display1.value;
    if(count.clientWidth > display1.clientWidth)
    {//Make the right button for display1 visible after every operation since text gets added to display1 after every operation
        enable_left_right('right');
    }
    else
    {
        disable_left_right('both');
    }
}
