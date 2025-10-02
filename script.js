document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progess");   
    const mediumProgressCircle = document.querySelector(".medium-progess"); 
    const hardProgressCircle = document.querySelector(".hard-progess");   
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/; 
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            
            const targetUrl = `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(username)}`;
            const response = await fetch(targetUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch the details");
            }

            const parsedData = await response.json();
            console.log("Logging Data:", parsedData);

            if (parsedData.status !== "success") {
                statsContainer.innerHTML = `<p>No data found for this user</p>`;
                return;
            }

            displayUserData(parsedData);
        } catch (error) {
            console.error(error);
            statsContainer.innerHTML = `<p>Error fetching data</p>`;
        } finally {
            searchButton.textContent = "SEARCH"; 
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalEasyQues = parsedData.totalEasy || 0;
        const totalMediumQues = parsedData.totalMedium || 0;
        const totalHardQues = parsedData.totalHard || 0;

        const solvedEasy = parsedData.easySolved || 0;
        const solvedMedium = parsedData.mediumSolved || 0;
        const solvedHard = parsedData.hardSolved || 0;

        updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMedium, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHardQues, hardLabel, hardProgressCircle);
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("logging username", username);
        if (validateUsername(username)) {
            fetchUserDetails(username); 
        }
    });
});
