// =============================================================================
// Formatters - Utility functions for formatting data display
// =============================================================================

/**
 * Format numbers with thousands separators
 */
export const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat('en-US', options).format(num);
};

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format decimal values
 */
export const formatDecimal = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Convert camelCase to Title Case
 */
export const camelToTitle = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Convert snake_case to Title Case
 */
export const snakeToTitle = (text: string): string => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format network speed
 */
export const formatNetworkSpeed = (bytesPerSecond: number): string => {
  const mbps = (bytesPerSecond * 8) / 1000000; // Convert to Mbps
  
  if (mbps < 1) {
    const kbps = (bytesPerSecond * 8) / 1000;
    return `${kbps.toFixed(0)} Kbps`;
  }
  
  return `${mbps.toFixed(1)} Mbps`;
};

/**
 * Format hash/ID for display (show first and last few characters)
 */
export const formatHash = (hash: string, prefixLength: number = 6, suffixLength: number = 4): string => {
  if (hash.length <= prefixLength + suffixLength + 3) return hash;
  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`;
};

/**
 * Format list of items with proper grammar
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
};

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Format email addresses (truncate domain if too long)
 */
export const formatEmail = (email: string, maxLength: number = 30): string => {
  if (email.length <= maxLength) return email;
  
  const [local, domain] = email.split('@');
  const available = maxLength - local.length - 4; // 4 for "@..." 
  
  if (available <= 0) {
    return truncateText(email, maxLength);
  }
  
  return `${local}@${truncateText(domain, available)}`;
};

/**
 * Format URLs for display (remove protocol, truncate if needed)
 */
export const formatUrl = (url: string, maxLength: number = 40): string => {
  const cleaned = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return truncateText(cleaned, maxLength);
};

/**
 * Format version numbers
 */
export const formatVersion = (version: string): string => {
  // Remove 'v' prefix if present
  const cleaned = version.replace(/^v/, '');
  
  // If it's a semantic version, return as is
  if (/^\d+\.\d+\.\d+/.test(cleaned)) {
    return `v${cleaned}`;
  }
  
  return version;
};

/**
 * Format status badges
 */
export const formatStatus = (status: string): string => {
  return status
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format array of tags
 */
export const formatTags = (tags: string[], maxDisplay: number = 3): { displayed: string[], overflow: number } => {
  if (tags.length <= maxDisplay) {
    return { displayed: tags, overflow: 0 };
  }
  
  return {
    displayed: tags.slice(0, maxDisplay),
    overflow: tags.length - maxDisplay,
  };
};

/**
 * Format initials from name
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  return initials || '?';
};

/**
 * Format full name from first and last name
 */
export const formatFullName = (firstName?: string, lastName?: string): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'Unknown User';
};