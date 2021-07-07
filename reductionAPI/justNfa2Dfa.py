import json

class JustNfa2Dfa:
    def __init__(self, input):
        # variables
        self.nfa = input
        self.start = []
        self.final = []
        self.Alphabet = []
        self.dfa = {}
        self.dfa[0] = {}
        # Important variables
        self.isNFA = False
        self.JsonObj = ''
        # Method Calls
        self.json2dict()
        self.initialize()
        self.CheckLambda()# Contains All Sub-Methods

    # Converting Given Json Into Python-Dict
    def json2dict(self):
        self.nfa = json.loads(self.nfa)

    # Filling start,final And Alphabet Lists
    def initialize(self):
        for i in self.nfa:
            if 'start' in self.nfa[i]['state']:
                self.start.append(i)
            if 'final' in self.nfa[i]['state']:
                self.final.append(i)
            for j in self.nfa[i].keys():
                if j != 'λ' and j != 'state' and j not in self.Alphabet:
                    self.Alphabet.append(j)

    # Finding All Possible Transitions(When we have Lamdbda)
    def AccessLambda(self):
        for i in self.nfa:
            list = []
            list.append(i)
            for j in list:
                if self.nfa[j]['λ'] != []:
                    par = []
                    par = self.nfa[j]['λ']
                    for k in par:
                        if k not in list and k != []:
                            list.append(k)
            list.remove(i)
            self.nfa[i]['λ'] = list

    # Removing All Lambda Transitions
    def LmbdaRemove(self):
        for i in self.nfa:
            par = []
            if self.nfa[i]['λ'] != []:
                par = self.nfa[i]['λ']
                for j in par:
                    temp = []
                    for k in self.Alphabet:
                        if self.nfa[j][k] != []:
                            temp = self.nfa[j][k]
                            self.nfa[i][k].extend([item for item in temp if item not in self.nfa[i][k]])
            for x in self.Alphabet:
                for y in self.nfa[i][x]:
                    self.nfa[i][x].extend([item for item in self.nfa[y]['λ'] if item not in self.nfa[i][x]])
                    self.nfa[i][x] = sorted(self.nfa[i][x])

    # Removing All Repeated Tansitions And Also Determining Final states
    def RepeatedRemove(self):
        num = 0
        OldList = [self.start]
        for i in OldList:
            if num != 0:
                self.dfa[num] = {}
                self.dfa[num]['state'] = []
            for k in self.Alphabet:
                temp = []
                for j in i:
                    temp.extend([item for item in self.nfa[j][k] if item not in temp])
                    temp = sorted(temp)
                if temp not in OldList:
                    OldList.append(temp)
                self.dfa[num][k] = OldList.index(temp)
            if any(elem in self.final for elem in i):
                self.dfa[num]['state'].append('final')
            num = num + 1

    # Determining Trap and Normal States
    def states(self):
        for i in self.dfa:
            count = 0
            for j in self.Alphabet:
                if i == self.dfa[i][j]:
                    count = count + 1
                self.dfa[i][j] = list(str(self.dfa[i][j]))
            if count == len(self.Alphabet):
                self.dfa[i]['state'].append('TRAP')
            if self.dfa[i]['state'] == []:
                self.dfa[i]['state'].append('normal')

    # Check whether We Have Lambda Transition In Our Nfa Or Not(To Skip The Two First Methods)
    def CheckLambda(self):
        self.dfa[0]['state'] = ['start']
        hasLambda = False
        LessThanOne = True
        for i in self.nfa:
            if 'λ' in self.nfa[i]:
                hasLambda = True
            for j in self.Alphabet:
                if len(self.nfa[i][j]) > 1:
                    LessThanOne = False
                self.dfa[0][j] = []
        if hasLambda:
            self.AccessLambda()
            self.LmbdaRemove()
        if not LessThanOne or hasLambda:
            self.isNFA = True
            self.RepeatedRemove()
            self.states()
        self.results()

    # show results
    def results(self):
        if self.isNFA:
            print("Conversion Done Successfully!")
            self.JsonObj = json.dumps(self.dfa)
        elif not self.isNFA:
            print("The Given Input Is Already A DFA!(No Changes Made!)")
            self.JsonObj = json.dumps(self.nfa)
        # print("Final Output: ")
        # print(self.JsonObj)

#_______________________________ Input And Class Object(Test) ______________________________________________
nfa = {
        'q0':{'00': [], '11': [],'λ': ['q1', 'q2'], 'state': ['start']},
        'q1':{'00': ['q3'], '11': [],'λ': [], 'state': ['normal']},
        'q2':{'00': [], '11': ['q3'],'λ': [], 'state': ['normal']},
        'q3':{'00': [], '11': ['q4'],'λ': [], 'state': ['normal']},
        'q4':{'00': [], '11': [],'λ': [], 'state': ['final']}
}
nfa = json.dumps(nfa)
obj = JustNfa2Dfa(nfa)
# print("Is NFA: ")
# print(obj.isNFA)