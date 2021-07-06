#Introduction

Our program consists of two main parts, including conversion of nondeterministic finite automaton (NFA) to deterministic finite automaton (DFA) and also reduction for minimizing the given input as much as possible.




#NFA TO DFA algorithms

NFA to DFA algorithm contains three major functions. The first function(access lambda)،finds all possible transitions using epsilon transition .The second function(lambdaremove)، removes epsilon transitions by merging the related states. The last function(repeatedremove)makes a new transition table using the old values and that table is considered as the final output of the program which will be shown for the user after turning into a json format.




#Reduction algorithms

Reduction Algorithm has two separated sections. The first section is for removing inaccessible states using function (RemoveInaccessibleStates) and the second part is for finding equal states. This part contains three major function. The first function, (createTransitionTable) is responsible for creating transition table. The second function, (findEqualStates) is responsible for finding equal states from transition table and removing equal, repeated states. The last function, (standardTransitionTable) is responsible for building a new machine with survived states. The final output is converted to Json format and ready to be sent to Front.




#Api

##Nfa To Dfa
https://automaton-app.herokuapp.com/nfa-to-dfa/{json format}

##Input example

first index of our json is states name and in each states we set their connection and state status. for example in state "q0" we have just one connection with "q1" by "a" and other connection like "b" , "λ" , "c" are null but we shouldn't remove them from our input json and the last value "state" show the status of our state and only get "start" , "final" , "normal" value.

##Output example

in output we only have one extra states status and its "TRAP" like state "2" and other value are like input value.

##Errors

if send empty json we will see this errors .

if send DFA machine we will see this errors because the DFA machine didnt need to change DFA and the input machine should be NFA .

##Reduction
https://automaton-app.herokuapp.com/reduction/{json format}

all of the inputs and outputs in reduction are like nfa to dfa Api.

##Errors

if send empty json we will see this errors .

if send NFA machine we will see this error because reduction algorithm just get DFA machine .




#How to use

Click and drag new Connections from the orange div in each State, Each State supports up to 20 Connections.

Click on a Connection to delete or rename it.

Double click on black movable button to see Clear , NTD , Red and help button.

Right click to white page to see menu of button.

Click on a 'Nfa 2 Dfa' button to convert from Nfa to Dfa and Show it.

Click on a 'Reduction' button to process a Reduction algorithm.

RightClick on a State to delete, rename, Start or Final it.

Double click on whitespace to add a new State.
