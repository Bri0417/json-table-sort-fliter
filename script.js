$(document).ready(function () {
    $.getJSON("one_planet_community.json", function (data) {
        console.log(data);
        generateTable(data);
        populateDropdowns(data);

        // Add click event to the table headers for sorting
        $("#dynamic-table thead th").each(function (index) {
            $(this).on("click", function () {
                var isAscending = $(this).hasClass("asc");
                sortTable(index, !isAscending, data); // Toggle the sorting order
                updateArrows($(this), !isAscending); // Update the arrows
            });
        });

        // Add event listener for the search button
        $("#search-button").on("click", function () {
            var searchTerm = $("#global-search").val().toLowerCase().trim();
            var country = $("#filter-country").val();
            var userType = $("#filter-user-type").val();
            var subject = $("#filter-subject").val();

            // Check if all filters are reset
            if (searchTerm === "" && country === "" && userType === "" && subject === "") {
                generateTable(data); // Reset the table to show all data
            } else {
                var filteredData = filterData(data, searchTerm, country, userType, subject);
                generateTable(filteredData);
            }
        });

        // Reset filters when clearing search input or selecting "All" from dropdowns
        $("#global-search, #filter-country, #filter-user-type, #filter-subject").on("change keyup", function () {
            if ($("#global-search").val() === "" && $("#filter-country").val() === "" && $("#filter-user-type").val() === "" && $("#filter-subject").val() === "") {
                generateTable(data); // Reset the table to show all data
            }
        });

        // Optional: Add event listener for Enter key in search input
        $("#global-search").on("keypress", function (e) {
            if (e.which === 13) { // Enter key pressed
                $("#search-button").click();
            }
        });
    });
});

function generateTable(data) {
    var tableBody = $("#dynamic-table tbody");
    tableBody.empty();

    // Loop through the JSON data
    $.each(data.users, function (index, item) {
        var row = $("<tr>");

        // Create table cell for each piece of data
        row.append($("<td>").text(item.id));
        row.append($("<td>").text(item.title));
        row.append($("<td>").text(item.path));
        row.append($("<td>").text(item.user_type));
        row.append($("<td>").text(item.subject));
        row.append($("<td>").text(item.country));
        row.append($("<td>").text(item.short_content));
        row.append($("<td>").text(item.field_of_research));
        row.append($("<td>").text(item.learningpartner));
        row.append($("<td>").text(item.image));

        // Append the row to the table body
        tableBody.append(row);
    });
}

function sortTable(columnIndex, asc, data) {
    var sortedData = data.users.sort(function (a, b) {
        var aValue = Object.values(a)[columnIndex];
        var bValue = Object.values(b)[columnIndex];

        // Handle case-insensitive sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (asc) {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });

    generateTable({ users: sortedData });
}

function updateArrows(th, isAscending) {
    $("#dynamic-table thead th").removeClass("asc desc").find(".arrow").remove(); // Remove previous arrows

    if (isAscending) {
        th.removeClass("desc").addClass("asc").append(' <span class="arrow up-arrow">&#9650;</span>'); // Up arrow
    } else {
        th.removeClass("asc").addClass("desc").append(' <span class="arrow down-arrow">&#9660;</span>'); // Down arrow
    }
}

function filterData(data, searchTerm, country, userType, subject) {
    var isNumber = !isNaN(searchTerm) && searchTerm.trim() !== '';

    var filteredUsers = data.users.filter(function (item) {
        var matchesSearchTerm = Object.values(item).some(function (value) {
            if (typeof value === "string") {
                return value.toLowerCase().includes(searchTerm);
            } else if (typeof value === "number") {
                return isNumber && value.toString().includes(searchTerm);
            }
            return false;
        });

        var matchesCountry = country === "" || item.country === country;
        var matchesUserType = userType === "" || item.user_type === userType;
        var matchesSubject = subject === "" || item.subject === subject;

        return matchesSearchTerm && matchesCountry && matchesUserType && matchesSubject;
    });

    return { users: filteredUsers };
}

function populateDropdowns(data) {
    var countries = new Set();
    var userTypes = new Set();
    var subjects = new Set();

    $.each(data.users, function (index, item) {
        countries.add(item.country);
        userTypes.add(item.user_type);
        subjects.add(item.subject);
    });

    var countrySelect = $("#filter-country");
    var userTypeSelect = $("#filter-user-type");
    var subjectSelect = $("#filter-subject");

    countries.forEach(function (country) {
        countrySelect.append($('<option>').text(country).val(country));
    });

    userTypes.forEach(function (userType) {
        userTypeSelect.append($('<option>').text(userType).val(userType));
    });

    subjects.forEach(function (subject) {
        subjectSelect.append($('<option>').text(subject).val(subject));
    });
}
