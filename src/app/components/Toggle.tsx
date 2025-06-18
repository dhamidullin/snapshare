import { ChangeEvent } from 'react';
import styled from 'styled-components';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ToggleTrack = styled.div`
  width: 40px;
  height: 24px;
  background-color: #e9ecef;
  border-radius: 34px;
  padding: 2px;
  transition: background-color 0.2s ease;
  position: relative;

  &[data-checked="true"] {
    background-color: #2196f3;
  }

  &[data-disabled="true"] {
    background-color: #ccc;
  }
`;

const ToggleThumb = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 2px;
  top: 2px;

  &[data-checked="true"] {
    transform: translateX(16px);
  }
`;

const ToggleInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleLabel = styled.span`
  color: #4a4a4a;
  font-size: 0.95rem;
`;

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <ToggleWrapper data-disabled={disabled}>
      <ToggleInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <ToggleTrack data-checked={checked} data-disabled={disabled}>
        <ToggleThumb data-checked={checked} />
      </ToggleTrack>
      {label && <ToggleLabel>{label}</ToggleLabel>}
    </ToggleWrapper>
  );
};

export default Toggle; 