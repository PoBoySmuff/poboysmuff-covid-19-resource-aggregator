'use strict';

const newsAPIKey = '77ff17db5d0d445f9fc64a57371455dd';
const youtubeAPIKey = 'AIzaSyBrCa8TDSEDLl8B1D4IOJaC34RUUDun0gM';
const youtubeSearchURL = 'https://www.googleapis.com/youtube/v3/search';

function loadGlobalStats() {
    console.log('hi');
    fetch('https://coronavirus-19-api.herokuapp.com/all')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayGlobal(responseJson))
        .catch(err => {
            $('#js-error-message-global').text(`something went wrong in loadGlobalStats: ${err.message}`);
        });
}

function displayGlobal(responseJson) {

    console.log('hi2');
    console.log(responseJson);
    $('#js-error-message-global').empty();
    $('#js-global-results').append(`
    <tr class='color-1'><th>Total cases:</th><td> ${responseJson.cases}</td></tr>
    <tr class='color-2'><th>Total deaths:</th><td> ${responseJson.deaths}</td></tr>
    <tr class='color-3'><th>Total recovered:</th><td> ${responseJson.recovered}</td></tr>
    `);

}

function loadCountryStats(country = 'usa') {
    console.log(country);
    fetch('https://coronavirus-19-api.herokuapp.com/countries/' + country)

        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayCountry(responseJson))
        .catch(err => {
            $('#js-error-message-country').text(`something went wrong in loadCountryStats: ${err.message}`);

        });
}

function displayCountry(responseJson) {
    console.log('hi3');
    console.log(responseJson);
    $('#js-error-message-country').empty();
    $('#js-country-results').empty();
    $('#js-country-results').append(`
    <tr class='color-1'><th>New Cases:</th><td> ${responseJson.todayCases}</td></tr>
    <tr class='color-2'><th>Total cases:</th><td> ${responseJson.cases}</td></tr>
    <tr class='color-3'><th>Total deaths:</th><td> ${responseJson.deaths}</td></tr>
    <tr class='color-4'><th>Total recovered:</th><td> ${responseJson.recovered}</td></tr>
    `);
}

function loadRecentNews() {
    console.log('hi4');
    const options = {
        headers: new Headers({
            'X-Api-Key': newsAPIKey
        })
    };
    fetch('http://newsapi.org/v2/everything?q=covid-19&from=2020-03-14&sortBy=published', options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNews(responseJson))
        .catch(err => {
            $('#js-error-message-news').text(`something went wrong in loadRecentNews: ${err.message}`);
        });
}

function displayNews(responseJson) {
    $('#js-error-message-news').empty();
    $('.js-news-results').empty();
    for (let i = 0; i < 7; i++) {
        let url = responseJson.articles[i].url;
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        } //for some reason <a> tag wouldn't create link with / at the end
        //therefore removing ending / with slice function
        console.log(url);
        $('.js-news-results').append(`
        <li><h3><a href=${url}>${responseJson.articles[i].title}</a></h3>
        <img src='${responseJson.articles[i].urlToImage}'>
        <p>${responseJson.articles[i].description}</p></li>`);
    }
};

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function loadRecentVideos() {
    console.log('hi5');
    const params = {
        key: youtubeAPIKey,
        q: 'covid-19',
        part: 'snippet',
        maxResults: 7,
        relevanceLanguage: 'en'
    };
    const queryString = formatQueryParams(params);
    const url = youtubeSearchURL + '?' + queryString;
    const options = {
        headers: new Headers({
            'X-Api-Key': youtubeAPIKey
        })
    };
    fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayVideos(responseJson))
    .catch(err => {
        $('#js-error-message-videos').text(`something went wrong in loadRecentVideos: ${err.message}`);
    })
}

function displayVideos(responseJson) {
    $('#js-videos-results').empty();
    console.log(responseJson);
    for (let i=0; i<responseJson.items.length; i++) {
        console.log(responseJson.items[i].id.videoId);
       $('#js-videos-results').append(
            `<li><h3><a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'>
            ${responseJson.items[i].snippet.title}</a></h3>
            <img src='${responseJson.items[i].snippet.thumbnails.medium.url}'>
            <p>${responseJson.items[i].snippet.description}</p>
            
            </li>`
            
        )

        /*<a href=''>
        /*>
            </li>*/
    };
    
}

function watchForm() {
    $('#js-form-country-search').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-country').val();
        console.log(searchTerm);
        loadCountryStats(searchTerm);
    })
}

function pageLoad() {
    //Call to load global stats, recent news, and recent videos on pageload
    //Call watchForm function to allow user to search stats by country
    loadGlobalStats();
    loadCountryStats(); //default to USA stats on page load
    loadRecentNews();
    loadRecentVideos();
    watchForm();
}

$(pageLoad);