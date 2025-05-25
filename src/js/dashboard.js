const restEndpoint = "/data-api/rest/HolidayRequest";

async function fetchDashboardData() {
  try {
    const response = await fetch(restEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayDashboardData(data.value);
    displayUpcomingHolidays(data.value);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    alert("Failed to load dashboard data. Please try again later.");
  }
}

// Display dashboard stats
function displayDashboardData(requests) {
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(req => req.IsApproved === true || req.IsApproved === 1).length;
  const pendingRequests = totalRequests - approvedRequests;

  document.getElementById("total-requests").textContent = totalRequests;
  document.getElementById("approved-requests").textContent = approvedRequests;
  document.getElementById("pending-requests").textContent = pendingRequests;
}

// Display upcoming holidays (without type column)
function displayUpcomingHolidays(requests) {
  const today = new Date();
  const upcoming = requests
    .filter(req => new Date(req.HolidayStartDate) >= today)
    .sort((a, b) => new Date(a.HolidayStartDate) - new Date(b.HolidayStartDate))
    .slice(0, 5);

  const container = document.getElementById("upcoming-holidays");

  if (!upcoming || upcoming.length === 0) {
    container.innerHTML = `<div class="alert alert-info mb-0">No upcoming holidays.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Driver</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${upcoming
            .map(
              req => `
                <tr>
                  <td>${req.Driver || "N/A"}</td>
                  <td>${formatDate(req.HolidayStartDate)}</td>
                  <td>${formatDate(req.HolidayEndDate)}</td>
                  <td>${req.Remark ? req.Remark.replace(/\n/g, "<br>") : ""}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Helper to format date as YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

// Initialize
fetchDashboardData();