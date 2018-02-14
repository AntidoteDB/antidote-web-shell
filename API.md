# AntidoteDB Web Shell API

Add-Wins Set

    GET /api/:rep_id/set/:set_id
        read a set
    
    PUT /api/:rep_id/set/:set_id     value
        add an element to a set
    
    DELETE /api/:rep_id/set/:set_id     value
        remove an element from a set

Counter

    GET /api/:rep_id/count/:counter_id
        read a counter
    
    PUT /api/:rep_id/count/:counter_id
        increment a counter
    
    DELETE /api/:rep_id/count/:counter_id
        decrement a counter
    
Manage network partitions

    GET /api/:rep_id/part
        get partition status of rep_id
    
    PUT /api/:rep_id/part
        partition rep_id

    DELETE /api/:rep_id/part
        remove rep_id partition

# Web shell commands

Add-Wins Set
    
    set add <set_id> <value>
    set remove <set_id> <value>
    set get <set_id>

Counter
    
    count inc <counter_id>
    count dec <counter_id>
    count get <counter_id>