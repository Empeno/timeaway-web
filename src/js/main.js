// API endpoint
const apiEndpoint = "https://htemailfunction.azurewebsites.net/api/GetHolidayRequests?code=4aFS/po6AfAvAOMOPD5Cdy6lfRv3HpLRtX7TJ45xquO1I/GB2flV6g==";

// Fetch and display holiday requests
async function fetchHolidayRequests() {
  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayHolidayRequests(data);
  } catch (error) {
    console.error("Error fetching holiday requests:", error);
    document.getElementById("holiday-requests").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Error loading holiday requests. Please try again later.
      </div>`;
  }
}

// Display holiday requests in the DOM
function displayHolidayRequests(requests) {
  const container = document.getElementById("holiday-requests");
  if (requests.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info" role="alert">
        No holiday requests found.
      </div>`;
    return;
  }

  requests.forEach((request) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${request.driver || "N/A"}</h5>
          <p class="card-text">
            <strong>Start Date:</strong> ${new Date(request.holidayStartDate).toLocaleDateString()}<br>
            <strong>End Date:</strong> ${new Date(request.holidayEndDate).toLocaleDateString()}<br>
            <strong>Type:</strong> ${request.requestType}<br>
            <strong>Remark:</strong> ${request.remark}
          </p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Initialize
fetchHolidayRequests();