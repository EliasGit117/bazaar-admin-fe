import { type FC, type SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  logoClassName?: string;
}

export const ChromeIcon: FC<IProps> = ({ logoClassName, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" className={logoClassName}/>
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" className={logoClassName}/>
      <path d="M12 9h8.4" className={logoClassName}/>
      <path d="M14.598 13.5l-4.2 7.275" className={logoClassName}/>
      <path d="M9.402 13.5l-4.2 -7.275" className={logoClassName}/>
    </svg>
  );
};