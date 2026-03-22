import React from 'react';
import { ACTIVE_LAYOUT } from '../../constants/theme';
import { SearchBarCrystal } from './SearchBarCrystal';
import { SearchBarGlass } from './SearchBarGlass';
import { SearchBarModern } from './SearchBarModern';

// 1. Define the Interface (The Type)
interface SearchBarProps {
    onChangeText: (text: string) => void;
}

// 2. The Map should just hold the components (The Values)
const SearchBarMap: Record<string, React.FC<SearchBarProps>> = {
    crystal: SearchBarCrystal,
    glass: SearchBarGlass,
    modern: SearchBarGlass,
};

// 3. Export as a functional component, not just a variable assignment
export const SelectedSearchBar = (props: SearchBarProps) => {
    const layoutKey = ACTIVE_LAYOUT.toLowerCase();

    // Fallback to Crystal if the layout name doesn't match
    const Component = SearchBarMap[layoutKey] || SearchBarCrystal;

    return <Component {...props} />;
};