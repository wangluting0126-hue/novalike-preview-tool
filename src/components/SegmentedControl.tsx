import React from 'react';
import type { VersionType } from '../types';

interface SegmentedControlProps {
  value: VersionType;
  onChange: (value: VersionType) => void;
  options: { label: string; value: VersionType }[];
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div className="seg-control">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={value === opt.value ? 'active' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
