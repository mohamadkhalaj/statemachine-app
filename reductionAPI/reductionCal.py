
import json

class Reduction:
    json_object = ''
    def __init__(self, input):
        self.inputs = input
        self.RemoveInaccessibleStates(self.inputs)

    def RemoveInaccessibleStates(self, Inputs):
        NoneCheck = 0
        obj = []
        for item in Inputs[next(iter(Inputs))]:
            if item != 'start' and item != 'final':
                obj.append(item)
        for item in Inputs.keys():
            for objects in obj:
                if Inputs[item][objects] == 'None':
                    NoneCheck = 1
        tempNone = {}
        if NoneCheck == 1:
            for i in obj:
                tempNone[i] = 'None'
            tempNone['start'] = False
            tempNone['final'] = False
            Inputs['None'] = tempNone
        listOfStates = []
        out = False
        for state in Inputs.keys():
            if Inputs[state]['start'] == True:
                listOfStates.append(state)
                while out != 1:
                    SetOfStates = set(listOfStates)
                    flag = 0
                    for temp in SetOfStates:
                        j = 0
                        for i in obj:
                            if Inputs[temp][i] not in listOfStates:
                                listOfStates.append(Inputs[temp][i])
                                flag = 1
                    if flag == 0:
                        out = True
        lstTemp = []
        for state in Inputs.keys():
            if state not in listOfStates:
                lstTemp.append(state)
        for remove in lstTemp:
            Inputs.pop(remove)
        self.createTransitionTable(obj, Inputs)

    # Create Transition table
    def createTransitionTable(self, obj, Inputs):
        lst = [[] * len(Inputs)]
        out = 0
        i = 0
        for state in Inputs.keys():
            lstTemp = [[]]
            lstTemp[0].append(state)
            for j in obj:
                lstTemp[0].append(Inputs[state][j])
            # 2.add 0 and 1 as final is false or true
            if Inputs[state]['final'] == True:
                lstTemp[0].append('1')
            else:
                lstTemp[0].append('0')
            lst.append(lstTemp[0])
        del lst[0]
        count = 0
        while out != 1:
            count += 1
            lenght = len(lst[0])
            for lstElement in lst:
                lstTemp = []
                addList = []
                for i in range(1, len(obj) + 1):
                    for dt in lst:
                        if lstElement[i] == dt[0]:
                            if len(dt) == lenght:
                                lstTemp.append(dt[len(dt) - 1])
                            else:
                                lstTemp.append(dt[len(dt) - 3])
                for s in lstTemp:
                    lstElement.append(s)
            for k in lst:
                tempE = ""
                for lentgh in range(len(k) - len(obj) - 1, len(k)):
                    tempE += k[lentgh]
                if tempE not in addList:
                    addList.append(tempE)
                    k.append(str(len(addList) - 1))
                elif tempE in addList:
                    for i in range(0, len(addList)):
                        if tempE == addList[i]:
                            k.append(str(i))
            counter = 0
            for k in lst:
                if k[len(k) - 1] == k[len(k) - 2 - len(obj)]:
                    counter += 1
            if counter == len(lst):
                out = 1
        self.findEqualStates(lst, obj)

    # checking rows and fining equal states
    def findEqualStates(self, lst, obj):
        temp = ''
        stop = 0
        outLoop = 0
        while(outLoop != 1):
            flag = 0
            stop += 1
            for q in lst:
                count = -1
                for it in lst:
                    count += 1
                    if q != it:
                        if q[len(obj) + 1:] == it[len(obj) + 1:]:
                            temp = it[0]
                            i = 0
                            for lsls in lst:
                                lst[i] = [sub.replace(temp, q[0]) for sub in lsls]
                                i += 1
                            flag = 1
                            lst.pop(count)
                            break
                if(flag == 1):
                    break
            if(flag == 0):
                outLoop = 1

        self.standardTransitionTable(lst, obj)
    # Creating standard transition table
    def standardTransitionTable(self, lst, obj):
        listOfElements = [lst[0][0]]
        for check in listOfElements:
            for w in lst:
                if check == w[0]:
                    for i in range(0, len(obj) + 1):
                        if w[i] not in listOfElements:
                            listOfElements.append(w[i])
        lstFinal = []
        for check in listOfElements:
            lstTempo = []
            for w in lst:
                if check == w[0]:
                    for i in range(0, len(obj) + 1):
                        for j in range(0, len(listOfElements)):
                            if w[i] == listOfElements[j]:
                                lstTempo.append(str(j))
                    lstTempo.append(w[0])
                    lstFinal.append(lstTempo)
        self.output(listOfElements, lst, lstFinal, obj, self.inputs)

    # Creating Output Dictionary
    def output(self, listOfElements, lst, lstFinal, obj, Inputs):
        Output = {}
        for k in lstFinal:
            temp = {}
            state = []
            j = 0
            for i in obj:
                j += 1
                temp[i] = list(k[j])
            j = 0
            for find in Inputs.keys():
                if k[len(k) - 1] == find:
                    if Inputs[find]['start'] == True:
                        state.append('start')
                    if Inputs[find]['final'] == True:
                        state.append('final')
                    if len(state) == 0:
                        state.append('normal')
                    temp['state'] = state
                Output[k[0]] = temp
        # creating a json output from our Output Dictionary
        self.json_object = json.dumps(Output)


