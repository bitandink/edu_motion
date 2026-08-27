"use client";

import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./page.module.css";

type LearningStep = {
  kicker: string;
  title: string;
  body: string;
  phoneTitle: string;
  phoneBody: string;
  cardTitle: string;
  cardBody: string;
};

const learningSteps: LearningStep[] = [
  {
    kicker: "DAY 01 · WATCH",
    title: "미드 장면을 보고",
    body: "짧은 장면으로 오늘 배울 표현의 상황과 뉘앙스를 먼저 만납니다.",
    phoneTitle: "오늘의 Scene",
    phoneBody: "“You’ve got to be kidding me.”",
    cardTitle: "오늘의 장면",
    cardBody: "먼저 상황과 표현을 만나보세요.",
  },
  {
    kicker: "DAY 01 · LEARN",
    title: "표현을 배우고",
    body: "핵심 표현과 단어, 문법을 부담 없는 분량으로 정리합니다.",
    phoneTitle: "오늘의 표현",
    phoneBody:
      "You’ve got to ~\n상황에 따라 달라지는 실제 쓰임을 배워요.",
    cardTitle: "오늘의 표현",
    cardBody: "단어와 표현을 가볍게 이해해요.",
  },
  {
    kicker: "DAY 01 · SPEAK",
    title: "직접 따라 말하고",
    body: "쉐도잉으로 듣기와 말하기를 한 번에 반복합니다.",
    phoneTitle: "Shadowing",
    phoneBody: "Listen  →  Repeat  →  Record",
    cardTitle: "오늘의 쉐도잉",
    cardBody: "듣고, 따라하고, 직접 말해요.",
  },
  {
    kicker: "DAY 01 · COMPLETE",
    title: "오늘의 공부 끝.",
    body: "길게 몰아서 하지 않아도 오늘 해야 할 학습은 여기서 끝납니다.",
    phoneTitle: "오늘 학습 완료",
    phoneBody: "10분 완료 ✓\n내일도 같은 시간에 만나요.",
    cardTitle: "오늘 학습 완료",
    cardBody: "내일도 같은 시간에 만나요.",
  },
];

const systemSteps = [
  ["01", "WATCH", "미드로 보고"],
  ["02", "LEARN", "표현을 배우고"],
  ["03", "SPEAK", "직접 말하고"],
  ["04", "REPEAT", "다시 복습합니다."],
];

const journeyDays = [1, 7, 30, 100, 365];

function clamp(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(
  progress: number,
  start: number,
  end: number,
) {
  if (start === end) {
    return progress >= end ? 1 : 0;
  }

  return clamp(
    (progress - start) / (end - start),
  );
}

/**
 * 각 단계의 opacity를 연속적으로 계산.
 *
 * 단계 0:
 * 0 ~ 약 0.18 유지 → 다음 화면과 crossfade
 *
 * 중간 단계:
 * fade in → 유지 → fade out
 *
 * 마지막 단계:
 * fade in 후 100%까지 유지
 */
function getLayerOpacity(
  progress: number,
  index: number,
  total: number,
) {
  const segment = 1 / total;

  const start = index * segment;
  const end = (index + 1) * segment;

  const fadeSize = segment * 0.3;

  if (index === 0) {
    const fadeOutStart = end - fadeSize;

    if (progress <= fadeOutStart) {
      return 1;
    }

    return (
      1 -
      rangeProgress(
        progress,
        fadeOutStart,
        end + fadeSize,
      )
    );
  }

  if (index === total - 1) {
    const fadeInStart = start - fadeSize;

    return rangeProgress(
      progress,
      fadeInStart,
      start + fadeSize,
    );
  }

  const fadeInStart = start - fadeSize;
  const fadeInEnd = start + fadeSize;

  const fadeOutStart = end - fadeSize;
  const fadeOutEnd = end + fadeSize;

  if (progress < fadeInEnd) {
    return rangeProgress(
      progress,
      fadeInStart,
      fadeInEnd,
    );
  }

  if (progress <= fadeOutStart) {
    return 1;
  }

  return (
    1 -
    rangeProgress(
      progress,
      fadeOutStart,
      fadeOutEnd,
    )
  );
}

function useSectionProgress<
  T extends HTMLElement,
>() {
  const ref = useRef<T | null>(null);

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (!ref.current) {
        return;
      }

      const rect =
        ref.current.getBoundingClientRect();

      const viewport =
        window.innerHeight;

      const travel =
        rect.height - viewport;

      if (travel <= 0) {
        setProgress(0);
        return;
      }

      const raw =
        -rect.top / travel;

      /**
       * 아주 작은 sub-pixel 진동 완화.
       */
      const normalized =
        Math.round(
          clamp(raw) * 10000,
        ) / 10000;

      setProgress(normalized);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);

      frame =
        requestAnimationFrame(update);
    };

    update();

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      onScroll,
    );

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "scroll",
        onScroll,
      );

      window.removeEventListener(
        "resize",
        onScroll,
      );
    };
  }, []);

  return {
    ref,
    progress,
  };
}

/* =========================
   BASIC PHONE
========================= */

function BasicPhone() {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneTop}>
        <span>9:00</span>

        <span
          className={
            styles.dynamicIsland
          }
        />

        <span>5G</span>
      </div>

      <div className={styles.chatHeader}>
        <div
          className={styles.logoBubble}
        >
          S
        </div>

        <div>
          <strong>STEADY365</strong>
          <span>오늘의 영어</span>
        </div>
      </div>

      <div className={styles.chatBody}>
        <div className={styles.dateChip}>
          Today
        </div>

        <div
          className={
            styles.messageBubble
          }
        >
          <span
            className={
              styles.messageLabel
            }
          >
            오늘의 영어
          </span>

          <p>
            오늘도 10분,
            {"\n"}
            함께 시작해볼까요?
          </p>
        </div>

        <div className={styles.miniCard}>
          <div
            className={styles.miniVisual}
          >
            <span>10</span>
            <small>MIN</small>
          </div>

          <div>
            <strong>
              오늘의 루틴
            </strong>

            <p>
              보고 · 배우고 · 말하고
              · 완료하기
            </p>
          </div>
        </div>
      </div>

      <div
        className={styles.phoneHomeBar}
      />
    </div>
  );
}

/* =========================
   EXPERIENCE PHONE
========================= */

function ExperiencePhone({
  progress,
}: {
  progress: number;
}) {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneTop}>
        <span>9:00</span>

        <span
          className={
            styles.dynamicIsland
          }
        />

        <span>5G</span>
      </div>

      <div className={styles.chatHeader}>
        <div
          className={styles.logoBubble}
        >
          S
        </div>

        <div>
          <strong>STEADY365</strong>
          <span>오늘의 영어</span>
        </div>
      </div>

      <div
        className={
          styles.experiencePhoneBody
        }
      >
        <div className={styles.dateChip}>
          Today
        </div>

        {learningSteps.map(
          (step, index) => {
            const opacity =
              getLayerOpacity(
                progress,
                index,
                learningSteps.length,
              );

            const translateY =
              (1 - opacity) * 28;

            const scale =
              0.97 +
              opacity * 0.03;

            return (
              <div
                key={step.kicker}
                className={
                  styles.phoneExperienceLayer
                }
                style={
                  {
                    opacity,
                    transform: `translateY(${translateY}px) scale(${scale})`,
                  } as CSSProperties
                }
              >
                <div
                  className={
                    styles.messageBubble
                  }
                >
                  <span
                    className={
                      styles.messageLabel
                    }
                  >
                    {step.phoneTitle}
                  </span>

                  <p>
                    {step.phoneBody}
                  </p>
                </div>

                <div
                  className={
                    styles.miniCard
                  }
                >
                  <div
                    className={
                      styles.miniVisual
                    }
                  >
                    <span>
                      {index === 3
                        ? "✓"
                        : "10"}
                    </span>

                    <small>
                      {index === 3
                        ? "DONE"
                        : "MIN"}
                    </small>
                  </div>

                  <div>
                    <strong>
                      {step.cardTitle}
                    </strong>

                    <p>
                      {step.cardBody}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>

      <div
        className={styles.phoneHomeBar}
      />
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function Home() {
  const experience =
    useSectionProgress<HTMLElement>();

  const dayJourney =
    useSectionProgress<HTMLElement>();

  const experienceLayers =
    learningSteps.map(
      (step, index) => {
        const opacity =
          getLayerOpacity(
            experience.progress,
            index,
            learningSteps.length,
          );

        return {
          step,
          opacity,
          translateY:
            (1 - opacity) * 42,
        };
      },
    );

  const experienceIndex =
    Math.min(
      learningSteps.length - 1,
      Math.floor(
        experience.progress *
          learningSteps.length,
      ),
    );

  const dayIndex = Math.min(
    journeyDays.length - 1,
    Math.floor(
      dayJourney.progress *
        journeyDays.length,
    ),
  );

  const activeDay =
    journeyDays[dayIndex];

  return (
    <main className={styles.page}>
      {/* =====================
          01 HERO
      ===================== */}

      <section className={styles.hero}>
        <div
          className={styles.heroGlow}
        />

        <div
          className={styles.heroInner}
        >
          <p className={styles.eyebrow}>
            STEADY 365 · ENGLISH
            ROUTINE
          </p>

          <h1>
            영어 공부,
            <br />
            매번 시작만 하고
            있나요?
          </h1>

          <p className={styles.heroLead}>
            하루 단 10분.
            <br />
            영어가 습관이 되는
            시간.
          </p>

          <div
            className={
              styles.heroPhone
            }
          >
            <BasicPhone />

            <div
              className={
                styles.notification
              }
            >
              <span>
                STEADY365
              </span>

              <strong>
                오늘의 영어가
                도착했어요 💬
              </strong>
            </div>
          </div>
        </div>

        <div
          className={styles.scrollHint}
        >
          SCROLL ↓
        </div>
      </section>

      {/* =====================
          02 PROBLEM
      ===================== */}

      <section
        className={styles.problem}
      >
        <div
          className={
            styles.problemInner
          }
        >
          <p
            className={
              styles.sectionNumber
            }
          >
            01 · WHY
          </p>

          <h2>작심삼일.</h2>

          <p
            className={
              styles.problemCopy
            }
          >
            또 시작하고,
            <br />
            또 포기하고.
          </p>

          <div
            className={
              styles.problemCards
            }
          >
            {[
              "영어 인강 48분",
              "단어장 300개",
              "문법책 500페이지",
              "영어 앱 알림",
              "학원 숙제",
            ].map(
              (item, index) => (
                <div
                  key={item}
                  className={
                    styles.problemCard
                  }
                  style={
                    {
                      "--i": index,
                    } as CSSProperties
                  }
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div
            className={
              styles.problemAnswer
            }
          >
            <span>
              문제는 의지가 아니라
            </span>

            <strong>
              계속하기 어려운 방법
            </strong>

            <span>
              이었을지도 모릅니다.
            </span>
          </div>

          <div
            className={
              styles.tenMinuteStamp
            }
          >
            <strong>10</strong>
            <span>MINUTES</span>
          </div>

          <p
            className={
              styles.centerCopy
            }
          >
            그래서 우리는 하루
            10분만 보냅니다.
          </p>
        </div>
      </section>

      {/* =====================
          03 EXPERIENCE
      ===================== */}

      <section
        ref={experience.ref}
        className={
          styles.experience
        }
      >
        <div
          className={
            styles.experienceSticky
          }
        >
          <div
            className={
              styles.experienceGrid
            }
          >
            <div
              className={
                styles.phoneColumn
              }
            >
              <ExperiencePhone
                progress={
                  experience.progress
                }
              />

              <div
                className={
                  styles.progressTrack
                }
              >
                <span
                  style={{
                    transform: `scaleX(${experience.progress})`,
                  }}
                />
              </div>

              <div
                className={
                  styles.experienceProgress
                }
              >
                <span>
                  {String(
                    experienceIndex +
                      1,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>

                <i />

                <span>04</span>
              </div>
            </div>

            <div
              className={
                styles.stepColumn
              }
            >
              <p
                className={
                  styles.sectionNumber
                }
              >
                02 · EXPERIENCE
              </p>

              <div
                className={
                  styles.experienceTextStage
                }
              >
                {experienceLayers.map(
                  ({
                    step,
                    opacity,
                    translateY,
                  }) => (
                    <div
                      key={
                        step.kicker
                      }
                      className={
                        styles.experienceTextLayer
                      }
                      style={{
                        opacity,
                        transform: `translateY(calc(-50% + ${translateY}px))`,
                      }}
                    >
                      <span>
                        {
                          step.kicker
                        }
                      </span>

                      <h2>
                        {step.title}
                      </h2>

                      <p>
                        {step.body}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div
                className={
                  styles.stepNav
                }
              >
                {learningSteps.map(
                  (
                    step,
                    index,
                  ) => {
                    const isPassed =
                      index <=
                      experienceIndex;

                    return (
                      <div
                        key={
                          step.kicker
                        }
                        className={
                          isPassed
                            ? styles.stepNavActive
                            : undefined
                        }
                      >
                        <span>
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <p>
                          {step.kicker
                            .split(
                              "·",
                            )[1]
                            ?.trim()}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================
          04 TEN MINUTES
      ===================== */}

      <section
        className={styles.tenMinutes}
      >
        <p
          className={
            styles.sectionNumber
          }
        >
          03 · ONLY TEN MINUTES
        </p>

        <div className={styles.timer}>
          10:00
        </div>

        <h2>
          하루 10분이면
          충분합니다.
        </h2>

        <div
          className={styles.wordStack}
        >
          {[
            "영상",
            "오늘의 표현",
            "단어",
            "문법",
            "쉐도잉",
          ].map((word) => (
            <span key={word}>
              {word}
            </span>
          ))}
        </div>
      </section>

      {/* =====================
          05 SYSTEM
      ===================== */}

      <section
        className={styles.system}
      >
        <div
          className={
            styles.systemHeader
          }
        >
          <p
            className={
              styles.sectionNumber
            }
          >
            04 · LEARNING SYSTEM
          </p>

          <h2>
            짧게 시작하고,
            <br />
            자연스럽게
            반복합니다.
          </h2>
        </div>

        <div
          className={
            styles.systemGrid
          }
        >
          {systemSteps.map(
            ([num, title, body]) => (
              <article
                key={num}
                className={
                  styles.systemCard
                }
              >
                <span>{num}</span>

                <h3>{title}</h3>

                <p>{body}</p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* =====================
          06 ROUTINE
      ===================== */}

      <section
        className={styles.routine}
      >
        <div
          className={
            styles.routineCopy
          }
        >
          <p
            className={
              styles.sectionNumber
            }
          >
            05 · ROUTINE
          </p>

          <h2>
            하루의 체크가
            <br />
            한 달의 기록이
            됩니다.
          </h2>

          <p>
            평일에는 가볍게
            학습하고,
            <br />
            주말에는 한 번 더
            복습합니다.
          </p>
        </div>

        <div
          className={styles.calendar}
        >
          <div
            className={
              styles.calendarHeader
            }
          >
            <strong>AUGUST</strong>

            <span>
              ROUTINE LOG
            </span>
          </div>

          <div
            className={
              styles.weekdays
            }
          >
            {"MON TUE WED THU FRI SAT SUN"
              .split(" ")
              .map((day) => (
                <span key={day}>
                  {day}
                </span>
              ))}
          </div>

          <div
            className={
              styles.calendarGrid
            }
          >
            {Array.from(
              {
                length: 28,
              },
              (_, index) =>
                index + 1,
            ).map((day) => {
              const isWeekday =
                (day - 1) % 7 <
                5;

              return (
                <div
                  key={day}
                  className={
                    styles.calendarDay
                  }
                >
                  <span>
                    {day}
                  </span>

                  {isWeekday ? (
                    <b>✓</b>
                  ) : (
                    <small>
                      REVIEW
                    </small>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={
              styles.completeBadge
            }
          >
            30 DAYS COMPLETE ✓
          </div>
        </div>
      </section>

      {/* =====================
          07 DAY JOURNEY
      ===================== */}

      <section
        ref={dayJourney.ref}
        className={
          styles.dayJourney
        }
      >
        <div
          className={
            styles.daySticky
          }
        >
          <p
            className={
              styles.sectionNumber
            }
          >
            06 · KEEP GOING
          </p>

          <div
            className={
              styles.dayCounter
            }
          >
            <span>DAY</span>

            <strong
              key={activeDay}
            >
              {String(
                activeDay,
              ).padStart(2, "0")}
            </strong>
          </div>

          <div
            className={
              styles.dayTimeline
            }
          >
            {journeyDays.map(
              (day) => (
                <span
                  key={day}
                  className={
                    day <=
                    activeDay
                      ? styles.dayActive
                      : undefined
                  }
                >
                  {day}
                </span>
              ),
            )}
          </div>

          {activeDay === 365 && (
            <div
              className={
                styles.dayFinal
              }
            >
              <p>어느 순간,</p>

              <h2>
                공부가 아니라
                <br />
                습관이 되어 있을
                거예요.
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* =====================
          08 BENEFITS
      ===================== */}

      <section
        className={styles.benefits}
      >
        <div
          className={
            styles.benefitIntro
          }
        >
          <p
            className={
              styles.sectionNumber
            }
          >
            07 · BENEFITS
          </p>

          <h2>
            시작하기 어렵지
            않도록.
          </h2>
        </div>

        <div
          className={
            styles.benefitGrid
          }
        >
          {[
            [
              "01",
              "3일 체험",
              "부담 없이 먼저 경험해보세요.",
            ],
            [
              "02",
              "하루 10분",
              "매일 가능한 만큼만.",
            ],
            [
              "03",
              "카톡 학습",
              "익숙한 화면에서 바로 시작.",
            ],
            [
              "04",
              "루틴 설계",
              "반복할 수 있게 단순하게.",
            ],
          ].map(
            ([num, title, body]) => (
              <article key={num}>
                <span>{num}</span>

                <h3>{title}</h3>

                <p>{body}</p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* =====================
          09 CTA
      ===================== */}

      <section className={styles.cta}>
        <p className={styles.eyebrow}>
          START YOUR ROUTINE
        </p>

        <h2>
          오늘부터
          <br />
          하루 10분.
        </h2>

        <p>
          영어를 공부하지 말고,
          <br />
          영어가 익숙해지세요.
        </p>

        <div
          className={
            styles.productCard
          }
        >
          <span>
            STEADY365 ENGLISH
          </span>

          <strong>
            미드 속 뻔하지 않은
            영어 표현
          </strong>

          <button type="button">
            지금 시작하기
            <i>→</i>
          </button>
        </div>
      </section>
    </main>
  );
}