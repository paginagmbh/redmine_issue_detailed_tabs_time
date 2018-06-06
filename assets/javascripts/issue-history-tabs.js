/*
Author: Daniel Munn <https://github.com/danmunn
Date: 23/05/2012
Forked & Redone: Mark Kalender (Markedagain)
Date: 08/03/2013
Forked & Changed: Tobias Fischer (tofi86)
Date: 06/06/2018
*/

// Simple cookie handling from http://stackoverflow.com/a/24103596/692410
function createCookie(name,value) {
	document.cookie = name + "=" + value + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0){
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

HISTORY_TABS = {
	'tabtime_questions': '.journal.question,.journal.question-closed',
	'tabtime_time': '.journal.has-time',
	'history_private': '.journal.private-notes',
	'history_comments': '.journal.has-notes',
	'history_activity': '.journal.has-details',
	'history_all': '.journal',
	'history_none': ''
}

function initTabs() {
	for(tab in HISTORY_TABS) {
		bindTab(tab)
	}
	selectDefaultTab();
}

function bindTab(tab){
	$('#tab-' + tab).click(function(){
		selectTab(tab);
		if('replaceState' in window.history){
			window.history.replaceState(null, document.title, '?tab=' + tab);
		}
	});
}

function selectTab(tab) {
	if(!(tab in HISTORY_TABS)) {
		return;
	}
	$('.tab-history').removeClass('selected');
	$('#tab-' + tab).addClass('selected');
	$('.journal').hide();
	$(HISTORY_TABS[tab]).show();
	createCookie('selected_issue_tab', tab);
}

function selectDefaultTab() {
	var tab = readCookie('selected_issue_tab');
	var focusOn = null;
	if(window.location.hash != '') {
		var fragment = window.location.hash;

		// look for <a name="">
		var anchorElem = $('a[name=' + fragment.substring(1, fragment.length) + ']');
		// alternatively look for <elem id="">
		var elem = $(fragment);

		if(anchorElem.length) {
			focusOn = anchorElem.parent().parent();
		} else if(elem.length) {
			focusOn = elem;
		}

		if(focusOn) {
			tab = 'history_all';
		}
	}
	if(!tab) {
		var elem = $('.tab-history.selected').not('#tab-history_all')[0];
		if(elem) {
			var id = elem.attr('id');
			tab = id.substring(4, id.length);
		}
	}
	selectTab(tab);
	if(focusOn) {
		$(window).scrollTop( focusOn.offset().top - parseInt(focusOn.css("marginTop")) - $('#top-menu.is_stuck').height() );
		focusOn.addClass('focus');
	}
}

$(window).load(function() {
	initTabs();
});
