import { useEffect, useRef } from 'react';
import { useLearning } from '../context/LearningContext';

export const useLearningProgress = (algorithmId: string, completionSignal: boolean) => {
  const { markVisited, markCompleted, getStatusFor } = useLearning();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    markVisited(algorithmId);
  }, [algorithmId, markVisited]);

  useEffect(() => {
    if (!completionSignal) return;
    if (hasCompletedRef.current) return;

    if (getStatusFor(algorithmId) !== 'completed') {
      markCompleted(algorithmId);
    }

    hasCompletedRef.current = true;
  }, [completionSignal, algorithmId, getStatusFor, markCompleted]);
};
