let nextPageToken = '';  // Variable to store the nextPageToken for pagination
const apiKey = 'AIzaSyDa_BXl1BGZjxDlytjA5erNYqUADB6P2jE'; // Replace with your YouTube API key

// Function to search YouTube videos
function searchVideos() {
    const query = document.getElementById('search-query').value;
    const sortOption = document.getElementById('sort-option').value;
    
    if (!query) return;  // Don't proceed if the search query is empty

    // Show loader while fetching data
    document.getElementById('loader').style.display = 'block';
    document.getElementById('load-more').style.display = 'none';  // Hide "Load More" until results are fetched
    document.getElementById('back-btn').style.display = 'none';  // Hide back button

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}&order=${sortOption}&maxResults=5&pageToken=${nextPageToken}`;

    // Make API request to YouTube
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayVideos(data.items);  // Display the videos on the page
            nextPageToken = data.nextPageToken;  // Store the nextPageToken for the next set of results

            // Show "Load More" button if there are more results
            if (nextPageToken) {
                document.getElementById('load-more').style.display = 'block';
            }

            // Show the video container and hide search results when videos are loaded
            document.getElementById('video-container').style.display = 'grid';

            // Hide loader when data is fetched
            document.getElementById('loader').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('loader').style.display = 'none';
        });
}

// Function to display the videos
function displayVideos(videos) {
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = '';  // Clear existing videos before adding new ones

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.onclick = () => playVideo(video.id.videoId);  // Play video on click

        const videoThumbnail = video.snippet.thumbnails.high.url;
        const videoTitle = video.snippet.title;
        const videoId = video.id.videoId;

        // Build the video HTML
        videoElement.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}">
            <h3>${videoTitle}</h3>
        `;

        // Append the video to the video container
        videoContainer.appendChild(videoElement);
    });
}

// Function to play the selected video
function playVideo(videoId) {
    const playerContainer = document.getElementById('player-container');
    const backButton = document.getElementById('back-btn');
    
    // Hide the search results and show the back button
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('video-container').style.display = 'none';
    document.getElementById('load-more').style.display = 'none';

    // Show the video player and back button
    playerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    backButton.style.display = 'inline-block';
}

// Function to go back to search results
function backToSearch() {
    // Show the search results and hide the video player
    document.getElementById('search-container').style.display = 'block';
    document.getElementById('video-container').style.display = 'grid';
    document.getElementById('load-more').style.display = 'block';
    document.getElementById('player-container').innerHTML = '';
    document.getElementById('back-btn').style.display = 'none';
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', function() {
    nextPageToken = ''; // Reset the token when a new search is made
    searchVideos();
});

// Event listener for the "Load More" button
document.getElementById('load-more').addEventListener('click', function() {
    searchVideos();  // Call the searchVideos function again to load more results
});

// Event listener for the dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
