const graphqlEndpoint = "/data-api/graphql";

// Fetch and display condition reports
async function fetchConditionReports() {
  const query = `
    {
      damageReports {
        items {
          Id
          Driver
          FleetNumber
          TrailerNumber
          Description   
            DamageReportFileNames {
                items {
                    FileName
                }
                
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
    const reports = data.damageReports.items; // Access the "items" array
    displayConditionReports(reports);
  } catch (error) {
    console.error("Error fetching condition reports:", error);
    document.getElementById("condition-reports").innerHTML = `
      <div class="alert alert-danger" role="alert">
        Error loading condition reports. Please try again later.
      </div>`;
  }
}

// Display condition reports in a table
function displayConditionReports(reports) {
  const container = document.getElementById("condition-reports");

  if (!Array.isArray(reports) || reports.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info" role="alert">
        No condition reports found.
      </div>`;
    return;
  }

  // Create the table structure
  container.innerHTML = `
    <table class="table table-striped table-hover">
      <thead class="table-dark">
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
        ${reports
          .map(
            (report, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${report.Driver || "N/A"}</td>
            <td>${report.FleetNumber || "N/A"}</td>
            <td>${report.TrailerNumber || "N/A"}</td>
            <td>${report.Description || "N/A"}</td>
            <td>
              ${
                Array.isArray(report.DamageReportFileNames?.items) &&
                report.DamageReportFileNames.items.length > 0
                  ? report.DamageReportFileNames.items
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
  `;
}

function showImage(fileName) {
  const imageViewer = document.getElementById("image-viewer");

  // Clear any existing content
  imageViewer.innerHTML = "";

  // Create an image element
  const img = document.createElement("img");
  img.src = fileName;
  img.alt = "Condition Report Image";
  img.className = "image-preview"; // Use the custom CSS class

  // Append the image to the viewer
  imageViewer.appendChild(img);

  // Optionally, scroll to the image
  imageViewer.scrollIntoView({ behavior: "smooth" });
}

// Initialize
fetchConditionReports();