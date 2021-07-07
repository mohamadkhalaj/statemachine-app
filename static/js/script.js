var states_counter = 0;
var instanceObj;
var rightClick_on;
var start_is_set = 0;
var conns_counter = 0;
var start_obj;
var state_status = [];
var res;
var main_url = 'https://automaton-app.herokuapp.com/';
jsPlumb.ready(function () {

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 6}],
        Connector:"StateMachine",
        HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "", id: "label", cssClass: "aLabel" }]
        ],
        Container: "canvas"
    });

    instanceObj = instance
    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    window.jsp = instance;

    var canvas = document.getElementById("canvas");
    var windows = jsPlumb.getSelector(".statemachine-demo .w");

    instance.bind("click", function (c) {
        dialog(c, instance);
    });

    instance.bind("mouseup", function (c) {
    });

    instance.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel('λ'); // set name
        conns_counter ++;
    });

    jsPlumb.on(canvas, "dblclick", function(e) {
        newNode(e.offsetX, e.offsetY);
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

});

function dialog(c, instance) {
    swal({
        content: {
            element: "input",
            attributes: {
                placeholder: 'Name: ',
                defaultValue: 'λ',
            },
        },
        buttons: {
            cancel : 'Cancel',
            Delete: {text:'Delete',className:'sweet-warning'},
            confirm : {text:'Confirm'},
            closeOnClickOutside: false,
        },
    }).then((result) => {
        if (result == null) {

        }
        else if (result == 'Delete') {
            instance.deleteConnection(c);
        }
        else {
            var result = document.getElementsByClassName('swal-content__input')[0].value;
            if (result != '') {
                c.getOverlay("label").setLabel(result)
            }
            else {
                dialog(c, instance)
            }
        }
    });
}

function rename(item) {
    swal({
        content: {
            element: "input",
            attributes: {
                placeholder: 'State Name: ',
                defaultValue: item.textContent.trim(),
            },
        },
        buttons: {
            cancel : 'Cancel',
            confirm : {text:'Confirm'},
        },
    }).then((result) => {
        if (result == null) {

        }
        else {
            var result = document.getElementsByClassName('swal-content__input')[0].value;
            if (result != '') {
                item.innerHTML = result + "&nbsp;&nbsp;<div class=\"ep\"></div>";
            }
            else
                rename(item)
        }
    });
}

function error_message(text, type) {
    swal(type.charAt(0).toUpperCase() + type.slice(1) + '!', text, type);
}

function help_message(text, type) {
    swal({
        icon: 'info',
        title: "STATE MACHINE",
        text: "Click and drag new Connections from the orange div in each State, Each State supports up to 20 Connections."
            +"\n\n"+"Click on a Connection to delete or rename it."
            +"\n\n"+"Double click on black movable button to see Clear , NTD , Red and help button."
            +"\n\n"+"Right click to white page to see menu of button."
            +"\n\n"+"Click on a 'Nfa 2 Dfa' button to convert from Nfa to Dfa and Show it."
            +"\n\n"+"Click on a 'Reduction' button to process a Reduction algorithm."
            +"\n\n"+"RightClick on a State to delete, rename, Start or Final it."
            +"\n\n"+"Double click on whitespace to add a new State."
            +"\n\n"+"Made with ♥"

        ,
        width:'100%',
    })
}

function delete_button(e) {
    if(this.className != undefined && this.className == 'delete') {
        remove_state_connections(this.parentNode)
    }
    else if (e.target != undefined && rightClick_on != undefined) {
        remove_state_connections(rightClick_on)
    }
}

function fix_delete_position() {
    var l = (this.clientWidth/2) - 5;
    for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].className == "delete") {
            this.childNodes[i].style.left = l + 'px';
            break;
        }
    }
}

function rename_clicked_state(e) {
    if (e.target != undefined && rightClick_on != undefined) {
        for (var i = 0; i < rightClick_on.childNodes.length; i++) {
            if (rightClick_on.childNodes[i].className == "stateName") {
                rename(rightClick_on.childNodes[i]);
                break;
            }
        }
    }
    if (this.className == 'stateName') {
        rename(this);
    }
}

function remove_state_connections(instance) {
    if (instance.id == start_obj) {
        start_obj = undefined;
    }
    instanceObj.remove(instance) // remove state
    instanceObj.deleteConnectionsForElement(instance) // remove connections
}

// custom main menubar

document.oncontextmenu = mainRightClick;

function mainRightClick(e) {
    if (document.querySelector('.page.machine-container').classList.toString() == "page machine-container active" && e.target.id == 'canvas') {
        e.preventDefault();
        hideMenu()
        var menu = document.getElementById("maincontextMenu")
        menu.style.display = 'block';
        document.body.style.overflowY = 'hidden';
        menu.style.left = e.pageX-22 + "px";
        menu.style.top = e.pageY-120 + "px";
    }
}

// custom context menu
document.onclick = hideMenu;

function hideMenu() {
    document.getElementById("contextMenu").style.display = "none";
    document.getElementById("maincontextMenu").style.display = "none";
    document.body.style.overflowY = '';
}


function rightClick(e) {
    hideMenu();
    rightClick_on = this
    e.preventDefault();
    var startMenu = document.getElementById('start-menu');
    var finalMenu = document.getElementById('final-menu');

    if (state_status[rightClick_on.id] != undefined) {
        if (state_status[rightClick_on.id]['start'] == '1') {
            startMenu.textContent = ' Remove Start'
            startMenu.parentNode.style.color = 'green'
        }
        if (state_status[rightClick_on.id]['final'] == '1') {
            finalMenu.textContent = ' Remove Final'
            finalMenu.parentNode.style.color = 'orange'
        }
        if (state_status[rightClick_on.id]['start'] == '0') {
            startMenu.textContent = ' Start'
            startMenu.parentNode.style.color = 'black'
        }
        if (state_status[rightClick_on.id]['final'] == '0') {
            finalMenu.textContent = ' Final'
            finalMenu.parentNode.style.color = 'black'
        }
    }

    var menu = document.getElementById("contextMenu")
    menu.style.display = 'block';
    document.body.style.overflowY = 'hidden';
    menu.style.left = e.pageX-27 + "px";
    menu.style.top = e.pageY-120 + "px";
}

function make_start(e) {
    var finalAndStartColor = ""
    var startColor = ""
    var finalColor = ""
    var node = document.createElement("div");
    if (state_status[rightClick_on.id]['start'] === '1' && state_status[rightClick_on.id]['final'] === '0') {
        state_status[rightClick_on.id]['start'] = '0'
        start_obj = undefined;
        rightClick_on.style.backgroundColor = 'white';
        rightClick_on.style.color = 'black';
        document.getElementById("startFlag").remove();
    }
    else if (state_status[rightClick_on.id]['final'] === '1' && state_status[rightClick_on.id]['start'] === '0') {
        if (start_obj != undefined) {
            state_status[start_obj]['start'] = '0'
            document.getElementById("startFlag").remove();
        }
        start_obj = rightClick_on.id;
        state_status[rightClick_on.id]['start'] = '1'
        rightClick_on.style.backgroundColor = finalAndStartColor;
        rightClick_on.style.color = 'white';
        node.id="startFlag";
        rightClick_on.appendChild(node);
    }
    else if (state_status[rightClick_on.id]['final'] === '1' && state_status[rightClick_on.id]['start'] === '1') {
        state_status[rightClick_on.id]['start'] = '0'
        start_obj = undefined;
        state_status[rightClick_on.id]['final'] = '1'
        rightClick_on.style.backgroundColor = finalColor;
        rightClick_on.style.color = 'white';
        document.getElementById("startFlag").remove();
    }
    else {
        if (start_obj != undefined) {
            state_status[start_obj]['start'] = '0'
            document.getElementById("startFlag").remove();
        }
        state_status[rightClick_on.id]['start'] = '1'
        start_obj = rightClick_on.id;
        node.id="startFlag";
        rightClick_on.appendChild(node);
        rightClick_on.style.backgroundColor = startColor;
        rightClick_on.style.color = 'white';
    }
}

function make_final(e) {
    var finalAndStartColor = ""
    var startColor = ""
    var finalColor = ""

    if (state_status[rightClick_on.id]['final']==='1' && state_status[rightClick_on.id]['start']==="0") {
        state_status[rightClick_on.id]['final'] = '0'
        rightClick_on.style.backgroundColor = 'white';
        rightClick_on.style.color = 'black';
        rightClick_on.style.border = '1px solid #2e6f9a';
    }
    else if (state_status[rightClick_on.id]['start']==="1" && state_status[rightClick_on.id]['final']==='0') {
        state_status[rightClick_on.id]['final'] = '1'
        rightClick_on.style.backgroundColor = finalAndStartColor;
        rightClick_on.style.color = 'white';
        rightClick_on.style.border = 'solid 3px black';
    }
    else if (state_status[rightClick_on.id]['start']==="1" && state_status[rightClick_on.id]['final']==="1") {
        state_status[rightClick_on.id]['final'] = '0'
        state_status[rightClick_on.id]['start'] = '1'
        rightClick_on.style.backgroundColor = startColor;
        rightClick_on.style.color = 'white';
        rightClick_on.style.border = '1px solid #2e6f9a';

    }
    else {
        state_status[rightClick_on.id]['final'] = '1'
        rightClick_on.style.backgroundColor = finalColor;
        rightClick_on.style.border = 'solid 3px black';
        rightClick_on.style.color = 'white';
    }
}

function make_JSON() {
    var JSON_ata = {};
    jsPlumb.getSelector(".statemachine-demo .w").forEach(function(item, index) {
        if (JSON_ata[item.id] == undefined)
            JSON_ata[item.id] = []
        JSON_ata[item.id] = get_state_connections(item);

        if (state_status[item.id]['start'] == '1') {
            JSON_ata[item.id]['state'] = ['start'];
            if (state_status[item.id]['final'] == '1') {
                JSON_ata[item.id]['state'] = ['start', 'final'];
            }
        }
        else if (state_status[item.id]['final'] == '1') {
            JSON_ata[item.id]['state'] = ['final'];
        }
        else if (state_status[item.id]['start'] == '0' && state_status[item.id]['final'] == '0') {
            JSON_ata[item.id]['state'] = ['normal'];
        }

    })
    return JSON_ata;
}

function start_final_json() {
    state_status[rightClick_on] = {'status':''}
}

function get_state_connections(state) {
    var conns = {}
    instanceObj.getAllConnections().forEach(function(item, index) {
        if (item.source == state) {
            if (conns[item.getOverlay('label').getLabel()] == undefined)
                conns[item.getOverlay('label').getLabel()] = []
            conns[item.getOverlay('label').getLabel()].push(item.target.id);
        }
        else {
            if (conns[item.getOverlay('label').getLabel()] == undefined)
                conns[item.getOverlay('label').getLabel()] = []
        }
    })
    return conns;
}

var clcicked_button;
var clicked_name;
function send_data(e, check = 0) {
    clcicked_button = undefined;
    var type;
    if (start_obj != undefined) {
        if (!unused_states_exists()) {
            if (!check) {

                if (e.target.textContent == 'NtD') {
                    type = 'nfa-to-dfa';
                }
                else if (e.target.textContent == 'RED'){
                    type = 'reduction';
                }
                clcicked_button = e;
                if (e.target.childNodes[0] != undefined)
                    clcicked_button.target.childNodes[0].classList.remove('onLoad');

                if (e.target.childNodes[1] != undefined) {

                    clicked_name = e.target.childNodes[1]['textContent'];
                    e.target.childNodes[1]['textContent'] = '';
                }
            } else {
                if (e.target.id == 'nfa2dfa') {
                    type = 'nfa-to-dfa';
                }
                else if (e.target.id == 'reduction'){
                    type = 'reduction';
                }
                document.getElementById("reload_menu").style.display="block"
                document.getElementById("btn__move").style.backgroundImage="url('/static/image/move4.png')"
            }
            var out = JSON.stringify(make_JSON());
            connect(type, out);
        }
        else {
            error_message('Check Unused States OR Connections!', 'error');
        }
    }
    else {
        error_message('First, You Should Set Start State!', 'error');
    }
}

function get_all_states(inpt) {
    var names = []
    Object.keys(inpt).forEach(function(item, index) {
        if (!names.includes(item)) {
            names.push(item);
        }

        Object.keys(inpt[item]).forEach(function(inner, index) {
            if (inner != 'state') {
                var i = inpt[item][inner].toString();
                if (!names.includes(i)) {
                    names.push(i);
                }
            }
        })
    })
    return names;
}

function cls(status) {
    jsPlumb.getSelector(".statemachine-demo .w").forEach(function(item, index) {
        remove_state_connections(item);
    })
    states_counter = 0;
    conns_counter = 0;
    if (status) {
        error_message('Cleared Successfully!', 'success');
    }
}

function connect_states(allStates, instance) {
    Object.keys(allStates).forEach(function(item, index) {
        Object.keys(allStates[item]).forEach(function(conn_names, index) {
            if (conn_names != 'state') { // labels
                var target = allStates[item][conn_names].toString();
                var instnc = instance.connect({source : item, target : target, type :'basic'});
                instnc.getOverlay('label').setLabel(conn_names);
            }
            else { //status
                var get_state = document.getElementById(item)
                if (allStates[item][conn_names][0] == 'start') { // start

                    start_obj = get_state.id;
                    var node = document.createElement("div");
                    node.id="startFlag";
                    get_state.appendChild(node);
                    get_state.style.backgroundColor = '';
                    get_state.style.color = 'white';
                    state_status[item]['start'] = '1';

                    if (allStates[item][conn_names][1] != undefined && allStates[item][conn_names][1] == 'final') { // start and final
                        get_state.style.backgroundColor = 'white';
                        get_state.style.color = 'black';
                        get_state.style.border = '3px solid black';
                        state_status[item]['final'] = '1';
                    }
                }
                else if (allStates[item][conn_names][0] == 'final') { // final
                    get_state.style.backgroundColor = 'white';
                    get_state.style.color = 'black';
                    get_state.style.border = '3px solid black';
                    state_status[item]['final'] = '1';
                }
                else { // nothing
                    state_status[item]['start'] = '0';
                    state_status[item]['final'] = '0';
                }
            }
        })
    })
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


var initNode = function(el) {
    // initialise draggable elements.
    var span = document.createElement('span')
    span.className = 'stateName'
    span.innerHTML = el.id + "&nbsp;&nbsp;<div class=\"ep\"></div>";
    span.addEventListener("click", rename_clicked_state);
    el.appendChild(span)
    el.addEventListener('mouseover', fix_delete_position)
    el.addEventListener("contextmenu", rightClick);
    var div = document.createElement('div')
    div.innerHTML = 'X'
    div.className = 'delete'
    div.style.top='45px'
    div.addEventListener('click', delete_button)
    el.appendChild(div)
    state_status[el.id] = {'start':'0', 'final': '0'};
    instanceObj.draggable(el);
    instanceObj.makeSource(el, {
        filter: ".ep",
        anchor: "Continuous",
        connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
        connectionType:"basic",
        extract:{
            "action":"the-action"
        },
        maxConnections: 20,
        onMaxConnections: function (info, e) {
            alert("Maximum connections (" + info.maxConnections + ") reached");
        }
    });

    instanceObj.makeTarget(el, {
        dropOptions: { hoverClass: "dragHover" },
        anchor: "Continuous",
        allowLoopback: true
    });

    instanceObj.fire("jsPlumbDemoNodeAdded", el);
};

var newNode = function(x, y) {
    var d = document.createElement("div");
    d.className = "w jtk-hover";
    d.id = 'q' + states_counter;
    d.style.left = x + "px";
    d.style.top = y + "px";
    instanceObj.getContainer().appendChild(d);
    initNode(d);
    states_counter ++;
    return d;
};

var newNode_draw = function(x, y, s_name) {
    var d = document.createElement("div");
    d.className = "w jtk-hover";
    d.id = s_name;
    d.style.left = x + "px";
    d.style.top = y + "px";
    instanceObj.getContainer().appendChild(d);
    initNode(d);
    states_counter ++;
    return d;
};

function draw_states_connections(inpt) {
    get_all_states(inpt).forEach(function(item, index) {
        newNode_draw(getRandom(200, 1200), getRandom(70, 450),item)
    })
}

function connect(type, json) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', main_url + type + '/' + json);
    xhr.timeout = 10000;
    xhr.ontimeout = function () { error_message('Connection Timed out! Try again', 'error'); }
    xhr.responseType = 'json';

    xhr.onreadystatechange = function(e) {
        if (this.status === 200 && xhr.readyState == 4) {
            res = this.response;
            if (Object.keys(res)[0] != undefined && Object.keys(res)[0] != "status") {
                if (res['is_dfa'] !=  undefined && res['is_dfa'] == true) {
                    error_message('Entered Machine is Already a DFA!', 'error');
                }
                else if (res['is_nfa'] !=  undefined && res['is_nfa'] == true){
                    error_message('Entered Machine is Not a DFA, First Convert it To DFA!', 'error');
                }
                else {
                    error_message('Data Sent Successfully!', 'success');
                    cls(false);
                    state_status = [];
                    draw_states_connections(res);
                    connect_states(res, instanceObj);
                }
            }
            else if (Object.keys(res)[0] != undefined && Object.keys(res)[0] == "status"){
                error_message('Response: ' + JSON.stringify(res), 'error');
            }
            console.log(type + '\n\n➡️ '+ json + '\n\n↩️ '+ JSON.stringify(res));
        }
        else {
            error_message('Connection Failed!: ' + this.status, 'error');
        }
        if (clcicked_button != undefined) {
            clcicked_button.target.childNodes[0].classList.add('onLoad');

            if (clcicked_button.target.childNodes[1] != undefined) {
                clcicked_button.target.childNodes[1]['textContent'] = clicked_name;
            }
        }else{
            document.getElementById("reload_menu").style.display="none"
            document.getElementById("btn__move").style.backgroundImage="url('/static/image/move5.png')"
        }
    };
    try {
        xhr.send();
    } catch(err) {
        error_message('Connection Failed!: ' + err.description, 'error');
    }
}

function unused_states_exists() {
    var found = false;
    var ret = false;
    var ret2 = false;
    var ret3 = false;

    // no connections
    if (instanceObj.getAllConnections().length == 0) {
        return true
    }

    // state without connections
    jsPlumb.getSelector(".statemachine-demo .w").forEach(function(state, index) {
        found = false;
        ret2 = false;
        ret3 = false;
        instanceObj.getAllConnections().forEach(function(item, index) {
            if (item.source == state || item.target == state) {
                found = true;
            }
            // alone state and not start
            if ((start_obj != undefined) && (item.source == state && item.target == state) && (start_obj != state.id)) {
                ret2 = true;
            }
            if ((item.targetId != item.sourceId) && ((item.target == state) || (item.source == state))) {
                ret3 = true;
            }
        })
        if (!found) {
            ret = true;
        }
        if (ret2 && !ret3) {
            ret = true;
        }
    })
    return ret;
}

const allMenueItem = document.querySelectorAll('.menue__item:not(.calculate)')
const menueContainer = document.querySelector('.menue__container')
const pages = document.querySelectorAll('.page')

menueContainer.addEventListener('click', menueAction)

function menueAction(e) {
    if (!e.target.closest('.calculate')) e.preventDefault()
    const target = e.target.closest('a')
    if (!target) return

    const item = target.parentNode
    allMenueItem.forEach(el => el.classList.remove('active'))

    pages.forEach(p => {
        p.classList.remove('active')
        if (p.classList[1].split('-')[0] === item.classList[1])
            p.classList.add('active')
    })

    item.classList.add('active')
}

const onStartNowClick = (e) => {
    e.preventDefault();
    pages.forEach(p => p.classList.remove('active'))
    document.querySelector('.page.machine-container').classList.add('active');

    allMenueItem.forEach(el => el.classList.remove('active'))
    document.querySelector('.menue__item.machine').classList.add('active');
}

document.querySelector('.start-machine').addEventListener('click', onStartNowClick);

function copyFunction(ids) {
    console.log(ids)
    var TextToCopy = document.getElementById(ids[0]).innerText;
    var copyFeild = document.getElementById(ids[1].id)
    var coin =['Bbtc','Beth','Batm','Bdoge']
    for (let i = 0; i < 4; i++) {
        if(coin[i]!==copyFeild.id){
            document.getElementById(coin[i]).style.backgroundColor = '#DFE0DB'
            document.getElementById(coin[i]).style.width = '55px'
        }
    }
    copyFeild.style.backgroundColor = 'white'
    copyFeild.style.width = '60px'

    var TempText = document.createElement("input");
    TempText.value = TextToCopy;
    document.body.appendChild(TempText);
    TempText.select();
    document.execCommand("copy");
    document.body.removeChild(TempText);
}


dragElement(document.getElementById("btns-bar"));

function dragElement(elmnt) {
    var canvas =  document.getElementById("canvas")
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        if((elmnt.offsetTop - pos2)<=-120 || (elmnt.offsetLeft - pos1)<=-100 || (pos3>=canvas.offsetWidth+10) || (pos4>=630)){
            if((pos3>=canvas.offsetWidth)){
                elmnt.style.left = (canvas.offsetWidth-130) + "px"
            }
            if((elmnt.offsetLeft - pos1)<=-100){
                elmnt.style.left = -71 + "px"
            }
            if((elmnt.offsetTop - pos2)<=-120){
                elmnt.style.top = -100 + "px"
            }
            if((630<=pos4)){
                elmnt.style.top = 480 + "px"
            }
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
//document.querySelector('.sendLink').addEventListener('click',go)

function closeBar() {
    if(document.getElementById("btn__clear").style.visibility==="hidden"){
        document.getElementById("btn__clear").style.transform="translateX(0%)";
        document.getElementById("btn__help").style.transform="translateX(0)";
        document.getElementById("btn__reduction").style.transform="translateY(0)";
        document.getElementById("btn__nfa").style.transform="translateY(0)";
        document.getElementById("btn__clear").style.visibility ="visible";
        document.getElementById("btn__help").style.visibility ="visible";
        document.getElementById("btn__reduction").style.visibility ="visible";
        document.getElementById("btn__nfa").style.visibility ="visible";
    }else{
        document.getElementById("btn__clear").style.transform="translateX(106%)";
        document.getElementById("btn__help").style.transform="translateX(-106%)";
        document.getElementById("btn__reduction").style.transform="translateY(-106%)";
        document.getElementById("btn__nfa").style.transform="translateY(106%)";
        document.getElementById("btn__clear").style.visibility ="hidden";
        document.getElementById("btn__help").style.visibility ="hidden";
        document.getElementById("btn__reduction").style.visibility ="hidden";
        document.getElementById("btn__nfa").style.visibility ="hidden";
    }

}

var mybutton = document.getElementById("scroll_btn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function donate(e) {
    var val = document.getElementById("foods").value
    if(val==='☕ Cafe'){
        window.open("https://zarinp.al/379381");
    }else if(val==='🥪 Sandwich'){
        window.open("https://zarinp.al/379382");
    }else if(val==='🍕 Pizza'){
        window.open("https://zarinp.al/379383");
    }
    else{
        window.open("https://zarinp.al/379384");
    }
}



function jsonViewer(json, collapsible=false) {
    var TEMPLATES = {
        item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
        itemCollapsible: '<label class="json__item json__item--collapsible"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
        itemCollapsibleOpen: '<label class="json__item json__item--collapsible"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div>%CHILDREN%</label>'
    };

    function createItem(key, value, type){
        var element = TEMPLATES.item.replace('%KEY%', key);

        if(type == 'string') {
            element = element.replace('%VALUE%', '"' + value + '"');
        } else {
            element = element.replace('%VALUE%', value);
        }

        element = element.replace('%TYPE%', type);

        return element;
    }

    function createCollapsibleItem(key, value, type, children){
        var tpl = 'itemCollapsible';

        if(collapsible) {
            tpl = 'itemCollapsibleOpen';
        }

        var element = TEMPLATES[tpl].replace('%KEY%', key);

        element = element.replace('%VALUE%', type);
        element = element.replace('%TYPE%', type);
        element = element.replace('%CHILDREN%', children);

        return element;
    }

    function handleChildren(key, value, type) {
        var html = '';

        for(var item in value) {
            var _key = item,
                _val = value[item];

            html += handleItem(_key, _val);
        }

        return createCollapsibleItem(key, value, type, html);
    }

    function handleItem(key, value) {
        var type = typeof value;

        if(typeof value === 'object') {
            return handleChildren(key, value, type);
        }

        return createItem(key, value, type);
    }

    function parseObject(obj) {
        _result = '<div class="json">';

        for(var item in obj) {
            var key = item,
                value = obj[item];

            _result += handleItem(key, value);
        }

        _result += '</div>';

        return _result;
    }

    return parseObject(json);
};



var NTD_input = {
    "q0":{"a":["q1"],"b":[],"λ":[],"c":[],"state":["start"]},"q1":{"a":[],"b":["q2"],"λ":["q0"],"c":[],"state":["normal"]},"q2":{"a":[],"b":[],"λ":[],"c":["q2"],"state":["final"]}
}
var NTD_output = {
    "0":{"state":["start"],"a":["1"],"b":["2"],"c":["2"]},"1":{"state":["normal"],"a":["1"],"b":["3"],"c":["2"]},"2":{"state":["TRAP"],"a":["2"],"b":["2"],"c":["2"]},"3":{"state":["final"],"a":["2"],"b":["2"],"c":["3"]}
}
var is_null ={
    "status": 'null'
}
var is_NFA ={
    "is_nfa": true
}
var is_DFA ={
    "is_dfa": true
}
var el = document.querySelector('.target');
var el2 = document.querySelector('.target2');
var el3 = document.querySelector('.target3');
var el4 = document.querySelector('.target4');
var el5 = document.querySelector('.target5');
var el6 = document.querySelector('.target6');

el.innerHTML = jsonViewer(NTD_input, true);
el2.innerHTML = jsonViewer(NTD_output, true);
el3.innerHTML = jsonViewer(is_null, true);
el4.innerHTML = jsonViewer(is_DFA, true);
el5.innerHTML = jsonViewer(is_null, true);
el6.innerHTML = jsonViewer(is_NFA, true);

