#!/bin/bash

SOLUTION_FILE="solution.cpp"
TESTER_FILE="tester.cpp"
MEMORY_LIMIT=${MEMORY_LIMIT:-65536}
TIME_LIMIT=${TIME_LIMIT:-1} 

g++ -o solution $SOLUTION_FILE
if [ $? -ne 0 ]; then
    printf "CE" > output.txt
    exit 0
fi

ulimit -v $MEMORY_LIMIT

timeout ${TIME_LIMIT}s ./solution < input.txt > user_output.txt
EXIT_CODE=$?

if [ $EXIT_CODE -eq 124 ]; then
    printf "TLE" > output.txt
    exit 0
fi
if [ $EXIT_CODE -eq 137 ]; then 
    printf "MLE" > output.txt
    exit 0
fi
if [ $EXIT_CODE -ne 0 ]; then
    printf "RE" > output.txt
    exit 0
fi

g++ -o tester $TESTER_FILE
if [ $? -ne 0 ]; then
    printf "CE" > output.txt
    exit 0
fi

sed -e '$s/$/\n/' input.txt user_output.txt > tester_input.txt
./tester < tester_input.txt > output.txt
