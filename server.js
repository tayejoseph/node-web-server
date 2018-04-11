const express = require('express');
const hbs = require('hbs');
const fs = require('fs');// I think fs means file system
const port = process.env.PORT || 3000; //this is used to set port for heroku or port for our local server


const app = express();
hbs.registerPartials(__dirname + "/views/partials");//this is used to register partials eg footer partial
hbs.registerHelper("getCurrentYear", () => {
    //any thing rendered inside here is going to be called inplace of getCurrentyear
    return new Date().getFullYear()
});
hbs.registerHelper("screemIt", (text) => {
    return text.toUpperCase();
});
app.set("view engine", "hbs");//this is used to set express configuration the tell express the type of view engine we want to use which we now set it to be hbs

//EXPRESS MIDDLEWARE
//note the app.use() wrk orderly i.e how we arranged it in this file
app.use((req, res, next) => {
//next argument is used to tell express when we are done
const now = new Date().toString();
const log = `${now}: ${req.method} ${req.url}`;
console.log(log);
//this func below is used to save our log to a file named server.log
fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
        console.log("Unable to append to server.log");
    }
});
next();
});
//this is used to so our maintenance page
app.use((req, res, next) => {
    // res.render("maintenance.hbs"); //we can un comment this line and comment the next() in other for us to show maintenace messages in all our page
    next() //this next will make our app to run instead of it showing site under maintenance
});
app.use(express.static(__dirname + "/public")); //this get the help.html page





// app.get("/", (req, res) => { //the req(all know as request) store information about the request coming in eg. header,body etc
//     //the res(all know as respond) with the u can respond to ur request
//     //this function is run we a user visit the root of the app
// // res.send("<h1>Hello Express</h1>"); //this is the respond of the http request
// res.send({//this send back a json
//     name: "Andrew",
//     likes: [
//         "Biking"
//     ]
// });
// });


//FOR DYNAMIC PAGE RENDERING
app.get("/", (req, res) => {
res.render("home.hbs", {
    welcomeMessage: "WELCOME TO OUR WEBSITE",
    pageTitle: "Home Page",
})
});

app.get('/about', (req, res) => {
res.render("about.hbs", {
    //this take in the dynamic data want to change on our about.html page so check the page out
    pageTitle: "About Page",
}); //this helps us render our dynamic about.hbs template under of views folder
});

app.get("/bad", (req, res) => {
res.send({//this send a json to the /bad webpage
    error: "Http not found"
})
});

app.get("/project", (req, res) => {
    res.render("project.hbs", {
        title: "Portfolio Page Here"
    });
})

//the port we declared above is used here for listen/serving up our app
app.listen(port, () => {
    //this func help us to do something onces the server is up
    console.log(`Server is up on port ${port}`)//this is printed on our cmd prompt
}); //this bond of app to localhost 3000