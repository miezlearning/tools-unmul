const state = {
    selectedCourses: [],
    totalSKS: 0,
    maxSKS: 0,
    isMinimized: false,
    includePilihan: true, 
};
function createSelectionUI() {
    state.maxSKS = parseInt(document.getElementById('jatah_sks')?.value || '0');
    
    const container = document.createElement('div');
    container.id = 'krsAutomationContainer';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f8f9fa;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 500px;
        transition: all 0.3s ease;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        cursor: pointer;
    `;

    // const content = document.createElement('div');

    const title = document.createElement('h4');
    title.textContent = `KRS Helper IF (${state.maxSKS} SKS)`;
    title.style.margin = '0';
    
    const minimizeBtn = document.createElement('button');
    minimizeBtn.innerHTML = '−';
    minimizeBtn.style.cssText = `
        border: none;
        background: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0 5px;
    `;
    
    header.appendChild(title);
    header.appendChild(minimizeBtn);
    container.appendChild(header);

    const content = document.createElement('div');
    content.id = 'krsAutomationContent';
    container.appendChild(content);

    // Angkatan Selection
    const angkatanLabel = document.createElement('label');
    angkatanLabel.textContent = 'Angkatan:';
    angkatanLabel.style.display = 'block';
    angkatanLabel.style.marginBottom = '5px';
    content.appendChild(angkatanLabel);

    const angkatanSelect = document.createElement('select');
    angkatanSelect.id = 'angkatanSelect';
    angkatanSelect.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px;';
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 4; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `Angkatan ${year}`;
        angkatanSelect.appendChild(option);
    }
    content.appendChild(angkatanSelect);

    // Semester Selection
    const semesterLabel = document.createElement('label');
    semesterLabel.textContent = 'Semester:';
    semesterLabel.style.display = 'block';
    semesterLabel.style.marginBottom = '5px';
    content.appendChild(semesterLabel);

    const semesterSelect = document.createElement('select');
    semesterSelect.id = 'semesterSelect';
    semesterSelect.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px;';
    for (let i = 1; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Semester ${i}`;
        semesterSelect.appendChild(option);
    }
    content.appendChild(semesterSelect);

    // Class Selection
    const kelasLabel = document.createElement('label');
    kelasLabel.textContent = 'Kelas:';
    kelasLabel.style.display = 'block';
    kelasLabel.style.marginBottom = '5px';
    content.appendChild(kelasLabel);

    const kelasSelect = document.createElement('select');
    kelasSelect.id = 'kelasSelect';
    kelasSelect.style.cssText = 'width: 100%; padding: 5px; margin-bottom: 10px;';
    ['', 'A', 'B', 'C'].forEach(kelas => {
        const option = document.createElement('option');
        option.value = kelas;
        option.textContent = kelas ? `Kelas ${kelas}` : 'Semua Kelas';
        kelasSelect.appendChild(option);
    });
    content.appendChild(kelasSelect);

    // Selected Courses Area
    const selectedCoursesArea = document.createElement('div');
    selectedCoursesArea.id = 'selectedCoursesArea';
    selectedCoursesArea.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        background-color: #f1f1f1;
        border-radius: 4px;
        max-height: 200px;
        overflow-y: auto;
        font-size: 12px;
    `;
    content.appendChild(selectedCoursesArea);

    const pilihanContainer = document.createElement('div');
    pilihanContainer.style.cssText = 'margin-bottom: 10px;';
    
    const pilihanCheckbox = document.createElement('input');
    pilihanCheckbox.type = 'checkbox';
    pilihanCheckbox.id = 'includePilihanCheckbox';
    pilihanCheckbox.checked = state.includePilihan;
    pilihanCheckbox.style.marginRight = '5px';
    
    const pilihanLabel = document.createElement('label');
    pilihanLabel.htmlFor = 'includePilihanCheckbox';
    pilihanLabel.textContent = 'Tampilkan Mata Kuliah Pilihan (Semester 4 minimal)';
    
    pilihanContainer.appendChild(pilihanCheckbox);
    pilihanContainer.appendChild(pilihanLabel);
    content.appendChild(pilihanContainer);

    pilihanCheckbox.onchange = (e) => {
        state.includePilihan = e.target.checked;
        addLog(`Mata Kuliah Pilihan ${state.includePilihan ? 'akan' : 'tidak akan'} ditampilkan`, 'info');
    };

    // SKS Counter
    const sksCounter = document.createElement('div');
    sksCounter.id = 'sksCounter';
    sksCounter.style.cssText = `
        margin-top: 10px;
        font-weight: bold;
        text-align: right;
    `;
    sksCounter.textContent = `Total SKS: 0/${state.maxSKS}`;
    content.appendChild(sksCounter);

    // Log Area
    const logArea = document.createElement('div');
    logArea.id = 'logArea';
    logArea.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        background-color: #f1f1f1;
        border-radius: 4px;
        max-height: 150px;
        overflow-y: auto;
        font-size: 12px;
    `;
    content.appendChild(logArea);

    // Button Container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-top: 10px;
    `;

    // Scan Button
    const scanButton = document.createElement('button');
    scanButton.textContent = 'Scan Mata Kuliah';
    scanButton.style.cssText = `
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;
    scanButton.onclick = scanCourses;
    buttonContainer.appendChild(scanButton);

    // Selected Button
    const addButton = document.createElement('button');
    addButton.textContent = 'Tambah Terpilih';
    addButton.style.cssText = `
        background-color: #28a745;
        color: #fff;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;
    addButton.onclick = addSelectedCourses;
    buttonContainer.appendChild(addButton);

    content.appendChild(buttonContainer);

    minimizeBtn.onclick = (e) => {
        e.stopPropagation();
        toggleMinimize();
    };


    document.body.appendChild(container);

    
}

function toggleMinimize() {
    const content = document.getElementById('krsAutomationContent');
    const container = document.getElementById('krsAutomationContainer');
    const minimizeBtn = container.querySelector('button');
    
    state.isMinimized = !state.isMinimized;
    
    if (state.isMinimized) {
        content.style.display = 'none';
        container.style.width = '150px';
        minimizeBtn.innerHTML = '+';
    } else {
        content.style.display = 'block';
        container.style.width = '500px';
        minimizeBtn.innerHTML = '−';
    }
}

function addLog(message, type = 'info') {
    const logArea = document.getElementById('logArea');
    const logEntry = document.createElement('div');
    logEntry.style.marginBottom = '5px';
    logEntry.style.color = type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#000';
    logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    logArea.appendChild(logEntry);
    logArea.scrollTop = logArea.scrollHeight;
}

function updateSelectedCoursesDisplay() {
    const area = document.getElementById('selectedCoursesArea');
    const counter = document.getElementById('sksCounter');
    
    area.innerHTML = '';
    state.selectedCourses.forEach(course => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '5px';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${course.name} (${course.sks} SKS)`;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.cssText = `
            border: none;
            background: none;
            color: red;
            cursor: pointer;
            padding: 0 5px;
        `;
        removeBtn.onclick = () => removeCourse(course.id);
        
        div.appendChild(nameSpan);
        div.appendChild(removeBtn);
        area.appendChild(div);
    });
    
    counter.textContent = `Total SKS: ${state.totalSKS}/${state.maxSKS}`;
    counter.style.color = state.totalSKS > state.maxSKS ? '#dc3545' : '#000';
}

function removeCourse(courseId) {
    const course = state.selectedCourses.find(c => c.id === courseId);
    if (course) {
        state.totalSKS -= parseInt(course.sks);
        state.selectedCourses = state.selectedCourses.filter(c => c.id !== courseId);
        updateSelectedCoursesDisplay();
    }
}



function addCourseToSelection(course) {
    if (state.selectedCourses.some(c => c.id === course.id)) {
        addLog(`${course.name} sudah ada dalam pilihan`, 'error');
        return;
    }

    state.selectedCourses.push(course);
    state.totalSKS += course.sks;
    updateSelectedCoursesDisplay();
    addLog(`Added ${course.name} to selection`, 'success');
}

function scanCourses() {
    const kelas = document.getElementById('kelasSelect').value;
    const angkatan = document.getElementById('angkatanSelect').value;
    const semesterSelect = document.getElementById('semesterSelect');

    addLog(`Memindai untuk Angkatan ${angkatan}${kelas ? ` Kelas ${kelas}` : ''}`);

    const existingCourseIds = new Set(state.selectedCourses.map(course => course.id));
    const regulerTab = document.getElementById('reguler');
    if (!regulerTab) {
        addLog(`Error: Elemen dengan ID 'reguler' tidak ditemukan.`, 'error');
        return;
    }

    const courses = regulerTab.querySelectorAll('li.inbox-data');
    let fullCount = 0;

    addLog(`Jumlah kursus ditemukan: ${courses.length}`);

    courses.forEach(course => {
        try {
            const courseId = course.dataset.id;
            if (existingCourseIds.has(courseId)) {
                return;
            }

            let courseName = course.querySelector('.inbox-user p').textContent.trim();
            courseName = courseName.replace(/^\[.*?\]\s*/, '');
            const emailDataSpanElement = course.querySelector('.email-data span');
            if (!emailDataSpanElement) {
                addLog(`Warning: Tidak dapat menemukan elemen '.email-data span' untuk kursus ID ${courseId}.`, 'warning');
                return;
            }

            const emailDataSpan = emailDataSpanElement.firstChild.textContent.trim();
            const [kodeMatkul, ...kelasInfoParts] = emailDataSpan.split(' - ');
            const kelasInfoRaw = kelasInfoParts.join(' - ');

            const courseCode = kodeMatkul.trim();
            const courseType = course.querySelector('.badge-light-success, .badge-light-warning')?.textContent.trim();
            const courseSKS = parseInt(course.dataset.sks);
            const isFull = course.querySelector('.badge-light-danger') !== null;

            // Cek apakah ini mata kuliah khusus (KKN/PKL)
            const isSpecialCourse = kelasInfoRaw.includes('Kelas 20');
            let isMatch = false;

            if (isSpecialCourse && courseType === 'WAJIB') {
                // Untuk mata kuliah khusus, cek apakah angkatan yang dipilih ada dalam range kelasnya
                const yearRange = kelasInfoRaw.match(/Kelas (\d{4})-(\d{4})/);
                if (yearRange) {
                    const [_, startYear, endYear] = yearRange;
                    isMatch = (angkatan === startYear || angkatan === endYear);
                }
            } else if (courseType === 'WAJIB') {
                // Untuk mata kuliah wajib reguler
                const isClassMatch = !kelas || kelasInfoRaw.includes(`Kelas ${kelas}`);
                const isAngkatanMatch = kelasInfoRaw.includes(angkatan);
                isMatch = isClassMatch && isAngkatanMatch;
            } else if (courseType === 'PILIHAN' && semesterSelect.value > 3) {
                // Untuk mata kuliah pilihan, hanya bergantung pada status checkbox
                isMatch = state.includePilihan;
            }

            if (isMatch) {
                if (isFull) {
                    addLog(`${courseCode} - ${courseName} - ${kelasInfoRaw} - Kelas Penuh`, 'error');
                    fullCount++;
                    return;
                }

                const courseData = {
                    id: courseId,
                    code: courseCode,
                    name: courseName,
                    type: courseType,
                    sks: courseSKS,
                    class: kelasInfoRaw
                };

                state.selectedCourses.push(courseData);
                state.totalSKS += courseSKS;

                addLog(`Ditemukan ${courseCode} - ${courseName} - ${kelasInfoRaw} (${courseType})`, 'success');
            }
        } catch (error) {
            addLog(`Error processing course ID ${course.dataset.id}: ${error.message}`, 'error');
        }
    });

    updateSelectedCoursesDisplay();
    addLog(`Pemindaian selesai. Total ${state.selectedCourses.length} kursus. ${fullCount} kursus penuh.`, 'success');
}

function updateSelectedCoursesDisplay() {
    const area = document.getElementById('selectedCoursesArea');
    const counter = document.getElementById('sksCounter');

    area.innerHTML = '';
    state.selectedCourses.forEach(course => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '5px';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${course.code} - ${course.name} - ${course.class}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.cssText = `
            border: none;
            background: none;
            color: red;
            cursor: pointer;
            padding: 0 5px;
        `;
        removeBtn.onclick = () => removeCourse(course.id);

        div.appendChild(nameSpan);
        div.appendChild(removeBtn);
        area.appendChild(div);
    });

    counter.textContent = `Total SKS: ${state.totalSKS}/${state.maxSKS}`;
    counter.style.color = state.totalSKS > state.maxSKS ? '#dc3545' : '#000';
}



function addSelectedCourses() {
    if (state.totalSKS > state.maxSKS) {
        addLog(`Error: Total SKS (${state.totalSKS}) melebihi jatah (${state.maxSKS})`, 'error');
        return;
    }

    state.selectedCourses.forEach(course => {
        const courseElement = document.querySelector(`li.inbox-data[data-id="${course.id}"]`);
        const addButton = courseElement?.querySelector('button.btn-success');
        
        if (addButton) {
            addButton.click();
            addLog(`Added ${course.name}`, 'success');
        }
    });

    state.selectedCourses = [];
    state.totalSKS = 0;
    updateSelectedCoursesDisplay();
}
createSelectionUI();