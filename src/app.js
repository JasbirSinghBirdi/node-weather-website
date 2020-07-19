const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const geoCode = require('./utils/geocode')
const { resolveSoa } = require('dns')


//console.log(__dirname) //directory name
//console.log(__filename) //file name

//console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
/*****Views is the default location that express expectsyour views to live in -- we can also customize it but 
we have to tell express where to look */
const viewsPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

app.set('view engine', 'hbs')  //for setting handlebars (for creating dynamic template)
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//setup static directory to serve
app.use(express.static(publicDirectoryPath))  //its a way to customize the server


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Jasbir Singh Birdi'
    }) //by using render express goes to views then convert into html then sends to requester
}) 


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Jasbir Singh Birdi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Jasbir Singh Birdi',
        message: 'Contact me for help'
    })
})

app.get('/weather', (req, res) => {
    //res.send('Weather Page')
    if (!req.query.address) {
        return res.send({
            error: 'please provide an address to get the weather'
        })
    }

    geoCode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({ error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    
    // res.send({
    //     forecast: 'It is Raining',
    //     location: 'Jalandhar',
    //     address: req.query.address
    // })
})


app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    /*We can only send one request at a time */

    console.log(req.query.search)//req has a query property , query is also an object,; contains all the query string information 
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    //res.send('Weather Page')
    res.render('404', {
        title: '404 help',
        name: 'Jasbir SIngh Birdi',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    //res.send('Weather Page')
    res.render('404', {
        title: '404',
        name: 'Jasbir SIngh Birdi',
        errorMessage: 'Page not found'
    })
})

// app.get('', (req, res) => {
//     res.send('<h1>Hello Express</h1>')
// })

// app.get('/help', (req, res) => {
//     res.send([{                    // for sending json
//         name: 'Jasbir Singh Birdi',
//         age: 25
//     },
//     {
//         name: 'Motu',
//         age:25
//     }
// ])
// })

// app.get('/about', (req, res) => {
//     res.send('<h1>About Page</h1>')
    
// })



// app.com
// app.com/help
// app.com/about


//to start the server in a specific port
// common development port: 3000

app.listen(port, () => {
    console.log('Server Started on port' + port)   //to be displayed only to devloper
})