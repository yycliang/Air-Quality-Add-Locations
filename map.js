// api key to access JotForm, switch my key for yours
JF.initialize({ apiKey: "609878d444944c609170949cb51ce66e" }); //PUT YOUR OWN KEY HERE
 
// get form submissions from JotForm Format: (formID, callback)
JF.getFormSubmissions("223123808962053", function (response) {
    console.log(response);
    // array to store all the submissions: we will use this to create the map
    const submissions = [];
    // for each response
    for (var i = 0; i < response.length; i++) {
    // create an object to store the submissions and structure as a json
    const submissionProps = {};

    // add all fields of response.answers to our object
    const keys = Object.keys(response[i].answers);
    keys.forEach((answer) => {
        const lookup = response[i].answers[answer].cfname ? "cfname" : "name";
        submissionProps[response[i].answers[answer][lookup]] =
        response[i].answers[answer].answer;
    });
    // convert location coordinates string to float array
    submissionProps["Location Coordinates"] = submissionProps[
        "Location Coordinates"
    ]   
        .split(/\r?\n/)
        .map((x) => parseFloat(x.replace(/[^\d.-]/g, "")))

    console.log(submissionProps);

    // add submission to submissions array
    submissions.push(submissionProps);
    }
    // Import Layers from DeckGL
    const { MapboxLayer, ScatterplotLayer } = deck;
 
    // YOUR MAPBOX TOKEN HERE
    mapboxgl.accessToken = "pk.eyJ1IjoieXljbGlhbmciLCJhIjoiY2w5d3Y5aGtkMDQzaDNucWtncnpuN21sMSJ9.Mb6lmVCXVSXGDXJLRlD2AQ";

    const map = new mapboxgl.Map({
        container: document.body,
        style: "mapbox://styles/yycliang/cl9wvsusl000a14mj99msp21h", // Your style URL
        center: [-71.10326, 42.36476], // starting position [lng, lat]
        zoom: 12, // starting zoom
        projection: "globe", // display the map as a 3D globe
    });

    map.on("load", () => {
        const firstLabelLayerId = map
        .getStyle()
        .layers.find((layer) => layer.type === "symbol").id;

        map.addLayer(
            new MapboxLayer({
                id: "deckgl-circle",
                type: ScatterplotLayer,
                data: submissions,
                getPosition: (d) => {
                return d["Location Coordinates"];
                },
                // Styles
                radiusUnits: "pixels",
                getRadius: 10,
                opacity: 0.7,
                stroked: false,
                filled: true,
                radiusScale: 3,
                getFillColor: [255, 0, 0],
                pickable: true,
                autoHighlight: true,
                highlightColor: [255, 255, 255, 255],
                parameters: {
                depthTest: false,
                },
            }),
            firstLabelLayerId
        );
    }); 
});
