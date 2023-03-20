#!/bin/bash -e

echo "Setting REACT_APP_QUERY_URL to $REACT_APP_QUERY_URL"
sed -i "s|REACT_APP_QUERY_URL_variable_placeholder|$REACT_APP_QUERY_URL|g" /usr/share/nginx/html/static/js/main.*.js

echo "Starting Nginx"
exec nginx -g "daemon off;"
