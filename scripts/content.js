chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getDOMContent") {
    const result = parse();

    sendResponse({ result: result });
  }

  return true;
});

function parse() {
  const table = document.getElementsByClassName("setting-table")[0];

  const [header, ...body] = table.querySelectorAll("tr");

  // column 추출
  let columns = [];
  const thList = header.querySelectorAll("th");
  thList.forEach((th, index) => {
    if (index === 0) return;

    const span = th
      .getElementsByClassName("icon-button")[0]
      .querySelector("span");
    const text = span.innerText;

    columns.push(text);
  });

  let contents = [];
  body.forEach((tr, index) => {
    if (index === body.length - 1) return;

    const tdList = tr.querySelectorAll("td");

    const num = tdList[3].innerText;

    // 적요
    const extra = tdList[6].querySelector("input").value;

    contents.push({
      num: convertToNumber(num),
      extra,
    });
  });

  const personalSpend = contents.reduce((acc, cur) => {
    if (!cur.extra.includes("팀비")) acc += cur.num;
    return acc;
  }, 0);
  const teamSpend = contents.reduce((acc, cur) => {
    if (cur.extra.includes("팀비")) acc += cur.num;
    return acc;
  }, 0);

  return {
    personalSpend,
    teamSpend,
  };
}

function convertToNumber(commaMarkedStr) {
  const cleanedStr = commaMarkedStr.replace(/,/g, "");

  return parseFloat(cleanedStr);
}
