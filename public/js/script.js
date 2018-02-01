const NUM_TERMS = 3;

const OK_MSG = 'OK';
const ERROR_MSG = 'ERROR';
const UNKNOWN_MSG = 'command not found';

const HELP_MSG = `
add-wins set:
    set add <set_id> <value>
    set remove <set_id> <value>
    set get <set_id>
`;

const CMDS = ['set', 'help', 'get', 'add', 'remove'];

document.onkeydown = function (e) {
    // Ctrl+[1,2,..,9] to switch between terminals
    if (e.ctrlKey && (e.which >= 49 && e.which <= 57)) {
        terms[e.which - 49].focus();
    }
};

var terms = [];

$(function () {
    for (i = 1; i <= NUM_TERMS; i++) {
        // Initialize terminals
        terms.push(
            $('#term' + i).terminal(evalAtdCmd, {
                greetings: false,
                height: 350,
                prompt: 'demo@antidote' + i + '> ',
                tabcompletion: true,
                completion: CMDS,
                name: i
            })
        );
    }
    terms[0].focus();

    for (let i = 1; i <= NUM_TERMS; i++) {
        // NB: use of let for block scoping 
        // see https://stackoverflow.com/a/750506

        // Set partitioning button logic
        $('#btn-part' + i).click(function () {
            if (!$('#part' + i).hasClass('partitioned')) {
                $.ajax({
                    url: '/api/' + i + '/part',
                    type: 'PUT',
                    dataType: 'json',
                    success: function (data) {
                        setPartitionGui(data.rep);
                    }
                });
            } else {
                $.ajax({
                    url: '/api/' + i + '/part',
                    type: 'DELETE',
                    dataType: 'json',
                    success: function (data) {
                        unsetPartitionGui(data.rep);
                    }
                });
            }
        });

        // Get current partitioning state
        $.getJSON('/api/' + i + '/part', function (data) {
            switch (data.status) {
                case 'ON':
                    unsetPartitionGui(data.rep);
                    break;
                case 'OFF':
                    setPartitionGui(data.rep);
                    break;
            }
        });
    }
});

function setPartitionGui(i) {
    $("#part" + i).addClass('partitioned');
    $("#btn-part" + i).addClass('btn-success').removeClass('btn-danger');
    $("#btn-part" + i).html('Heal partition');
}
function unsetPartitionGui(i) {
    $("#part" + i).removeClass('partitioned');
    $("#btn-part" + i).addClass('btn-danger').removeClass('btn-success');
    $("#btn-part" + i).html('Create partition');
}

function evalAtdCmd(cmd, term) {
    if (cmd == null || cmd == "") return;
    var args = cmd.split(" ")
    let tid = parseInt(term.name()) - 1;
    let okErrOutput = function (res) {
        terms[tid].echo(res.status === 'OK' ? OK_MSG : ERROR_MSG);
    }
    switch (args[0]) {
        case "set":
            switch (args[1]) {
                case "get":
                    $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'GET',
                        dataType: 'json',
                        success: function (res) {
                            terms[tid].echo(JSON.stringify(res.cont));
                        }
                    });
                    break;
                case "add":
                    $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'PUT',
                        data: 'value=' + args[3],
                        dataType: 'json',
                        success: okErrOutput
                    });
                    break;
                case "remove":
                    $.ajax({
                        url: '/api/' + tid + '/set/' + args[2],
                        type: 'DELETE',
                        data: 'value=' + args[3],
                        dataType: 'json',
                        success: okErrOutput
                    });
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
