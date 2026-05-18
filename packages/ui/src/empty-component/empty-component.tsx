import React from 'react';
import './index.css';

export interface EmptyComponentProps {
  active?: boolean;

  size?: 'small' | 'default' | 'large';
  shape?: 'circle' | 'square' | 'round';
  paragraph?: boolean | { rows?: number };
  title?: boolean | { width?: string | number };
  className?: string;
}

export const EmptyComponent: React.FC<EmptyComponentProps> = ({
  active = false,
  size = 'default',
  shape = 'square',
  paragraph = true,
  title = true,
  className = '',
}) => {
  const sizeMap = {
    small: 20,
    default: 32,
    large: 48,
  };
  const mainSize = sizeMap[size];

  return (
    <div className={`empty-component ${className}`} data-active={active}>
      {title && (
        <div
          className="empty-component-title"
          data-shape={shape}
          style={{
            width: typeof title === 'object' && title.width ? title.width : mainSize * 3,
            height: mainSize,
          }}
        />
      )}
      
      {paragraph && (
        <div className="empty-component-paragraph">
          {typeof paragraph === 'object' && paragraph.rows ? (
            Array.from({ length: paragraph.rows }).map((_, i) => (
              <div key={i} className="empty-component-line" style={{ height: mainSize * 0.6 }} />
            ))
          ) : (
            <div className="empty-component-line" style={{ height: mainSize * 0.6 }} />
          )}
        </div>
      )}
    </div>
  );
};

EmptyComponent.displayName = 'EmptyComponent';

export default EmptyComponent;