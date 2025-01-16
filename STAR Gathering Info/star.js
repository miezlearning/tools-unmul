const createUI = () => {
    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; margin: 20px; border: 1px solid #ccc; border-radius: 8px;';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Class Detail Information';
    
    const select = document.createElement('select');
    select.style.cssText = 'width: 100%; padding: 8px; margin: 10px 0;';
    
    const result = document.createElement('pre');
    result.style.cssText = 'background: #f5f5f5; padding: 15px; border-radius: 4px; max-height: 400px; overflow: auto;';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download All Data';
    downloadBtn.style.cssText = 'padding: 8px 16px; margin: 10px 0; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    container.appendChild(heading);
    container.appendChild(select);
    container.appendChild(result);
    container.appendChild(downloadBtn);
    
    document.body.appendChild(container);
    
    return { select, result, downloadBtn };
  };
  
  async function fetchClassDetails(url) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const students = [...doc.querySelectorAll('.social-profile')].map(profile => ({
        nim: profile.querySelector('.mb-1 a')?.textContent?.trim() || 'N/A',
        name: profile.querySelector('.f-light')?.textContent?.trim() || 'N/A'
      }));
  
      const lecturers = [...doc.querySelectorAll('.main-menu li')]
        .filter(li => li.textContent.startsWith('- '))
        .map(li => li.textContent.replace('- ', '').trim());
  
      const classInfo = {
        className: doc.querySelector('.media-body h6')?.textContent?.trim() || 'N/A',
        type: doc.querySelector('.media-body p')?.textContent?.trim() || 'N/A',
        faculty: doc.querySelector('.project-box > p')?.textContent?.trim() || 'N/A',
        status: doc.querySelector('.badge-danger') ? 'Closed' : 'Open',
        students,
        lecturers,
        totalStudents: students.length,
        totalLecturers: lecturers.length
      };
  
      return classInfo;
    } catch (error) {
      console.error('Error fetching class details:', error);
      return null;
    }
  }
  
  async function processClasses() {
    const ui = createUI();
    const allData = {};
    
    const classLinks = [...document.querySelectorAll('a[href*="/mahasiswa/kelas/detail/"]')];
    
    console.log('Starting to fetch class details...');
    for (let i = 0; i < classLinks.length; i++) {
      const link = classLinks[i];
      const url = link.href;
      const data = await fetchClassDetails(url);
      
      if (data) {
        allData[data.className] = data;
        
        const option = document.createElement('option');
        option.value = i;
        option.textContent = data.className;
        ui.select.appendChild(option);
      }
      
      console.log(`Processed ${i + 1}/${classLinks.length} classes`);
    }
    
    ui.select.addEventListener('change', (e) => {
      const selectedClass = Object.values(allData)[e.target.value];
      ui.result.textContent = JSON.stringify(selectedClass, null, 2);
    });
    
    ui.downloadBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'class_details.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    // Show initial data if available
    if (Object.keys(allData).length > 0) {
      ui.result.textContent = JSON.stringify(Object.values(allData)[0], null, 2);
    }
    return allData;
  }
  
  processClasses().then(data => {
    console.log('Script completed successfully!');
    window.classData = data;
  });