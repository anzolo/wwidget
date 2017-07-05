function getURL() {
    let days = document.getElementById('days');
    let city = document.getElementById('city')
    let req = ['days=' + days[days.selectedIndex].value, 'city=' + city[city.selectedIndex].value];
    let rads = document.getElementsByName('align');
    for (i = 0; i < rads.length; i++) {
        if (rads[i]['checked']) {
            req.push('align=' + rads[i].value);
            break;
        }
    }

    return "http://localhost:8080/get_embedded?" +
        req.join('&');
}

function getCode() {

    let widget_url = getURL();

    document.getElementById("code").value = '<iframe src="'+widget_url+ '" width="100%" height="100%" frameborder="0"></iframe>';
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}