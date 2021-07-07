import json

class NfaToDfaAndReduction():
    def __init__(self, input):
        self.nfa = input
        self.start = []
        self.final = []
        self.Alphabet = []
        self.isNFA = False
        self.json2dict()
        self.initialize()
        self.CheckLambda()
        if not self.isNFA:
            self.Algo2Input()

    # Converting Given Json Into Python-Dict
    def json2dict(self):
        self.nfa = json.loads(self.nfa)

    # Filling start,final And Alphabet Lists
    def initialize(self):
        for i in self.nfa:
            for j in self.nfa[i].keys():
                if j != 'λ' and j != 'state' and j not in self.Alphabet:
                    self.Alphabet.append(j)

    # Check whether We Have Lambda Transition In Our Nfa Or Not
    def CheckLambda(self):
        hasLambda = False
        LessTransision = True
        for i in self.nfa:
            if 'λ' in self.nfa[i]:
                hasLambda = True
            for j in self.Alphabet:
                if len(self.nfa[i][j]) > 1:
                    LessTransision = False
        if hasLambda or not LessTransision:
            self.isNFA = True

    # Changing Output Format So That It Can Be Used For The Reduction Program
    def Algo2Input(self):
        for i in self.nfa:
            for j in self.Alphabet:
                self.nfa[i][j] = ' '.join([str(element) for element in self.nfa[i][j]])
                if self.nfa[i][j] == '':
                    self.nfa[i][j] = 'None'
            if 'start' in self.nfa[i]['state']:
                self.nfa[i]['start'] = True
            else:
                self.nfa[i]['start'] = False
            if 'final' in self.nfa[i]['state']:
                self.nfa[i]['final'] = True
            else:
                self.nfa[i]['final'] = False
            del self.nfa[i]['state']

        hasstart = False
        for i in self.nfa:
            if self.nfa[i]['start'] == True and i != list(self.nfa.keys())[0]:
                hasstart = True
                prob = i
                nfa2 = {}
                nfa2[i] = self.nfa[i]
        if hasstart:
            for i in self.nfa:
                if i != prob:
                    nfa2[i] = self.nfa[i]
            self.nfa = nfa2

