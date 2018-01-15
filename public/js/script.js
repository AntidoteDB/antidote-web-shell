jQuery(function($, undefined) {
    $('#term1').terminal(evalfun, {
        greetings: 'Antidote replica 1.',
        height: 200,
        prompt: 'antidote1> '
    });
    
    $('#term2').terminal(evalfun, {
        greetings: 'Antidote replica 2.',
        height: 200,
        prompt: 'antidote2> '
    });
    
    $('#term3').terminal(evalAntidoteCmd, {
        greetings: 'Antidote replica 3.', 
        height: 200,
        prompt: 'antidote3> '
     });

    $("#btn-partition").click(function() {
        if (!$("#term3").hasClass('partitioned')) {
            $("#term3").addClass('partitioned');
            $("#btn-partition").addClass('btn-primary');
            $("#btn-partition").removeClass('btn-danger');
            $("#btn-partition").html('Heal partition');
        } else {
            $("#term3").removeClass('partitioned');
            $("#btn-partition").addClass('btn-danger');
            $("#btn-partition").removeClass('btn-primary');
            $("#btn-partition").html('Create partition');
        }
    });
});


function evalAntidoteCmd() {

    if (arguments == null || arguments[0] == "")
        return;
    var args = arguments[0].split(" ")
    switch (args[0]) {
        case "set":
            switch (args[1]) {
                case "add":
                    var res = $.ajax({
                            url: '/api/1/set/' + args[2],
                            type: 'GET',
                            async: false               
                        }).responseText;
                    this.echo(res);
                    break;                
                case "add":
                    var res = jQuery.ajax({
                            url: '/api/1/set/' + args[2],
                            type: 'PUT',
                            data: 'value='+ args[3],
                            async: false               
                        }).responseText;
                    this.echo(res);
                    break;
                case "remove":
                    var res = jQuery.ajax({
                            url: '/api/1/set/' + args[2],
                            type: 'DELETE',
                            data: 'value='+ args[3],
                            async: false               
                        }).responseText;
                    this.echo(res);
                    break;
                default:
                    alert("not supported op");
            };
            break;
        default:
            alert("not supported op")
    }


}

function evalfun(command) {
    if (command !== '') {
        try {
            var result = window.eval(command);
            if (result !== undefined) {
                this.echo(new String(result));
            }
        } catch(e) {
            this.error(new String(e));
        }
    } else {
        this.echo('');
    }
}
