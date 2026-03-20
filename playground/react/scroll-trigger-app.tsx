import { useScrollTrigger, TransformProvider } from 'hamo'
import { Minimap } from 'hamo/scroll-trigger'
import type { TransformRef } from 'hamo'
import { useRef, useState } from 'react'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="st-section">
      <h2>{title}</h2>
      <div className="st-section-content">{children}</div>
    </section>
  )
}

function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="st-value">
      <span className="st-value-label">{label}</span>
      <span className="st-value-data">{value ?? '---'}</span>
    </div>
  )
}

// 1. Hero / Intro
function HeroSection() {
  return (
    <Section title="useScrollTrigger">
      <p className="st-description">
        Scroll-based progress tracking with GSAP ScrollTrigger-like position
        syntax. Integrates with Lenis when available, falls back to native
        scroll events. Scroll down to explore each feature.
      </p>
      <p className="st-description">
        <strong>Position syntax:</strong>{' '}
        <code>"element-position viewport-position"</code>
      </p>
      <table className="st-syntax-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Element</th>
            <th>Viewport</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>top</td>
            <td>Top edge of element</td>
            <td>Top of viewport</td>
          </tr>
          <tr>
            <td>center</td>
            <td>Center of element</td>
            <td>Center of viewport</td>
          </tr>
          <tr>
            <td>bottom</td>
            <td>Bottom edge of element</td>
            <td>Bottom of viewport</td>
          </tr>
          <tr>
            <td>number</td>
            <td>Pixel offset from top</td>
            <td>Pixel offset from top</td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

// 2. Basic Progress
function BasicProgressDemo() {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const progressValueRef = useRef<HTMLSpanElement>(null)
  const activeValueRef = useRef<HTMLSpanElement>(null)
  const heightValueRef = useRef<HTMLSpanElement>(null)
  const directionValueRef = useRef<HTMLSpanElement>(null)

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    debug: 'basic',
    onEnter: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'false'
    },
    onProgress: ({ progress, isActive, height, direction }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
      if (progressValueRef.current) {
        progressValueRef.current.textContent = progress.toFixed(3)
      }
      if (activeValueRef.current) {
        activeValueRef.current.textContent = isActive ? 'true' : 'false'
      }
      if (heightValueRef.current) {
        heightValueRef.current.textContent = `${Math.round(height)}px`
      }
      if (directionValueRef.current) {
        directionValueRef.current.textContent =
          direction === 1 ? '\u2193 down' : '\u2191 up'
      }
    },
  })

  return (
    <Section title="Basic Progress">
      <p className="st-description">
        Tracks scroll progress from 0 to 1 as the element traverses the
        viewport. Uses <code>start: "bottom bottom"</code> and{' '}
        <code>end: "top top"</code> (the defaults) for full traversal.
      </p>
      <div className="st-spacer">
        <span>Scroll to see progress</span>
      </div>
      <div
        ref={(el) => {
          setRef(el)
          boxRef.current = el
        }}
        className="st-progress-box"
        data-active="false"
      >
        <div className="st-progress-bar" ref={progressBarRef} />
        <div className="st-progress-info">
          <Value
            label="progress"
            value={<span ref={progressValueRef}>0.000</span>}
          />
          <Value
            label="isActive"
            value={<span ref={activeValueRef}>false</span>}
          />
          <Value label="height" value={<span ref={heightValueRef}>---</span>} />
          <Value
            label="direction"
            value={<span ref={directionValueRef}>---</span>}
          />
        </div>
        <p className="st-hint">start: "bottom bottom" / end: "top top"</p>
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 3. Enter / Leave Events
function EnterLeaveDemo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<string[]>([])

  const addEvent = (
    type: 'enter' | 'leave',
    progress: number,
    direction: 1 | -1
  ) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const className = type === 'enter' ? 'st-event-enter' : 'st-event-leave'
    const label = type === 'enter' ? 'ENTER' : 'LEAVE'
    const dir = direction === 1 ? '\u2193' : '\u2191'
    eventsRef.current = [
      ...eventsRef.current.slice(-4),
      `<span class="${className}">[${time}] ${label} ${dir}</span> progress: ${progress.toFixed(3)}`,
    ]
    if (logRef.current) {
      logRef.current.innerHTML = eventsRef.current.join('<br/>')
    }
  }

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    debug: 'events',
    onEnter: ({ progress, direction }) => {
      if (boxRef.current) boxRef.current.dataset.active = 'true'
      addEvent('enter', progress, direction)
    },
    onLeave: ({ progress, direction }) => {
      if (boxRef.current) boxRef.current.dataset.active = 'false'
      addEvent('leave', progress, direction)
    },
  })

  return (
    <Section title="Enter / Leave Events">
      <p className="st-description">
        <code>onEnter</code> fires when the element enters the trigger zone.{' '}
        <code>onLeave</code> fires when it exits. Each callback receives{' '}
        <code>direction</code> (1 = down, -1 = up). Scroll past this element and
        back to see the event log update.
      </p>
      <div className="st-spacer">
        <span>Scroll to trigger enter/leave</span>
      </div>
      <div
        ref={(el) => {
          setRef(el)
          boxRef.current = el
        }}
        className="st-event-box"
        data-active="false"
      >
        <Value label="status" value="Scroll through to trigger events" />
        <div className="st-event-log" ref={logRef}>
          Waiting for events...
        </div>
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 4. Position Combinations
function PositionCard({
  startPos,
  endPos,
  label,
}: {
  startPos: string
  endPos: string
  label: string
}) {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [setRef] = useScrollTrigger({
    start: startPos as `${string} ${string}`,
    end: endPos as `${string} ${string}`,
    onEnter: () => {
      if (cardRef.current) cardRef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (cardRef.current) cardRef.current.dataset.active = 'false'
    },
    onProgress: ({ progress }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
      if (valueRef.current) {
        valueRef.current.textContent = progress.toFixed(3)
      }
    },
  })

  return (
    <div
      ref={(el) => {
        setRef(el)
        cardRef.current = el
      }}
      className="st-position-card"
      data-active="false"
    >
      <div className="st-progress-bar" ref={progressBarRef} />
      <div className="st-position-label">{label}</div>
      <div className="st-position-label">
        start: "{startPos}" / end: "{endPos}"
      </div>
      <div className="st-position-value">
        <span ref={valueRef}>0.000</span>
      </div>
    </div>
  )
}

function PositionCombinationsDemo() {
  return (
    <Section title="Position Combinations">
      <p className="st-description">
        Different <code>start</code> / <code>end</code> positions change when
        progress runs. Compare how each configuration behaves as you scroll.
      </p>
      <div className="st-spacer">
        <span>Scroll to compare positions</span>
      </div>
      <div className="st-positions-grid">
        <PositionCard
          startPos="bottom bottom"
          endPos="top top"
          label="Full traversal (default)"
        />
        <PositionCard
          startPos="bottom bottom"
          endPos="top center"
          label="Bottom to center"
        />
        <PositionCard
          startPos="center center"
          endPos="top top"
          label="Center to top"
        />
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 5. Steps / Staggered Animation
function StepsDemo() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const STEP_COUNT = 6

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    steps: STEP_COUNT,
    debug: 'steps',
    onProgress: ({ steps }) => {
      for (let i = 0; i < steps.length; i++) {
        const el = itemRefs.current[i]
        if (el) {
          const stepProgress = steps[i]
          el.style.opacity = String(0.2 + stepProgress * 0.8)
          el.style.transform = `translateY(${(1 - stepProgress) * 20}px)`
          el.dataset.visible = stepProgress > 0 ? 'true' : 'false'
        }
      }
    },
  })

  return (
    <Section title="Steps / Staggered Animation">
      <p className="st-description">
        Using <code>steps: {STEP_COUNT}</code> to subdivide progress into{' '}
        {STEP_COUNT} discrete sub-ranges. Each item animates based on its
        individual step progress, creating a staggered effect.
      </p>
      <div className="st-spacer">
        <span>Scroll to see staggered animation</span>
      </div>
      <div ref={setRef} className="st-steps-list">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="st-step-item"
            data-visible="false"
          >
            Step {i + 1} / {STEP_COUNT}
          </div>
        ))}
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 6. Offset
function OffsetDemo() {
  const cardARef = useRef<HTMLDivElement>(null)
  const cardBRef = useRef<HTMLDivElement>(null)
  const valueARef = useRef<HTMLSpanElement>(null)
  const valueBRef = useRef<HTMLSpanElement>(null)

  const [setRefA] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    offset: 0,
    onEnter: () => {
      if (cardARef.current) cardARef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (cardARef.current) cardARef.current.dataset.active = 'false'
    },
    onProgress: ({ progress }) => {
      if (valueARef.current) {
        valueARef.current.textContent = progress.toFixed(3)
      }
    },
  })

  const [setRefB] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    offset: -200,
    onEnter: () => {
      if (cardBRef.current) cardBRef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (cardBRef.current) cardBRef.current.dataset.active = 'false'
    },
    onProgress: ({ progress }) => {
      if (valueBRef.current) {
        valueBRef.current.textContent = progress.toFixed(3)
      }
    },
  })

  return (
    <Section title="Offset">
      <p className="st-description">
        The <code>offset</code> option shifts element positions by a pixel
        amount. Compare <code>offset: 0</code> (default) vs{' '}
        <code>offset: -200</code> - the second triggers earlier.
      </p>
      <div className="st-spacer">
        <span>Scroll to compare offsets</span>
      </div>
      <div className="st-offset-grid">
        <div
          ref={(el) => {
            setRefA(el)
            cardARef.current = el
          }}
          className="st-offset-card"
          data-active="false"
        >
          <div className="st-offset-label">offset: 0</div>
          <div className="st-offset-value">
            <span ref={valueARef}>0.000</span>
          </div>
        </div>
        <div
          ref={(el) => {
            setRefB(el)
            cardBRef.current = el
          }}
          className="st-offset-card"
          data-active="false"
        >
          <div className="st-offset-label">offset: -200</div>
          <div className="st-offset-value">
            <span ref={valueBRef}>0.000</span>
          </div>
        </div>
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 7. Disabled Toggle
function DisabledDemo() {
  const [disabled, setDisabled] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    disabled,
    onEnter: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'false'
    },
    onProgress: ({ progress }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
      if (valueRef.current) {
        valueRef.current.textContent = progress.toFixed(3)
      }
    },
  })

  return (
    <Section title="Disabled Toggle">
      <p className="st-description">
        The <code>disabled</code> option stops progress updates. Toggle it to
        see the progress bar freeze in place.
      </p>
      <div className="st-toggle-row">
        <button
          type="button"
          data-active={String(disabled)}
          onClick={() => setDisabled((v) => !v)}
          aria-label={
            disabled ? 'Enable scroll trigger' : 'Disable scroll trigger'
          }
        >
          {disabled ? 'Disabled' : 'Enabled'}
        </button>
      </div>
      <div className="st-spacer">
        <span>Scroll to see progress {disabled ? '(disabled)' : ''}</span>
      </div>
      <div
        ref={(el) => {
          setRef(el)
          boxRef.current = el
        }}
        className="st-progress-box"
        data-active="false"
      >
        <div className="st-progress-bar" ref={progressBarRef} />
        <div className="st-progress-info">
          <Value label="progress" value={<span ref={valueRef}>0.000</span>} />
          <Value label="disabled" value={disabled ? 'true' : 'false'} />
        </div>
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 8. CSS Custom Property
function CSSPropertyDemo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    onProgress: ({ progress }) => {
      if (boxRef.current) {
        boxRef.current.style.setProperty('--progress', String(progress))
      }
      if (valueRef.current) {
        valueRef.current.textContent = progress.toFixed(3)
      }
    },
  })

  return (
    <Section title="CSS Custom Property">
      <p className="st-description">
        Set <code>--progress</code> as a CSS custom property to drive transforms
        purely through CSS. The box below uses <code>translateY</code>,{' '}
        <code>scale</code>, <code>rotate</code>, and <code>opacity</code> all
        driven by a single variable.
      </p>
      <div className="st-spacer">
        <span>Scroll to animate via CSS variable</span>
      </div>
      <div
        ref={(el) => {
          setRef(el)
          boxRef.current = el
        }}
        className="st-css-demo"
      >
        <div className="st-css-box" />
        <span className="st-css-label">
          --progress: <span ref={valueRef}>0.000</span>
        </span>
      </div>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

// 9. TransformProvider (Parallax Compensation)
function TransformChildTrigger() {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const [setRef] = useScrollTrigger({
    onEnter: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'true'
    },
    onLeave: () => {
      if (boxRef.current) boxRef.current.dataset.active = 'false'
    },
    onProgress: ({ progress }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
      if (valueRef.current) {
        valueRef.current.textContent = progress.toFixed(3)
      }
    },
  })

  return (
    <div
      ref={(el) => {
        setRef(el)
        boxRef.current = el
      }}
      className="st-transform-child"
      data-active="false"
    >
      <div className="st-progress-bar" ref={progressBarRef} />
      <Value label="child progress" value={<span ref={valueRef}>0.000</span>} />
      <p className="st-hint">
        This child compensates for the parent's translateY
      </p>
    </div>
  )
}

function TransformDemo() {
  const transformRef = useRef<TransformRef>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const offsetValueRef = useRef<HTMLSpanElement>(null)

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'top top',
    onProgress: ({ progress }) => {
      const y = (progress - 0.5) * -400
      transformRef.current?.setTranslate(0, y)
      if (parentRef.current) {
        parentRef.current.style.transform = `translateY(${y}px)`
      }
      if (offsetValueRef.current) {
        offsetValueRef.current.textContent = `${Math.round(y)}px`
      }
    },
  })

  return (
    <Section title="TransformProvider">
      <p className="st-description">
        When a parent element is translated programmatically (e.g., parallax),
        child <code>useScrollTrigger</code> hooks need to know about that
        offset. <code>TransformProvider</code> propagates transform state down
        the tree so child triggers compute accurate progress despite the parent
        moving.
      </p>
      <div className="st-spacer">
        <span>Scroll to see parallax compensation</span>
      </div>
      <TransformProvider ref={transformRef}>
        <div
          ref={(el) => {
            setRef(el)
            parentRef.current = el
          }}
          className="st-transform-parent"
        >
          <div className="st-transform-header">
            <Value
              label="parent translateY"
              value={<span ref={offsetValueRef}>0px</span>}
            />
          </div>
          <TransformChildTrigger />
        </div>
      </TransformProvider>
      <div className="st-spacer">
        <span>Scroll back up</span>
      </div>
    </Section>
  )
}

export default function ScrollTriggerApp() {
  return (
    <div className="st-playground">
      <Minimap theme="light" />
      <header>
        <h1>useScrollTrigger</h1>
        <p>
          Scroll-based progress tracking with position syntax, enter/leave
          callbacks, steps, offset, and CSS variable integration.
        </p>
      </header>

      <HeroSection />
      <BasicProgressDemo />
      <EnterLeaveDemo />
      <PositionCombinationsDemo />
      <StepsDemo />
      <OffsetDemo />
      <DisabledDemo />
      <CSSPropertyDemo />
      <TransformDemo />

      <footer>
        <p>
          <a
            href="https://github.com/darkroomengineering/hamo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {' / '}
          <a
            href="https://www.npmjs.com/package/hamo"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
        </p>
      </footer>
    </div>
  )
}
