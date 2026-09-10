'use client';

import Image from 'next/image';

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    shape?: 'circle' | 'square';
    status?: 'online' | 'offline' | 'away' | 'busy';
    badge?: React.ReactNode;
    className?: string;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-base',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-lg',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-xl',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32 text-2xl',
};

const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted',
    away: 'bg-warning',
    busy: 'bg-error',
};

export function Avatar({
    src,
    alt = 'Avatar',
    name,
    size = 'md',
    shape = 'circle',
    status,
    badge,
    className = '',
}: AvatarProps) {
    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
                    ${sizeClasses[size]}
                    ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
                    bg-muted text-text-primary
                    flex items-center justify-center
                    font-semibold
                    overflow-hidden
                    border-2 border-border
                `}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{getInitials(name || alt)}</span>
                )}
            </div>

            {/* Status Indicator */}
            {status && (
                <span
                    className={`
                        absolute bottom-0 right-0
                        w-3 h-3 sm:w-3.5 sm:h-3.5
                        ${statusColors[status]}
                        border-2 border-background
                        ${shape === 'circle' ? 'rounded-full' : 'rounded'}
                    `}
                />
            )}

            {/* Badge */}
            {badge && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                    {badge}
                </span>
            )}
        </div>
    );
}

export interface AvatarGroupProps {
    avatars: Array<{
        src?: string;
        alt?: string;
        name?: string;
    }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    shape?: 'circle' | 'square';
    className?: string;
}

export function AvatarGroup({
    avatars,
    max = 4,
    size = 'md',
    shape = 'circle',
    className = '',
}: AvatarGroupProps) {
    const displayAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    return (
        <div className={`flex items-center -space-x-2 sm:-space-x-3 ${className}`}>
            {displayAvatars.map((avatar, index) => (
                <div key={index} className="relative">
                    <Avatar
                        src={avatar.src}
                        alt={avatar.alt}
                        name={avatar.name}
                        size={size}
                        shape={shape}
                        className="ring-2 ring-background"
                    />
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={`
                        ${sizeClasses[size]}
                        ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
                        bg-muted text-text-primary
                        flex items-center justify-center
                        font-semibold text-xs sm:text-sm
                        border-2 border-background
                        ring-2 ring-background
                    `}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

export default Avatar;