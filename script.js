document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateContent(data);
            initTypewriter(data.personalInfo.headline);
            document.getElementById('current-year').textContent = new Date().getFullYear();
        })
        .catch(error => console.error('Error loading the portfolio data:', error));
});

function populateContent(data) {
    const info = data.personalInfo;
    
    // --- Hero Section ---
    document.getElementById('profile-photo').src = info.profilePicture;
    document.getElementById('tagline').textContent = info.tagline;
    document.getElementById('email-cta').href = `mailto:${info.contact.email}`;
    document.getElementById('resume-cta').href = info.contact.resumeLink;

    // --- About Me Section ---
    document.getElementById('about-text').textContent = info.aboutMe;
    const softSkillsList = document.getElementById('soft-skills-list');
    info.softSkills.forEach(skill => {
        const li = document.createElement('li');
        // Add Bootstrap classes for list item styling
        li.className = 'p-2 me-2 mb-2 bg-light rounded-pill'; 
        li.textContent = skill;
        softSkillsList.appendChild(li);
    });

    // --- Skills Section ---
    const skillsGrid = document.getElementById('skills-grid');
    for (const key in data.techStack) {
        const category = data.techStack[key];
        const col = document.createElement('div');
        col.className = 'col'; // Bootstrap column wrapper
        
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-category';
        skillDiv.innerHTML = `<h4>${category.name}</h4>`;
        
        category.skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            skillDiv.appendChild(badge);
        });
        
        col.appendChild(skillDiv);
        skillsGrid.appendChild(col);
    }
    
    // --- Projects Section ---
    const workContainer = document.getElementById('work-projects-container');
    data.projects.workProjects.forEach(project => {
        // Work project gets full width on desktop (col-12)
        const col = document.createElement('div');
        col.className = 'col-12';
        col.appendChild(createProjectCard(project, true));
        workContainer.appendChild(col);
    });

    const personalContainer = document.getElementById('personal-projects-container');
    data.projects.personalProjects.forEach(project => {
        // Personal projects get half width on desktop (col-md-6)
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.appendChild(createProjectCard(project));
        personalContainer.appendChild(col);
    });

    // --- Experience Section (Using simpler list/custom class for B5) ---
    const experienceList = document.getElementById('experience-list');
    data.experience.forEach((job) => {
        const item = document.createElement('div');
        item.className = 'timeline-item-custom mb-4'; // Custom class for styling
        item.innerHTML = `
            <div class="timeline-content-custom">
                <p class="inter-font text-muted small">${job.duration}</p>
                <h4 class="mb-1">${job.role} @ ${job.company}</h4>
                <p class="mb-0">${job.achievement}</p>
            </div>
        `;
        experienceList.appendChild(item);
    });

    // --- Education Section ---
    const educationContainer = document.getElementById('education-container');
    data.education.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'col-lg-8 mb-4';
        item.innerHTML = `
            <div class="p-4 border border-charcoal rounded shadow-sm">
                <h4 class="poppins-font text-charcoal mb-1">${edu.degree}</h4>
                <p class="mb-2 text-muted">${edu.institution} (${edu.duration})</p>
                <p class="mb-0 fw-bold">CGPA: ${edu.gpa}</p>
            </div>
        `;
        educationContainer.appendChild(item);
    });


    // --- Research Contributions Section ---
    const researchContainer = document.getElementById('research-container');
    data.researchContributions.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'research-card';
        card.innerHTML = `
            <a href="${paper.link}" target="_blank">${paper.title} <i class="fas fa-external-link-alt ms-2 small"></i></a>
            <p class="inter-font">${paper.summary}</p>
            <div class="research-meta">
                <span class="d-block d-md-inline-block">Venue: <strong>${paper.venue}</strong></span>
                <span class="d-block d-md-inline-block ms-md-3">Publisher: ${paper.publisher}</span>
                <span class="d-block d-md-inline-block ms-md-3">Date: ${paper.date}</span>
            </div>
        `;
        researchContainer.appendChild(card);
    });

    // --- Awards & Achievements Section ---
    const awardsContainer = document.getElementById('awards-container');
    data.awardsAndAchievements.forEach(award => {
        const col = document.createElement('div');
        col.className = 'col-lg-5'; // Slightly smaller column width

        col.innerHTML = `
            <div class="card p-4 h-100 border shadow-sm">
                <div class="d-flex align-items-center mb-2">
                    <i class="${award.icon} fa-2x text-charcoal me-3"></i>
                    <div>
                        <h5 class="poppins-font fw-bold mb-0 text-charcoal">${award.name}</h5>
                        <small class="text-muted">${award.date}</small>
                    </div>
                </div>
                <p class="inter-font mb-0">${award.description}</p>
            </div>
        `;
        awardsContainer.appendChild(col);
    });

    // --- Certifications Section ---
    const certsContainer = document.getElementById('certifications-container');
    data.certifications.forEach(cert => {
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="text-center p-4 border rounded shadow-sm h-100">
                <i class="${cert.icon} fa-3x text-charcoal mb-3"></i>
                <h5 class="poppins-font fw-bold mb-1">${cert.name}</h5>
                <p class="text-muted mb-0">${cert.issuer} (${cert.date})</p>
            </div>
        `;
        certsContainer.appendChild(col);
    });

    // --- Technical Talks & Demos Section ---
    const talksContainer = document.getElementById('talks-container');
    data.technicalOutreach.forEach(talk => {
        const col = document.createElement('div');
        col.className = 'col-lg-10'; // Use wider column for readability

        col.innerHTML = `
            <div class="card p-4 border shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="poppins-font fw-bold mb-1 text-charcoal">${talk.topic}</h5>
                        <p class="text-muted mb-0 small">${talk.venue} (${talk.date}) - <span class="fw-bold">${talk.type}</span></p>
                    </div>
                    ${talk.link ? `<a href="${talk.link}" target="_blank" class="btn secondary-btn btn-sm ms-3">View <i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
                <p class="inter-font mt-2 mb-0">${talk.summary}</p>
            </div>
        `;
        talksContainer.appendChild(col);
    });

    // --- Learning & Building Section ---
    const learningData = data.learningAndBuilding;
    document.getElementById('learning-title').textContent = '💡 ' + learningData.title;
    document.getElementById('learning-tagline').textContent = learningData.tagline;

    const cardsContainer = document.getElementById('learning-cards-container');

    learningData.cards.forEach(card => {
        const col = document.createElement('div');
        col.className = 'col';

        let itemsHtml = card.items.map(item => `<li>${item}</li>`).join('');

        col.innerHTML = `
            <div class="card learning-card h-100 p-4 border shadow-sm">
                <div class="d-flex justify-content-between align-items-start">
                    <h4 class="card-title poppins-font text-charcoal mb-3">${card.category}</h4>
                    <span class="status-badge status-${card.status.toLowerCase().replace(/\s/g, '-')}" >${card.status}</span>
                </div>
                <ul class="list-unstyled learning-list">
                    ${itemsHtml}
                </ul>
            </div>
        `;
        cardsContainer.appendChild(col);
    });


    // --- Contact/Footer Section (Using FontAwesome icons) ---
    const socialLinks = document.getElementById('social-links');
    socialLinks.innerHTML = `
        <a href="${info.contact.github}" target="_blank" title="GitHub" class="text-white mx-3"><i class="fab fa-github"></i></a>
        <a href="${info.contact.linkedin}" target="_blank" title="LinkedIn" class="text-white mx-3"><i class="fab fa-linkedin"></i></a>
        <a href="mailto:${info.contact.email}" title="Email" class="text-white mx-3"><i class="fas fa-envelope"></i></a>
        <a href="${info.contact.orcid}" target="_blank" title="ORCID" class="text-white mx-3"><i class="fab fa-orcid"></i></a>
        <a href="${info.contact.researcherProfile}" target="_blank" title="Researcher Profile" class="text-white mx-3"><i class="fas fa-file-alt"></i></a>
    `;
}

// Function to create a project card (re-uses original logic)
function createProjectCard(project, isWork = false) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const techListHTML = project.technologies.map(tech => `<li>${tech}</li>`).join('');

    let linksHTML = '';
    if (project.links.github) {
        linksHTML += `<a href="${project.links.github}" target="_blank" class="btn secondary-btn me-2 mt-2">GitHub Repo <i class="fab fa-github"></i></a>`;
    }
    if (project.links.demo) {
        linksHTML += `<a href="${project.links.demo}" target="_blank" class="btn primary-btn mt-2">Live Demo <i class="fas fa-external-link-alt"></i></a>`;
    }
    if (isWork) {
        linksHTML = `<span class="inter-font text-muted fst-italic mt-2 d-block">(Details upon request)</span>`;
    }

    card.innerHTML = `
        <h4 class="mb-3">${project.name}</h4>
        <p class="mb-2"><strong>Role:</strong> ${project.myRole}</p>
        <p>${project.description}</p>
        <ul class="tech-list">${techListHTML}</ul>
        <div class="project-links">${linksHTML}</div>
    `;
    return card;
}

// Typewriter Effect Logic (remains the same)
function initTypewriter(text) {
    const element = document.getElementById('typewriter-text');
    let i = 0;
    const speed = 70;

    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}