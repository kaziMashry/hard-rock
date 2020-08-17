// API urls
const baseUrl = "https://api.lyrics.ovh/suggest/";
const lyricsUrl = "https://api.lyrics.ovh/v1/";


const searchButton = document.querySelector('.search-btn');
const searchBox = document.querySelector('.song-name');
const resultArea = document.querySelector('.search-result');

// Event listener for search button
searchButton
.addEventListener('click', () => {
    startProcess();
});

// Event listener for key press
searchBox
.addEventListener('keypress', (event) => {
    if(event.keyCode === 13) {
        startProcess();
    }
});

// Event listener for getting lyrics(using event bubble)
document.querySelector('.search-result')
.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if(clickedElement.classList.contains('get-lyrics-btn')) {
        const url = lyricsUrl + "/" + clickedElement.id;
        fetchAndShowLyrics(url);
    }
});


// This function starts process of showing the search result.
// It takes value from search box. 
// Clear the title and lyrics area.
// If there are any key in the search box then it bulid an url and call the fetchAndDisplaySongList() function.

function startProcess () {
    searchKey = searchBox.value;
    displayLyrics("", "");
    if(searchKey.length) {
        const url = baseUrl + searchKey;
        fetchAndDisplaySongList(url);
    }
}


// This function fetches data through API and call displaySongList() function.

function fetchAndDisplaySongList (url) {
    fetch(url)
    .then(response => response.json())
    .then(rawData => {
        displaySongList(rawData.data);
    })
    .catch(() => alert("Song not found"));
}


// This function clear the resultArea at first place.
// Then it loop through the data array.
// While loop through, it call createChild() function to build innerHTML for resultArea.

function displaySongList (data) {
    resultArea.innerHTML = "";
    let innerHTML = "";
    for(let i = 0; i < Math.min(data.length, 10); ++i) {
        innerHTML += createChild(data[i]);
    }
    
    resultArea.innerHTML = innerHTML;
}


// This function create child for resultArea.

function createChild (data) {
    let str = `<div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-9">
                <h3 class="lyrics-name">${data.title}</h3>
                <p class="author lead">Album by <span>${data.artist.name}</span></p>
            </div>
            <div class="col-md-3 text-md-right text-center">
                <button class="btn btn-success get-lyrics-btn" id="${data.artist.name}/${data.title}">Get Lyrics</button>
            </div>
        </div>`;

    return str;
}


// This function fetches the lyric of a song by fetching data through API.
// Firstly, it gets title by spliting url.
// Then if fetch data and call displayLyrics() to show the lyric

function fetchAndShowLyrics (url) {
    const title = url.split("/").pop();

    fetch(url)
    .then(response => response.json())
    .then(data => {
        displayLyrics(title, data.lyrics);
    })
    .catch(error => alert(error.message));
}


// This function display lyrics in the lyrics area

function displayLyrics (title, lyrics = "Lyrics Not found in the server") {
    document.querySelector('.song-title').innerText = title;
    document.querySelector('.lyric').innerText = lyrics;
}