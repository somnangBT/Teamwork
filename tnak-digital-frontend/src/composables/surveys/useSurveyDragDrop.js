import { ref, onBeforeUnmount } from 'vue';
import domAutoScroll from 'dom-autoscroller';

const autoScroll = domAutoScroll.default || domAutoScroll;

export function useSurveyDragDrop(dynamicSections, onReorderCallback = () => { }, options = {}) {
    let activeGhostEl = null;
    let lastClientX = 0;
    let lastClientY = 0;

    const customDragState = ref({
        isDragging: false,
        type: null, // 'section' | 'question'
        sIndex: null,
        qIndex: null,
        fromSIndex: null,
        fromQIndex: null,
        hoverSIndex: null,
        hoverQIndex: null,
        x: 0,
        y: 0,
        title: '',
        subtitle: '',
        width: 300,
        columnX: 20,
        offsetX: 20,
        offsetY: 20,
        html: '',
        hasChanged: false,
        extraData: null,
        isNewImport: false
    });

    let scroller = null;

    const startCustomDrag = (e, type, sIndex, qIndex = null, extraData = null) => {
        try {
            // Only trigger on left mouse button click
            if (e.button !== 0) return;

            let title = '';
            let subtitle = '';
            if (type === 'section') {
                const sec = dynamicSections.value[sIndex];
                title = sec?.title || `Section ${sIndex + 1}`;
                subtitle = sec?.description || 'No description';
            } else if (type === 'question') {
                const q = dynamicSections.value[sIndex]?.questions[qIndex];
                title = q?.data?.title || q?.title || `Untitled Question ${qIndex + 1}`;
                subtitle = `Question (${q?.type || 'Text'})`;
            } else if (type === 'import_question') {
                title = extraData?.questionText || extraData?.title || extraData?.name || 'Import Question';
                subtitle = `Import (${extraData?.questionType || extraData?.type || 'TEXT'})`;
            }

            let cardEl = null;
            if (type === 'question') {
                cardEl = e.target.closest('.question-card-wrapper');
            } else if (type === 'section') {
                cardEl = e.target.closest('[data-section-tab-idx]');
            } else if (type === 'import_question') {
                cardEl = e.target.closest('.import-question-card');
            }
            
            let width = 300;
            let columnX = e.clientX;
            let offsetX = 20;
            let offsetY = 20;
            let html = '';

            if (activeGhostEl) {
                activeGhostEl.remove();
                activeGhostEl = null;
            }

            if (cardEl) {
                const rect = cardEl.getBoundingClientRect();
                width = rect.width;
                columnX = rect.left;
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                // Sync input values to HTML attributes so outerHTML captures them
                const inputs = cardEl.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (input.tagName === 'SELECT') {
                        const selected = input.querySelector('option:checked');
                        if (selected) {
                            input.querySelectorAll('option').forEach(opt => opt.removeAttribute('selected'));
                            selected.setAttribute('selected', 'selected');
                        }
                    } else if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) input.setAttribute('checked', 'checked');
                        else input.removeAttribute('checked');
                    } else {
                        input.setAttribute('value', input.value);
                        if (input.tagName === 'TEXTAREA') {
                            input.innerHTML = input.value;
                        }
                    }
                });

                html = cardEl.outerHTML;

                activeGhostEl = document.createElement('div');
                activeGhostEl.className = 'custom-floating-card';
                activeGhostEl.style.position = 'fixed';
                activeGhostEl.style.zIndex = '9999999';
                activeGhostEl.style.pointerEvents = 'none';
                activeGhostEl.style.userSelect = 'none';
                activeGhostEl.style.top = (e.clientY - offsetY) + 'px';
                activeGhostEl.style.left = columnX + 'px';
                activeGhostEl.style.width = width + 'px';
                activeGhostEl.style.margin = '0';
                activeGhostEl.style.padding = '0';
                activeGhostEl.style.background = 'transparent';
                activeGhostEl.style.border = 'none';
                activeGhostEl.innerHTML = html;

                if (activeGhostEl.firstElementChild) {
                    activeGhostEl.firstElementChild.style.setProperty('margin', '0', 'important');
                    activeGhostEl.firstElementChild.style.setProperty('margin-bottom', '0', 'important');
                    activeGhostEl.firstElementChild.style.setProperty('width', '100%', 'important');
                    activeGhostEl.firstElementChild.classList.remove('mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5');

                    // Add custom classes for styling the clone
                    activeGhostEl.firstElementChild.classList.add('custom-ghost-clone');

                    if (type === 'question') {
                        const clone = activeGhostEl.firstElementChild;
                        const q = dynamicSections.value[sIndex]?.questions[qIndex];
                        const qType = q?.type || 'TEXT';

                        // Replace inputs and textareas with plain text
                        const textInputs = clone.querySelectorAll('input[type="text"], textarea');
                        textInputs.forEach((input, idx) => {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'd-flex align-items-center gap-1';

                            const textDiv = document.createElement('div');
                            textDiv.className = 'mb-0 fw-medium';
                            textDiv.textContent = input.getAttribute('value') || input.getAttribute('placeholder') || 'Question';
                            wrapper.appendChild(textDiv);

                            // Add required asterisk to the first input (question text) if required
                            let isReq = q?.data?.isRequired;
                            if (options.questionRefs && options.questionRefs.value) {
                                const qRef = options.questionRefs.value[`${sIndex}-${qIndex}`];
                                if (qRef && qRef.formData) {
                                    isReq = qRef.formData.isRequired;
                                }
                            }

                            if (idx === 0 && (isReq === true || String(isReq) === 'true' || isReq === 1)) {
                                const star = document.createElement('span');
                                star.className = 'text-danger';
                                star.textContent = '*';
                                wrapper.appendChild(star);
                            }

                            input.parentNode.replaceChild(wrapper, input);
                        });

                        // Add ... for Choice only
                        if (qType === 'CHOICE') {
                            const card = clone.querySelector('.card');
                            if (card) {
                                const dots = document.createElement('div');
                                dots.className = 'text-center text-muted';
                                dots.style.fontSize = '1.5rem';
                                dots.style.lineHeight = '0.5';
                                dots.style.letterSpacing = '2px';
                                dots.style.marginTop = '0.5rem';
                                dots.style.marginBottom = '0.5rem';
                                dots.textContent = '...';
                                card.appendChild(dots);
                            }
                        }
                    }
                }

                document.body.appendChild(activeGhostEl);
            }

            customDragState.value = {
                isDragging: true,
                type,
                sIndex,
                qIndex,
                fromSIndex: sIndex,
                fromQIndex: qIndex,
                hoverSIndex: sIndex,
                hoverQIndex: qIndex,
                x: e.clientX,
                y: e.clientY,
                title,
                subtitle,
                width,
                columnX,
                offsetX,
                offsetY,
                html,
                hasChanged: false,
                extraData,
                isNewImport: false
            };

            lastClientX = e.clientX;
            lastClientY = e.clientY;

            window.addEventListener('mousemove', onCustomMouseMove);
            window.addEventListener('mouseup', onCustomMouseUp);

            document.body.classList.add('custom-dragging-active');
            document.body.style.cursor = 'move';
            
            if (!scroller) {
                scroller = autoScroll([window], {
                    margin: 150,
                    maxSpeed: 40, // Increased moderately from 25 to 40 for a faster, but still smooth scroll
                    scrollWhenOutside: true,
                    autoScroll: function() {
                        return customDragState.value.isDragging;
                    }
                });
            }
        } catch (err) {
            console.error('Failed to initialize custom drag:', err);
            // Force cleanup if initialization failed mid-way
            customDragState.value.isDragging = false;
            document.body.classList.remove('custom-dragging-active');
            document.body.style.cursor = '';
            if (activeGhostEl) {
                activeGhostEl.remove();
                activeGhostEl = null;
            }
        }
    };

    let lastScrollCheckTime = 0;

    const checkDropTarget = () => {
        try {
            const ghostTopY = lastClientY - customDragState.value.offsetY;

            if (customDragState.value.type === 'section') {
                const tabElements = document.querySelectorAll('[data-section-tab-idx]');
                for (const tabEl of tabElements) {
                    const targetIdx = parseInt(tabEl.getAttribute('data-section-tab-idx'), 10);
                    if (!isNaN(targetIdx) && targetIdx !== customDragState.value.sIndex) {
                        const rect = tabEl.getBoundingClientRect();
                        const isMovingDown = targetIdx > customDragState.value.sIndex;
                        const isMovingUp = targetIdx < customDragState.value.sIndex;

                        if ((isMovingDown && ghostTopY >= rect.top + 10) ||
                            (isMovingUp && ghostTopY <= rect.top - 10)) {

                            const [item] = dynamicSections.value.splice(customDragState.value.sIndex, 1);
                            dynamicSections.value.splice(targetIdx, 0, item);
                            customDragState.value.sIndex = targetIdx;
                            customDragState.value.hoverSIndex = targetIdx;
                            customDragState.value.hasChanged = true;
                            return;
                        }
                    }
                }
            } else if (customDragState.value.type === 'import_question') {
                const tabElements = document.querySelectorAll('[data-section-tab-idx]');
                for (const tabEl of tabElements) {
                    const targetSIdx = parseInt(tabEl.getAttribute('data-section-tab-idx'), 10);
                    if (!isNaN(targetSIdx)) {
                        const rect = tabEl.getBoundingClientRect();
                        if (lastClientX >= rect.left && lastClientX <= rect.right && lastClientY >= rect.top && lastClientY <= rect.bottom) {
                            const toQuestions = dynamicSections.value[targetSIdx].questions;
                            const newQ = {
                                id: crypto.randomUUID(),
                                type: customDragState.value.extraData.questionType || customDragState.value.extraData.type || 'TEXT',
                                data: { ...customDragState.value.extraData },
                                isImported: true
                            };
                            toQuestions.push(newQ);
                            customDragState.value.type = 'question';
                            customDragState.value.sIndex = targetSIdx;
                            customDragState.value.qIndex = toQuestions.length - 1;
                            customDragState.value.hoverSIndex = targetSIdx;
                            customDragState.value.hoverQIndex = toQuestions.length - 1;
                            customDragState.value.hasChanged = true;
                            customDragState.value.isNewImport = true;
                            return;
                        }
                    }
                }
                const qElements = document.querySelectorAll('[data-question-idx]');
                for (const qEl of qElements) {
                    const targetSIdx = parseInt(qEl.getAttribute('data-section-idx'), 10);
                    const targetQIdx = parseInt(qEl.getAttribute('data-question-idx'), 10);
                    if (!isNaN(targetSIdx) && !isNaN(targetQIdx)) {
                        const rect = qEl.getBoundingClientRect();
                        if (lastClientX >= rect.left - 100 && lastClientX <= rect.right + 100) {
                            if (ghostTopY >= rect.top - 10 && ghostTopY <= rect.bottom + 10) {
                                const questions = dynamicSections.value[targetSIdx].questions;
                                const newQ = {
                                    id: crypto.randomUUID(),
                                    type: customDragState.value.extraData.questionType || customDragState.value.extraData.type || 'TEXT',
                                    data: { ...customDragState.value.extraData },
                                    isImported: true
                                };
                                questions.splice(targetQIdx, 0, newQ);
                                customDragState.value.type = 'question';
                                customDragState.value.sIndex = targetSIdx;
                                customDragState.value.qIndex = targetQIdx;
                                customDragState.value.hoverSIndex = targetSIdx;
                                customDragState.value.hoverQIndex = targetQIdx;
                                customDragState.value.hasChanged = true;
                                customDragState.value.isNewImport = true;
                                return;
                            }
                        }
                    }
                }
                const sectionEmptyElements = document.querySelectorAll('.question-card-wrapper');
                if (sectionEmptyElements.length === 0) {
                    const activeSecEl = document.querySelector('[data-section-idx]');
                    if (activeSecEl) {
                        const targetSIdx = parseInt(activeSecEl.getAttribute('data-section-idx'), 10);
                        const questions = dynamicSections.value[targetSIdx].questions;
                        const newQ = {
                            id: crypto.randomUUID(),
                            type: customDragState.value.extraData.questionType || customDragState.value.extraData.type || 'TEXT',
                            data: { ...customDragState.value.extraData },
                            isImported: true
                        };
                        questions.push(newQ);
                        customDragState.value.type = 'question';
                        customDragState.value.sIndex = targetSIdx;
                        customDragState.value.qIndex = 0;
                        customDragState.value.hoverSIndex = targetSIdx;
                        customDragState.value.hoverQIndex = 0;
                        customDragState.value.hasChanged = true;
                        customDragState.value.isNewImport = true;
                        return;
                    }
                }
            } else if (customDragState.value.type === 'question') {
                // Check if hovering over a tab to change sections
                const tabElements = document.querySelectorAll('[data-section-tab-idx]');
                for (const tabEl of tabElements) {
                    const targetSIdx = parseInt(tabEl.getAttribute('data-section-tab-idx'), 10);
                    if (!isNaN(targetSIdx) && targetSIdx !== customDragState.value.sIndex) {
                        const rect = tabEl.getBoundingClientRect();

                        if (lastClientX >= rect.left && lastClientX <= rect.right &&
                            lastClientY >= rect.top && lastClientY <= rect.bottom) {

                            const fromQuestions = dynamicSections.value[customDragState.value.sIndex].questions;
                            const toQuestions = dynamicSections.value[targetSIdx].questions;

                            const [item] = fromQuestions.splice(customDragState.value.qIndex, 1);
                            toQuestions.push(item);

                            customDragState.value.sIndex = targetSIdx;
                            customDragState.value.qIndex = toQuestions.length - 1;
                            customDragState.value.hoverSIndex = targetSIdx;
                            customDragState.value.hoverQIndex = toQuestions.length - 1;
                            customDragState.value.hasChanged = true;
                            return;
                        }
                    }
                }

                // Normal vertical reordering for questions
                const qElements = document.querySelectorAll('[data-question-idx]');
                for (const qEl of qElements) {
                    const targetSIdx = parseInt(qEl.getAttribute('data-section-idx'), 10);
                    const targetQIdx = parseInt(qEl.getAttribute('data-question-idx'), 10);
                    if (!isNaN(targetSIdx) && !isNaN(targetQIdx)) {
                        if (targetSIdx === customDragState.value.sIndex && targetQIdx === customDragState.value.qIndex) continue;

                        const rect = qEl.getBoundingClientRect();

                        // Prevent conflict with tab hovering: only reorder if mouse X is roughly within the question column
                        if (lastClientX < rect.left - 100 || lastClientX > rect.right + 100) continue;

                        const isMovingDown = targetSIdx > customDragState.value.sIndex || (targetSIdx === customDragState.value.sIndex && targetQIdx > customDragState.value.qIndex);
                        const isMovingUp = targetSIdx < customDragState.value.sIndex || (targetSIdx === customDragState.value.sIndex && targetQIdx < customDragState.value.qIndex);

                        if ((isMovingDown && ghostTopY >= rect.top + 10) || (isMovingUp && ghostTopY <= rect.top - 10)) {
                            if (targetSIdx === customDragState.value.sIndex) {
                                const questions = dynamicSections.value[customDragState.value.sIndex].questions;
                                const [item] = questions.splice(customDragState.value.qIndex, 1);
                                questions.splice(targetQIdx, 0, item);
                                customDragState.value.qIndex = targetQIdx;
                                customDragState.value.hoverQIndex = targetQIdx;
                            } else {
                                const fromQuestions = dynamicSections.value[customDragState.value.sIndex].questions;
                                const toQuestions = dynamicSections.value[targetSIdx].questions;
                                const [item] = fromQuestions.splice(customDragState.value.qIndex, 1);
                                toQuestions.splice(targetQIdx, 0, item);
                                customDragState.value.sIndex = targetSIdx;
                                customDragState.value.qIndex = targetQIdx;
                                customDragState.value.hoverSIndex = targetSIdx;
                                customDragState.value.hoverQIndex = targetQIdx;
                            }
                            customDragState.value.hasChanged = true;
                            return;
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error during drop target check:', err);
        }
    };

    const onCustomMouseMove = (e) => {
        try {
            if (!customDragState.value.isDragging) return;

            lastClientX = e.clientX;
            lastClientY = e.clientY;
            customDragState.value.x = e.clientX;
            customDragState.value.y = e.clientY;

            if (activeGhostEl) {
                activeGhostEl.style.top = (e.clientY - customDragState.value.offsetY) + 'px';
                activeGhostEl.style.left = (e.clientX - customDragState.value.offsetX) + 'px';
            }

            // Throttle drop target checking on mouse move to prevent severe layout thrashing lag
            const now = performance.now();
            if (now - lastScrollCheckTime > 50) {
                checkDropTarget();
                lastScrollCheckTime = now;
            }
        } catch (err) {
            console.error('Error during mouse move:', err);
            onCustomMouseUp(); // Gracefully cancel drag to avoid freezing UI
        }
    };

    const onCustomMouseUp = () => {
        try {
            if (!customDragState.value.isDragging) return;

            document.body.classList.remove('custom-dragging-active');

            if (customDragState.value.hasChanged) {
                if (customDragState.value.isNewImport) {
                    onReorderCallback({
                        type: 'import_drop',
                        toSectionIndex: customDragState.value.sIndex,
                        toQuestionIndex: customDragState.value.qIndex,
                        data: customDragState.value.extraData
                    });
                } else {
                    onReorderCallback({
                        type: customDragState.value.type,
                        fromSectionIndex: customDragState.value.fromSIndex,
                        toSectionIndex: customDragState.value.sIndex,
                        fromQuestionIndex: customDragState.value.fromQIndex,
                        toQuestionIndex: customDragState.value.qIndex
                    });
                }
            }
        } catch (err) {
            console.error('Error during drag end:', err);
        } finally {
            // ALWAYS guarantee cleanup runs
            window.removeEventListener('mousemove', onCustomMouseMove);
            window.removeEventListener('mouseup', onCustomMouseUp);

            if (activeGhostEl) {
                activeGhostEl.remove();
                activeGhostEl = null;
            }

            document.body.style.cursor = '';

            // Reset drag state
            customDragState.value = {
                isDragging: false,
                type: null,
                sIndex: null,
                qIndex: null,
                fromSIndex: null,
                fromQIndex: null,
                hoverSIndex: null,
                hoverQIndex: null,
                x: 0,
                y: 0,
                title: '',
                subtitle: '',
                width: 300,
                columnX: 20,
                offsetX: 20,
                offsetY: 20,
                html: '',
                hasChanged: false,
                extraData: null,
                isNewImport: false
            };
        }
    };

    // Clean up global listeners on component unmount
    onBeforeUnmount(() => {
        window.removeEventListener('mousemove', onCustomMouseMove);
        window.removeEventListener('mouseup', onCustomMouseUp);
        if (activeGhostEl) {
            activeGhostEl.remove();
            activeGhostEl = null;
        }
        document.body.classList.remove('custom-dragging-active');
        document.body.style.cursor = '';
    });

    return {
        customDragState,
        startCustomDrag
    };
}
