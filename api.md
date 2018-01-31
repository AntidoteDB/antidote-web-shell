# AntidoteDB Web Shell API

Set

    GET /api/:rep_id/set/:set_id
        read a set
    
    PUT /api/:rep_id/set/:set_id     value
        add an element to a set
    
    DELETE /api/:rep_id/set/:set_id     value
        remove an element from a set
    
Manage network partitions

    GET /api/:rep_id/part
        get partition status of rep_id
    
    PUT /api/:rep_id/part
        partition rep_id

    DELETE /api/:rep_id/part
        remove rep_id partition

# Web shell commands

    set add <set_id> <value>
    set remove <set_id> <value>
    set get <set_id>
