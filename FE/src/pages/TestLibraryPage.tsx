/**
 * Test Library Page
 * Route: /test-library
 */

import { TestsHub } from '../components/TestsHub';
import { useNavigate } from 'react-router-dom';

export function TestLibraryPage() {
  const navigate = useNavigate();

  const handleOpenExamRoom = () => {
    navigate('/exam-room');
  };

  return <TestsHub onOpenExamRoom={handleOpenExamRoom} />;
}

