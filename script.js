document.addEventListener('DOMContentLoaded', async () => {
    const competitionsDiv = document.getElementById('competitions');
    const matchesDiv = document.getElementById('matches');
    const upcomingMessage = document.getElementById('upcomingmatches');
    const competitionMessage = document.getElementById('comps');
    const loadingMatches = document.getElementById('loadingmatches');

    async function fetchCompetitions() {
        try {
            competitionMessage.innerHTML = `<p>
  <img src="loading/loading.gif" alt="Loading" style="vertical-align: middle; height:28px"> 
  Loading competitions...
</p>
`;
            const response = await fetch('http://localhost:3000/competitions');
            const competitions = await response.json();
            competitionMessage.textContent = '✦ Football Competitions ✦';

            competitionsDiv.innerHTML = '';

            competitions.forEach(competition => {
                const button = document.createElement('button');
                button.textContent = '';  // Clear any default text

                // Create a div to hold the logo and name
                const container = document.createElement('div');
                container.style.textAlign = 'center';  // Centers the content inside the button

                // Add logo to the container
                const img = document.createElement('img');
                img.src = competition.emblem;  // Use the logo URL fetched from the server
                img.alt = competition.name;  // Use the competition name as alt text
                img.width = 100;
                img.height = 100;  // Adjust size as necessary
                container.appendChild(img);

                // Add competition name below the image
                const name = document.createElement('div');
                name.textContent = competition.name;
                name.style.marginTop = '10px';  // Add some space between the logo and name
                container.appendChild(name);

                button.appendChild(container);  // Add the container with image and name to the button

                button.onclick = () => fetchMatches(competition.id);
                competitionsDiv.appendChild(button);
            });

        } catch (error) {
            console.error('Error during fetching competitions:', error.message);
            competitionMessage.textContent = 'Error loading competitions.';
        }
    }

    async function fetchMatches(competitionId) {
        try {
            upcomingMessage.innerHTML = `<p>
            <img src="loading/loading.gif" alt="Loading" style="vertical-align: middle; height:28px"> 
            Loading matches...
          </p>
          `;
            const response = await fetch(`http://localhost:3000/matches/${competitionId}`);
            const data = await response.json();

            if (data.message === 'No upcoming matches for this competition') {
                upcomingMessage.textContent = "No upcoming matches for this competition.";
            } else {
                upcomingMessage.textContent = "✦ Upcoming Matches ✦";
                matchesDiv.innerHTML = '';
                if (data.message) {
                    const noMatchesMessage = document.createElement('p');
                    noMatchesMessage.textContent = data.message;
                    matchesDiv.appendChild(noMatchesMessage);
                    return;
                }

                loadingMatches.textContent = '';

                data.forEach(match => {
                    const matchButton = document.createElement('button');
                    matchButton.classList.add('match-button');
                    const formattedDate = new Date(match.utcDate).toLocaleString('en-US', {
                        weekday: 'long',   // Day of the week (e.g., 'Monday')
                        year: 'numeric',   // Full year (e.g., 2025)
                        month: 'long',     // Full month name (e.g., 'January')
                        day: 'numeric',    // Day of the month (e.g., 3)
                        hour: '2-digit',   // 12-hour format hour (e.g., 02 or 2)
                        minute: '2-digit', // 2-digit minutes (e.g., 30)
                        hour12: true       // Use 12-hour clock (AM/PM)
                    });
                    matchButton.innerHTML = `

                          <div class="match-info">
    <img src="${match.homeTeam.logo}" alt="Home Team Logo">
    
    <div class="match-teams">
      <p><strong>${match.homeTeam.name}</strong></p>
      <p><strong>vs</strong></p>
      <p><strong>${match.awayTeam.name}</strong></p>
    </div>

    <img src="${match.awayTeam.logo}" alt="Away Team Logo">
  </div>

  <p class="match-time"><strong>${formattedDate}</strong></p>

                        
                    
                `;

                    matchButton.onclick = () => {
                        localStorage.setItem('selectedMatch', JSON.stringify(match));
                        window.location.href = 'match-details.html';
                    };

                    matchesDiv.appendChild(matchButton);
                })
            }

        } catch (error) {
            console.error('Error fetching matches:', error.message);
            upcomingMessage.textContent = 'Error loading matches.';
        }
    }



    await fetchCompetitions();
});