// Simple icon glyphs for mobile
import { SVGProps } from 'react';

interface IconBaseProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IBase = ({ size = 20, children, style, ...props }: IconBaseProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={style} aria-hidden {...props}>{children}</svg>
);

export const IWatch = (p: IconBaseProps) => (<IBase {...p}>
  <rect x="5" y="5" width="10" height="10" rx="2.5"/>
  <path d="M7.5 5V3.2M12.5 5V3.2M7.5 15v1.8M12.5 15v1.8"/>
  <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none"/>
</IBase>);

export const IMail = (p: IconBaseProps) => (<IBase {...p}>
  <rect x="3" y="5" width="14" height="10" rx="1.5"/>
  <path d="M3.5 6.2L10 11l6.5-4.8"/>
</IBase>);

export const IPhone = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M5.3 4h2.2l1.2 3.2-1.4 1A7.5 7.5 0 0011.8 12l1-1.4L16 11.8V14a2 2 0 01-2 2A10 10 0 014 6a2 2 0 011.3-2z"/>
</IBase>);

export const IChat = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M3.5 5.5A1.5 1.5 0 015 4h10a1.5 1.5 0 011.5 1.5V12A1.5 1.5 0 0115 13.5H8L4.5 17v-3.5A1.5 1.5 0 013.5 12z"/>
  <path d="M7 8.5h6M7 11h4"/>
</IBase>);

export const IPulse = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M2.5 10H6l1.5-4 2.5 8 2-6 1.5 2H17.5"/>
</IBase>);

export const IDrop = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M10 3.2c2.5 3 5 5.8 5 8.3a5 5 0 11-10 0c0-2.5 2.5-5.3 5-8.3z"/>
</IBase>);

export const IMoon = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M16.5 11.5A6.5 6.5 0 018.5 3.5a6.5 6.5 0 108 8z"/>
</IBase>);

export const ICheck = (p: IconBaseProps) => (<IBase {...p}><path d="M4 10.5l3.5 3.5L16 6"/></IBase>);

export const IUndo = (p: IconBaseProps) => (<IBase {...p}><path d="M5 7.5h7.5A3.5 3.5 0 0116 11a3.5 3.5 0 01-3.5 3.5H7"/><path d="M7 4.5L4 7.5l3 3"/></IBase>);

export const IUp = (p: IconBaseProps) => (<IBase {...p}><path d="M10 16V4M5 9l5-5 5 5"/></IBase>);

export const IPlay = (p: IconBaseProps) => (<IBase {...p}><path d="M6 4.5l9 5.5-9 5.5z" fill="currentColor" stroke="none"/></IBase>);

export const IPause = (p: IconBaseProps) => (<IBase {...p}><rect x="5" y="4.5" width="3" height="11" rx="0.5" fill="currentColor" stroke="none"/><rect x="12" y="4.5" width="3" height="11" rx="0.5" fill="currentColor" stroke="none"/></IBase>);

export const IBrain = (p: IconBaseProps) => (<IBase {...p}>
  <path d="M8.5 4.5A2 2 0 005 6v1.5A2 2 0 004 9.5 2 2 0 005 11.5 2 2 0 007 13.5V15a2 2 0 003.5 1.2"/>
  <path d="M11.5 4.5A2 2 0 0115 6v1.5A2 2 0 0116 9.5 2 2 0 0015 11.5 2 2 0 0013 13.5V15a2 2 0 01-3.5 1.2"/>
  <path d="M10 4.2v12"/>
</IBase>);

export const IAlert = (p: IconBaseProps) => (<IBase {...p}><path d="M10 3l8 14H2z"/><path d="M10 9v3.5"/><circle cx="10" cy="15" r=".6" fill="currentColor"/></IBase>);

export const ICal = (p: IconBaseProps) => (<IBase {...p}><rect x="3" y="5" width="14" height="12" rx="2"/><path d="M3 8.5h14M7 3.5v3M13 3.5v3"/></IBase>);

export const IFlag = (p: IconBaseProps) => (<IBase {...p}><path d="M5 3v14M5 4h8l-1.5 3L13 10H5"/></IBase>);

export const ICircleCheck = (p: IconBaseProps) => (<IBase {...p}><circle cx="10" cy="10" r="7"/><path d="M7 10l2.2 2.2L13.5 8"/></IBase>);

export const CHANNEL_ICON: Record<string, React.ComponentType<IconBaseProps>> = { 
  watch: IWatch, 
  mail: IMail, 
  call: IPhone, 
  chat: IChat 
};
