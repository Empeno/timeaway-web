// GraphQL endpoint
const graphqlEndpoint = "/data-api/graphql";
const restEndpoint = "/data-api/rest/HolidayRequest";

let allHolidayRequests = []; // Store all requests globally for filtering

// Fetch and display holiday requests
async function fetchHolidayRequests() {
  const query = `
    {
      holidayRequests(orderBy: { HolidayStartDate: ASC }) {
        items {
          HolidayRequestId
          Driver
          HolidayStartDate
          HolidayEndDate
          Email
          VehicleNumber
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
    allHolidayRequests = data.holidayRequests.items; // Store all requests globally
    displayHolidayRequests(allHolidayRequests); // Display all requests initially
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

  // Helper function to format dates as dd/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Create the table structure
  container.innerHTML = `
    <div class="bg-white p-4 rounded shadow-sm">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Driver</th>
            <th>Fleet Number</th>
            <th>Trailer Number</th>
            <th>Description</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          ${requests
            .map(
              (request, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${request.Driver || "N/A"}</td>
              <td>${request.FleetNumber || "N/A"}</td>
              <td>${request.TrailerNumber || "N/A"}</td>
              <td>${request.Description || "N/A"}</td>
              <td>
                ${
                  Array.isArray(request.DamageReportFileNames?.items) &&
                  request.DamageReportFileNames.items.length > 0
                    ? request.DamageReportFileNames.items
                        .map(
                          (file) =>
                            `<a href="#" onclick="showImage('${file.FileName}')" class="text-decoration-none">View</a>`
                        )
                        .join(", ")
                    : "No files"
                }
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}





// Approve a holiday request
async function approveRequest(holidayRequestId) {
  
  const base64Token = "Q2FzcGVyVDoxYTQwZDI4ZC0yZGZhLTQ2MzAtYmI3ZS1iNDdjOTM2MTU2MGU=";

  const response = await fetch("https://api.cpsms.dk/v2/send", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${base64Token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: "4551850553",
      message: "Hello from CPSMS!",
      from: "CPSMS"
    })
  });

  const result = await response.text();
  //document.getElementById("smsResult").innerText = `Status: ${response.status}\n${result}`;
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
populateRequestTypeDropdown(); // Ensure this is called

async function openUpdateModal(holidayRequestId) {
  try {
    const endpoint = '/data-api/rest/HolidayRequest/HolidayRequestId';
    const requestTypeEndpoint = '/data-api/rest/RequestType'; // Endpoint to fetch request types

    // Fetch the holiday request
    const response = await fetch(`${endpoint}/${holidayRequestId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const request = data.value[0]; // Access the first item in the "value" array

    if (!request) {
      throw new Error("Holiday request not found.");
    }

    // Populate the modal with the fetched data
    document.getElementById("updateHolidayRequestId").value = request.HolidayRequestId;
    document.getElementById("updateDriverName").value = request.Driver;
    document.getElementById("updateHolidayStartDate").value = request.HolidayStartDate.split("T")[0];
    document.getElementById("updateHolidayEndDate").value = request.HolidayEndDate.split("T")[0];
    document.getElementById("updateRemark").value = request.Remark || "";

    // Fetch and populate request types
    const requestTypeResponse = await fetch(requestTypeEndpoint);
    if (!requestTypeResponse.ok) {
      throw new Error(`HTTP error! Status: ${requestTypeResponse.status}`);
    }
    const requestTypes = await requestTypeResponse.json();
    const requestTypeSelect = document.getElementById("updateRequestTypeId");
    requestTypeSelect.innerHTML = ""; // Clear existing options

    requestTypes.value.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.RequestTypeId;
      option.textContent = type.RequestTypeName;
      if (type.RequestTypeId === request.RequestTypeId) {
        option.selected = true; // Pre-select the current request type
      }
      requestTypeSelect.appendChild(option);
    });

    // Show the modal
    const updateModal = new bootstrap.Modal(document.getElementById("updateHolidayRequestModal"));
    updateModal.show();
  } catch (error) {
    console.error("Error fetching holiday request:", error);
    alert("Failed to load the holiday request. Please try again.");
  }
}

async function updateHolidayRequest(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const holidayRequestId = document.getElementById("updateHolidayRequestId").value;
  const driverName = document.getElementById("updateDriverName").value.trim();
  const holidayStartDate = document.getElementById("updateHolidayStartDate").value;
  const holidayEndDate = document.getElementById("updateHolidayEndDate").value;
  const remark = document.getElementById("updateRemark").value.trim();
  const requestTypeId = document.getElementById("updateRequestTypeId").value;

  if (!driverName || !holidayStartDate || !holidayEndDate) {
    alert("All fields except remarks are required.");
    return;
  }

  const data = {
    Driver: driverName,
    HolidayStartDate: holidayStartDate,
    HolidayEndDate: holidayEndDate,
    Remark: remark || null,
    RequestTypeId: requestTypeId,
  };

  try {
    const response = await fetch(`${restEndpoint}/HolidayRequestId/${holidayRequestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Request updated successfully!");
    const updateModal = bootstrap.Modal.getInstance(document.getElementById("updateHolidayRequestModal"));
    updateModal.hide();
    fetchHolidayRequests(); // Refresh the list
  } catch (error) {
    console.error("Error updating request:", error);
    alert("Failed to update the request. Please try again.");
  }
}

// Attach the update form submission handler
document.getElementById("update-holiday-request-form").addEventListener("submit", updateHolidayRequest);

async function populateRequestTypeDropdown() {
  const requestTypeEndpoint = '/data-api/rest/RequestType';

  try {
    const response = await fetch(requestTypeEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const requestTypes = data.value; // Assuming the API returns a "value" array

    const dropdown = document.getElementById("filterRequestType");
    requestTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.RequestTypeId;
      option.textContent = type.RequestTypeName;
      dropdown.appendChild(option);
    });

    // Add event listener to filter requests when the dropdown value changes
    dropdown.addEventListener("change", filterHolidayRequests);
  } catch (error) {
    console.error("Error fetching request types:", error);
  }
}

function filterHolidayRequests() {
  const selectedRequestTypeId = document.getElementById("filterRequestType").value;

  // Filter requests based on the selected request type
  const filteredRequests = selectedRequestTypeId
    ? allHolidayRequests.filter(
        (request) => request.RequestType.RequestTypeId === parseInt(selectedRequestTypeId, 10)
      )
    : allHolidayRequests; // Show all requests if no filter is selected

  displayHolidayRequests(filteredRequests);
}