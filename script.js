
/* ========================================
   DARK MODE
======================================== */

// Get the theme toggle button
var themeToggle = document.getElementById("theme-toggle");

// Retrieve saved theme preference
var savedTheme = null;

try {
    savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
    // Continue without saved preferences if storage is unavailable.
}

// Apply saved theme when the page loads
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

// Update the toggle button's appearance and accessibility labels
function updateThemeToggle(darkMode) {
    if (!themeToggle) {
        return;
    }

    themeToggle.setAttribute("aria-pressed", darkMode ? "true" : "false");

    themeToggle.setAttribute(
        "aria-label",
        darkMode ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.innerHTML = darkMode
        ? '<span aria-hidden="true">☀</span>'
        : '<span aria-hidden="true">☾</span>';
}

// Synchronize the toggle with the current theme
updateThemeToggle(document.body.classList.contains("dark-mode"));

// Toggle theme and save the preference
if (themeToggle) {
    themeToggle.addEventListener("click", function() {
        var darkMode = document.body.classList.toggle("dark-mode");

        updateThemeToggle(darkMode);

        try {
            localStorage.setItem(
                "portfolio-theme",
                darkMode ? "dark" : "light"
            );
        } catch (error) {
            // Theme still works if storage is unavailable.
        }
    });
}


/* ========================================
   ACCESSIBLE PROJECT DROPDOWNS
======================================== */

// These are disclosure buttons, not ARIA application menus.
(function() {
    var dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    function setDropdownState(toggle, expanded) {
        var menuId = toggle.getAttribute("aria-controls");
        var menu = document.getElementById(menuId);
        var menuLabel = toggle.getAttribute("data-menu-label") || "project links";

        if (!menu) {
            return;
        }

        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");

        toggle.setAttribute(
            "aria-label",
            (expanded ? "Hide " : "Show ") + menuLabel
        );

        menu.hidden = !expanded;
    }

    // Close all dropdowns except the one being opened
    function closeAllDropdowns(exceptToggle) {
        dropdownToggles.forEach(function(toggle) {
            if (toggle !== exceptToggle) {
                setDropdownState(toggle, false);
            }
        });
    }

    // Toggle dropdowns when clicked
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener("click", function() {
            var isExpanded = toggle.getAttribute("aria-expanded") === "true";

            closeAllDropdowns(toggle);
            setDropdownState(toggle, !isExpanded);
        });
    });

    // Escape closes an open dropdown and returns focus to its toggle button
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            dropdownToggles.forEach(function(toggle) {
                if (toggle.getAttribute("aria-expanded") === "true") {
                    setDropdownState(toggle, false);
                    toggle.focus();
                }
            });
        }
    });

    // Close dropdowns when a user clicks outside the navigation
    document.addEventListener("click", function(event) {
        if (!event.target.closest("#menu-wrapper")) {
            closeAllDropdowns();
        }
    });

    // Close dropdowns when keyboard focus moves outside the navigation
    document.addEventListener("focusin", function(event) {
        if (!event.target.closest("#menu-wrapper")) {
            closeAllDropdowns();
        }
    });
})();
