import { questionsData } from './data/questions.js';
import { resultsData } from './data/results.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const pages = {
        landing: document.getElementById('landing'),
        question: document.getElementById('question'),
        loading: document.getElementById('loading'),
        result: document.getElementById('result')
    };

    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');
    const retryBtn = document.getElementById('retry-btn');
    
    // Question UI
    const currentQEl = document.getElementById('current-q');
    const totalQEl = document.getElementById('total-q');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressBar = document.getElementById('progress-bar');
    const qnumCircle = document.getElementById('q-circle-num');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // Result UI
    const topMatchBar = document.getElementById('top-match-bar');
    const topMatchPercent = document.getElementById('top-match-percent');
    const resultTypeTitle = document.getElementById('result-type-title');
    const resultTypeBadge = document.getElementById('result-type-badge');
    const resultDescription = document.getElementById('result-description');
    const rankingContainer = document.getElementById('ranking-container');

    // State
    let currentQuestionIndex = 0;
    let scores = {};
    const totalQuestions = questionsData.length;

    totalQEl.textContent = totalQuestions;

    // Initialize Scores
    function initScores() {
        scores = {};
        resultsData.forEach(res => {
            scores[res.id] = 0;
        });
    }

    // Navigation
    function showPage(pageId) {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        Object.values(pages).forEach(page => page.classList.remove('active'));
        
        pages[pageId].classList.remove('hidden');
        // trigger reflow
        void pages[pageId].offsetWidth;
        pages[pageId].classList.add('active');
    }

    // Render Question
    function renderQuestion() {
        const q = questionsData[currentQuestionIndex];
        currentQEl.textContent = currentQuestionIndex + 1;
        qnumCircle.textContent = currentQuestionIndex + 1;
        questionText.textContent = q.text;

        // Progress
        const percent = Math.round(((currentQuestionIndex) / totalQuestions) * 100);
        progressPercentEl.textContent = percent + '%';
        progressBar.style.width = percent + '%';

        // Back button
        if (currentQuestionIndex > 0) {
            backBtn.classList.remove('hidden');
        } else {
            backBtn.classList.add('hidden');
        }

        // Render Options
        optionsContainer.innerHTML = '';
        q.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => handleOptionClick(opt.scores));
            optionsContainer.appendChild(btn);
        });
    }

    // Handle Answer
    function handleOptionClick(optionScores) {
        // Add scores
        for (const [id, value] of Object.entries(optionScores)) {
            if (scores[id] !== undefined) {
                scores[id] += value;
            }
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < totalQuestions) {
            renderQuestion();
        } else {
            // Finish
            const finalPercent = 100;
            progressPercentEl.textContent = finalPercent + '%';
            progressBar.style.width = finalPercent + '%';
            
            setTimeout(() => {
                showLoading();
            }, 300);
        }
    }

    // Loading Screen
    function showLoading() {
        showPage('loading');
        setTimeout(() => {
            calculateResults();
            showPage('result');
        }, 1500); // 1.5s delay to mimic analysis
    }

    // Calculate & Render Results
    function calculateResults() {
        // Find max possible score for percentage calculation
        // A simple way is to find the max accumulated score
        let maxScoreAcquired = 0;
        let sortedResults = resultsData.map(res => {
            const finalScore = scores[res.id];
            if(finalScore > maxScoreAcquired) maxScoreAcquired = finalScore;
            return {
                ...res,
                matchScore: finalScore
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        const topResult = sortedResults[0];
        
        // Calculate percentages based on the top score being ~95%
        // and others relative to it.
        sortedResults = sortedResults.map(res => {
            let percent = 0;
            if (maxScoreAcquired > 0) {
                // Top gets around 92-98%
                if (res.id === topResult.id) {
                    percent = 90 + Math.floor(Math.random() * 8); // 90-97%
                } else {
                    const ratio = res.matchScore / maxScoreAcquired;
                    percent = Math.floor(ratio * 90);
                }
            }
            return { ...res, percent };
        });

        // Add small jitter so they aren't exactly the same if tied
        // (Just relies on their existing sort order to place them)

        renderResultPage(sortedResults);
    }

    function renderResultPage(sortedResults) {
        const top = sortedResults[0];

        // Top match header
        resultTypeTitle.textContent = top.title;
        resultTypeBadge.textContent = top.badge;
        resultDescription.textContent = top.description;
        
        topMatchPercent.textContent = `おすすめ度 ${top.percent}%`;
        setTimeout(() => {
            topMatchBar.style.width = top.percent + '%';
        }, 100);

        // Render Top 3 rankings
        rankingContainer.innerHTML = '';
        const top3 = sortedResults.slice(0, 3);

        top3.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'ranking-card';
            
            let featuresHtml = '';
            item.features.forEach(f => {
                featuresHtml += `<li>${f}</li>`;
            });

            card.innerHTML = `
                <div class="rc-header">
                    <div>
                        <div class="rc-rank">おすすめ第${index + 1}位</div>
                        <div class="rc-name">${item.name}</div>
                    </div>
                    <div class="rc-match">${item.percent}%</div>
                </div>
                <div class="rc-subtitle">${item.badge}</div>
                <ul class="rc-features">
                    ${featuresHtml}
                </ul>
                <a href="${item.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="cta-btn">
                    今すぐ口座開設（無料） →
                </a>
            `;
            rankingContainer.appendChild(card);
        });
    }

    // Event Listeners
    startBtn.addEventListener('click', () => {
        initScores();
        currentQuestionIndex = 0;
        renderQuestion();
        showPage('question');
    });

    backBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });

    retryBtn.addEventListener('click', () => {
        showPage('landing');
    });

    // Init
    initScores();
});
