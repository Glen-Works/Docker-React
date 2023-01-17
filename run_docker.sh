#!/bin/bash

#cover env and run docker
cp cdn_client_react/.env.production react_env_volume/.env

docker-compose up -d