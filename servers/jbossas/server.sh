#!/bin/bash

BASE_DIR=`pwd`/$(dirname $0)
JBOSS_AS_VERSION='7.1.1'
DOWNLOAD_URL="http://download.jboss.org/jbossas/${JBOSS_AS_VERSION:0:3}/jboss-as-$JBOSS_AS_VERSION.Final/jboss-as-$JBOSS_AS_VERSION.Final.tar.gz"
JBOSS_AS_PATH="$BASE_DIR/jboss-as-$JBOSS_AS_VERSION.Final"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -i jboss | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

if [ -d "$JBOSS_AS_PATH" ]; then
    rm -rf $JBOSS_AS_PATH/
fi

if [ ! -f "$JBOSS_AS_PATH.tar.gz" ]; then
    echo $DOWNLOAD_URL
    wget -c $DOWNLOAD_URL -P $BASE_DIR/
fi

if [ -f "$JBOSS_AS_PATH.tar.gz" ]; then
    tar xzvf $JBOSS_AS_PATH.tar.gz -C $BASE_DIR/
else
    echo "The path does not contain a jboss-as distribution"
    exit 3
fi

SETUP_FILES_PATH="$BASE_DIR/setup-files"
STANDALONE_XML_PATH="$SETUP_FILES_PATH/standalone.xml"
KEYSTORE_PATH="$SETUP_FILES_PATH/aerogear.keystore"
JBOSS_AS_STANDALONE_XML_PATH="$JBOSS_AS_PATH/standalone/configuration/standalone.xml"
KEYSTORE_PATTERN="KEYSTORE_PATH"

sed -e s,$KEYSTORE_PATTERN,$KEYSTORE_PATH,g $STANDALONE_XML_PATH > $JBOSS_AS_STANDALONE_XML_PATH
#sed -i s,$DEFAULT_HTTP_PORT,$TESTS_HTTP_PORT,g "$JBOSS_AS_STANDALONE_XML"

cp -r $SETUP_FILES_PATH/aerogear-rest-service.war $JBOSS_AS_PATH/standalone/deployments/

# start server
chmod +x $JBOSS_AS_PATH/bin/standalone.sh
nohup $JBOSS_AS_PATH/bin/standalone.sh &

# wait to start up
$BASE_DIR/wait_jboss_to_start_up.sh
