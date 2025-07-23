import React, { useState } from 'react';
import { DatePicker, Button, Dropdown, Tag } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CalendarOutlined, DownOutlined, CloseOutlined,  } from '@ant-design/icons';
import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

const { RangePicker } = DatePicker;

type DateRange = [Dayjs, Dayjs] | null;
type PresetKey = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last7Days' | 'last30Days' | 'last90Days' | 'thisYear' | 'lastYear';

interface DatePreset {
  label: string;
  value: DateRange;
  key: PresetKey;
}

export interface DateRangePickerProps extends Omit<RangePickerProps, 'value' | 'onChange' | 'presets'> {
  /** Selected date range */
  value?: DateRange;
  /** Callback when date range changes */
  onChange?: (range: DateRange, rangeString: [string, string]) => void;
  /** Whether to show preset options */
  showPresets?: boolean;
  /** Custom preset options */
  presets?: DatePreset[];
  /** Whether to show relative time descriptions */
  showRelativeTime?: boolean;
  /** Date format for display */
  format?: string;
  /** Whether to show time selection */
  showTime?: boolean;
  /** Custom placeholder text */
  placeholder?: [string, string];
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Whether to allow clearing the selection */
  allowClear?: boolean;
  /** Size of the picker */
  size?: 'small' | 'middle' | 'large';
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const DateRangeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--rescale-space-2);
`;

const StyledRangePicker = styled(RangePicker)`
  .ant-picker-input > input {
    font-family: var(--rescale-font-family);
    color: var(--rescale-color-gray-900);
  }
  
  .ant-picker-separator {
    color: var(--rescale-color-gray-500);
  }
  
  .ant-picker-suffix {
    color: var(--rescale-color-gray-500);
  }
  
  &.ant-picker-focused {
    border-color: var(--rescale-color-brand-blue);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
  
  &:hover {
    border-color: var(--rescale-color-brand-blue);
  }
  
  &.ant-picker-disabled {
    background: var(--rescale-color-gray-100);
    border-color: var(--rescale-color-gray-300);
    
    .ant-picker-input > input {
      color: var(--rescale-color-gray-500);
    }
  }
`;

const PresetDropdown = styled.div`
  padding: var(--rescale-space-2);
  min-width: 180px;
`;

const PresetSection = styled.div`
  margin-bottom: var(--rescale-space-3);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PresetTitle = styled.div`
  font-size: var(--rescale-font-size-xs);
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--rescale-space-2);
  padding: 0 var(--rescale-space-2);
`;

const PresetButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: var(--rescale-space-2) var(--rescale-space-3);
  border: none;
  background: ${props => props.$active ? 'var(--rescale-color-light-blue)' : 'transparent'};
  color: ${props => props.$active ? 'var(--rescale-color-brand-blue)' : 'var(--rescale-color-gray-700)'};
  text-align: left;
  border-radius: var(--rescale-radius-base);
  font-size: var(--rescale-font-size-sm);
  font-weight: ${props => props.$active ? 'var(--rescale-font-weight-medium)' : 'var(--rescale-font-weight-normal)'};
  cursor: pointer;
  transition: all var(--rescale-duration-normal);
  
  &:hover {
    background: var(--rescale-color-gray-100);
    color: var(--rescale-color-brand-blue);
  }
  
  &:active {
    background: var(--rescale-color-light-blue);
  }
`;

const RelativeTimeTag = styled(Tag)`
  margin-left: var(--rescale-space-2);
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-600);
  background: var(--rescale-color-gray-100);
  border: 1px solid var(--rescale-color-gray-300);
`;

const ClearButton = styled(Button)`
  padding: 0;
  height: auto;
  border: none;
  background: transparent;
  color: var(--rescale-color-gray-500);
  font-size: var(--rescale-font-size-xs);
  
  &:hover,
  &:focus {
    color: var(--rescale-color-brand-blue);
    background: transparent;
    border: none;
  }
`;

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  showPresets = true,
  presets,
  showRelativeTime = true,
  format = 'YYYY-MM-DD',
  showTime = false,
  placeholder = ['Start date', 'End date'],
  disabled = false,
  allowClear = true,
  size = 'middle',
  className,
  style,
  ...rangePickerProps
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const defaultPresets: DatePreset[] = [
    {
      label: 'Today',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
      key: 'today',
    },
    {
      label: 'Yesterday',
      value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
      key: 'yesterday',
    },
    {
      label: 'This Week',
      value: [dayjs().startOf('week'), dayjs().endOf('week')],
      key: 'thisWeek',
    },
    {
      label: 'Last Week',
      value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')],
      key: 'lastWeek',
    },
    {
      label: 'This Month',
      value: [dayjs().startOf('month'), dayjs().endOf('month')],
      key: 'thisMonth',
    },
    {
      label: 'Last Month',
      value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
      key: 'lastMonth',
    },
    {
      label: 'Last 7 Days',
      value: [dayjs().subtract(7, 'day'), dayjs()],
      key: 'last7Days',
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().subtract(30, 'day'), dayjs()],
      key: 'last30Days',
    },
    {
      label: 'Last 90 Days',
      value: [dayjs().subtract(90, 'day'), dayjs()],
      key: 'last90Days',
    },
    {
      label: 'This Year',
      value: [dayjs().startOf('year'), dayjs().endOf('year')],
      key: 'thisYear',
    },
    {
      label: 'Last Year',
      value: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
      key: 'lastYear',
    },
  ];

  const activePresets = presets || defaultPresets;

  const getRelativeTimeText = (range: DateRange) => {
    if (!range || !range[0] || !range[1]) return null;

    const [start, end] = range;
    const now = dayjs();
    const diffDays = end.diff(start, 'day') + 1;

    if (start.isSame(end, 'day')) {
      if (start.isSame(now, 'day')) {
        return 'Today';
      } else if (start.isSame(now.subtract(1, 'day'), 'day')) {
        return 'Yesterday';
      } else {
        return `${Math.abs(now.diff(start, 'day'))} days ago`;
      }
    }

    if (diffDays <= 7) {
      return `${diffDays} days`;
    } else if (diffDays <= 31) {
      return `${Math.ceil(diffDays / 7)} weeks`;
    } else if (diffDays <= 365) {
      return `${Math.ceil(diffDays / 30)} months`;
    } else {
      return `${Math.ceil(diffDays / 365)} years`;
    }
  };

  const isPresetActive = (preset: DatePreset) => {
    if (!value || !preset.value) return false;
    
    const [valueStart, valueEnd] = value;
    const [presetStart, presetEnd] = preset.value;
    
    return valueStart?.isSame(presetStart, 'day') && valueEnd?.isSame(presetEnd, 'day');
  };

  const handlePresetSelect = (preset: DatePreset) => {
    if (preset.value) {
      const rangeString: [string, string] = [
        preset.value[0].format(format),
        preset.value[1].format(format),
      ];
      onChange?.(preset.value, rangeString);
    }
    setDropdownVisible(false);
  };

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    const range: DateRange = dates ? [dates[0], dates[1]] : null;
    onChange?.(range, dateStrings);
  };

  const handleClear = () => {
    onChange?.(null, ['', '']);
  };

  const groupedPresets = {
    quick: activePresets.filter(p => ['today', 'yesterday', 'last7Days', 'last30Days'].includes(p.key)),
    periods: activePresets.filter(p => ['thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'].includes(p.key)),
    extended: activePresets.filter(p => ['last90Days', 'thisYear', 'lastYear'].includes(p.key)),
  };

  const presetDropdown = (
    <PresetDropdown>
      {groupedPresets.quick.length > 0 && (
        <PresetSection>
          <PresetTitle>Quick Select</PresetTitle>
          {groupedPresets.quick.map((preset) => (
            <PresetButton
              key={preset.key}
              $active={isPresetActive(preset)}
              onClick={() => handlePresetSelect(preset)}
            >
              {preset.label}
            </PresetButton>
          ))}
        </PresetSection>
      )}

      {groupedPresets.periods.length > 0 && (
        <PresetSection>
          <PresetTitle>Periods</PresetTitle>
          {groupedPresets.periods.map((preset) => (
            <PresetButton
              key={preset.key}
              $active={isPresetActive(preset)}
              onClick={() => handlePresetSelect(preset)}
            >
              {preset.label}
            </PresetButton>
          ))}
        </PresetSection>
      )}

      {groupedPresets.extended.length > 0 && (
        <PresetSection>
          <PresetTitle>Extended</PresetTitle>
          {groupedPresets.extended.map((preset) => (
            <PresetButton
              key={preset.key}
              $active={isPresetActive(preset)}
              onClick={() => handlePresetSelect(preset)}
            >
              {preset.label}
            </PresetButton>
          ))}
        </PresetSection>
      )}
    </PresetDropdown>
  );

  return (
    <DateRangeContainer className={className} style={style}>
      <StyledRangePicker
        {...rangePickerProps}
        value={value}
        onChange={handleRangeChange}
        format={format}
        showTime={showTime}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        size={size}
        suffixIcon={<CalendarOutlined />}
      />
      
      {showPresets && !disabled && (
        <Dropdown
          trigger={['click']}
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
          dropdownRender={() => presetDropdown}
          placement="bottomLeft"
        >
          <Button 
            size={size}
            icon={<Icon name="ClockCircleOutlined" />}
            type="text"
          >
            Presets <DownOutlined />
          </Button>
        </Dropdown>
      )}
      
      {showRelativeTime && value && (
        <RelativeTimeTag>
          {getRelativeTimeText(value)}
        </RelativeTimeTag>
      )}
      
      {allowClear && value && (
        <ClearButton
          icon={<CloseOutlined />}
          onClick={handleClear}
          title="Clear selection"
        />
      )}
    </DateRangeContainer>
  );
};

export default DateRangePicker;