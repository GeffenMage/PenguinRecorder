function hide(...elements){
    elements.forEach(element => {
        element.classList.add('is-hidden');
    });
}

function show(...elements){
    elements.forEach(element => {
        element.classList.remove('is-hidden');
    });
}

function disable(...elements){
    elements.forEach(element => {
        element.classList.add('is-disabled');
        if(element.getAttribute('disabled') == null || undefined)
            element.setAttribute('disabled', 'disabled');
    });
}

function enable(...elements){
    elements.forEach(element => {
        element.classList.remove('is-disabled');
        if(element.getAttribute('disabled') != null || undefined)
            element.removeAttribute('disabled');
    });
}

module.exports = {
    enable,
    disable,
    hide,
    show,
};