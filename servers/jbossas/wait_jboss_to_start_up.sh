#!/bin/bash

echo "Waiting JBoss to start up"
jboss_status="0"
failures=0
until [[ "$jboss_status" != "0" ]]; do
    jboss_status=`netstat -an | grep 127.0.0.1:9999 | grep -v grep | wc -l`
    echo "$jboss_status"
    if [[ "$jboss_status" == "0" ]]; then
        let "failures +=1"
        echo "$failures"
        if [[ $failures -gt 3 ]]; then
            echo "4 Failures: Server is not started: abort"
            exit 1
        fi
    fi
    sleep 5
done
echo "Server started"

