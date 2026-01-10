'use client';

import { useResponsiveLayout } from '@/utils/responsiveUtils';

/**
 * Responsive container component that adapts to different screen sizes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullWidth - Whether the container should be full width
 * @param {string} props.as - HTML element to render as
 * @returns {React.ReactNode} - Rendered component
 */
export default function ResponsiveContainer({ 
  children, 
  className = '', 
  fullWidth = false,
  as: Component = 'div'
}) {
  const { isMobile } = useResponsiveLayout();
  
  // Base container classes
  const containerClasses = fullWidth
    ? `w-full px-4 sm:px-6 ${className}`
    : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`;
  
  return (
    <Component className={containerClasses}>
      {children}
    </Component>
  );
}

/**
 * Responsive grid component that adapts to different screen sizes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.columns - Number of columns on desktop
 * @param {number} props.mobileColumns - Number of columns on mobile
 * @param {number} props.tabletColumns - Number of columns on tablet
 * @param {string} props.gap - Gap between grid items
 * @returns {React.ReactNode} - Rendered component
 */
export function ResponsiveGrid({ 
  children, 
  className = '', 
  columns = 3,
  mobileColumns = 1,
  tabletColumns = 2,
  gap = '4'
}) {
  const { getGridColumns } = useResponsiveLayout();
  
  const gridColumns = getGridColumns(mobileColumns, tabletColumns, columns);
  
  return (
    <div 
      className={`grid grid-cols-${gridColumns} gap-${gap} ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` 
      }}
    >
      {children}
    </div>
  );
}

/**
 * Responsive flex component that adapts to different screen sizes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.direction - Flex direction on desktop
 * @param {string} props.mobileDirection - Flex direction on mobile
 * @param {string} props.tabletDirection - Flex direction on tablet
 * @returns {React.ReactNode} - Rendered component
 */
export function ResponsiveFlex({ 
  children, 
  className = '', 
  direction = 'row',
  mobileDirection = 'column',
  tabletDirection = 'row'
}) {
  const { getFlexDirection } = useResponsiveLayout();
  
  const flexDirection = getFlexDirection(mobileDirection, tabletDirection, direction);
  
  return (
    <div 
      className={`flex flex-${flexDirection} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Responsive section component with proper spacing
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Section ID for navigation
 * @param {boolean} props.fullWidth - Whether the section should be full width
 * @returns {React.ReactNode} - Rendered component
 */
export function ResponsiveSection({ 
  children, 
  className = '', 
  id,
  fullWidth = false
}) {
  const { getResponsivePadding } = useResponsiveLayout();
  
  const padding = getResponsivePadding(4, 6, 8);
  
  return (
    <section 
      id={id}
      className={`${padding} ${className}`}
    >
      <ResponsiveContainer fullWidth={fullWidth}>
        {children}
      </ResponsiveContainer>
    </section>
  );
}
