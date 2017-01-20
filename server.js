var express = require('express');
var cheerio = require('cheerio');
var app     = express();
var request = require('request');

app.get('/scrape_movie', function(req, res){


    // The URL we will scrape from html returned from IMDB.
    url = 'http://www.imdb.com/title/tt0067756/'; // Silent Running
    //url = 'http://www.imdb.com/title/tt0062622/';  // 2001 A Space Odyddey

    request(url, function(error, response, html){
        // Check for errors
        if(!error){
            
            // Use 'Cheerio' to load the html into a jQuery node
            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            var title, date, rating;
            var json = { title : "", date : "", rating : ""};

            // Get the name and date property from h1 tag 
            $('h1[itemprop=name]').filter(function(){
           		var data = $(this);
            	title = data.text();
            	date = data.children().first().text();
            
            	json.title = title;
            	json.date = date;
        	})
            
            // Get the rating from a span 
            $('span[itemprop=ratingValue]').filter(function(){
                var data1 = $(this);
                rating = data1.text();
               
                json.rating = rating;
				//console.log('DEBUG: json: ' + JSON.stringify(json));
            })

        }
        else {
        	console.log("An error occurred sending the request: " + error);
        }

		// Generate the very simplistic UI.
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		res.write('<p>Movie information</p>'); 
		res.write('<ul>');
		res.write('<li>Title:   ' + json.title);
		res.write('<li>Date: ' + json.date);	
		res.write('<li>Rating:  ' + json.rating);	
		res.write('</ul>');	
		res.end();
	})
})

app.listen('3057')
console.log('App is listenning on port 3057');

exports = module.exports = app;
