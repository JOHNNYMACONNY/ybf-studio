import React from 'react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type IconProps = {
  as: IconComponent;
  className?: string;
  title?: string;
  "aria-hidden"?: boolean;
  role?: string;
};

export function Icon({ as: As, className, title, ...rest }: IconProps) {
  return (
    <As
      className={className || 'h-5 w-5 text-neutral-400'}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...(title ? { title } : {})}
      {...rest}
    />
  );
}


