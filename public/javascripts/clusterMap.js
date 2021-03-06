mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
   
    // style: 'mapbox://styles/mapbox/light-v8',
    style: 'mapbox://styles/mapbox/streets-v9',
    // style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/light-v11',
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 1
});

map.addControl(new mapboxgl.NavigationControl());




map.on('load', function () {
    map.addSource('places', {
        type: 'geojson',
        data: places,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                // '#11ffaa',
                // '#00dd8e',
                // '#3fb1ce',
                '#ff2052',
                3,
                // '#00c37d',
                // '#00dd8e',
                // '#00aa6d',
                // '#2c93ae',
                '#ff4770',
                5,
                // '#00aa6d'
                // '#005e3c'
                // '#278299'
                '#ff5b80',
                10,
                // '#00aa6d'
                // '#005e3c'
                // '#278299'
                '#fe6f6e',
                25,
                // '#00aa6d'
                // '#005e3c'
                // '#278299'
                '#fd5c5b',
                50,
                // '#00aa6d'
                // '#005e3c'
                // '#278299'
                '#fd4847',
                100,
                // '#00aa6d'
                // '#005e3c'
                // '#278299'
                '#fd3534'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                20,
                30,
                25

                // 3,
                // 5,
                // 5,
                // 7,
                // 10,
                // 10,
                // 25,
                // 15,
                // 50,
                // 20,
                // 100,
                // 25
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        paint: {
            // color name awesome = ff2052
            // 'circle-color': '#11ffaa',
            // 'circle-color': '#7ccade',
            'circle-color': '#ff2052',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('places').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    map.on('click', 'unclustered-point', function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});