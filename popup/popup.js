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
  const ui = document.createElement("div");
  ui.className = "container";

  // personal title
  const personalTitle = document.createElement("div");
  personalTitle.textContent = "개인 법카";
  personalTitle.className = "title";

  // personal total
  const pTotalDiv = document.createElement("div");

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

  const pRemainLabel = document.createElement("span");
  pRemainLabel.innerText = "잔여 금액";
  pRemainLabel.className = "label";

  const pRemainValue = document.createElement("span");
  pRemainValue.innerText = (personalTotal - personalSpend).toLocaleString();
  pRemainValue.className = "value";

  pRemainDiv.appendChild(pRemainLabel);
  pRemainDiv.appendChild(pRemainValue);

  // personal box ui
  const personalBox = document.createElement("div");
  personalBox.className = "box";

  personalBox.appendChild(personalTitle);
  personalBox.appendChild(pTotalDiv);
  personalBox.appendChild(pUsageDiv);
  personalBox.appendChild(pRemainDiv);

  // team title
  const teamTitle = document.createElement("div");
  teamTitle.textContent = "팀비 법카";
  teamTitle.className = "title";

  // team total
  const tTotalDiv = document.createElement("div");

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

  // total title
  const totalTitle = document.createElement("div");
  totalTitle.textContent = "합계";
  totalTitle.className = "title";

  // total total
  const totalDiv = document.createElement("div");

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

  // team box
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
