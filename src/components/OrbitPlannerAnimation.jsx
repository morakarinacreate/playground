import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * OrbitPlannerAnimation
 * 
 * A hero animation showing "messy thoughts" floating in orbit around a head,
 * then organizing into a structured plan.
 * 
 * Animation Phases (loops every ~16 seconds):
 * - Phase 1 (0-4s): Messy orbit - items float randomly within circle
 * - Phase 2 (4-8s): Node activates - glowing node travels slowly along orbit
 * - Phase 3 (8-16s): Hold organized state before reset
 */

// All items in final organized order (removed Groceries)
const ITEMS = [
  { id: 'task-1', type: 'task', label: 'Walk Fido', emojiEnd: '🐕', group: null },
  { id: 'meet-1', type: 'meeting', label: 'Standup Call', time: '9am', group: null },
  { id: 'task-2', type: 'task', label: 'Pay Electric', group: null },
  { id: 'task-3', type: 'task', label: 'Read book 30 min', goalIcon: true, group: null },
  { id: 'meet-2', type: 'meeting', label: 'Client Call', time: '2pm', group: null },
  { id: 'task-4', type: 'task', label: 'Buy baby shower gift', group: 'errands' },
  { id: 'task-5', type: 'task', label: 'Return amazon package', group: 'errands' },
  { id: 'meet-3', type: 'meeting', label: 'Yoga Class', time: '6pm', group: null },
]

// Circle radius (half of container width: 520/2 = 260)
const ORBIT_RADIUS = 260

// Fixed starting positions - distributed evenly around the circle, no overlaps
// Using golden angle distribution for even spacing
const INITIAL_POSITIONS = [
  { x: -100, y: -60 },   // Walk Fido - upper left
  { x: -170, y: 150 },   // 9am Standup - bottom left
  { x: -195, y: 0 },     // Pay Electric - mid left
  { x: 60, y: -20 },      // Email landlord - mid right
  { x: -295, y: -180 },   // 2pm Client Call - far left
  { x: 50, y: 100 },      // Buy baby shower gift - lower right
  { x: -120, y: 60 },     // Return amazon package - far left near track
  { x: 50, y: -100 },     // 6pm Yoga Class - upper right
]

// Generate random position within circle bounds
const getRandomPositionInCircle = (radius, padding = 40) => {
  const angle = Math.random() * Math.PI * 2
  const r = Math.random() * (radius - padding)
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  }
}

// Bounded drift animation - keeps items within circle
const useBoundedDrift = (isActive, radius, itemIndex) => {
  // Use the pre-defined initial position for this item
  const initialPos = INITIAL_POSITIONS[itemIndex] || { x: 0, y: 0 }
  
  const [position, setPosition] = useState(initialPos)
  const velocityRef = useRef({ 
    x: (Math.sin(itemIndex * 2.3) * 0.3), 
    y: (Math.cos(itemIndex * 3.7) * 0.3) 
  })
  const rafRef = useRef(null)
  const hasResetRef = useRef(false)

  // Reset position when becoming active again (new cycle)
  useEffect(() => {
    if (isActive && !hasResetRef.current) {
      // On first activation, use the initial position
      setPosition(initialPos)
      hasResetRef.current = true
    } else if (!isActive) {
      hasResetRef.current = false
    }
  }, [isActive, initialPos])

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocityRef.current.x
        let newY = prev.y + velocityRef.current.y
        
        const dist = Math.sqrt(newX * newX + newY * newY)
        const maxDist = radius + 30  // Allow items to drift slightly beyond the track
        
        if (dist > maxDist) {
          const nx = newX / dist
          const ny = newY / dist
          const dot = velocityRef.current.x * nx + velocityRef.current.y * ny
          velocityRef.current.x -= 2 * dot * nx
          velocityRef.current.y -= 2 * dot * ny
          newX = nx * maxDist * 0.95
          newY = ny * maxDist * 0.95
        }
        
        // Gentle drift with slight randomness
        velocityRef.current.x += (Math.random() - 0.5) * 0.015
        velocityRef.current.y += (Math.random() - 0.5) * 0.015
        velocityRef.current.x *= 0.995
        velocityRef.current.y *= 0.995
        
        return { x: newX, y: newY }
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isActive, radius])

  return position
}

// Interpolate between two positions based on progress (0-1)
const lerp = (start, end, progress) => start + (end - start) * progress

// Task pill component
const TaskItem = ({ item, index, organizedPosition, phase, transitionProgress }) => {
  const shouldFloat = phase === 1
  const driftPos = useBoundedDrift(shouldFloat, ORBIT_RADIUS, index)
  
  // During phase 2, interpolate between drift position and organized position
  // During phase 3, use organized position
  // During phase 1, use drift position
  let currentPos
  if (phase === 1) {
    currentPos = driftPos
  } else if (phase === 2) {
    // Smoothly interpolate based on transition progress
    currentPos = {
      x: lerp(driftPos.x, organizedPosition.x, transitionProgress),
      y: lerp(driftPos.y, organizedPosition.y, transitionProgress),
    }
  } else {
    currentPos = organizedPosition
  }

  // Items in errands group should have no border in organized state
  const isInGroup = item.group === 'errands'
  const hideGroupItemBorder = isInGroup && transitionProgress > 0.5
  
  // Fixed width to match group envelope
  const targetWidth = 190

  return (
    <motion.div
      className="orbit-task-item"
      style={hideGroupItemBorder ? { border: 'none', boxShadow: 'none' } : undefined}
      initial={false}
      animate={{
        x: currentPos.x,
        y: currentPos.y,
        width: targetWidth,
      }}
      transition={{
        x: { duration: 0.1, ease: 'linear' },
        y: { duration: 0.1, ease: 'linear' },
        width: { duration: 0.8, ease: 'easeOut' },
      }}
    >
      {/* Always show checkbox at start for tasks */}
      <svg className="orbit-checkbox" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span>{item.label}</span>
      {/* Emoji at end */}
      {item.emojiEnd && <span className="orbit-emoji">{item.emojiEnd}</span>}
      {/* Goal icon at end */}
      {item.goalIcon && (
        <svg className="orbit-goal-icon" viewBox="0 0 16 16" fill="none" width="14" height="14">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="1" fill="currentColor" />
        </svg>
      )}
    </motion.div>
  )
}

// Meeting block component
const MeetingItem = ({ item, index, organizedPosition, phase, transitionProgress }) => {
  const shouldFloat = phase === 1
  const driftPos = useBoundedDrift(shouldFloat, ORBIT_RADIUS, index)
  
  // Same interpolation logic as TaskItem
  let currentPos
  if (phase === 1) {
    currentPos = driftPos
  } else if (phase === 2) {
    currentPos = {
      x: lerp(driftPos.x, organizedPosition.x, transitionProgress),
      y: lerp(driftPos.y, organizedPosition.y, transitionProgress),
    }
  } else {
    currentPos = organizedPosition
  }

  // Fixed width to match group envelope
  const targetWidth = 190

  return (
    <motion.div
      className="orbit-meeting-item"
      initial={false}
      animate={{
        x: currentPos.x,
        y: currentPos.y,
        width: targetWidth,
      }}
      transition={{
        x: { duration: 0.1, ease: 'linear' },
        y: { duration: 0.1, ease: 'linear' },
        width: { duration: 0.8, ease: 'easeOut' },
      }}
    >
      <span className="orbit-meeting-time">{item.time}</span>
      <span>{item.label}</span>
    </motion.div>
  )
}

// Head icon SVG
const HeadIcon = () => (
  <svg className="orbit-head-icon" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="18" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 42c0-6.627 5.373-12 12-12s12 5.373 12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// Orbit circle with glow effect
const OrbitCircle = ({ phase, nodeAngle }) => {
  const isGlowing = phase >= 2
  
  return (
    <div className="orbit-circle-container">
      <svg className="orbit-circle" viewBox="-260 -260 520 520">
        {/* Black background fill */}
        <circle
          cx="0"
          cy="0"
          r={ORBIT_RADIUS}
          fill="#F1EFEA"
          fillOpacity="0.3"
          stroke="none"
        />
        {/* Dashed outline */}
        <circle
          cx="0"
          cy="0"
          r={ORBIT_RADIUS}
          fill="none"
          stroke="none"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="orbit-circle-base"
        />
      </svg>
      
      <motion.svg
        className="orbit-circle-glow"
        viewBox="-260 -260 520 520"
        initial={{ opacity: 0 }}
        animate={{ opacity: isGlowing ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="0"
          cy="0"
          r={ORBIT_RADIUS}
          fill="none"
          stroke="var(--orbit-accent-light)"
          strokeWidth="3"
          filter="url(#glow)"
          strokeDasharray={`${nodeAngle * (ORBIT_RADIUS * Math.PI * 2 / 360)} 2000`}
          strokeDashoffset="0"
          transform="rotate(-90)"
          strokeLinecap="butt"
        />
      </motion.svg>
    </div>
  )
}

// Moon icon SVG
const MoonIcon = () => (
  <svg 
    className="orbit-node-icon" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
)

// Glowing node that travels along orbit
const OrbitNode = ({ phase, angle }) => {
  const isVisible = phase >= 2
  const x = Math.cos((angle - 90) * Math.PI / 180) * ORBIT_RADIUS
  const y = Math.sin((angle - 90) * Math.PI / 180) * ORBIT_RADIUS

  return (
    <motion.div
      className="orbit-node"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        x,
        y,
      }}
      transition={{ 
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
    >
      <MoonIcon />
    </motion.div>
  )
}

// Group envelope component
const GroupEnvelope = ({ label, visible, x, y, width, height }) => {
  // Position using left/top with transform for centering (same as tasks)
  return (
    <motion.div
      className="orbit-group-envelope"
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.9,
      }}
      transition={{ 
        opacity: { duration: 0.5, delay: visible ? 0.1 : 0 },
        scale: { duration: 0.5, delay: visible ? 0.1 : 0 },
      }}
    >
      <span className="orbit-category-label">{label}</span>
    </motion.div>
  )
}

// Main component
export default function OrbitPlannerAnimation() {
  const [phase, setPhase] = useState(1)
  const [nodeAngle, setNodeAngle] = useState(0)
  const [transitionProgress, setTransitionProgress] = useState(0) // 0-1, how far items have transitioned
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Organized positions - centered within the orb
  // The After Work Errands group takes up a "block" space with tasks inside
  const organizedPositions = useMemo(() => {
    const baseX = -95  // Centered (offset by half the 190px item width)
    const spacing = 48  // spacing between regular items (increased)
    const startY = -190  // Starting position (raised more)
    
    // Group block position and dimensions
    const groupBlockY = 85  // Where the group block is centered (raised more)
    const groupBlockHeight = 75  // Height of the group block
    const insideGroupSpacing = 30  // Spacing for items inside group
    
    // Items inside the group are positioned relative to the group center
    const firstTaskInGroupY = groupBlockY - 15  // First task above center
    const secondTaskInGroupY = firstTaskInGroupY + insideGroupSpacing  // Second task below
    
    // Yoga class goes AFTER the group with extra margin
    const yogaClassY = 155  // Fixed position below the group block (raised more)
    
    return [
      // Walk Fido
      { x: baseX, y: startY },                    // y = -155
      // 9am Standup
      { x: baseX, y: startY + spacing },          // y = -115
      // Pay Electric
      { x: baseX, y: startY + spacing * 2 },      // y = -75
      // Read book 30 min
      { x: baseX, y: startY + spacing * 3 },      // y = -35
      // 2pm Client Call
      { x: baseX, y: startY + spacing * 4 },      // y = 5
      // After Work Errands - tasks INSIDE the group block (moved down)
      { x: baseX, y: firstTaskInGroupY },         // Buy baby shower gift: y = 62
      { x: baseX, y: secondTaskInGroupY },        // Return amazon package: y = 88
      // 6pm Yoga Class - AFTER the group block with extra margin
      { x: baseX, y: yogaClassY },                // y = ~147
    ]
  }, [])

  // Animation loop
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    let animationFrame
    let startTime = Date.now()
    const cycleDuration = 16000 // Extended for longer hold at end

    const animate = () => {
      const elapsed = (Date.now() - startTime) % cycleDuration
      const progress = elapsed / cycleDuration

      if (progress < 0.25) {
        // Phase 1: Floating (4s)
        setPhase(1)
        setNodeAngle(0)
        setTransitionProgress(0)
      } else if (progress < 0.5) {
        // Phase 2: Node moves around, items gradually transition (4s)
        setPhase(2)
        const nodeProgress = (progress - 0.25) / 0.25
        setNodeAngle(nodeProgress * 360)
        // Use eased progress for smoother item transition
        const easedProgress = 1 - Math.pow(1 - nodeProgress, 2) // easeOutQuad
        setTransitionProgress(easedProgress)
      } else {
        // Phase 3: Hold organized state (8s - double the previous hold time)
        setPhase(3)
        setNodeAngle(360)
        setTransitionProgress(1)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPaused, prefersReducedMotion])

  if (prefersReducedMotion && !isPaused) {
    return (
      <div className="orbit-animation-container">
        <div className="orbit-stage orbit-static">
          <HeadIcon />
          <p className="orbit-reduced-motion-text">
            Animation paused for reduced motion preference
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="orbit-animation-container">
      <div className="orbit-stage orbit-stage-large">
        {/* Orbit circle with glow */}
        <OrbitCircle phase={phase} nodeAngle={nodeAngle} />
        
        {/* Glowing node */}
        <OrbitNode phase={phase} angle={nodeAngle} />
        
        {/* Head icon at CENTER of circle - fades out when tasks start moving */}
        <motion.div 
          className="orbit-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeadIcon />
        </motion.div>
        
        {/* All items and group envelopes */}
        <div className="orbit-items-layer">
          {/* Group envelope - After Work Errands acts as a block in the list */}
          <GroupEnvelope 
            label="After Work Errands" 
            visible={transitionProgress > 0.5} 
            x={-95}
            y={60}
            width={190}
            height={80}
          />
          
          {ITEMS.map((item, i) => (
            item.type === 'task' ? (
              <TaskItem
                key={item.id}
                item={item}
                index={i}
                organizedPosition={organizedPositions[i]}
                phase={phase}
                transitionProgress={transitionProgress}
              />
            ) : (
              <MeetingItem
                key={item.id}
                item={item}
                index={i}
                organizedPosition={organizedPositions[i]}
                phase={phase}
                transitionProgress={transitionProgress}
              />
            )
          ))}
        </div>
      </div>
      
      {/* Pause toggle */}
      <button
        className="orbit-pause-toggle"
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
      >
        {isPaused ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        )}
      </button>
    </div>
  )
}
