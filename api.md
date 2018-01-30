# Antidote web shell API

    GET /api/:rep_id/set/:set_id
        read a set
    
    PUT /api/:rep_id/set/:set_id     value
        add an element to a set
    
    DELETE /api/:rep_id/set/:set_id     value
        remove an element from a set
    
    
# Web shell commands

    set add <set_id> <value>
    set remove <set_id> <value>
    set get <set_id>
