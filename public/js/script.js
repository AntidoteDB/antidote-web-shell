const NUM_TERMS = 3;

const OK_MSG = 'OK';
const ERROR_MSG = 'ERROR';
const UNKNOWN_MSG = 'command not found';

const HELP_MSG = `
set:
    set add <set_id> <value>
    set remove <set_id> <value>
    set get <set_id>
`;

const CMDS = ['set', 'help', 'get', 'add', 'remove'];

var terms = [];

$(function () {
    for (i = NUM_TERMS; i >= 1; i--) {
        terms.unshift(
            $('#term' + i).terminal(window['evalAtdCmd' + i], {
                greetings: false,
                height: 350,
                prompt: 'demo@antidote' + i + '> ',
                tabcompletion: true,
                completion: CMDS
            })
        );
    }

    $("#btn-partition").click(function () {
        if (!$("#part").hasClass('partitioned')) {
            $("#part").addClass('partitioned');
            $("#btn-partition").addClass('btn-success').removeClass('btn-danger');
            $("#btn-partition").html('Heal partition');
        } else {
            $("#part").removeClass('partitioned');
            $("#btn-partition").addClass('btn-danger').removeClass('btn-success');
            $("#btn-partition").html('Create partition');
        }
    });
});

function evalAtdCmd1() { evalAtdCmd(arguments[0], 0); }
function evalAtdCmd2() { evalAtdCmd(arguments[0], 1); }
function evalAtdCmd3() { evalAtdCmd(arguments[0], 2); }

function evalAtdCmd() {

    if (arguments == null || arguments[0] == "")
        return;
    var args = arguments[0].split(" ")
    let tid = parseInt(arguments[1]);
    switch (args[0]) {
        case "set":
            switch (args[1]) {
                case "get":
                    var res = $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'GET',
                        async: false,
                        dataType: 'json'
                    }).responseJSON;
                    terms[tid].echo(JSON.stringify(res.cont));
                    break;
                case "add":
                    var res = $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'PUT',
                        data: 'value=' + args[3],
                        async: false,
                        dataType: 'json'
                    }).responseJSON;
                    terms[tid].echo(res.status === 'OK' ? OK_MSG : ERROR_MSG);
                    break;
                case "remove":
                    var res = $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'DELETE',
                        data: 'value=' + args[3],
                        async: false,
                        dataType: 'json'
                    }).responseJSON;
                    terms[tid].echo(res.status === 'OK' ? OK_MSG : ERROR_MSG);
                    break;
                default:
                    terms[tid].echo(UNKNOWN_MSG);
            };
            break;
        case "help":
            terms[tid].echo(HELP_MSG);
            break;
        default:
            terms[tid].echo(UNKNOWN_MSG)
    }
}
