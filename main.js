
let history = [], prediction = null, capital = 0, profit = 0, count = 0, allSessions = [];

function addResult(res) {
  if (!capital) {
    capital = parseFloat(document.getElementById("capitalInput").value || 0);
  }
  const bet = parseFloat(document.getElementById("betInput").value || 0);
  if (!capital || !bet) {
    alert("⚠️ Vui lòng nhập vốn và tiền cược.");
    return;
  }

  if (prediction && count < 15) {
    profit += (prediction === res) ? bet : -bet;
    count++;
    prediction = null;
  }

  history.push(res);
  updateDisplay();
}

function predict() {
  if (history.length < 2) {
    document.getElementById("output").innerText = "⛔ Chưa đủ dữ liệu.";
    return;
  }

  const last2 = history.slice(-2);
  const last10 = history.slice(-10);
  const countT = last10.filter(x => x === "Tài").length;
  const countX = last10.filter(x => x === "Xỉu").length;

  let rule1 = false, rule2 = false;
  if (last2[0] === last2[1]) {
    rule1 = true;
    prediction = last2[1];
  }

  if (countT >= 7) {
    rule2 = true;
    prediction = "Xỉu";
  } else if (countX >= 7) {
    rule2 = true;
    prediction = "Tài";
  }

  let msg = prediction ? `➡️ Dự đoán: ${prediction}
` : "❌ Không đủ điều kiện.";
  if (rule1) msg += "✔ Cầu gần nhất giống nhau
";
  if (rule2) msg += `✔ Lệch xác suất (Tài: ${countT}, Xỉu: ${countX})`;
  document.getElementById("output").innerText = msg;
}

function updateDisplay() {
  const percent = capital > 0 ? (profit / capital * 100).toFixed(2) : 0;
  let msg = `📜 Lịch sử (${history.length}): ${history.join(", ")}
💵 Lợi nhuận: ${profit.toLocaleString()} VND
🎯 Cược: ${count}/15`;

  if (percent >= 20) msg += "
✅ Lời +20% → Dừng phiên";
  if (percent <= -10) msg += "
❌ Lỗ -10% → Dừng phiên";
  if (count >= 15) msg += "
⛔ Đã cược đủ 15 lần";

  document.getElementById("summary").innerText = msg;

  if ((percent >= 20 || percent <= -10 || count >= 15) && history.length > 0) {
    saveSession();
  }
}

function resetSession() {
  capital = 0;
  prediction = null;
  profit = 0;
  count = 0;
  history = [];
  document.getElementById("capitalInput").value = "";
  document.getElementById("betInput").value = "";
  document.getElementById("sessionName").value = "";
  document.getElementById("output").innerText = "";
  updateDisplay();
}

function saveSession() {
  const name = document.getElementById("sessionName").value || `Phiên ${allSessions.length + 1}`;
  const session = {
    Phiên: name,
    Ngày: new Date().toLocaleString(),
    Vốn: capital,
    Cược: parseFloat(document.getElementById("betInput").value),
    Lợi_nhuận: profit,
    Lượt: count,
    Lịch_sử: history.join(", ")
  };
  allSessions.push(session);
  showHistory();
  resetSession();
}

function showHistory() {
  let out = `🗂 Lịch sử các phiên:
`;
  allSessions.forEach((s, i) => {
    out += `#${i + 1} - ${s.Phiên}: ${s.Lợi_nhuận.toLocaleString()} VND (${s.Lượt} ván)
`;
  });
  document.getElementById("history").innerText = out;
}

function exportExcel() {
  if (allSessions.length === 0) {
    alert("Chưa có phiên nào.");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(allSessions);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LichSu");
  XLSX.writeFile(wb, "LichSu_TaiXiu.xlsx");
}
