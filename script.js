document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const inputArea = document.getElementById('gradeReportInput');
    const resultContainer = document.getElementById('resultContainer');

    const gradeMap4 = {
        'A+': 4.0, 'A': 4.0,
        'B+': 3.5, 'B': 3.0,
        'C+': 2.5, 'C': 2.0,
        'D+': 1.5, 'C': 1.0,
		'F': 0.0
    };

    calculateBtn.addEventListener('click', () => {
        const inputText = inputArea.value;
        if (!inputText) {
            alert("Please paste your grade report first.");
            return;
        }

        const lines = inputText.split('\n');

        let studentName = "N/A";
        let studentId = "N/A";

        let totalCredits10 = 0;
        let weightedSum10 = 0;

        let totalCredits4 = 0;
        let weightedSum4 = 0;
        
        let subjectsCounted = 0;

        const nameLine = lines.find(line => line.startsWith('Họ và tên:'));
        if (nameLine) {
            studentName = nameLine.replace('Họ và tên:', '').trim();
        }
        const idLine = lines.find(line => line.startsWith('Mã sinh viên:'));
        if (idLine) {
            studentId = idLine.replace('Mã sinh viên:', '').trim();
        }

        const subjectLineRegex = /^\d+\t/;

        lines.forEach(line => {
            if (subjectLineRegex.test(line)) {
                const parts = line.split(/\t+/).map(p => p.trim());
                
                if (parts.length >= 6) {
                    const diemSoStr = parts[3];
                    const diemChuStr = parts[4];
                    const tinChiStr = parts[5];

                    const tinChi = parseFloat(tinChiStr);

                    if (!isNaN(tinChi) && tinChi > 0) {
                        const diemSo = parseFloat(diemSoStr);
                        if (!isNaN(diemSo) && diemSo >= 0 && diemSo <= 10) {
                            weightedSum10 += diemSo * tinChi;
                            totalCredits10 += tinChi;
                        }

                        if (gradeMap4.hasOwnProperty(diemChuStr)) {
                            const diemHe4 = gradeMap4[diemChuStr];
                            weightedSum4 += diemHe4 * tinChi;
                            totalCredits4 += tinChi;
                        }
                        
                        if ((!isNaN(diemSo) && diemSo >= 0 && diemSo <= 10) || gradeMap4.hasOwnProperty(diemChuStr)) {
                             subjectsCounted++;
                        }
                    }
                }
            }
        });

        const gpa10 = totalCredits10 > 0 ? (weightedSum10 / totalCredits10) : 0;
        const gpa4 = totalCredits4 > 0 ? (weightedSum4 / totalCredits4) : 0;

        displayResults(studentName, studentId, gpa10, gpa4, totalCredits10);
    });

    function displayResults(name, id, gpa10, gpa4, credits) {
        resultContainer.innerHTML = '';

        const resultCardHTML = `
            <div class="result-card">
                <div class="result-header">
                    <h2>${name}</h2>
                    <p>Student ID: ${id}</p>
                </div>
                <div class="result-scores">
                    <div class="score-box">
                        <div class="label">Điểm TBTL hệ 10</div>
                        <div class="value">${gpa10.toFixed(6)}<span> / 10</span></div>
                    </div>
                    <div class="score-box">
                        <div class="label">Điểm TBTL hệ 4</div>
                        <div class="value">${gpa4.toFixed(6)}<span> / 4.0</span></div>
                    </div>
                </div>
                <div class="calculation-details">
                    <p>Calculation based on <strong>${credits}</strong> credits with valid scores (0-10).</p>
                </div>
            </div>
        `;

        resultContainer.innerHTML = resultCardHTML;
    }
});