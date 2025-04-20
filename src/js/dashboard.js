// API endpoint
const apiEndpoint = "https://htemailfunction.azurewebsites.net/api/GetHolidayRequests?code=4aFS/po6AfAvAOMOPD5Cdy6lfRv3HpLRtX7TJ45xquO1I/GB2flV6g==";

// Fetch and display dashboard data
async function fetchDashboardData() {
  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayDashboardData(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    alert("Failed to load dashboard data. Please try again later.");
  }
}

// Display dashboard data
function displayDashboardData(requests) {
  const totalRequests = requests.length;
  const approvedRequests = requests.filter((req) => req.status === "Approved").length;
  const pendingRequests = totalRequests - approvedRequests;

  document.getElementById("total-requests").textContent = totalRequests;
  document.getElementById("approved-requests").textContent = approvedRequests;
  document.getElementById("pending-requests").textContent = pendingRequests;
}

// Initialize
fetchDashboardData();