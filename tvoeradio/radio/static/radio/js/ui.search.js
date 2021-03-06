register_namespace('ui.search');


ui.search.load_suggest_for = function(type, txt, callback) {
    if (type == 'user') {
        callback([]);
        return;
    }
    var params = {};
    params['limit'] = 10;
    params[type] = txt;
    network.lastfm.api(type + '.search', params, function(data) {
        if (txt != $('#search-widget__name').val()) {
            return;
        }
        var items = network.lastfm.arrayize(data.results[type + 'matches'][type]);
        var final_items = [];
        for (var i in items) {
            var name = items[i].name;
            if (type == 'album') {
                name += ' (' + items[i].artist + ')';
            }
            final_items.push({
                'value': name
            });
        }
        callback(final_items);
    });
};

ui.search.load_result = function(type, name) {
    $('.ui-autocomplete').hide();
    $('#dashboard').hide();
    $('#search-result').show();
    $('#search-widget__clear').show();
    $('#search-widget__name').val(name);
    ui.infoblock.show($('#search-result'), type, name);
};


ui.search.clear_result = function() {
    $('#search-widget__clear').hide();
    $('#dashboard').show();
    $('#search-result').hide();
    $('#search-widget__name').val('');
    $('#search-suggest').hide();
};


$(document).ready(function() {

    $('#search-widget__clear').click(function(){
        ui.search.clear_result();
    });

    $("#search-widget__name").autocomplete({
        'source': function(request, callback) {
            var type = $('#search-widget__type').val();
            ui.search.load_suggest_for(type, request.term, callback);
        },
        'select': function(event, jui) {
            if (event.keyCode == 13) {
                return;
            }
            var type = $('#search-widget__type').val();
            var name = jui.item.label;
            ui.search.load_result(type, name);
        }
    });

    $('#search-widget__name').keyup(function(e){
        if (e.which == 13) {
            var type = $('#search-widget__type').val();
            var name = $('#search-widget__name').val();
            ui.search.load_result(type, name);
        }
    });

    // $('#search-widget__name').

});
