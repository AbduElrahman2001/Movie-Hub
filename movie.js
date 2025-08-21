//////////////////////abdelrahman/////////////////////////////////
let allMovies = [];

// Helpers for favourites storage
function getFavourites() {
  try {
    const raw = JSON.parse(localStorage.getItem('favourites') || '[]');
    const asObjects = Array.isArray(raw)
      ? raw.filter(item => item && typeof item === 'object' && 'title' in item)
      : [];
    // Migrate away any legacy string-HTML entries
    if (asObjects.length !== (Array.isArray(raw) ? raw.length : 0)) {
      localStorage.setItem('favourites', JSON.stringify(asObjects));
    }
    return asObjects;
  } catch (_) {
    return [];
  }
}

function saveFavourites(favourites) {
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

function isFavouriteByTitle(title) {
  return getFavourites().some(item => item.title === title);
}

// Helpers for downloads storage
function getDownloads() {
  try {
    const raw = JSON.parse(localStorage.getItem('downloads') || '[]');
    const asObjects = Array.isArray(raw)
      ? raw.filter(item => item && typeof item === 'object' && 'title' in item)
      : [];
    // Migrate away any legacy string-HTML entries
    if (asObjects.length !== (Array.isArray(raw) ? raw.length : 0)) {
      localStorage.setItem('downloads', JSON.stringify(asObjects));
    }
    return asObjects;
  } catch (_) {
    return [];
  }
}

function saveDownloads(downloads) {
  localStorage.setItem('downloads', JSON.stringify(downloads));
}

function isDownloadedByTitle(title) {
  return getDownloads().some(item => item.title === title);
}

  fetch('movies.json')
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      displayMovies(allMovies);
    });


  function displayMovies(movies) {
    const container = document.querySelector('.products');
    if (!container) return;
    container.innerHTML = '';

    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'card';
      const heartClass = isFavouriteByTitle(movie.title) ? 'fa-solid' : 'fa-regular';
      const downloadClass = isDownloadedByTitle(movie.title) ? 'fa-solid' : 'fa-regular';
      const downloadText = isDownloadedByTitle(movie.title) ? 'Downloaded' : 'Download Now';
      card.innerHTML = `
        <div class="imag"><img src="${movie.image}" alt="${movie.title}"></div>
        <div class="desc">${movie.description}</div>
        <div class="title">${movie.title}</div>
        <div class="box">
          <i class="${heartClass} fa-heart" id="navbarHeart"></i>
          <button class="btn download-btn" data-title="${movie.title}">
            <i class="${downloadClass} fa-download"></i> ${downloadText}
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function searchMovies() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query)
    );
    displayMovies(filtered);
  }

  function searchDownloads() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const downloads = getDownloads();
    const filtered = downloads.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query)
    );
    
    const downloadContainer = document.getElementById('downloadContainer');
    if (!downloadContainer) return;
    
    downloadContainer.innerHTML = '';
    
    if (filtered.length === 0) {
      downloadContainer.innerHTML = '<p class="no-downloads">No movies found matching your search.</p>';
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="imag"><img src="${item.image}" alt="${item.title}"></div>
        <div class="desc">${item.description}</div>
        <div class="title">${item.title}</div>
        <div class="box">
          <i class="fa-solid fa-heart" id="navbarHeart"></i>
          <button class="btn download-btn downloaded" data-title="${item.title}">
            <i class="fa-solid fa-download"></i> Downloaded
          </button>
        </div>
      `;
      downloadContainer.appendChild(card);
    });
  }
  ////////////////////////////////////////////////////////////////////
 
//////////////////////////Osama///////////////////////////////////////////////
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, val] = cookie.split('=');
    return key === name ? decodeURIComponent(val) : acc;
  }, '');
}

const darkModeToggle = document.getElementById('darkModeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');

// Apply saved mode on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedMode = getCookie('darkMode');
  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline';
  } else {
    document.body.classList.remove('dark-mode');
    moonIcon.style.display = 'inline';
    sunIcon.style.display = 'none';
  }
});

// Toggle and save mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  setCookie('darkMode', isDark ? 'enabled' : 'disabled', 30);
  moonIcon.style.display = isDark ? 'none' : 'inline';
  sunIcon.style.display = isDark ? 'inline' : 'none';
});
////////////////////// Favourite section/////////////////////////////

// document.addEventListener('click', function (e) {
//   if (e.target && e.target.id === 'navbarHeart') {
//     if (e.target.classList.contains('fa-regular')) {
//       e.target.classList.remove('fa-regular');
//       e.target.classList.add('fa-solid');
//     } else {
//       e.target.classList.remove('fa-solid');
//       e.target.classList.add('fa-regular');
//     }
//   }
// });

//////////////////////////mohamed////////////////////////////
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'navbarHeart') {
    const heart = e.target;
    const card = heart.closest('.card');
    if (!card) return;

    const titleEl = card.querySelector('.title');
    const descEl = card.querySelector('.desc');
    const imgEl = card.querySelector('.imag img');

    const movie = {
      title: titleEl ? titleEl.textContent.trim() : '',
      description: descEl ? descEl.textContent.trim() : '',
      image: imgEl ? imgEl.getAttribute('src') : ''
    };

    let favourites = getFavourites();
    const index = favourites.findIndex(item => item.title === movie.title);

    if (heart.classList.contains('fa-regular')) {
      // add to favourites
      if (index === -1 && movie.title) {
        favourites.push(movie);
        saveFavourites(favourites);
      }
      heart.classList.remove('fa-regular');
      heart.classList.add('fa-solid');
    } else {
      // remove from favourites
      if (index !== -1) {
        favourites.splice(index, 1);
        saveFavourites(favourites);
      }
      heart.classList.remove('fa-solid');
      heart.classList.add('fa-regular');
      // If we're on favourites page, remove the card from DOM
      const favContainer = document.getElementById('favouriteContainer');
      if (favContainer && favContainer.contains(card)) {
        card.remove();
      }
    }
  }
  
  // Handle download button clicks
  if (e.target && e.target.classList.contains('download-btn')) {
    const btn = e.target;
    const title = btn.getAttribute('data-title');
    const card = btn.closest('.card');
    if (!card || !title) return;

    const descEl = card.querySelector('.desc');
    const imgEl = card.querySelector('.imag img');

    const movie = {
      title: title,
      description: descEl ? descEl.textContent.trim() : '',
      image: imgEl ? imgEl.getAttribute('src') : ''
    };

    let downloads = getDownloads();
    const index = downloads.findIndex(item => item.title === title);

    if (index === -1) {
      // Add to downloads
      downloads.push(movie);
      saveDownloads(downloads);
      
      // Update button appearance
      btn.innerHTML = '<i class="fa-solid fa-download"></i> Downloaded';
      btn.classList.add('downloaded');
      
      // Show success message
      showNotification('Movie downloaded successfully!', 'success');
    } else {
      // Remove from downloads
      downloads.splice(index, 1);
      saveDownloads(downloads);
      
      // Update button appearance
      btn.innerHTML = '<i class="fa-regular fa-download"></i> Download Now';
      btn.classList.remove('downloaded');
      
      // Show removal message
      showNotification('Movie removed from downloads!', 'info');
    }
  }
});

////////////////////////////////
// Notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Remove existing notifications
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Render favourites page
window.addEventListener('DOMContentLoaded', () => {
  const container1 = document.getElementById('favouriteContainer');
  if (!container1) return;
  container1.innerHTML = '';
  const favourites = getFavourites();

  favourites.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const downloadClass = isDownloadedByTitle(item.title) ? 'fa-solid' : 'fa-regular';
    const downloadText = isDownloadedByTitle(item.title) ? 'Downloaded' : 'Download Now';
    card.innerHTML = `
      <div class="imag"><img src="${item.image}" alt="${item.title}"></div>
      <div class="desc">${item.description}</div>
      <div class="title">${item.title}</div>
      <div class="box">
        <i class="fa-solid fa-heart" id="navbarHeart"></i>
        <button class="btn download-btn" data-title="${item.title}">
          <i class="${downloadClass} fa-download"></i> ${downloadText}
        </button>
      </div>
    `;
    container1.appendChild(card);
  });
});

// Render downloads page
window.addEventListener('DOMContentLoaded', () => {
  const downloadContainer = document.getElementById('downloadContainer');
  if (!downloadContainer) return;
  downloadContainer.innerHTML = '';
  const downloads = getDownloads();

  if (downloads.length === 0) {
    downloadContainer.innerHTML = '<p class="no-downloads">No movies downloaded yet. Go to Home to download some movies!</p>';
    return;
  }

  downloads.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="imag"><img src="${item.image}" alt="${item.title}"></div>
      <div class="desc">${item.description}</div>
      <div class="title">${item.title}</div>
      <div class="box">
        <i class="fa-solid fa-heart" id="navbarHeart"></i>
        <button class="btn download-btn downloaded" data-title="${item.title}">
          <i class="fa-solid fa-download"></i> Downloaded
        </button>
      </div>
    `;
    downloadContainer.appendChild(card);
  });
});
