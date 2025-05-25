// Generate the navigation bar
function generateNavbar() {
  const navbarContainer = document.getElementById("navbar-container");

  navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Time Away</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/holiday-requests">Holiday Requests</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/request-types">Request Types</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/create-holiday-request">Create Holiday Request</a>
            </li>           
          </ul>
        </div>
      </div>
    </nav>
  `;
}

// Initialize the menu
generateNavbar();