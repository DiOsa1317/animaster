addListeners();

function addListeners() {
    console.log(animaster)
    const an = animaster();
    let fadeIn = null;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            fadeIn = an.addFadeIn(block, 5000);
            an.play(block);
        });

    document.getElementById('fadeInStop')
        .addEventListener('click', function() {
            fadeIn.stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            an.move(block, 1000, { x: 100, y: 10 });
            an.play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            an.scale(block, 1000, 1.25);
            an.play(block);
        });

    let moveAndHide = null;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = animaster().moveAndHide(block, 5000, { x: 100, y: 10 });
        });

    document.getElementById('moveAndHideStop')
        .addEventListener('click', function() {
            moveAndHide.stop();
        });

    let fadeOut = null;
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            fadeOut = animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutStop')
        .addEventListener('click', function() {
            fadeOut.stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    let heart = null;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            heart = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            heart.stop();
        })
    document.getElementById('aaaPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('aaaBlock');
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block);
        })
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };

    function resetMoveAndHide(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };


    return {
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {
                stop() {
                    resetFadeIn(element);
                }
            }
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                stop() {
                    resetFadeOut(element);
                }
            }
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation)
            setTimeout(() => {
                this.fadeOut(element, 3 / 5 * duration)
            }, 3 / 5 * duration);
            return {
                stop() {
                    resetMoveAndHide(element);
                }
            }
        },
        showAndHide(element, duration) {
            this.fadeIn(element, 1 / 3 * duration)
            setTimeout(() => { this.fadeOut(element, 1 / 3 * duration) }, 2 / 3 * duration)
        },
        heartBeating(element) {
            let interval = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                        this.scale(element, 500, 5 / 7);
                    },
                    500);
            }, 1000);
            return {
                interval,
                stop() {
                    clearInterval(interval);
                }
            }
        },
        _steps: [],

        addMove(duration, translation) {
            this._steps.push({
                type: 'move',
                duration,
                translation
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                type: 'scale',
                duration,
                ratio
            });
            return this;
        },
        addFadeIn(element, duration) {
            this._steps.push({
                type: 'fadeIn',
                element,
                duration,
            });
            return this;
        },
        addFadeOut(element, duration) {
            this._steps.push({
                type: 'fadeOut',
                element,
                duration,
            });
            return this;
        },
        play(element) {
            let currentTime = 0;
            const steps = [...this._steps]; // Copy steps
            this._steps = []; // Clear steps for next use

            steps.forEach(step => {
                setTimeout(() => {
                    switch (step.type) {
                        case 'move':
                            this.move(element, step.duration, step.translation);
                            break;
                        case 'scale':
                            this.scale(element, step.duration, step.ratio);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                    }
                }, currentTime);

                currentTime += step.duration;
            });

            // Return a combined stop function for the whole sequence
            return {
                stop() {
                    // Clear all timeouts? This is tricky with setTimeout
                    // You might want to implement a more sophisticated approach
                    resetFadeIn(element);
                    resetFadeOut(element);
                    resetScale(element);
                }
            };
        },
    }
}