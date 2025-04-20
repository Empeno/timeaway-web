// API endpoints
const apiEndpoint = "https://htemailfunction.azurewebsites.net/api/GetHolidayRequests?code=4aFS/po6AfAvAOMOPD5Cdy6lfRv3HpLRtX7TJ45xquO1I/GB2flV6g==";
const deleteEndpoint = "https://your-api-endpoint/deleteHolidayRequest";
const approveEndpoint = "https://your-api-endpoint/approveHolidayRequest";

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
          <div class="d-flex justify-content-between">
            <button class="btn btn-success btn-sm" onclick="approveRequest('${request.driver}', '${request.holidayStartDate}')">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRequest('${request.driver}', '${request.holidayStartDate}')">Delete</button>
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
async function deleteRequest(driver, holidayStartDate) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const response = await fetch(deleteEndpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver, holidayStartDate }),
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