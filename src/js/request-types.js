// Fetch and display request types
async function listRequestTypes() {
  const endpoint = '/data-api/rest/RequestType';
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayRequestTypes(data.value);
  } catch (error) {
    console.error("Error fetching request types:", error);
    document.getElementById("request-types").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Error loading request types. Please try again later.
      </div>`;
  }
}

// Display request types in the DOM
function displayRequestTypes(requestTypes) {
  const container = document.getElementById("request-types");
  container.innerHTML = ""; // Clear previous content

  if (requestTypes.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info" role="alert">
        No request types found.
      </div>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-striped table-bordered";

  // Table header
  table.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      ${requestTypes
        .map(
          (type) => `
        <tr>
          <td>${type.RequestTypeId}</td>
          <td>${type.RequestTypeName}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  container.appendChild(table);
}

// Handle form submission to create a new request type
async function createRequestType(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const requestTypeName = document.getElementById("requestTypeName").value.trim();

  if (!requestTypeName) {
    alert("Request Type Name is required.");
    return;
  }

  const data = {
    RequestTypeName: requestTypeName,
  };

  const endpoint = '/data-api/rest/RequestType/';
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Request type created successfully!");
    document.getElementById("create-request-type-form").reset(); // Reset the form
    listRequestTypes(); // Refresh the list of request types
  } catch (error) {
    console.error("Error creating request type:", error);
    alert("Failed to create request type. Please try again.");
  }
}

// Initialize
document.getElementById("create-request-type-form").addEventListener("submit", createRequestType);
listRequestTypes();