'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import "@/css/dropdown.css"

export interface DropdownMenuItem {
    id?: string;
    type: 'item';
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    onSelect?: () => void;
    disabled?: boolean;
    variant?: 'default' | 'danger';
}

export interface DropdownMenuSeparator {
    type: 'separator';
}

export interface DropdownMenuLabel {
    type: 'label';
    label: string;
}

export interface DropdownMenuCheckboxItem {
    type: 'checkbox';
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
}

export interface DropdownMenuRadioGroup {
    type: 'radio-group';
    value?: string;
    onValueChange?: (value: string) => void;
    items: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
}

export type DropdownMenuItemType = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel | DropdownMenuCheckboxItem | DropdownMenuRadioGroup;

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const RadioIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
    </svg>
);

const MenuItem = ({ label, icon, shortcut, onSelect, disabled, variant }: DropdownMenuItem) => (
    <DropdownMenu.Item
        className={`dropdown-item ${variant === 'danger' ? 'dropdown-item-danger' : ''}`}
        onSelect={onSelect}
        disabled={disabled}
    >
        <div className="dropdown-item-content">
            {icon && <span className="dropdown-item-icon">{icon}</span>}
            <span className="dropdown-item-label">{label}</span>
        </div>
        {shortcut && <span className="dropdown-item-shortcut">{shortcut}</span>}
    </DropdownMenu.Item>
);

const CheckboxItem = ({ label, checked, onCheckedChange, disabled }: DropdownMenuCheckboxItem) => (
    <DropdownMenu.CheckboxItem
        className="dropdown-item dropdown-checkbox-item"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
    >
        <span className="dropdown-item-label">{label}</span>
        <DropdownMenu.ItemIndicator className="dropdown-item-indicator">
            <CheckIcon />
        </DropdownMenu.ItemIndicator>
    </DropdownMenu.CheckboxItem>
);

const RadioItem = ({ value, label, disabled }: { value: string; label: string; disabled?: boolean }) => (
    <DropdownMenu.RadioItem
        value={value}
        className="dropdown-item dropdown-radio-item"
        disabled={disabled}
    >
        <span className="dropdown-item-label">{label}</span>
        <DropdownMenu.ItemIndicator className="dropdown-item-indicator">
            <RadioIcon />
        </DropdownMenu.ItemIndicator>
    </DropdownMenu.RadioItem>
);

export interface CustomDropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownMenuItemType[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    className?: string;
}

export const CustomDropdownMenu: React.FC<CustomDropdownMenuProps> = ({
    trigger,
    items,
    align = 'end',
    side = 'bottom',
    sideOffset = 8,
    className = '',
}) => {
    const renderItem = (item: DropdownMenuItemType, index: number) => {
        switch (item.type) {
            case 'item':
                return <MenuItem key={item.id || index} {...item} />;
            case 'separator':
                return <DropdownMenu.Separator key={index} className="dropdown-separator" />;
            case 'label':
                return <DropdownMenu.Label key={index} className="dropdown-label">{item.label}</DropdownMenu.Label>;
            case 'checkbox':
                return <CheckboxItem key={index} {...item} />;
            case 'radio-group':
                return (
                    <DropdownMenu.RadioGroup key={index} value={item.value} onValueChange={item.onValueChange}>
                        {item.items.map((radioItem, radioIndex) => (
                            <RadioItem key={radioIndex} {...radioItem} />
                        ))}
                    </DropdownMenu.RadioGroup>
                );
            default:
                return null;
        }
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild className={className}>
                {trigger}
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="dropdown-content"
                    align={align}
                    side={side}
                    sideOffset={sideOffset}
                >
                    {items.map((item, index) => renderItem(item, index))}
                    <DropdownMenu.Arrow className="dropdown-arrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

// UserMenu Component - MISSING IN ORIGINAL
export interface UserMenuProps {
    trigger?: React.ReactNode;
    userName?: string;
    userEmail?: string;
    onProfile?: () => void;
    onSettings?: () => void;
    onBilling?: () => void;
    onSupport?: () => void;
    onSignOut?: () => void;
    className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
    trigger,
    userName = 'User',
    userEmail,
    onProfile,
    onSettings,
    onBilling,
    onSupport,
    onSignOut,
    className = '',
}) => {
    const defaultTrigger = (
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-muted focus:outline-none focus:ring-4 focus:ring-focus-ring/20">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-text-primary">{userName}</span>
                {userEmail && <span className="text-xs text-text-secondary">{userEmail}</span>}
            </div>
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    );

    const items: DropdownMenuItemType[] = [
        { type: 'label', label: 'My Account' },
        {
            type: 'item',
            label: 'Profile',
            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
            onSelect: onProfile,
            shortcut: '⌘P',
        },
        {
            type: 'item',
            label: 'Settings',
            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" /></svg>,
            onSelect: onSettings,
            shortcut: '⌘S',
        },
        {
            type: 'item',
            label: 'Billing',
            icon: (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
            ),
            onSelect: onBilling,
        },
        {
            type: 'separator',
        },
        {
            type: 'item',
            label: 'Support',
            icon: (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" />
                </svg>
            ),
            onSelect: onSupport,
        },
        {
            type: 'separator',
        },
        {
            type: 'item',
            label: 'Sign Out',
            icon: (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9" />
                </svg>
            ),
            onSelect: onSignOut,
            shortcut: '⇧⌘Q',
        },
    ];

    return (
        <CustomDropdownMenu
            trigger={trigger || defaultTrigger}
            items={items}
            className={className}
        />
    );
};

// ActionsMenu Component - MISSING IN ORIGINAL
export interface ActionsMenuProps {
    trigger?: React.ReactNode;
    actions: Array<{
        label: string;
        icon?: React.ReactNode;
        onSelect: () => void;
        disabled?: boolean;
        variant?: 'default' | 'danger';
    }>;
    className?: string;
}

export const ActionsMenu = ({
    trigger,
    actions,
    className = '',
}: ActionsMenuProps) => {
    const defaultTrigger = (
        <button className="p-2 rounded-lg transition-all text-text-secondary hover:text-text-primary hover:bg-muted focus:outline-none focus:ring-4 focus:ring-focus-ring/20" aria-label="More actions">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
        </button>
    );

    const items: DropdownMenuItemType[] = actions.map((action, index) => ({
        type: 'item',
        id: `action-${index}`,
        ...action,
    }));

    return (
        <CustomDropdownMenu
            trigger={trigger || defaultTrigger}
            items={items}
            className={className}
        />
    );
};

// FilterMenu Component - MISSING IN ORIGINAL
export interface FilterMenuProps {
    trigger?: React.ReactNode;
    selectedFilters?: string[];
    onFiltersChange?: (filters: string[]) => void;
    filters: Array<{
        value: string;
        label: string;
    }>;
    className?: string;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
    trigger,
    selectedFilters = [],
    onFiltersChange,
    filters,
    className = '',
}) => {
    const defaultTrigger = (
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border transition-all text-text-primary hover:border-primary hover:bg-primary-subtle focus:outline-none focus:ring-4 focus:ring-focus-ring/20">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="text-sm font-medium">Filters</span>
            {selectedFilters.length > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {selectedFilters.length}
                </span>
            )}
        </button>
    );

    const handleCheckedChange = (value: string, checked: boolean) => {
        const newFilters = checked
            ? [...selectedFilters, value]
            : selectedFilters.filter((f) => f !== value);
        onFiltersChange?.(newFilters);
    };

    const items: DropdownMenuItemType[] = [
        { type: 'label', label: 'Filter by', },
        ...filters.map((filter) => ({
            type: 'checkbox' as const,
            label: filter.label,
            checked: selectedFilters.includes(filter.value),
            onCheckedChange: (checked: boolean) => handleCheckedChange(filter.value, checked),
        })),
    ];

    return (
        <CustomDropdownMenu
            trigger={trigger || defaultTrigger}
            items={items}
            className={className}
        />
    );
};

// Checkbox Menu Item
export interface DropdownCheckboxItemProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
}

export const DropdownCheckboxItem: React.FC<DropdownCheckboxItemProps> = ({
    checked,
    onCheckedChange,
    label,
    disabled,
}) => {
    return (
        <DropdownMenu.CheckboxItem
            className="dropdown-item dropdown-checkbox-item"
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
        >
            <DropdownMenu.ItemIndicator className="dropdown-item-indicator">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </DropdownMenu.ItemIndicator>
            <span className="dropdown-item-label">
                {label}
            </span>
        </DropdownMenu.CheckboxItem>
    );
};

// Radio Menu Items
export interface DropdownRadioGroupProps {
    value: string;
    onValueChange: (value: string) => void;
    items: Array<{
        value: string;
        label: string;
        disabled?: boolean;
    }>;
}

export const DropdownRadioGroup: React.FC<DropdownRadioGroupProps> = ({
    value,
    onValueChange,
    items,
}) => {
    return (
        <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
            {items.map((item) => (
                <DropdownMenu.RadioItem
                    key={item.value}
                    value={item.value}
                    className="dropdown-item dropdown-radio-item"
                    disabled={item.disabled}
                >
                    <DropdownMenu.ItemIndicator className="dropdown-item-indicator">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                    </DropdownMenu.ItemIndicator>
                    <span className="dropdown-item-label">
                        {item.label}
                    </span>
                </DropdownMenu.RadioItem>
            ))}
        </DropdownMenu.RadioGroup>
    );
};

// Sub Menu
export interface DropdownSubMenuProps {
    trigger: string;
    items: Array<{
        id: string;
        label: string;
        icon?: React.ReactNode;
        onSelect?: () => void;
        disabled?: boolean;
        variant?: 'default' | 'danger';
    }>;
}

export const DropdownSubMenu: React.FC<DropdownSubMenuProps> = ({
    trigger,
    items,
}) => {
    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="dropdown-item dropdown-sub-trigger">
                <span className="dropdown-item-label">
                    {trigger}
                </span>
                <svg
                    className="dropdown-sub-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
                <DropdownMenu.SubContent className="dropdown-content" sideOffset={8}>
                    {items.map((item) => (
                        <DropdownMenu.Item
                            key={item.id}
                            className={`dropdown-item ${item.variant === 'danger' ? 'dropdown-item-danger' : ''}`}
                            onSelect={item.onSelect}
                            disabled={item.disabled}
                        >
                            <div className="dropdown-item-content">
                                {item.icon && (
                                    <span className="dropdown-item-icon">{item.icon}</span>
                                )}
                                <span className="dropdown-item-label">
                                    {item.label}
                                </span>
                            </div>
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
        </DropdownMenu.Sub>
    );
};