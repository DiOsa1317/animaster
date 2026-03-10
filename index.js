addListeners();

function addListeners() {
    console.log(animaster)
    let fadeIn = null;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            fadeIn = animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInStop')
        .addEventListener('click', function() {
            fadeIn.stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
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
        }
    }
}