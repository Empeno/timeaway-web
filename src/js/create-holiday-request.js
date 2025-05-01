// API endpoints
const requestTypeEndpoint = "/data-api/rest/RequestType"; // Endpoint to fetch request types
const createRequestEndpoint = "/data-api/rest/HolidayRequest"; // Endpoint to create holiday requests

// Populate the Request Type dropdown
async function populateRequestTypes() {
  try {
    const response = await fetch(requestTypeEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const requestTypes = await response.json();
    const requestTypeDropdown = document.getElementById("requestType");

    requestTypes.value.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.RequestTypeId; // Use RequestTypeId as the value
      option.textContent = type.RequestTypeName; // Display RequestTypeName as the label
      requestTypeDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching request types:", error);
    alert("Failed to load request types. Please try again.");
  }
}

// Handle form submission to create a new holiday request
async function createHolidayRequest(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const driverName = document.getElementById("driverName").value.trim();
  const holidayStartDate = document.getElementById("holidayStartDate").value;
  const holidayEndDate = document.getElementById("holidayEndDate").value;
  const requestTypeId = document.getElementById("requestType").value; // Get the selected RequestTypeId
  const remark = document.getElementById("remark").value.trim();

  if (!driverName || !holidayStartDate || !holidayEndDate || !requestTypeId) {
    alert("All fields except remarks are required.");
    return;
  }

  const data = {
    Driver: driverName,
    HolidayStartDate: holidayStartDate,
    HolidayEndDate: holidayEndDate,
    RequestTypeId: parseInt(requestTypeId, 10), // Ensure the ID is sent as an integer
    Remark: remark || null,
  };

  try {
    const response = await fetch(createRequestEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Holiday request created successfully!");
    document.getElementById("create-holiday-request-form").reset(); // Reset the form
  } catch (error) {
    console.error("Error creating holiday request:", error);
    alert("Failed to create holiday request. Please try again.");
  }
}

// Initialize
document.getElementById("create-holiday-request-form").addEventListener("submit", createHolidayRequest);
populateRequestTypes(); // Populate the dropdown on page load