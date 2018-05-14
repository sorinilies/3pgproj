#!/bin/bash

which docker

if [ $? -eq 0 ]
then
    docker --version | grep "Docker version"
    if [ $? -eq 0 ]
    then
        echo "docker is already installed"
    else
        echo "installing docker"
    fi
else
    # brew install docker >&2
    echo "Installing"
fi