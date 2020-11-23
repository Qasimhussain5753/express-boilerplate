const nodegeocoder = require("node-geocoder");

const options = {
    provider: "google",
//    fetch: customFetchImplementation,
   apiKey: 'AIzaSyDVRiAIbd92VjQJmSVn6XcC2acUfn085aM', // for Mapquest, OpenCage, Google Premier
   formatter: null
}

const geocoder = nodegeocoder(options);

exports.locationName = async(req, res, next)=>{
    const { lat, lng } = req.body;
    const response = await geocoder.reverse({ lat: 45.767, lon: 4.833 });
    console.log(response)
    if(response)
    {
     res.status(200).send({
         success: true,
         message: "Location found Successfully",
         data: response
     })
    }
    else{
        res.status(500).send({
            success: false,
            message: "Location is not found"
        })
    }
};