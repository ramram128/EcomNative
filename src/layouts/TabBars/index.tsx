import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ACTIVE_LAYOUT } from '../../constants/theme';
import { TabBarCrystal } from './TabBarCrystal';
import { TabBarGlass } from './TabBarGlass';
import { TabBarModern } from './TabBarModern';

const TabBarMap: Record<string, React.FC<BottomTabBarProps>> = {
    crystal: TabBarCrystal,
    glass: TabBarGlass,
    modern: TabBarGlass,
};

export const SelectedBottomTabBar = (props: BottomTabBarProps) => {
    const layoutKey = ACTIVE_LAYOUT.toLowerCase();
    const Component = TabBarMap[layoutKey] || TabBarCrystal;
    return <Component {...props} />;
};
