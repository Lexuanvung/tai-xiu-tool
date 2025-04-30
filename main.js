let history = [];
let betHistory = [];
let capital = 0;
let profit = 0;
let betLimit = 15;
let lastPrediction = null;
let currentBet = null;

function updateDisplay() {
  // Hiển thị lịch sử
  document.getElementById("historyDisplay").textContent = history.join(", ") || "Chưa có dữ liệu";

  // Tính chiến lược
  let strategyOutput = "";
  let last3 = history.slice(-3);
  let last10 = history.slice(-10);
  let count = arr => arr.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
  let c10 = count(last10);
  let t = c10["Tài"] || 0;
  let x = c10["Xỉu"] || 0;
  lastPrediction = null;

  if (last3.length === 3 && last3[0] === last3[1] && last3[1] === last3[2]) {
    strategyOutput += `📘 Cầu 3 ván giống nhau ➡️ ${last3[2]}\n`;
    lastPrediction = last3[2];
  } else if (last3.length >= 2 && last3[1] === last3[2]) {
    strategyOutput += `📙 Cầu 2 ván giống nhau ➡️ ${last3[2]}\n`;
    lastPrediction = last3[2];
  }

  if (last10.length === 10) {
    if (t >= 7) {
      strategyOutput += `📕 Tài quá nhiều (${t}/10) ➡️ Xỉu\n`;
      lastPrediction = "Xỉu";
    } else if (x >= 7) {
      strategyOutput += `📕 Xỉu quá nhiều (${x}/10) ➡️ Tài\n`;
      lastPrediction = "Tài";
    }
  }

  // Cập nhật chiến lược + dự đoán cuối cùng
  document.getElementById("strategyDisplay").textContent =
    (strategyOutput || "Chưa có chiến lược phù hợp.") +
    (lastPrediction ? `\n➡️ Dự đoán cuối cùng: ${lastPrediction}` : "");

  // Vốn
  document.getElementById("capitalDisplay").textContent = capital ? capital.toLocaleString() + " VND" : "Chưa nhập";

  // Lãi/lỗ
  document.getElementById("profitDisplay").textContent = profit.toLocaleString() + " VND";

  // Thông tin phiên
  document.getElementById("sessionInfoDisplay").textContent =
    `${betHistory.length}/${betLimit} lần cược\n` +
    (profit >= capital * 0.2 ? "✅ Đạt +20%" :
     profit <= capital * -0.1 ? "❌ Lỗ -10%" : "Đang chơi...");
}

function addResult(result) {
  if (capital === 0) {
    capital = parseInt(document.getElementById("initialCapital").value);
    if (!capital || capital <= 0) {
      alert("Vui lòng nhập vốn hợp lệ.");
      return;
    }
  }

  if (currentBet && betHistory.length < betLimit) {
    let betAmount = parseInt(document.getElementById("betAmount").value) || 100000;
    let win = result === currentBet;
    profit += win ? betAmount : -betAmount;
    betHistory.push({ bet: currentBet, actual: result, result: win ? "✅ Thắng" : "❌ Thua" });
    alert(`${win ? "✅ Thắng" : "❌ Thua"} - Đoán: ${currentBet}, KQ: ${result}`);
    currentBet = null;
  }

  history.push(result);
  updateDisplay();
}

function placeBet() {
  if (!lastPrediction) return alert("Chưa có dự đoán hợp lệ.");
  if (currentBet) return alert("Đã cược, nhập kết quả tiếp theo.");
  currentBet = lastPrediction;
  alert("🎯 Đã cược theo: " + currentBet);
}

function deleteLast() {
  if (history.length === 0) return alert("Không có gì để xóa.");
  history.pop();
  if (betHistory.length > 0) {
    let b = betHistory.pop();
    let betAmount = parseInt(document.getElementById("betAmount").value) || 100000;
    profit -= b.result === "✅ Thắng" ? betAmount : -betAmount;
  }
  updateDisplay();
}

function resetSession() {
  if (!confirm("Reset toàn bộ phiên?")) return;
  history = [];
  betHistory = [];
  capital = 0;
  profit = 0;
  currentBet = null;
  lastPrediction = null;
  document.getElementById("initialCapital").value = "";
  document.getElementById("sessionName").value = "";
  document.getElementById("betAmount").value = "";
  updateDisplay();
}

function editResult() {
  alert("✏️ Tính năng Edit đang được phát triển.");
}

function saveSession() {
  alert("💾 Tính năng Save sẽ bổ sung sau.");
}

function loadSession() {
  alert("📂 Tính năng Load sẽ bổ sung sau.");
}
