from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from .reductionCal import *
from .justNfa2Dfa import *
from .NfaToDfaAndReduction import *
import json


noneResponse = {
    'status': None
}
is_dfa = {
    'is_dfa': True,
}
is_nfa = {
    'is_nfa': True,
}
def reduction(request, value):
    try:
        value = beautifulJson(value)
        reductObj = NfaToDfaAndReduction(value)
        if reductObj.isNFA:
            return JsonResponse(is_nfa)
        myReduct = Reduction(reductObj.nfa)
        reduction_output = json.loads(myReduct.json_object)
        return JsonResponse(reduction_output, safe=False)
    except:
        return JsonResponse(noneResponse)
def nfaToDfa(request, value):
    try:
        value = beautifulJson(value)
        nfaObj = JustNfa2Dfa(value)
        if nfaObj.isNFA == False:
            return JsonResponse(is_dfa)
    
        out = json.loads(nfaObj.JsonObj)
        return JsonResponse(out, safe=False)
    except:
        return JsonResponse(noneResponse)

def beautifulJson(value):
    value = value.replace("\'", "\"")
    value = value.replace(" ", "")
    value = value.replace('\t', '')
    value = value.replace('\n', '')
    value = value.replace(',}', '}')
    value = value.replace(',]', ']')

    return value


def error_404(request, exception):
    return render(request, 'error_404.html')

def home_page(requests):
    return render(requests, 'help.html')


