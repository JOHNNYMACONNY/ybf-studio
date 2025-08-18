import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInteractionOptions {
  delay?: number;
  duration?: number;
  threshold?: number;
  disabled?: boolean;
}

interface UseInteractionReturn {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isActive: boolean;
  interactionProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
  };
}

// Mathematical harmony interaction timing
const INTERACTION_TIMING = {
  HOVER_DELAY: 50,      // Quick hover response
  PRESS_DELAY: 100,     // Press feedback timing
  FOCUS_DELAY: 150,     // Focus state timing
  RELEASE_DELAY: 200,   // Release feedback timing
  DEBOUNCE: 300,        // Debounce for rapid interactions
};

export const useInteraction = (options: UseInteractionOptions = {}): UseInteractionReturn => {
  const {
    delay = 0,
    duration = INTERACTION_TIMING.HOVER_DELAY,
    threshold = 0.1,
    disabled = false
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const touchStartTimeRef = useRef<number>(0);

  // Debounced state updates
  const debouncedSetState = useCallback((setter: (value: boolean) => void, value: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setter(value);
    }, delay);
  }, [delay]);

  // Handle hover interactions
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    debouncedSetState(setIsHovered, true);
  }, [disabled, debouncedSetState]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    debouncedSetState(setIsHovered, false);
    setIsPressed(false);
  }, [disabled, debouncedSetState]);

  // Handle press interactions
  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    setIsActive(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    if (disabled) return;
    setTimeout(() => {
      setIsPressed(false);
      setIsActive(false);
    }, INTERACTION_TIMING.RELEASE_DELAY);
  }, [disabled]);

  // Handle focus interactions
  const handleFocus = useCallback(() => {
    if (disabled) return;
    debouncedSetState(setIsFocused, true);
  }, [disabled, debouncedSetState]);

  const handleBlur = useCallback(() => {
    if (disabled) return;
    debouncedSetState(setIsFocused, false);
  }, [disabled, debouncedSetState]);

  // Handle touch interactions
  const handleTouchStart = useCallback(() => {
    if (disabled) return;
    touchStartTimeRef.current = Date.now();
    setIsPressed(true);
    setIsActive(true);
  }, [disabled]);

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    const touchDuration = Date.now() - touchStartTimeRef.current;
    
    // Only trigger if it's a quick tap (not a long press)
    if (touchDuration < 500) {
      setTimeout(() => {
        setIsPressed(false);
        setIsActive(false);
      }, INTERACTION_TIMING.RELEASE_DELAY);
    } else {
      setIsPressed(false);
      setIsActive(false);
    }
  }, [disabled]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isHovered,
    isPressed,
    isFocused,
    isActive,
    interactionProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    }
  };
};

// Specialized interaction hooks
export const useHover = (options?: UseInteractionOptions) => {
  const { isHovered, interactionProps } = useInteraction(options);
  return { isHovered, ...interactionProps };
};

export const usePress = (options?: UseInteractionOptions) => {
  const { isPressed, interactionProps } = useInteraction(options);
  return { isPressed, ...interactionProps };
};

export const useFocus = (options?: UseInteractionOptions) => {
  const { isFocused, interactionProps } = useInteraction(options);
  return { isFocused, ...interactionProps };
};

export const useActive = (options?: UseInteractionOptions) => {
  const { isActive, interactionProps } = useInteraction(options);
  return { isActive, ...interactionProps };
};

// Combined interaction hook
export const useCombinedInteraction = (options?: UseInteractionOptions) => {
  return useInteraction(options);
}; 