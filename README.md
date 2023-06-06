# Introduction

Our program consists of two main parts, including conversion of non deterministic finite automaton (NFA) to deterministic finite automaton (DFA) and also reduction for minimizing the given input as much as possible.


# NFA TO DFA algorithms

NFA to DFA algorithm contains three major functions. The first function(access lambda)،finds all possible transitions using epsilon transition .The second function(lambdaremove)، removes epsilon transitions by merging the related states. The last function(repeatedremove)makes a new transition table using the old values and that table is considered as the final output of the program which will be shown for the user after turning into a json format.

# Reduction algorithms

Reduction Algorithm has two separated sections. The first section is for removing inaccessible states using function (RemoveInaccessibleStates) and the second part is for finding equal states. This part contains three major function. The first function, (createTransitionTable) is responsible for creating transition table. The second function, (findEqualStates) is responsible for finding equal states from transition table and removing equal, repeated states. The last function, (standardTransitionTable) is responsible for building a new machine with survived states. The final output is converted to Json format and ready to be sent to Front.


# Screenshots

<img width="1440" alt="Screenshot 2023-06-06 at 5 35 10 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/86fa9427-1290-41a4-bc4a-20487ac0ecaa">
<img width="1440" alt="Screenshot 2023-06-06 at 5 35 30 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/056cf444-3d3c-461e-8610-46609125b723">
<img width="1440" alt="Screenshot 2023-06-06 at 5 35 40 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/ea2a2530-adec-4478-b4d1-ab3bf1b1280d">
<img width="1440" alt="Screenshot 2023-06-06 at 5 37 11 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/c4bc607f-2e03-48b9-97a7-758994b0fd52">
<img width="1440" alt="Screenshot 2023-06-06 at 5 37 30 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/e2ebbb15-4b57-44b0-8d30-fbcf22d60f46">
<img width="1440" alt="Screenshot 2023-06-06 at 5 37 45 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/4a1e8bf9-aeaf-4e09-9aac-a675313a7b3f">
<img width="1440" alt="Screenshot 2023-06-06 at 5 37 59 PM" src="https://github.com/mohamadkhalaj/statemachine-app/assets/62938359/e11e05a9-0be2-423c-8dc7-4620eafae8c4">

# Api

## Nfa To Dfa
`localhost:8000/nfa-to-dfa/{json_format}`

## Input example

First index of our json is states name and in each states we set their connection and state status. for example in state "q0" we have just one connection with "q1" by "a" and other connection like "b" , "λ" , "c" are null but we shouldn't remove them from our input json and the last value "state" show the status of our state and only get "start" , "final" , "normal" value.
```javascript
{
   "q0":{
      "a":[
         "q1"
      ],
      "b":[
         
      ],
      "λ":[
         
      ],
      "state":[
         "start"
      ]
   },
   "q1":{
      "a":[
         
      ],
      "b":[
         "q2"
      ],
      "λ":[
         
      ],
      "state":[
         "normal"
      ]
   },
   "q2":{
      "a":[
         
      ],
      "b":[
         
      ],
      "λ":[
         "q2"
      ],
      "state":[
         "final"
      ]
   }
}
```
## Output example

In output we only have one extra states status and its "TRAP" like state "2" and other value are like input value.
```javascript
{
   "0":{
      "state":[
         "start"
      ],
      "a":[
         "1"
      ],
      "b":[
         "2"
      ]
   },
   "1":{
      "state":[
         "normal"
      ],
      "a":[
         "2"
      ],
      "b":[
         "3"
      ]
   },
   "2":{
      "state":[
         "TRAP"
      ],
      "a":[
         "2"
      ],
      "b":[
         "2"
      ]
   },
   "3":{
      "state":[
         "final"
      ],
      "a":[
         "2"
      ],
      "b":[
         "2"
      ]
   }
}
```
## Errors

If send empty json we will see this errors:
```javascript
{"status": null}
```
If send DFA machine we will see this errors because the DFA machine didnt need to change DFA and the input machine should be NFA:
```javascript
{"is_dfa": True}
```
## Reduction
`localhost:8000/reduction/{json_format}`

All of the inputs and outputs in reduction are like nfa to dfa Api.

## Errors

If send empty json we will see this errors:
```javascript
{"status": null}
```
If send NFA machine we will see this error because reduction algorithm just get DFA machine:
```javascript
{"is_nfa": True}
```


# How to use

- Click and drag new Connections from the orange div in each State, Each State supports up to 20 Connections.

- Click on a Connection to delete or rename it.

- Double click on black movable button to see Clear , NTD , Red and help button.

- Right click to white page to see menu of button.

- Click on a 'Nfa 2 Dfa' button to convert from Nfa to Dfa and Show it.

- Click on a 'Reduction' button to process a Reduction algorithm.

- RightClick on a State to delete, rename, Start or Final it.

- Double click on whitespace to add a new State.

# How to run

For running this project followe below steps:

1. Install `python3`, `pip` in your system.
2. Clone this repository `https://github.com/mohamadkhalaj/statemachine-app.git`.
3. Run below commands:

  ```bash
  pip install -r requirements.txt
  python manage.py collectstatic 
  python manage.py runserver
  ```
4. Open following address `http://localhost:8000/` in your browser.
5. enjoy :)

# Team members
- [Mohammadmahdi Khalaj](https://github.com/mohamadkhalaj) FrontEnd
- [Mohammad Noroozi](https://github.com/norouzy/) FrontEnd
- [Amirhossein Bayati](https://github.com/amirhossein-bayati) BackEnd
- [Ali Hassanzadeh](https://github.com/AliHasanzadeh80) NFA 2 DFA Algorithm
- [Amirhossein Moosavi](https://github.com/AmirH-Moosavi) Reduction Algorithm
