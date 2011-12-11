register_namespace('migrate');


migrate.favorites = function() {
    var start = 1400;
    network.vkontakte.api('getVariable', {'key': start - 1}, function(data){
        if (!data.response) {
            network.vkontakte.api('getVariables', {'count': 32, 'key': start}, function(data){
                var params = {};
                for (var i in data.response) {
                    params['item' + i] = data.response[i].value;
                }
                params['count'] = parseInt(i) + 1;
                var old_fav_count = userdata.favorited_stations.list.length;
                $.post('/app/_/favorite/migrate/', params, function(data){
                    userdata.favorited_stations.list = data.favorited_stations;
                    var new_fav_count = userdata.favorited_stations.list.length;
                    ui.update_dashboard();
                    ui.update_station_controls();
                    network.vkontakte.api('putVariable', {'key': start - 1, 'value': 'favorites migrated'}, function(data){
                        if (old_fav_count != new_fav_count) {
                            ui.notification.show('info', 'Успешно перенесено избранное из предыдущей версии приложения');
                        }
                    });
                });
            });
        }
    });
};
