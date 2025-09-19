// --- 老師設定區 START ---
// 您可以在這裡新增、修改或刪除學生的資料
const studentsData = [
    { name: "小明", stats: { str: 15, int: 20, foc: 18, mor: 10, coop: 12, cre: 8 } },
    { name: "小華", stats: { str: 10, int: 12, foc: 14, mor: 15, coop: 18, cre: 10 } },
    { name: "小美", stats: { str: 22, int: 15, foc: 16, mor: 21, coop: 19, cre: 15 } },
    { name: "志強", stats: { str: 18, int: 28, foc: 20, mor: 16, coop: 22, cre: 25 } },
    { name: "雅玲", stats: { str: 12, int: 22, foc: 25, mor: 22, coop: 25, cre: 18 } }
];
// --- 老師設定區 END ---


// --- 系統核心邏輯區 (通常不需修改) ---

// 等級與稱號設定
const levelTiers = [
    { score: 100, title: "大師級", level: 6 },
    { score: 70, title: "高階鬥士", level: 5 },
    { score: 45, title: "精英挑戰者", level: 4 },
    { score: 25, title: "熟練冒險者", level: 3 },
    { score: 10, title: "初階冒險者", level: 2 },
    { score: 0, title: "新手學徒", level: 1 }
];

// 轉職條件與技能設定
const jobTiers = [
    { 
        name: "智者 (Sage)", 
        skill: "可提供一次作業提示或考試加分卷。",
        condition: (stats) => stats.int >= 25 && stats.cre >= 15
    },
    { 
        name: "守護者 (Guardian)", 
        skill: "可保護組員免於被懲罰一次。",
        condition: (stats) => stats.str >= 20 && stats.mor >= 15
    },
    { 
        name: "協作者 (Diplomat)", 
        skill: "組內衝突時可進行協調並獲加分。",
        condition: (stats) => stats.coop >= 20 && stats.mor >= 20
    }
];

// 六維名稱對照
const statNames = {
    int: "智力 (INT)",
    str: "體力 (STR)",
    foc: "專注 (FOC)",
    mor: "品德 (MOR)",
    coop: "合作 (COOP)",
    cre: "創意 (CRE)"
};

// 計算總分
function calculateTotalScore(stats) {
    return Object.values(stats).reduce((sum, value) => sum + value, 0);
}

// 根據總分計算等級與稱號
function getLevelInfo(totalScore) {
    for (const tier of levelTiers) {
        if (totalScore >= tier.score) {
            return { level: `Lv.${tier.level}`, title: tier.title };
        }
    }
    return { level: `Lv.1`, title: "新手學徒" };
}

// 判斷是否符合轉職條件
function getJobInfo(stats) {
    for (const job of jobTiers) {
        if (job.condition(stats)) {
            return { title: job.name, skill: job.skill };
        }
    }
    return null;
}

// 渲染學生卡牌到儀表板
function renderDashboard() {
    const dashboard = document.getElementById('student-dashboard');
    dashboard.innerHTML = ''; // 清空儀表板

    studentsData.forEach(student => {
        const totalScore = calculateTotalScore(student.stats);
        const levelInfo = getLevelInfo(totalScore);
        const jobInfo = getJobInfo(student.stats);

        // 創建卡牌 HTML
        const card = document.createElement('div');
        card.className = 'student-card';
        
        let jobHtml = `
            <div class="job-info">
                <div class="job-title">無</div>
                <div class="job-skill">尚未獲得特殊技能。</div>
            </div>`;
        if (jobInfo) {
            jobHtml = `
            <div class="job-info">
                <div class="job-title">${jobInfo.title}</div>
                <div class="job-skill">✨ 技能：${jobInfo.skill}</div>
            </div>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="student-name">${student.name}</div>
                <div class="student-level">${levelInfo.level} ${levelInfo.title}</div>
            </div>
            <div class="stats-grid">
                ${Object.entries(student.stats).map(([key, value]) => `
                    <div class="stat-item" data-stat="${key.toUpperCase()}">
                        <div class="stat-icon"></div>
                        <div class="stat-name">${statNames[key]}</div>
                        <div class="stat-value">${value}</div>
                    </div>
                `).join('')}
            </div>
            ${jobHtml}
        `;

        // 根據最高屬性設定卡牌頂部顏色
        const topStat = Object.keys(student.stats).reduce((a, b) => student.stats[a] > student.stats[b] ? a : b);
        card.style.borderTopColor = getStatColor(topStat.toUpperCase());

        dashboard.appendChild(card);
    });
}

function getStatColor(stat) {
    const colors = {
        "INT": "#4A90E2", "STR": "#D0021B", "FOC": "#BD10E0",
        "MOR": "#F5A623", "COOP": "#7ED321", "CRE": "#F78DA7"
    };
    return colors[stat] || '#4a90e2';
}

// 網頁載入後立即執行渲染
document.addEventListener('DOMContentLoaded', renderDashboard);
