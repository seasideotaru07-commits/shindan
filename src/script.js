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
    const shareXBtn = document.getElementById('share-x');
    const shareLineBtn = document.getElementById('share-line');
    const shareCopyBtn = document.getElementById('share-copy');
    
    // Question UI
    const currentQEl = document.getElementById('current-q');
    const totalQEl = document.getElementById('total-q');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressBar = document.getElementById('progress-bar');
    const qnumCircle = document.getElementById('q-circle-num');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionContentWrapper = document.getElementById('question-content-wrapper');

    // Result UI

    const topMatchContainer = document.getElementById('top-match-container');
    const rankingContainer = document.getElementById('ranking-container');

    // State
    let currentQuestionIndex = 0;
    let scores = {};
    const totalQuestions = questionsData.length;
    let sortedResultsForShare = null;

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
            btn.addEventListener('click', (e) => handleOptionClick(opt.scores, e.currentTarget));
            optionsContainer.appendChild(btn);
        });
    }

    // Handle Answer
    function handleOptionClick(optionScores, btnElement) {
        // Add scores
        for (const [id, value] of Object.entries(optionScores)) {
            if (scores[id] !== undefined) {
                scores[id] += value;
            }
        }
        
        if (btnElement) {
            btnElement.classList.add('selected');
        }

        setTimeout(() => {
            currentQuestionIndex++;

            if (currentQuestionIndex < totalQuestions) {
                questionContentWrapper.classList.remove('slide-active');
                questionContentWrapper.classList.add('slide-out');
                
                setTimeout(() => {
                    renderQuestion();
                    questionContentWrapper.classList.remove('slide-out');
                    questionContentWrapper.classList.add('slide-in');
                    void questionContentWrapper.offsetWidth;
                    questionContentWrapper.classList.remove('slide-in');
                    questionContentWrapper.classList.add('slide-active');
                }, 200); // 400ms -> 200ms
            } else {
                // Finish
                const finalPercent = 100;
                progressPercentEl.textContent = finalPercent + '%';
                progressBar.style.width = finalPercent + '%';
                
                setTimeout(() => {
                    showLoading();
                }, 150);
            }
        }, 150); // 300ms -> 150ms に短縮
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

        sortedResultsForShare = sortedResults; // シェア用に保存
        renderResultPage(sortedResults);
    }

    function createConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#26c6da', '#ff9800', '#e91e63', '#4caf50', '#ffeb3b'];
        
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // X軸の全域（0%〜100%）から発射するように変更
            const leftOrigin = Math.random() * 100;
            // ランダムな方向へ大きく散らばる（-600px 〜 600px）
            const xMovement = (Math.random() - 0.5) * 1200;
            // 高さ（-400px 〜 -1000px）まで飛ぶ
            const yMovement = -400 - Math.random() * 600;
            
            confetti.style.left = leftOrigin + 'vw';
            confetti.style.bottom = '0'; // 下からスタート
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // CSS変数に移動量と回転を渡す
            confetti.style.setProperty('--x', `${xMovement}px`);
            confetti.style.setProperty('--y', `${yMovement}px`);
            const rotation = Math.random() * 720 - 360;
            confetti.style.setProperty('--r', `${rotation}deg`);

            // タイミングずらす
            confetti.style.animationDelay = Math.random() * 0.2 + 's';
            // 発射して落ちるまで
            confetti.style.animationDuration = Math.random() * 1 + 2 + 's'; // 2〜3秒

            container.appendChild(confetti);
        }
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 4000);
    }

    function renderResultPage(sortedResults) {
        createConfetti();
        const top = sortedResults[0];

        // 1位のレンダリング (Top Match Hero)
        let topFeaturesHtml = '';
        top.features.forEach(f => {
            topFeaturesHtml += `<li>${f}</li>`;
        });

        topMatchContainer.innerHTML = `
            <div class="first-place-hero">
                <div class="fp-badge"><span class="crown-icon">👑</span> あなたに最もおすすめ（第1位）</div>
                <h3 class="fp-name">${top.name}</h3>
                <div class="fp-match-rate">
                    おすすめ度 <span class="highlight-percent">${top.percent}%</span>
                </div>
                <div class="fp-catchphrase">${top.title}</div>
                <div class="fp-description">${top.description}</div>
                <ul class="rc-features fp-features">
                    ${topFeaturesHtml}
                </ul>
                <a href="${top.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="cta-btn fp-cta">
                    今すぐ口座開設（無料） →
                </a>
            </div>
        `;

        // Render Top 2 & 3 rankings
        rankingContainer.innerHTML = '';
        const otherRanks = sortedResults.slice(1, 3);

        otherRanks.forEach((item, index) => {
            const actualRank = index + 2; // 2位・3位
            const rankText = `おすすめ第${actualRank}位`;

            const card = document.createElement('div');
            card.className = 'ranking-card';
            
            let featuresHtml = '';
            item.features.forEach(f => {
                featuresHtml += `<li>${f}</li>`;
            });

            card.innerHTML = `
                <div class="rc-header">
                    <div>
                        <div class="rc-rank">${rankText}</div>
                        <div class="rc-name">${item.name}</div>
                    </div>
                    <div>
                        <div class="rc-match">${item.percent}%</div>
                        <div class="rc-match-bar-wrap">
                            <div class="rc-match-bar-fill" style="width: 0%;" id="rc-match-bar-${actualRank}"></div>
                        </div>
                    </div>
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

        setTimeout(() => {
            otherRanks.forEach((item, index) => {
                const actualRank = index + 2;
                const bar = document.getElementById(`rc-match-bar-${actualRank}`);
                if (bar) bar.style.width = item.percent + '%';
            });
        }, 400);
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
            
            questionContentWrapper.classList.remove('slide-active');
            questionContentWrapper.classList.add('slide-in');
            
            setTimeout(() => {
                renderQuestion();
                questionContentWrapper.classList.remove('slide-in');
                questionContentWrapper.classList.add('slide-out');
                void questionContentWrapper.offsetWidth;
                questionContentWrapper.classList.remove('slide-out');
                questionContentWrapper.classList.add('slide-active');
            }, 200); // 400ms -> 200ms
        }
    });

    retryBtn.addEventListener('click', () => {
        showPage('landing');
    });

    // 結果をシェアするボタンの処理（個別）
    const getShareText = () => {
        // トップのタイトル（キャッチフレーズ）を取得してシェアテキストに使用
        const topResultCatchphrase = sortedResultsForShare ? sortedResultsForShare[0].title : '証券口座'; 
        return `私の証券口座診断結果は「${topResultCatchphrase}」でした！あなたも1分で最適な証券口座を診断しよう！`;
    };

    if (shareXBtn) {
        shareXBtn.addEventListener('click', () => {
            const text = encodeURIComponent(getShareText());
            const url = encodeURIComponent(window.location.href);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        });
    }

    if (shareLineBtn) {
        shareLineBtn.addEventListener('click', () => {
            const text = encodeURIComponent(getShareText() + '\n' + window.location.href);
            window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
        });
    }

    if (shareCopyBtn) {
        shareCopyBtn.addEventListener('click', () => {
            const textToCopy = getShareText() + '\n' + window.location.href;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('リンクとメッセージをクリップボードにコピーしました！');
            }).catch(err => {
                console.error('クリップボードのコピーに失敗しました:', err);
                alert('コピー機能が利用できませんでした。');
            });
        });
    }

    // Init
    initScores();
});
