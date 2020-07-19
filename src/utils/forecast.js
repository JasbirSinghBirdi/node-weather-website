const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=a57685649d776bc08890a5b25e81d37b&query=' + latitude + ',' + longitude  //'&units=f'

    request ( {url, json: true} , (error, {body} = {}) => { //using shorthand syntax fro url; names are identical
        if(error) {
            callback('unable to connect to weather services', undefined)
        }
        else if (body.error) {
            callback('Unable to find location', undefined)
        }
        else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degree out, It feels like " + body.current.feelslike + " degree out")
        }
    })
}




module.exports = forecast