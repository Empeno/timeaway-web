// GraphQL endpoint
const graphqlEndpoint = "/data-api/graphql";
const restEndpoint = "/data-api/rest/HolidayRequest";

// Fetch and display holiday requests
async function fetchHolidayRequests() {
  const query = `
    {
      holidayRequests {
        items {
          HolidayRequestId
          Driver
          HolidayStartDate
          HolidayEndDate
          Remark
          RequestType {
            RequestTypeId
            RequestTypeName
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();
    const requests = data.holidayRequests.items; // Access the "items" array
    displayHolidayRequests(requests);
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
  if (!Array.isArray(requests) || requests.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info" role="alert">
        No holiday requests found.
      </div>`;
    return;
  }

  container.innerHTML = ""; // Clear previous content

  requests.forEach((request) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${request.Driver || "N/A"}</h5>
          <p class="card-text">
            <strong>Start Date:</strong> ${new Date(request.HolidayStartDate).toLocaleDateString()}<br>
            <strong>End Date:</strong> ${new Date(request.HolidayEndDate).toLocaleDateString()}<br>
            <strong>Remark:</strong> ${request.Remark || "N/A"}<br />
            <strong>Request Type:</strong> ${request.RequestType.RequestTypeName || "N/A"}
          </p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-danger btn-sm" onclick="deleteRequest(${request.HolidayRequestId})">Delete</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Approve a holiday request
async function approveRequest(driver, holidayStartDate) {
  if (!confirm("Are you sure you want to approve this request?")) return;

  try {
    const response = await fetch(approveEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver, holidayStartDate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Request approved successfully!");
    fetchHolidayRequests(); // Refresh the list
  } catch (error) {
    console.error("Error approving request:", error);
    alert("Failed to approve the request. Please try again.");
  }
}

// Delete a holiday request
async function deleteRequest(holidayRequestId) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  const endpoint = '/data-api/rest/HolidayRequest/HolidayRequestId';

  try {
    const response = await fetch(`${endpoint}/${holidayRequestId}`, {
      method: "DELETE"      
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Request deleted successfully!");
    fetchHolidayRequests(); // Refresh the list
  } catch (error) {
    console.error("Error deleting request:", error);
    alert("Failed to delete the request. Please try again.");
  }
}

// Initialize
fetchHolidayRequests();