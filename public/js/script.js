jQuery(function($, undefined) {
    $('#term1').terminal(evalfun, {
        greetings: 'Antidote replica 1.',
        name: 'js_demo',
        height: 200,
        prompt: 'antidote1> '
    });
    
    $('#term2').terminal(evalfun, {
        greetings: 'Antidote replica 2.',
        name: 'js_demo',
        height: 200,
        prompt: 'antidote2> '
    });
    
    $('#term3').terminal(evalfun, {
        greetings: 'Antidote replica 3.',
        name: 'js_demo',
        height: 200,
        prompt: 'antidote3> '
    });
});


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
