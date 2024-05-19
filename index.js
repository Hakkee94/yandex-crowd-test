const JSCarousel = ({
                        carouselSelector,
                        slideSelector,
                        enablePagination = true,
                    }) => {
    let currentSlideIndex = 0;
    let prevBtn, nextBtn;
    let paginationContainer;

    const carousel = document.querySelector(carouselSelector);
    const isSecondCarousel = carouselSelector === ".main-content__members__slider"
    const activeClass = isSecondCarousel ? "carousel-number--active" : "carousel-btn--active"

    if (!carousel) {
        console.error("Specify a valid selector for the carousel.");
        return null;
    }

    const slides = carousel.querySelectorAll(slideSelector);
    const control = carousel.querySelector(
        ".stages_of_transformation__slider__carousel"
    );

    if (!slides.length) {
        console.error("Specify a valid selector for slides.");
        return null;
    }

    const addElement = (tag, attributes, children) => {
        const element = document.createElement(tag);

        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (children) {
            if (typeof children === "string") {
                element.textContent = children;
            } else {
                children.forEach((child) => {
                    if (typeof child === "string") {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
            }
        }

        return element;
    };

    const tweakStructure = () => {
        carousel.setAttribute("tabindex", "0");

        const carouselInner = addElement("div", {
            class: "carousel-inner",
        });

        const carouselControlInner = addElement("div", {
            class: "carousel-control",
        });

        carousel.insertBefore(carouselControlInner, control);

        carousel.insertBefore(carouselInner, slides[0]);

        slides.forEach((slide) => {
            carouselInner.appendChild(slide);
        });

        prevBtn = addElement(
            "button",
            {
                class: "carousel_btn_prev carousel_btn",
                "aria-label": "Previous Slide",
            },
            "<"
        );
        carouselControlInner.appendChild(prevBtn);

        nextBtn = addElement(
            "button",
            {
                class: "carousel_btn_next carousel_btn",
                "aria-label": "Next Slide",
            },
            ">"
        );
        carouselControlInner.appendChild(nextBtn);

        if (enablePagination) {
            paginationContainer = addElement("nav", {
                class: "carousel-pagination",
                role: "tablist",
            });
            carouselControlInner.appendChild(paginationContainer);
        }

        slides.forEach((slide, index, arr) => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                slide.style.transform = `translateX(${index * 100}%)`;
            } else {
                slide.style.transform = `translateX(${(index) * 33.3}%)`;
            }
            console.log(arr.length)
            if (enablePagination && isSecondCarousel) {
                const paginationBtn = addElement(
                    "span",
                    {
                        class: `carousel-number caroursel-number--${index + 1} ${!index && 'carousel-number--active'}`,
                        role: "tab",
                    },
                    (index + 1) + '/' + arr.length
                );

                paginationContainer.appendChild(paginationBtn);
            } else if (enablePagination && !isSecondCarousel) {
                const paginationBtn = addElement(
                    "button",
                    {
                        class: `carousel-btn caroursel-btn--${index + 1}`,
                        role: "tab",
                    },
                    `${index + 1}`
                );

                paginationContainer.appendChild(paginationBtn);

                if (index === 0) {
                    paginationBtn.classList.add(activeClass);
                    paginationBtn.setAttribute("aria-selected", true);
                }

                paginationBtn.addEventListener("click", () => {
                    handlePaginationBtnClick(index);
                });
            }
        });
    };

    const adjustSlidePosition = () => {
        slides.forEach((slide, i) => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                slide.style.transform = `translateX(${100 * (i - currentSlideIndex)}%)`;
            } else {
                slide.style.transform = `translateX(${
                    33.3 * (i - currentSlideIndex)
                }%)`;
            }
        });
    };

    const updatePaginationBtns = () => {
        const paginationBtns = paginationContainer.children;
        const prevActiveBtns = Array.from(paginationBtns).filter((btn) =>
            btn.classList.contains(activeClass)
        );
        prevActiveBtns.forEach((btn) => {
            btn.classList.remove(activeClass);
            btn.removeAttribute("aria-selected");
        });

        const currActiveBtns = paginationBtns[currentSlideIndex];
        if (currActiveBtns) {
            currActiveBtns.classList.add(activeClass);
            currActiveBtns.setAttribute("aria-selected", true);
        }
    };

    const updateCarouselState = () => {
        if (enablePagination) {
            updatePaginationBtns();
        }
        adjustSlidePosition();
    };

    const moveSlide = (direction) => {
        const newSlideIndex =
            direction === "next"
                ? (currentSlideIndex + 1) % slides.length
                : (currentSlideIndex - 1 + slides.length) % slides.length;
        currentSlideIndex = newSlideIndex;
        updateCarouselState();
    };

    const handlePaginationBtnClick = (index) => {
        currentSlideIndex = index;
        updateCarouselState();
    };

    const handlePrevBtnClick = () => moveSlide("prev");
    const handleNextBtnClick = () => moveSlide("next");

    const attachEventListeners = () => {
        prevBtn.addEventListener("click", handlePrevBtnClick);
        nextBtn.addEventListener("click", handleNextBtnClick);
        isSecondCarousel && setInterval(handleNextBtnClick,4000);
    };

    const create = () => {
        tweakStructure();
        attachEventListeners();
    };

    const destroy = () => {
        prevBtn.removeEventListener("click", handlePrevBtnClick);
        nextBtn.removeEventListener("click", handleNextBtnClick);
        if (enablePagination) {
            const paginationBtns =
                paginationContainer.querySelectorAll(".carousel_btn");
            if (paginationBtns.length) {
                paginationBtns.forEach((btn) => {
                    btn.removeEventListener("click", handlePaginationBtnClick);
                });
            }
        }
    };

    return { create, destroy };
};

const carousel2 = JSCarousel({
    carouselSelector: ".main-content__members__slider",
    slideSelector: ".main-content__members__slider__box",
});

carousel2.create();

window.addEventListener("unload", () => {
    carousel2.destroy();
});

if (window.matchMedia("(max-width: 768px)").matches) {
    const carousel1 = JSCarousel({
        carouselSelector: ".stages-of-transformation__slider",
        slideSelector: ".slide",
    });

    carousel1.create();

    window.addEventListener("unload", () => {
        carousel1.destroy();
    });

    const sliderBtn = document.querySelectorAll(".carousel_btn");

    function buttonHandler() {
        const firstDot = document.querySelector(".carousel-btn:first-child");
        const lastDot = document.querySelector(".carousel-btn:last-child");
        const prevBtn = document.querySelector(".carousel_btn_prev");
        const nextBtn = document.querySelector(".carousel_btn_next");

        if (firstDot.classList.contains("carousel-btn--active")) {
            prevBtn.classList.add("carousel-btn_disabled");
            prevBtn.setAttribute("disabled", "");
        } else {
            prevBtn.classList.remove("carousel-btn_disabled");
            prevBtn.removeAttribute("disabled");
        }

        if (lastDot.classList.contains("carousel-btn--active")) {
            nextBtn.classList.add("carousel-btn_disabled");
            nextBtn.setAttribute("disabled", "");
        } else {
            nextBtn.classList.remove("carousel-btn_disabled");
            nextBtn.removeAttribute("disabled");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        buttonHandler();
    });

    window.addEventListener("DOMContentLoaded", (event) => {
        [...sliderBtn].forEach((el) =>
            el.addEventListener("click", function (e) {
                buttonHandler();
            })
        );
    });
}
