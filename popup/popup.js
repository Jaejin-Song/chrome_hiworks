const publicHolidays = {
  "2024-01-01": ["1월 1일"],
  "2024-02-09": ["설날 전날"],
  "2024-02-10": ["설날"],
  "2024-02-11": ["설날 다음 날"],
  "2024-02-12": ["대체공휴일(설날)"],
  "2024-03-01": ["3ㆍ1절"],
  "2024-04-10": ["제22대국회의원선거"],
  "2024-05-05": ["어린이날"],
  "2024-05-06": ["대체공휴일(어린이날)"],
  "2024-05-15": ["부처님 오신 날"],
  "2024-06-06": ["현충일"],
  "2024-08-15": ["광복절"],
  "2024-09-16": ["추석 전날"],
  "2024-09-17": ["추석"],
  "2024-09-18": ["추석 다음 날"],
  "2024-10-01": ["임시공휴일"],
  "2024-10-03": ["개천절"],
  "2024-10-09": ["한글날"],
  "2024-12-25": ["기독탄신일"],
  "2025-01-01": ["1월 1일"],
  "2025-01-28": ["설날 전날"],
  "2025-01-29": ["설날"],
  "2025-01-30": ["설날 다음 날"],
  "2025-03-01": ["3ㆍ1절"],
  "2025-03-03": ["대체공휴일(3ㆍ1절)"],
  "2025-05-05": ["어린이날", "부처님 오신 날"],
  "2025-05-06": ["대체공휴일(부처님 오신 날)"],
  "2025-06-06": ["현충일"],
  "2025-08-15": ["광복절"],
  "2025-10-03": ["개천절"],
  "2025-10-05": ["추석 전날"],
  "2025-10-06": ["추석"],
  "2025-10-07": ["추석 다음 날"],
  "2025-10-08": ["대체공휴일(추석)"],
  "2025-10-09": ["한글날"],
  "2025-12-25": ["기독탄신일"],
};

let personalTotal = 250000;
let teamTotal = 160000;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { action: "getDOMContent" },
    function (response) {
      if (response && response.result) {
        const pTotalInput = document.getElementById("p-total");
        const tTotalInput = document.getElementById("t-total");

        pTotalInput.value = personalTotal;
        tTotalInput.value = teamTotal;

        chrome.storage.local.get(
          ["personalTotal", "teamTotal"],
          function (data) {
            if (data.personalTotal && data.teamTotal) {
              personalTotal = data.personalTotal;
              teamTotal = data.teamTotal;

              pTotalInput.value = personalTotal;
              tTotalInput.value = teamTotal;

              redrawUI();
            }
          }
        );

        const { personalSpend, teamSpend } = response.result;

        const ui = createUI({
          personalTotal,
          personalSpend,
          teamTotal,
          teamSpend,
        });
        document.getElementById("app").appendChild(ui);

        function redrawUI() {
          document.getElementById("app").innerHTML = "";

          chrome.storage.local.set({ personalTotal, teamTotal });

          const ui = createUI({
            personalTotal,
            personalSpend,
            teamTotal,
            teamSpend,
          });
          document.getElementById("app").appendChild(ui);
        }

        const updateBtn = document.getElementById("update-btn");
        updateBtn.addEventListener("click", redrawUI);
      } else {
        const span = document.createElement("span");
        span.textContent = "비활성화 상태입니다.";
        span.className = "title";

        const btnContainer =
          document.getElementsByClassName("btn-container")[0];
        btnContainer.style.display = "none";
        document.getElementById("app").appendChild(span);
      }
    }
  );
});

function setPersonalTotal(event) {
  const value = event.target.value;

  personalTotal = Number(value);
}
function setTeamTotal(event) {
  const value = event.target.value;

  teamTotal = Number(value);
}

document.getElementById("p-total").addEventListener("input", setPersonalTotal);
document.getElementById("t-total").addEventListener("input", setTeamTotal);

function createUI({ personalTotal, personalSpend, teamTotal, teamSpend }) {
  const { totalBusinessDays, remainingBusinessDays } = calculateBusinessDays();

  const ui = document.createElement("div");
  ui.className = "container";

  // personal title
  const personalTitle = document.createElement("div");
  personalTitle.textContent = "개인 법카";
  personalTitle.className = "title";

  // personal total
  const pTotalDiv = document.createElement("div");
  pTotalDiv.className = "line";

  const pTotalLabel = document.createElement("span");
  pTotalLabel.innerText = "한도 금액";
  pTotalLabel.className = "label";

  const pTotalValue = document.createElement("span");
  pTotalValue.innerText = personalTotal.toLocaleString();
  pTotalValue.className = "value";

  pTotalDiv.appendChild(pTotalLabel);
  pTotalDiv.appendChild(pTotalValue);

  // personal usage
  const pUsageDiv = document.createElement("div");
  pUsageDiv.className = "line";

  const pUsageLabel = document.createElement("span");
  pUsageLabel.innerText = "사용 금액";
  pUsageLabel.className = "label";

  const pUsageValue = document.createElement("span");
  pUsageValue.innerText = personalSpend.toLocaleString();
  pUsageValue.className = "value";

  pUsageDiv.appendChild(pUsageLabel);
  pUsageDiv.appendChild(pUsageValue);

  // personal remain
  const pRemainDiv = document.createElement("div");
  pRemainDiv.className = "line";

  const pRemainLabel = document.createElement("span");
  pRemainLabel.innerText = "잔여 금액";
  pRemainLabel.className = "label";

  const pRemainValue = document.createElement("span");
  pRemainValue.innerText = (personalTotal - personalSpend).toLocaleString();
  pRemainValue.className = "value";

  pRemainDiv.appendChild(pRemainLabel);
  pRemainDiv.appendChild(pRemainValue);

  // personal business day
  const pBusinessDiv = document.createElement("div");
  pBusinessDiv.className = "line";

  const pBusinessLabel = document.createElement("span");
  pBusinessLabel.innerText = "남은 영업일(오늘 포함) / 총 영업일";
  pBusinessLabel.className = "label";

  const pBusinessValue = document.createElement("span");
  pBusinessValue.innerText = `${remainingBusinessDays} / ${totalBusinessDays}`;
  pBusinessValue.className = "value";

  pBusinessDiv.appendChild(pBusinessLabel);
  pBusinessDiv.appendChild(pBusinessValue);

  // personal available account
  const pAvailableDiv = document.createElement("div");
  pAvailableDiv.className = "line";

  const pAvailableLabel = document.createElement("span");
  pAvailableLabel.innerText = "일별 사용가능 금액";
  pAvailableLabel.className = "label";

  const pAvailableValue = document.createElement("span");
  const remainAccount = Math.floor(
    (personalTotal - personalSpend) / remainingBusinessDays
  );
  pAvailableValue.innerText = `${remainAccount.toLocaleString()}`;
  pAvailableValue.className = "value";

  pAvailableDiv.appendChild(pAvailableLabel);
  pAvailableDiv.appendChild(pAvailableValue);

  // personal box ui
  const personalBox = document.createElement("div");
  personalBox.className = "box";

  personalBox.appendChild(personalTitle);
  personalBox.appendChild(pTotalDiv);
  personalBox.appendChild(pUsageDiv);
  personalBox.appendChild(pRemainDiv);
  personalBox.appendChild(pBusinessDiv);
  personalBox.appendChild(pAvailableDiv);

  // --------------------- team ---------------------
  // team title
  const teamTitle = document.createElement("div");
  teamTitle.textContent = "팀비 법카";
  teamTitle.className = "title";

  // team total
  const tTotalDiv = document.createElement("div");
  tTotalDiv.className = "line";

  const tTotalLabel = document.createElement("span");
  tTotalLabel.innerText = "한도 금액";
  tTotalLabel.className = "label";

  const tTotalValue = document.createElement("span");
  tTotalValue.innerText = teamTotal.toLocaleString();
  tTotalValue.className = "value";

  tTotalDiv.appendChild(tTotalLabel);
  tTotalDiv.appendChild(tTotalValue);

  // team usage
  const tUsageDiv = document.createElement("div");
  tUsageDiv.className = "line";

  const tUsageLabel = document.createElement("span");
  tUsageLabel.innerText = "사용 금액";
  tUsageLabel.className = "label";

  const tUsageValue = document.createElement("span");
  tUsageValue.innerText = teamSpend.toLocaleString();
  tUsageValue.className = "value";

  tUsageDiv.appendChild(tUsageLabel);
  tUsageDiv.appendChild(tUsageValue);

  // team remain
  const tRemainDiv = document.createElement("div");
  tRemainDiv.className = "line";

  const tRemainLabel = document.createElement("span");
  tRemainLabel.innerText = "잔여 금액";
  tRemainLabel.className = "label";

  const tRemainValue = document.createElement("span");
  tRemainValue.innerText = (teamTotal - teamSpend).toLocaleString();
  tRemainValue.className = "value";

  tRemainDiv.appendChild(tRemainLabel);
  tRemainDiv.appendChild(tRemainValue);

  // team box
  const teamBox = document.createElement("div");
  teamBox.className = "box";

  teamBox.appendChild(teamTitle);
  teamBox.appendChild(tTotalDiv);
  teamBox.appendChild(tUsageDiv);
  teamBox.appendChild(tRemainDiv);

  // --------------------- total ---------------------
  // total title
  const totalTitle = document.createElement("div");
  totalTitle.textContent = "합계";
  totalTitle.className = "title";

  // total total
  const totalDiv = document.createElement("div");
  totalDiv.className = "line";

  const totalLabel = document.createElement("span");
  totalLabel.innerText = "한도 금액";
  totalLabel.className = "label";

  const totalValue = document.createElement("span");
  totalValue.innerText = (personalTotal + teamTotal).toLocaleString();
  totalValue.className = "value";

  totalDiv.appendChild(totalLabel);
  totalDiv.appendChild(totalValue);

  // total usage
  const totalUsageDiv = document.createElement("div");
  totalUsageDiv.className = "line";

  const totalUsageLabel = document.createElement("span");
  totalUsageLabel.innerText = "사용 금액";
  totalUsageLabel.className = "label";

  const totalUsageValue = document.createElement("span");
  totalUsageValue.innerText = (personalSpend + teamSpend).toLocaleString();
  totalUsageValue.className = "value";

  totalUsageDiv.appendChild(totalUsageLabel);
  totalUsageDiv.appendChild(totalUsageValue);

  // total remain
  const totalRemainDiv = document.createElement("div");
  totalRemainDiv.className = "line";

  const totalRemainLabel = document.createElement("span");
  totalRemainLabel.innerText = "잔여 금액";
  totalRemainLabel.className = "label";

  const totalRemainValue = document.createElement("span");
  totalRemainValue.innerText = (
    personalTotal +
    teamTotal -
    (personalSpend + teamSpend)
  ).toLocaleString();
  totalRemainValue.className = "value";

  totalRemainDiv.appendChild(totalRemainLabel);
  totalRemainDiv.appendChild(totalRemainValue);

  // total box
  const totalBox = document.createElement("div");
  totalBox.className = "box";

  totalBox.appendChild(totalTitle);
  totalBox.appendChild(totalDiv);
  totalBox.appendChild(totalUsageDiv);
  totalBox.appendChild(totalRemainDiv);

  // create ui
  ui.appendChild(personalBox);
  ui.append(teamBox);
  ui.append(totalBox);

  return ui;
}

function getKoreanNow() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const korNow = new Date(utc + koreaTimeDiff);

  return korNow;
}

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 6 || day === 0; // 6 is Saturday, 0 is Sunday
}

// Function to check if a date is a public holiday
function isPublicHoliday(date) {
  const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  return Object.keys(publicHolidays).includes(formattedDate);
}

// Function to calculate both total and remaining business days in the current month (using UTC)
function calculateBusinessDays() {
  let totalBusinessDays = 0;
  let remainingBusinessDays = 0;

  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();

  // Get the first and last day of the month in UTC
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));

  // Iterate through each day of the month in UTC
  for (
    let day = new Date(firstDay);
    day <= lastDay;
    day.setUTCDate(day.getUTCDate() + 1)
  ) {
    const currentDate = new Date(day); // Create a new date object for each day (in UTC)
    if (!isWeekend(currentDate) && !isPublicHoliday(currentDate)) {
      totalBusinessDays++; // Count only weekdays that are not public holidays

      // Only count remaining business days if the day is today or in the future (UTC)
      if (currentDate >= today) {
        remainingBusinessDays++;
      }
    }
  }

  return { totalBusinessDays, remainingBusinessDays };
}
