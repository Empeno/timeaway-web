// Generate the navigation bar
function generateNavbar() {
  const navbarContainer = document.getElementById("navbar-container");

  navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">Time Away</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="holiday-requests.html">Holiday Requests</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}

// Initialize the menu
generateNavbar();