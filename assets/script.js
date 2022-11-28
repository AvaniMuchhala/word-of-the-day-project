// API Key variables
var wordnikKey = '3873f7o2of4s3fj3bugv8zc0cdx8qufrpau3754t2dpvlrjz5';
var defineMRKey = '0d506d29-33ec-4e0b-ac9a-e584f336c692';
var synonymMRKey = 'd051d5ac-5f7c-4338-8a27-3f68c90156c6';
var movieAPIKey = "63d7ebc58121dff8f561b458dad5480f";

var wordOfDay = '';
var movieSection = document.querySelector(".content");

// URL varriables
var randomUrl = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + wordnikKey;
var etymologyURL = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/etymologies?useCanonical=false&api_key=' + wordnikKey;



function getMovieData() {
    movieSection.textContent = "";

    var movieRequestURL = "https://api.themoviedb.org/3/search/multi?query=" + wordOfDay + "&api_key=" + movieAPIKey;
    fetch(movieRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Movie/TV results: ");
            console.log(data.results);

            // Decide on num of results to display (maximum of first 5 results)
            if (data.results.length <= 5) {
                var numResults = data.results.length;
            } else {
                var numResults = 5;
            }

            // Loop through results and display media info for 5 results (movie or tv)
            var resultsDisplayed = 1;
            var i = 0; // index of data.results array
            while (resultsDisplayed <= numResults) {
                // If index is out of bounds, break out of while-loop
                if (i >= data.results.length) {
                    break;
                }

                // Confirm that result's media type is not a person
                if (data.results[i].media_type !== "person") {

                    // Check whether media is movie or TV to get title and release date
                    var title = document.createElement("h2");
                    var releaseDate = document.createElement("li");
                    // var genre = document.createElement("li");
                    if (data.results[i].media_type === "movie") {
                        title.textContent = data.results[i].title;
                        if (data.results[i].release_date === "") {
                            releaseDate.textContent = "Release Date: none";
                        } else {
                            releaseDate.textContent = "Release Date: " + data.results[i].release_date;
                        }
                    } else if (data.results[i].media_type === "tv") {
                        title.textContent = data.results[i].name;
                        if (data.results[i].first_air_date === "") {
                            releaseDate.textContent = "First Air Date: none";
                        } else {
                            releaseDate.textContent = "First Air Date: " + data.results[i].first_air_date;
                        }
                    }

                    // Movie/TV title
                    movieSection.appendChild(title);

                    // Media poster image
                    if (data.results[i].poster_path !== null) {
                        var poster = document.createElement("img");
                        poster.setAttribute("src", "http://image.tmdb.org/t/p/w200//" + data.results[i].poster_path);
                        movieSection.appendChild(poster);
                    }

                    // Media type (movie or tv)
                    var mediaType = document.createElement("li");
                    mediaType.textContent = "Media Type: " + data.results[i].media_type;
                    movieSection.appendChild(mediaType);

                    // Release date
                    movieSection.appendChild(releaseDate);

                    // Summary/overview
                    var summary = document.createElement("li");
                    if (data.results[i].overview === "") {
                        summary.textContent = "Summary: none";
                    } else {
                        summary.textContent = "Summary: " + data.results[i].overview;
                    }
                    movieSection.appendChild(summary);

                    resultsDisplayed++;
                }
                i++;
            }
        });
}

// Gets the definition
function getWKDefinition() {
  var defineUrl = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=' + wordnikKey;
  
    // Fetches Wordnik definition
    fetch(defineUrl)
        .then(function (response) {
            console.log(response);

            return response.json();
        })
        .then(function (data) {
            console.log(data);

      fetch(etymologyURL)
        .then(function (response) {
          console.log(response);
    
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        })
      
      getWKSynonyms();
    })
}

function getMRDefinition() {
  var redefineUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + wordOfDay + '?key=' + defineMRKey;

    // Fetches Merriam-Webster definition
    fetch(redefineUrl)
        .then(function (response) {
            console.log(response);

            return response.json();
        })
        .then(function (data) {
            console.log(data);

            if (data[0].shortdef) {
              console.log('Part of Speech: ' + data[0].fl);
              console.log('Definition, per Merriam-Webster: ' + data[0].shortdef[0]);
              console.log('Etmology:' + data[0].et[0][2]);
              getMRSynonyms();
            }
            else {
              getWKDefinition();
            }
        })
  
}

function getMRSynonyms() {
  var synonymMKUrl = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + wordOfDay + '?key=' + synonymMRKey;

  // Fetches synonyms via Merriam-Webster's API
  fetch(synonymMKUrl)
  .then(function (response) {
    console.log(response);

    return response.json();
  })
  .then(function (data) {
    console.log(data);

    var text = 'Synonyms: '
    
    console.log(text + data[0].syns.join(', '));
  })
}

function getWKSynonyms() {
  var synonymWKUrl = 'https://api.wordnik.com/v4/word.json/' + wordOfDay + '/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=' + wordnikKey;

  // Fetches synonyms via Merriam-Webster's API
  fetch(synonymWKUrl)
  .then(function (response) {
    console.log(response);

            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var text = 'Synonyms: '

            console.log(text + data[0].syns.join(', '));
        })
}

// Gets word of the day
function getWord(event) {

    // Fetches a random word
    fetch(randomUrl)
        .then(function (response) {
            console.log(response);

            return response.json();
        })
        .then(function (data) {
            console.log(data);

            wordOfDay = data.word;
            console.log(wordOfDay);

            alert('The word of the day is: ' + wordOfDay + '.');

            // Display word of day in textbox
            var wordBox = document.querySelector(".input");
            wordBox.value = wordOfDay;

            if (confirm('Would you like a new word?')) {
                getWord();
            } else {
                alert('Cool. Enjoy your day!');

                getDefinition();
                // getSynonyms();

                getMovieData();
            }
        })
}

var button = document.querySelector(".button");
button.addEventListener("click", getWord);