// ../../layouts/profilescreen.ts
import { ACTIVE_LAYOUT } from '../../constants/theme';
import ProfileScreenModern from './ProfileScreenModern';

export interface ProfileLayoutProps {
  user: { name: string; role: string; avatar: string };
  isAuthenticated: boolean;
  menu: any[];
  onBack?: () => void;
  onLogin?: () => void;
}

const ProfileMap: Record<string, React.FC<ProfileLayoutProps>> = {
  crystal: ProfileScreenModern,
  modern: ProfileScreenModern,
};

export const SelectedProfileScreenLayout = ProfileMap[ACTIVE_LAYOUT];