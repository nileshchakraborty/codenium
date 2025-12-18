/**
 * LeetCode Top Interview 150 Visualizer
 * Frontend JavaScript - Charts, Interactions & Solution Modal
 */

// ===========================
// Chart Initialization
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initDifficultyChart();
    initCategoryChart();
    initSearch();
    initFilters();
    initModalHandlers();
});

/**
 * Difficulty Distribution Donut Chart
 */
function initDifficultyChart() {
    const ctx = document.getElementById('difficultyChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [stats.easy, stats.medium, stats.hard],
                backgroundColor: [
                    '#00b894',
                    '#f39c12',
                    '#e74c3c'
                ],
                borderColor: '#0a0a0f',
                borderWidth: 3,
                hoverBorderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0b0',
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            const total = stats.easy + stats.medium + stats.hard;
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return ` ${context.raw} problems (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

/**
 * Problems by Category Bar Chart
 */
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    const categoryNames = stats.categories.map(c => c.name);
    const easyData = stats.categories.map(c => c.easy);
    const mediumData = stats.categories.map(c => c.medium);
    const hardData = stats.categories.map(c => c.hard);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,
            datasets: [
                {
                    label: 'Easy',
                    data: easyData,
                    backgroundColor: '#00b894',
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Medium',
                    data: mediumData,
                    backgroundColor: '#f39c12',
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Hard',
                    data: hardData,
                    backgroundColor: '#e74c3c',
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#606070',
                        font: {
                            family: 'Inter',
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#606070',
                        font: {
                            family: 'Inter'
                        },
                        stepSize: 5
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#a0a0b0',
                        padding: 15,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0b0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// ===========================
// Category Toggle
// ===========================

function toggleCategory(header) {
    const card = header.closest('.category-card');
    const problemsList = card.querySelector('.problems-list');

    card.classList.toggle('expanded');
    problemsList.classList.toggle('expanded');
    problemsList.classList.toggle('collapsed');
}

// ===========================
// Search Functionality
// ===========================

function initSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        filterProblems(query);
    }, 200));
}

function filterProblems(query) {
    const categories = document.querySelectorAll('.category-card');

    categories.forEach(category => {
        const problems = category.querySelectorAll('.problem-item');
        let visibleCount = 0;

        problems.forEach(problem => {
            const title = problem.querySelector('.problem-title').textContent.toLowerCase();
            const isVisible = title.includes(query);
            problem.classList.toggle('hidden', !isVisible);
            if (isVisible) visibleCount++;
        });

        // Hide category if no problems match
        category.classList.toggle('hidden', visibleCount === 0 && query !== '');

        // Expand category if searching
        if (query && visibleCount > 0) {
            category.classList.add('expanded');
            category.querySelector('.problems-list').classList.add('expanded');
            category.querySelector('.problems-list').classList.remove('collapsed');
        }
    });
}

// ===========================
// Difficulty Filter
// ===========================

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter by difficulty
            const filter = btn.dataset.filter;
            applyDifficultyFilter(filter);
        });
    });
}

function applyDifficultyFilter(filter) {
    const problems = document.querySelectorAll('.problem-item');
    const categories = document.querySelectorAll('.category-card');

    problems.forEach(problem => {
        if (filter === 'all') {
            problem.classList.remove('hidden');
        } else {
            const difficulty = problem.dataset.difficulty;
            problem.classList.toggle('hidden', difficulty !== filter);
        }
    });

    // Hide empty categories
    categories.forEach(category => {
        const visibleProblems = category.querySelectorAll('.problem-item:not(.hidden)');
        category.classList.toggle('hidden', visibleProblems.length === 0);
    });
}

// ===========================
// Solution Modal
// ===========================

function initModalHandlers() {
    const modal = document.getElementById('solutionModal');

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

async function showSolution(slug) {
    const modal = document.getElementById('solutionModal');
    const content = document.getElementById('solutionContent');

    // Clear previous
    content.innerHTML = '';

    // Show modal immediately
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Switch to explanation
    switchTab('explanation');

    // Case 1: Solution exists in cache
    if (solutions[slug]) {
        renderAndInit(solutions[slug], slug);
        return;
    }

    // Case 2: Generate Solution
    content.innerHTML = `
        <div class="generating-state" style="text-align: center; padding: 60px 20px;">
            <div class="gen-icon" style="font-size: 3rem; margin-bottom: 20px; animation: pulse 2s infinite;">✨</div>
            <h2 style="margin-bottom: 15px;">Generating Visual Solution...</h2>
            <p style="color: var(--text-secondary); margin-bottom: 10px;">Using AI to analyze intuition, visualize steps, and generate code.</p>
            <p style="font-size: 0.9rem; color: var(--text-muted);">This usually takes 10-20 seconds.</p>
        </div>
    `;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug })
        });
        const data = await response.json();

        if (data.success) {
            // Fetch the newly created solution
            const solRes = await fetch(`/api/solutions/${slug}`);
            const newSol = await solRes.json();

            // Update cache
            solutions[slug] = newSol;

            // Allow adding it to "has-solution" visually in the list
            const item = document.querySelector(`.problem-item[data-slug="${slug}"]`);
            if (item) {
                item.classList.add('has-solution');
                const info = item.querySelector('.problem-info');
                if (!info.querySelector('.solution-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'solution-badge';
                    badge.textContent = '📖 Visual Solution';
                    info.appendChild(badge);
                }
            }

            renderAndInit(newSol, slug);
        } else {
            content.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 50px; color: var(--hard);">
                    <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                    <h2>Generation Failed</h2>
                    <p style="color: var(--text-secondary); margin-top: 10px;">${escapeHtml(data.error || 'Unknown error')}</p>
                </div>
            `;
        }
    } catch (e) {
        content.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 50px; color: var(--hard);">
                <h2>Network Error</h2>
                <p>${escapeHtml(e.message)}</p>
            </div>
        `;
    }
}

function renderAndInit(solution, slug) {
    const content = document.getElementById('solutionContent');
    content.innerHTML = renderSolution(solution);

    // Initialize Smart Visualizer
    if (solution.visualizationType && window.VisualizerEngine) {
        // Simple singleton management or re-instantiate
        if (!window.viz) {
            window.viz = new VisualizerEngine('smartVisualizer');
        } else {
            // Re-target container in case it changed (it did, because innerHTML wiped it)
            window.viz.container = document.getElementById('smartVisualizer');
        }
        window.viz.load(solution);
    }

    // Initialize Playground
    currentSlug = slug;
    const textarea = document.getElementById('codeEditor');
    if (solution) {
        textarea.value = solution.code || '';
    }
    const outputDiv = document.getElementById('codeOutput');
    outputDiv.textContent = "Click Run to execute...";
    outputDiv.className = "console-output";

    // Animate steps in (Legacy items)
    animateStepsIn();
}

function closeModal() {
    const modal = document.getElementById('solutionModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderSolution(sol) {
    let stepsHtml = '';

    if (sol.visualizationType) {
        stepsHtml = `<div id="smartVisualizer"></div>`;
    } else if (sol.steps) {
        stepsHtml = sol.steps.map(step => `
            <div class="step-card" style="opacity: 0; transform: translateY(20px);">
                <div class="step-header">
                    <div class="step-number">${step.step}</div>
                    <div class="step-title">${step.title}</div>
                </div>
                <div class="step-body">
                    <div class="step-visual">${escapeHtml(step.visual)}</div>
                    <div class="step-explanation">${step.explanation}</div>
                </div>
            </div>
        `).join('');
    }

    return `
        <!-- Header -->
        <div class="solution-header">
            <h2 class="solution-title">
                ${sol.patternEmoji || '💡'} ${sol.title || 'Solution'}
            </h2>
            <div class="pattern-badge">
                ${sol.patternEmoji || '💡'} ${sol.pattern || 'Pattern'}
            </div>
            <div class="complexity-badges">
                <div class="complexity-badge">Time: <span>${sol.timeComplexity}</span></div>
                <div class="complexity-badge">Space: <span>${sol.spaceComplexity}</span></div>
            </div>
        </div>
        
        <!-- One-liner -->
        <div class="oneliner">
            💡 ${sol.oneliner}
        </div>
        
        <!-- Intuition -->
        <div class="intuition-section">
            <h3>🧠 Core Intuition</h3>
            <div class="intuition-list">
                ${(sol.intuition || []).map(item => `
                    <div class="intuition-item">${item}</div>
                `).join('')}
            </div>
        </div>
        
        <!-- Steps / Visualizer -->
        <div class="steps-section">
            <h3>📝 Visualization</h3>
            ${stepsHtml}
        </div>
        
        <!-- Code -->
        <div class="code-section">
            <h3>💻 Python Code</h3>
            <pre class="code-block">${highlightCode(sol.code)}</pre>
        </div>
        
        <!-- Key Insight -->
        <div class="key-insight">
            <span class="insight-icon">🔑</span>
            <div class="insight-text">${sol.keyInsight}</div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightCode(code) {
    // Simple syntax highlighting
    return code
        // Comments
        .replace(/(#.+)/g, '<span class="comment">$1</span>')
        // Strings
        .replace(/("[^"]*")/g, '<span class="string">$1</span>')
        .replace(/('[^']*')/g, '<span class="string">$1</span>')
        // Keywords
        .replace(/\b(def|return|if|else|elif|for|while|in|not|and|or|True|False|None|class|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda)\b/g, '<span class="keyword">$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        // Functions
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function">$1</span>(');
}

function animateStepsIn() {
    const steps = document.querySelectorAll('.step-card');

    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.transition = 'all 0.4s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
    });
}

// ===========================
// Utility Functions
// ===========================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================
// Code Playground
// ===========================

let currentSlug = '';

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.getElementById('solutionContent').classList.toggle('active', tabName === 'explanation');
    document.getElementById('playgroundContent').classList.toggle('active', tabName === 'playground');
}

async function runCode() {
    const code = document.getElementById('codeEditor').value;
    const outputDiv = document.getElementById('codeOutput');

    outputDiv.innerHTML = "Running...";

    try {
        const response = await fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, slug: currentSlug })
        });

        const data = await response.json();

        if (data.success) {
            let outputHtml = '';

            if (data.logs) {
                outputHtml += `<div class="log-output" style="opacity:0.7; font-size:0.9em; margin-bottom:10px;">${escapeHtml(data.logs)}</div>`;
            }

            if (data.results && data.results.length > 0) {
                outputHtml += '<div class="test-results">';
                data.results.forEach(res => {
                    const statusClass = res.passed ? 'passed' : 'failed';
                    const icon = res.passed ? '✅' : '❌';
                    outputHtml += `
                        <div class="test-result-item ${statusClass}">
                            <div>${icon} Case ${res.case}: ${res.passed ? 'Passed' : 'Failed'}</div>
                            <div style="font-size: 0.85em; opacity: 0.8; margin-top:4px; font-family:monospace;">Input: ${escapeHtml(res.input)}</div>
                            ${!res.passed ? `
                                <div style="font-size: 0.85em; color: var(--hard); margin-top:2px;">Expected: ${escapeHtml(res.expected)}</div>
                                <div style="font-size: 0.85em; color: var(--hard);">Actual:   ${escapeHtml(res.actual || res.error || '')}</div>
                            ` : ''}
                        </div>
                     `;
                });
                outputHtml += '</div>';
            }

            if (data.passed) {
                outputHtml += '<div style="color: var(--easy); margin-top: 10px; font-weight: bold;">🎉 All Test Cases Passed!</div>';
            } else if (data.error) {
                outputHtml += `<div class="error" style="color:var(--hard); margin-top:10px;">Runtime Error: ${escapeHtml(data.error)}</div>`;
            }

            outputDiv.innerHTML = outputHtml;

        } else {
            outputDiv.innerHTML = `<div class="error" style="color:var(--hard)">Error: ${escapeHtml(data.error)}</div>`;
            if (data.logs) outputDiv.innerHTML += `<div class="log-output">${escapeHtml(data.logs)}</div>`;
            if (data.stderr) outputDiv.innerHTML += `<div class="error">${escapeHtml(data.stderr)}</div>`;
        }
    } catch (e) {
        outputDiv.innerHTML = `<div class="error" style="color:var(--hard)">Network Error: ${e.message}</div>`;
    }
}
